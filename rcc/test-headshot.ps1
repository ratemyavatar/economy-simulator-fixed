param(
  [int]$Port = 64989,
  [int]$UserId = 1,
  [string]$BaseUrl = "http://www.anemon.lol",
  [string]$OutFile = "$env:USERPROFILE\Desktop\rcc-headshot.png"
)

$ErrorActionPreference = "Stop"
$rcc = "http://127.0.0.1:$Port/"

function Send-RccSoap([string]$Action, [string]$BodyXml) {
  $headers = @{
    "Content-Type" = "text/xml; charset=utf-8"
    "SOAPAction"   = "http://roblox.com/$Action"
  }
  try {
    return Invoke-WebRequest -Uri $rcc -Method POST -Headers $headers -Body $BodyXml -TimeoutSec 120 -UseBasicParsing
  } catch {
    Write-Host "SOAP $Action failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
      $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
      Write-Host $reader.ReadToEnd()
    }
    throw
  }
}

Write-Host "RCC target $rcc (GET is ignored; SOAP 500 on GET is normal)"

$hello = @"
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <HelloWorld xmlns="http://roblox.com/" />
  </soap:Body>
</soap:Envelope>
"@
Write-Host "Sending HelloWorld..."
$helloResp = Send-RccSoap "HelloWorld" $hello
Write-Host $helloResp.Content

$jobId = [guid]::NewGuid().ToString()
$lua = @"
print("[test-headshot] start")
pcall(function() game:GetService("ContentProvider"):SetBaseUrl("$BaseUrl/") end)
pcall(function() settings().Network.HttpEnabled = true end)
local ok, err = pcall(function()
  local ThumbnailGenerator = game:GetService("ThumbnailGenerator")
  local plr = game:GetService("Players"):CreateLocalPlayer($UserId)
  plr.CharacterAppearance = "$BaseUrl/Asset/CharacterFetch.ashx?userId=$UserId"
  plr:LoadCharacter(false)
  wait(2)
  return ThumbnailGenerator:Click("png", 420, 420, true, true)
end)
if not ok then
  print("[test-headshot] error " .. tostring(err))
  return "ERR:" .. tostring(err)
end
print("[test-headshot] ok bytes")
return err
"@

$escaped = [System.Security.SecurityElement]::Escape($lua)
$openJob = @"
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <OpenJobEx xmlns="http://roblox.com/">
      <job>
        <id>$jobId</id>
        <category>0</category>
        <cores>1</cores>
        <expirationInSeconds>120</expirationInSeconds>
      </job>
      <script>
        <name>HeadshotTest</name>
        <script><![CDATA[
$lua
        ]]></script>
      </script>
    </OpenJobEx>
  </soap:Body>
</soap:Envelope>
"@

Write-Host "Sending OpenJobEx headshot job $jobId ..."
$jobResp = Send-RccSoap "OpenJobEx" $openJob
$raw = $jobResp.Content
$rawPath = "$env:TEMP\rcc-soap-response.xml"
Set-Content -Path $rawPath -Value $raw -Encoding UTF8
Write-Host "Saved SOAP response to $rawPath"

$b64 = $null
if ($raw -match "([A-Za-z0-9+/]{200,}={0,2})") {
  $b64 = $Matches[1]
}

if (-not $b64) {
  Write-Host "No PNG base64 in SOAP body. RCC answered, but did not return a thumbnail."
  Write-Host "Open $rawPath and the RCC console for the Lua error."
  exit 2
}

$bytes = [Convert]::FromBase64String($b64)
[IO.File]::WriteAllBytes($OutFile, $bytes)
Write-Host "Wrote headshot to $OutFile ($($bytes.Length) bytes)"
Start-Process $OutFile

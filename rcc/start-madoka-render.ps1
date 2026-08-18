$ErrorActionPreference = "Continue"
$madoka = "C:\Users\Administrator\madoka"
$desktop = [Environment]::GetFolderPath("Desktop")
$bridge = Join-Path $desktop "render-ws-bridge.js"
$appsettings = Join-Path $madoka "Roblox\Roblox.Website\appsettings.json"

if (-not (Test-Path $madoka)) { Write-Host "Missing $madoka"; exit 1 }

$key = ""
if (Test-Path $appsettings) {
  $json = Get-Content $appsettings -Raw | ConvertFrom-Json
  if ($json.Render -and $json.Render.Authorization) { $key = $json.Render.Authorization }
}

if (-not (Test-Path $bridge)) {
  Write-Host "Downloading render-ws-bridge.js..."
  curl.exe -L -H "Accept: application/vnd.github.raw" -o $bridge "https://api.github.com/repos/ratemyavatar/economy-simulator-fixed/contents/rcc/render-ws-bridge.js?ref=arena/01a01258-economy-simulator-fixed"
}

function Listening($port) {
  $r = netstat -ano -p tcp | Select-String ":$port " | Select-String "LISTENING"
  return [bool]$r
}

function Start-Win($title, $command) {
  Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "title $title && $command"
}

if (-not (Listening 5000)) {
  Write-Host "Starting website on 5000..."
  Start-Win "Madoka Website" "cd /d `"$madoka\Roblox\Roblox.Website`" && dotnet run -c Release"
} else { Write-Host "Website already on 5000" }

if (-not (Listening 7832)) {
  Write-Host "Starting game-renderer on 7832..."
  Start-Win "Madoka Renderer" "cd /d `"$madoka\game-renderer`" && npm run start"
} else { Write-Host "Renderer already on 7832" }

if (-not (Listening 2621)) {
  Write-Host "Starting RCC on 2621 (restart loop)..."
  $rcc = "cd /d `"$madoka\RCCService2020`" && :loop && RCCService.exe -Console -Port 2621 && timeout /t 2 && goto loop"
  Start-Win "Madoka RCC 2621" $rcc
} else { Write-Host "RCC already on 2621" }

if (-not (Listening 3189)) {
  Write-Host "Starting WS bridge on 3189..."
  $envLine = "set RENDER_KEY=$key&& set RENDER_HTTP=http://127.0.0.1:7832&& node `"$bridge`""
  Start-Win "Madoka Render Bridge" $envLine
} else { Write-Host "Bridge already on 3189" }

Write-Host ""
Write-Host "Leave the new windows open."
Write-Host "Wait ~20 seconds for dotnet, then open a profile or change avatar."
Start-Sleep -Seconds 3

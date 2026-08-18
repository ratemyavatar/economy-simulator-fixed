param([int]$UserId = 36)
$ErrorActionPreference = "Stop"
$madoka = "C:\Users\Administrator\madoka"
$render = "http://127.0.0.1:7832"

function Get-Png($path, $body) {
  Write-Host "POST $path ..."
  $r = Invoke-RestMethod -Uri ($render + $path) -Method POST -ContentType "application/json" -Body $body
  if (-not $r.success -or -not $r.data) { throw "Render failed for $path : $($r | ConvertTo-Json -Compress)" }
  return [Convert]::FromBase64String($r.data)
}

$head = Get-Png "/player/headshot" "{`"userId`":$UserId}"
$bodyPng = Get-Png "/player/thumbnail" "{`"userId`":$UserId}"

$dirs = @(
  "$madoka\api\public\images\thumbnails",
  "$madoka\frontend\public\images\thumbnails",
  "$madoka\Roblox\Roblox.Website\wwwroot\images\thumbnails",
  "$madoka\Roblox\Roblox.Website\wwwroot\img\thumbnails"
) | Where-Object { Test-Path (Split-Path $_) }

$written = @()
foreach ($d in $dirs) {
  if (-not (Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null }
  $h = Join-Path $d "user${UserId}_headshot.png"
  $t = Join-Path $d "user${UserId}_thumbnail.png"
  [IO.File]::WriteAllBytes($h, $head)
  [IO.File]::WriteAllBytes($t, $bodyPng)
  Write-Host "Wrote $h ($($head.Length) bytes)"
  Write-Host "Wrote $t ($($bodyPng.Length) bytes)"
  $written += $d
}

if ($written.Count -eq 0) {
  $fallback = "$env:USERPROFILE\Desktop"
  [IO.File]::WriteAllBytes((Join-Path $fallback "user${UserId}_headshot.png"), $head)
  [IO.File]::WriteAllBytes((Join-Path $fallback "user${UserId}_thumbnail.png"), $bodyPng)
  Write-Host "No site thumb folder found. PNGs are on Desktop."
}

Write-Host ""
Write-Host "Run this in your Postgres client (user $UserId):"
Write-Host "UPDATE user_avatar SET headshot_thumbnail_url = '/images/thumbnails/user${UserId}_headshot.png', thumbnail_url = '/images/thumbnails/user${UserId}_thumbnail.png' WHERE user_id = $UserId;"
Write-Host ""
Write-Host "Then hard-refresh the profile."

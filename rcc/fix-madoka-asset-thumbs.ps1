$ErrorActionPreference = "Continue"
$madoka = "C:\Users\Administrator\madoka"
$svc = Join-Path $madoka "Roblox\Roblox.Services\Assets\AssetsService.cs"
Write-Host "=== AssetsService RenderAssetAsync ==="
if (Test-Path $svc) {
  Select-String -Path $svc -Pattern "WhenAll\(thumbRequests\)" | ForEach-Object { $_.Line.Trim() }
} else {
  Write-Host "MISSING $svc"
}
Write-Host "=== sample asset thumbs API ==="
try {
  $r = Invoke-RestMethod -Uri "http://127.0.0.1:5000/apisite/thumbnails/v1/assets?assetIds=1&format=png&size=420x420"
  $r | ConvertTo-Json -Compress
} catch {
  Write-Host $_.Exception.Message
}
Write-Host "=== game-renderer 7832 ==="
try {
  Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:7832/" -TimeoutSec 3 | Select-Object StatusCode
} catch {
  Write-Host $_.Exception.Message
}

param(
  [int]$From = 1,
  [int]$To = 0,
  [string]$Madoka = "C:\Users\Administrator\madoka",
  [string]$Render = "http://127.0.0.1:7832"
)

$ErrorActionPreference = "Continue"

function Get-Png($path, $userId) {
  $body = '{"userId":' + $userId + '}'
  $r = Invoke-RestMethod -Uri ($Render + $path) -Method POST -ContentType "application/json" -Body $body -TimeoutSec 180
  if (-not $r.success -or -not $r.data) { throw "no image" }
  return [Convert]::FromBase64String($r.data)
}

$thumbDirs = @(
  "$Madoka\api\public\images\thumbnails",
  "$Madoka\frontend\public\images\thumbnails",
  "$Madoka\Roblox\Roblox.Website\wwwroot\images\thumbnails"
)

foreach ($d in $thumbDirs) {
  if (-not (Test-Path $d)) {
    $parent = Split-Path $d
    if (Test-Path $parent) { New-Item -ItemType Directory -Path $d -Force | Out-Null }
  }
}
$thumbDirs = $thumbDirs | Where-Object { Test-Path $_ }
if ($thumbDirs.Count -eq 0) {
  $fallback = Join-Path $env:USERPROFILE "Desktop\thumbnails"
  New-Item -ItemType Directory -Path $fallback -Force | Out-Null
  $thumbDirs = @($fallback)
  Write-Host "No site thumb folder. Writing to $fallback"
}

$ids = @()
if ($To -ge $From -and $To -gt 0) {
  $ids = $From..$To
} else {
  $psql = Get-Command psql -ErrorAction SilentlyContinue
  if ($psql) {
    Write-Host "Reading user ids from Postgres..."
    $ids = @(psql -t -A -c "SELECT id FROM \"user\" ORDER BY id")
    $ids = $ids | ForEach-Object { $_.Trim() } | Where-Object { $_ -match '^\d+$' }
  }
  if ($ids.Count -eq 0) {
    Write-Host "No psql and no -To. Using 1..100. Re-run with -From 1 -To 200 if needed."
    $ids = 1..100
  }
}

Write-Host "Rendering $($ids.Count) users. Renderer $Render"
$sql = New-Object System.Collections.Generic.List[string]
$ok = 0
$fail = 0

foreach ($id in $ids) {
  try {
    $head = Get-Png "/player/headshot" $id
    Start-Sleep -Milliseconds 300
    $full = Get-Png "/player/thumbnail" $id
    $hn = "user${id}_headshot.png"
    $tn = "user${id}_thumbnail.png"
    foreach ($d in $thumbDirs) {
      [IO.File]::WriteAllBytes((Join-Path $d $hn), $head)
      [IO.File]::WriteAllBytes((Join-Path $d $tn), $full)
    }
    $sql.Add("UPDATE user_avatar SET headshot_thumbnail_url = '/images/thumbnails/$hn', thumbnail_url = '/images/thumbnails/$tn' WHERE user_id = $id;")
    $ok++
    Write-Host "OK $id"
  } catch {
    $fail++
    Write-Host "FAIL $id $($_.Exception.Message)"
  }
}

$sqlPath = Join-Path $env:USERPROFILE "Desktop\rerender-all.sql"
$sql | Set-Content -Path $sqlPath -Encoding UTF8
Write-Host ""
Write-Host "Done. ok=$ok fail=$fail"
Write-Host "SQL saved to $sqlPath"
Write-Host "Apply it:"
Write-Host "  psql -f `"$sqlPath`""

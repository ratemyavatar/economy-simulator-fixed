$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
if (-not (Test-Path node_modules)) {
  Write-Host "npm install..."
  npm install
}
if (-not (Test-Path dist\index.js)) {
  Write-Host "npm run build..."
  npm run build
}
Write-Host "Bubba renderer: WS 3189, HTTP 3040, RCC 2621"
npm run start

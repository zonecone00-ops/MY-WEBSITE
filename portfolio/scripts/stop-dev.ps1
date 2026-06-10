$ErrorActionPreference = 'SilentlyContinue'

$projectRoot = Split-Path -Parent $PSScriptRoot
$pidFile = Join-Path $projectRoot '.vite-dev.pid'

if (-not (Test-Path -LiteralPath $pidFile)) {
  Write-Host 'No saved development server process was found.'
  exit 0
}

$processId = [int](Get-Content -LiteralPath $pidFile -Raw)
Stop-Process -Id $processId -Force
Remove-Item -LiteralPath $pidFile -Force

Write-Host 'Portfolio server stopped.'

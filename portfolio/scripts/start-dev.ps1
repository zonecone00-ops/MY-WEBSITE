$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$pidFile = Join-Path $projectRoot '.vite-dev.pid'
$viteEntry = Join-Path $projectRoot 'node_modules\vite\bin\vite.js'
$healthUrl = 'http://127.0.0.1:5173/index.html'

function Test-DevServer {
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $healthUrl -TimeoutSec 2
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

if (Test-DevServer) {
  $listener = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue |
    Select-Object -First 1
  if ($listener) {
    Set-Content -LiteralPath $pidFile -Value $listener.OwningProcess -Encoding ascii
  }
  Write-Host 'Portfolio server is already running: http://localhost:5173/index.html'
  exit 0
}

if (Test-Path -LiteralPath $pidFile) {
  Remove-Item -LiteralPath $pidFile -Force
}

if (-not (Test-Path -LiteralPath $viteEntry)) {
  Write-Error 'Vite is not installed. Run npm install first.'
}

$process = Start-Process `
  -FilePath 'node.exe' `
  -ArgumentList @("`"$viteEntry`"", '--host', '127.0.0.1', '--port', '5173', '--strictPort') `
  -WorkingDirectory $projectRoot `
  -WindowStyle Hidden `
  -PassThru

Set-Content -LiteralPath $pidFile -Value $process.Id -Encoding ascii

for ($attempt = 0; $attempt -lt 20; $attempt += 1) {
  Start-Sleep -Milliseconds 500
  if (Test-DevServer) {
    Write-Host 'Portfolio server started: http://localhost:5173/index.html'
    Write-Host "Stop it with: npm run dev:stop"
    exit 0
  }

  if ($process.HasExited) {
    break
  }
}

if (Test-Path -LiteralPath $pidFile) {
  Remove-Item -LiteralPath $pidFile -Force
}

Write-Error 'The development server did not start.'

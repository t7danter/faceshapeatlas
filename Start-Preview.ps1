param([switch]$Validate)
$ErrorActionPreference = 'Stop'
$projectDirectory = $PSScriptRoot
$nodeCandidates = @()
$installedNode = Get-Command node.exe -ErrorAction SilentlyContinue
if ($installedNode) { $nodeCandidates += $installedNode.Source }
$runtimeRoot = Join-Path $env:ProgramFiles 'WindowsApps'
if (Test-Path -LiteralPath $runtimeRoot) {
  $nodeCandidates += Get-ChildItem -LiteralPath $runtimeRoot -Directory -Filter 'OpenAI.CodexPrimaryRuntime*' -ErrorAction SilentlyContinue | ForEach-Object { Join-Path $_.FullName 'dependencies\node\bin\node.exe' }
}
$selectedNode = $null
foreach ($candidate in $nodeCandidates) {
  if (Test-Path -LiteralPath $candidate) {
    $nodeVersion = (& $candidate --version).TrimStart('v')
    if ([version]$nodeVersion -ge [version]'24.22.1') { $selectedNode = $candidate; break }
  }
}
if (-not $selectedNode) { throw 'Node 24.22.1 or newer is required. Install a supported Node release, then run npm ci.' }
Push-Location -LiteralPath $projectDirectory
try {
  if (-not (Test-Path -LiteralPath 'node_modules/astro/bin/astro.mjs')) { throw 'Dependencies are missing. Run npm ci with a supported Node release first.' }
  $env:ASTRO_TELEMETRY_DISABLED = '1'
  if ($Validate -or -not (Test-Path -LiteralPath 'dist/index.html')) {
    & $selectedNode scripts/validate.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Validation failed; preview was not started.' }
  }
  Write-Host 'Local preview: http://127.0.0.1:4321/  (Ctrl+C to stop)'
  & $selectedNode scripts/preview.mjs
} finally { Pop-Location }

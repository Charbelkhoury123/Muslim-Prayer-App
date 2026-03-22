# Run from project root: .\scripts\setup-ios-dev-build.ps1
# Step 1: Log in to Expo (opens browser) — required once per machine
# Step 2: Link this folder to an EAS project — creates projectId in app.json
# Step 3: Start an iOS development build in the cloud (install on iPhone from the link EAS prints)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host ""
Write-Host "=== 1. Expo login ===" -ForegroundColor Cyan
npx eas-cli whoami 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Not logged in. Running: npx eas-cli login" -ForegroundColor Yellow
  npx eas-cli login
}

Write-Host ""
Write-Host "=== 2. Link EAS project (if needed) ===" -ForegroundColor Cyan
if (-not (Select-String -Path "app.json" -Pattern "projectId" -Quiet)) {
  Write-Host "No projectId in app.json yet. Running: npx eas-cli init" -ForegroundColor Yellow
  npx eas-cli init
} else {
  Write-Host "app.json already has EAS projectId; skipping init." -ForegroundColor Green
}

Write-Host ""
Write-Host "=== 3. iOS development build ===" -ForegroundColor Cyan
Write-Host "This uploads your project to EAS and builds a dev client for your iPhone." -ForegroundColor Gray
Write-Host "You will need an Apple Developer account when EAS asks for signing." -ForegroundColor Gray
Write-Host ""
$confirm = Read-Host "Start cloud build now? (y/N)"
if ($confirm -eq "y" -or $confirm -eq "Y") {
  npx eas-cli build --profile development --platform ios
}

Write-Host ""
Write-Host "After the build finishes, install the app on your iPhone from the Expo dashboard link." -ForegroundColor Green
Write-Host "Then on this PC run: npm run start:dev" -ForegroundColor Green
Write-Host "Open the installed dev client (not Expo Go) and connect to Metro." -ForegroundColor Green

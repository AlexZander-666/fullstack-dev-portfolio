# Elastic Beanstalk 部署包创建脚本
# 在 backend 目录下运行: powershell -ExecutionPolicy Bypass -File scripts/create-eb-bundle.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Creating Elastic Beanstalk deployment bundle..." -ForegroundColor Cyan

# 确保在 backend 目录
$backendDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $backendDir

# 清理旧的部署包
if (Test-Path "eb-bundle.zip") {
    Remove-Item "eb-bundle.zip" -Force
    Write-Host "✓ Removed old bundle" -ForegroundColor Green
}

# 构建 TypeScript
Write-Host "📦 Building TypeScript..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build completed" -ForegroundColor Green

# 创建临时目录
$tempDir = "eb-temp"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# 复制必要文件
Write-Host "📁 Copying files..." -ForegroundColor Yellow
Copy-Item "package.json" "$tempDir/"
Copy-Item "package-lock.json" "$tempDir/"
Copy-Item -Recurse "dist" "$tempDir/"
Copy-Item "Procfile" "$tempDir/"

if (Test-Path ".ebextensions") {
    Copy-Item -Recurse ".ebextensions" "$tempDir/"
}

Write-Host "✓ Files copied" -ForegroundColor Green

# 创建 ZIP
Write-Host "🗜️ Creating ZIP bundle..." -ForegroundColor Yellow
Compress-Archive -Path "$tempDir\*" -DestinationPath "eb-bundle.zip" -Force
Write-Host "✓ Bundle created: eb-bundle.zip" -ForegroundColor Green

# 清理临时目录
Remove-Item $tempDir -Recurse -Force

# 显示包大小
$size = (Get-Item "eb-bundle.zip").Length / 1MB
Write-Host "`n✅ Deployment bundle ready!" -ForegroundColor Green
Write-Host "   File: eb-bundle.zip" -ForegroundColor White
Write-Host "   Size: $([math]::Round($size, 2)) MB" -ForegroundColor White
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Go to AWS Elastic Beanstalk Console"
Write-Host "   2. Create Application > Web server environment"
Write-Host "   3. Platform: Node.js 20"
Write-Host "   4. Upload eb-bundle.zip"
Write-Host "   5. Configure environment variables (see .env.production.example)"

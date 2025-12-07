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

if (Test-Path ".platform") {
    Copy-Item -Recurse ".platform" "$tempDir/"
}

Write-Host "✓ Files copied" -ForegroundColor Green

# 创建 ZIP - 使用 .NET 方法确保跨平台兼容性
Write-Host "🗜️ Creating ZIP bundle..." -ForegroundColor Yellow

# 进入临时目录，从内部创建 ZIP（避免路径分隔符问题）
Push-Location $tempDir
try {
    # 使用 PowerShell 7+ 的 Compress-Archive 或 .NET 方法
    $files = Get-ChildItem -Recurse -File
    $zipPath = Join-Path $backendDir "eb-bundle.zip"
    
    # 加载 .NET 压缩类
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    
    # 创建 ZIP 文件
    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force
    }
    
    $zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')
    
    foreach ($file in $files) {
        $relativePath = $file.FullName.Substring($PWD.Path.Length + 1)
        # 强制使用正斜杠
        $entryName = $relativePath -replace '\\', '/'
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $entryName) | Out-Null
    }
    
    $zip.Dispose()
    
    Write-Host "✓ Bundle created with forward slashes (Linux-compatible)" -ForegroundColor Green
} catch {
    Write-Host "❌ ZIP creation failed: $_" -ForegroundColor Red
    Pop-Location
    exit 1
} finally {
    Pop-Location
}

# 清理临时目录
Remove-Item $tempDir -Recurse -Force

# 显示包大小
$size = (Get-Item "eb-bundle.zip").Length / 1MB
Write-Host "`n✅ Deployment bundle ready!" -ForegroundColor Green
Write-Host "   File: eb-bundle.zip" -ForegroundColor White
Write-Host "   Size: $([math]::Round($size, 2)) MB" -ForegroundColor White
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Go to AWS Elastic Beanstalk Console"
Write-Host "   2. Upload and Deploy > Choose file > eb-bundle.zip"
Write-Host "   3. Version label: v1.0.3-linux-compatible"
Write-Host "   4. Click 'Deploy'"
Write-Host "`n💡 This bundle uses forward slashes for Linux compatibility"

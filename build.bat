@echo off
echo ========================
if exist node_modules (
    echo 📦 已检测到 node_modules，跳过依赖安装...
) else (
    echo 📦 安装依赖中...
    npm install

    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败！
        pause
        exit /b %errorlevel%
    )
)

echo ========================
echo 🔧 开始构建项目...
echo ========================
npm run build

if %errorlevel% neq 0 (
    echo ❌ 构建失败，请检查错误！
    pause
    exit /b %errorlevel%
)

echo ========================
echo ✅ 构建完成！
echo ========================
pause

const fs = require('fs');
const path = require('path');

// 从命令行参数中获取版本号
const newVersion = process.argv[2];

if (!newVersion) {
    console.error('Error: No version number provided');
    process.exit(1);
}

// 确定 package.json 的路径
const packageJsonPath = path.resolve(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 更新版本号
packageJson.version = newVersion;

// 写回 package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
console.log(`Updated package.json version to ${newVersion}`);

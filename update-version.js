const fs = require('fs');
const path = require('path');

// 读取 README.md 文件
const readmePath = path.join(__dirname, 'README.md');
const readmeContent = fs.readFileSync(readmePath, 'utf8');

// 正则表达式匹配 README.md 中的版本号（假设版本号格式如：Version 2.4.2）
const versionRegex = /版本\s([0-9]+\.[0-9]+\.[0-9]+)/;
const versionMatch = readmeContent.match(versionRegex);

if (!versionMatch || versionMatch.length < 2) {
    console.error('未能从 README.md 中找到版本号');
    process.exit(1);
}
const newVersion = versionMatch[1];

// 读取 package.json 文件
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 更新 package.json 中的版本号
packageJson.version = newVersion;

// 写入更新后的 package.json 文件
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

console.log(`已将 package.json 版本更新为 ${newVersion}`);

# bo-project

## 版本2.4.3 -> v1.5.5.3_xibu

### 新增功能

1.双边做市订单查询

## 版本 1.1 更新内容

### 新增功能

1. **主页面标题光影效果：**
    - 为主页面标题增加了动态光影效果，使其更具吸引力。

### 重构

1. **Vuex 模块化：**
    - 将 Vuex 重构为多个模块，提升代码的可维护性和可扩展性。
    - 模块包括 `role`、`dictionary`、`environment` 等，便于管理和使用。

### 修复的 Bug

1. **主页环境展示 Bug 修复：**
    - 修复了主页环境展示信息不正确的问题，确保当前环境信息准确显示。

## 版本1.0 更新内容

### 新增功能

1. **动态背景效果：**

    - 引入Canvas绘制Dashboard背景，提升视觉体验。
2. **环境显示功能：**

    - 在界面上显示当前环境信息（开发、测试或生产环境）。
    - 通过Vuex管理和显示环境状态。

### 修复的 Bug

1. 修复了环境信息显示不正确的问题。
2. 解决了窗口大小调整时表格高度未自动更新的问题。

### 性能优化

1. 优化了 Canvas 动态背景效果的性能，减少了资源消耗。
2. 提升了表格数据加载速度，改善用户体验。

### HFT标准产品

- **用户及角色权限管理：**

    - 实现了对用户及其角色的精细化管理，支持多级权限控制。
    - 包括客户端权限管理，确保不同用户和角色能够访问适当的功能和数据。
- **账户管理：**

    - 支持实体账户和分账户的管理，提供了灵活的账户结构。
    - 便于用户对账户进行集中管理和控制。
- **系统监控：**

    - 提供实时系统状态监控功能，确保系统运行的可靠性和稳定性。
    - 包括连接状态监控，及时发现并解决潜在问题。
- **交易数据权限管理：**

    - 细化的交易数据权限控制，确保数据访问的安全性。
    - 支持对订单、成交和持仓等交易数据的权限管理。
- **报表查询功能：**

    - 提供强大的报表查询功能，支持订单、成交和持仓等多种报表类型。
    - 用户可以根据需求生成和导出报表，方便数据分析和决策。
- **后端配置管理：**

    - 菜单的生成通过后端配置，确保灵活性和可扩展性。
    - 数据字典同样由后端生成，简化了前端的数据管理工作。

## 项目介绍

bo-project 是一个全面的企业管理系统，
旨在简化和优化用户及角色权限管理、账户管理、系统监控、交易数据权限管理等多种业务功能。
此项目通过引入动态背景效果和环境显示功能，提升了用户的视觉体验和系统的可用性。

## 安装步骤

1. **克隆项目到本地：**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. **安装依赖：**

   确保已安装 [Node.js](https://nodejs.org/) 和 [npm](https://www.npmjs.com/)，然后运行：

   ```bash
   npm install
   ```
3. **启动开发服务器：**

   ```bash
   npm run start
   ```

   访问 [http://localhost:8080](http://localhost:8080) 查看项目运行效果。
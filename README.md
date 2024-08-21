# bo-project

## 版本 1.5.6.1 更新日志

### 新增功能

* **审批操作**：新增审批通过和拒绝时的二次确认弹窗。
* **策略参数管理**：新增导出策略参数功能，便于后续的导入和管理。
* **策略审批导出**：新增策略审批记录的导出功能。
* **布尔类型参数**：新增策略参数布尔类型，支持下拉菜单选择。
* **打包配置**：修改 vue.config.js 文件，将打包目录输出至 /build。
* **忽略配置**：更新 .gitignore 文件，忽略 /build 目录。
* **策略类型切换**：切换策略类型时，自动映射到相应的存储路径。
* **特殊提示**：在 POST 接口中，为特殊场景增加提示 okMessage。
* **菜单与顶部布局优化**：菜单超出长度时提供滚动条，并且隐藏样式、优化`Header`组件布局

### 修复内容

* **主页刷新**：增加了对登录页面的限制，修复了主页刷新调用接口的问题。
* **Blob** **请求**：新增对 Blob 请求错误的解析。
* **状态字段**：删除了策略实例中的状态字段。
* **角色名称列**：修复了策略模板角色名称列悬浮遮挡的问题。
* **参数导入导出**：修正了导入和导出参数时的报错问题，提升了功能稳定性。
* **审批编辑**：修复了在编辑“我的审批”时 row 为空的问题，提升了用户体验。
* **文件上传**：文件上传界面现在能正确显示上传文件的名称。
* **删除按钮**：解决了策略实例列表中点击删除按钮无响应的问题。
* **编辑按钮**：修复了在“我的策略申请”页面点击编辑按钮时页面没有正确响应的问题。
* **策略文件上传**：解决了在“新增策略模板”页面导入参数时，未能上传策略文件的问题。
* **模板列表显示**：改善了策略模板列表的页面显示，解决了显示不完整的问题。
* **多选操作**：修复了策略模板列表中多选操作的问题。
* **文件名称**：修复了导出文件名称不正确的问题，更新为“我的审批”。
* **翻页操作**：确保了策略实例页面的翻页操作正常。
* **策略类型切换**：修复了在切换策略类型时加载策略存储位置的问题。
* **审批页面刷新**：修复了在策略审批页面刷新时出现的报错问题，确保页面稳定性


## 版本 1.5.6.0 更新日志

### 新增功能

1. **策略审批功能：**

    - 新增策略审批、我的审批、做市策略、量化策略的页面功能。

2. **版本管理：**

    - 新增打包自动生成版本号.txt文件，并提供sh脚本。

3. **实体账户和连接状态更新：**

    - 实体账户新增通道名称字段。
    - 连接状态新增通道名称字段。

4. **策略默认状态：**

    - 新增策略默认状态为启用。

5. **策略展示：**

    - 上传策略展示文件名。

6. **交易日历：**

    - 交易日历修改，新增 SSE 长连接。

7. **提示功能：**

    - 封装 HTTP 请求中的提示功能。

### 重构

1. **提交表单方法：**

    - 重写提交表单的方法，定义 config 判断请求类型，用 `[]` 方式填充 HTTP 请求。
    - 封装 `rulemixin` 方法，提取公共方法部分。

2. **管理组件：**

    - 封装管理组件的公共方法到 `mixin` 组件。
    - 添加策略存储路径的 tooltip 提示。

3. **角色管理：**

    - 添加角色时给出提示信息。
    - 提取公共方法为 `setList`。

4. **请求重构：**

    - 重构 `request` 请求，合并 blob 方法。

### 修复的 Bug

1. **策略存储位置映射：**

    - 修复策略存储位置映射关系错误的问题。

2. **角色客户端权限：**

    - 修复角色客户端权限，权限列表渲染错误的问题（由于场景与权限列表加载顺序不一致导致的）。
    - 修复客户端权限编辑时传参错误问题。

3. **策略审批和展示：**

    - 修复策略展示中的删除用户问题。
    - 修复策略审批完成的功能问题。

4. **导出功能：**

    - 删除导出时的多余参数。
    - 修复部分导出功能无法导出的问题。

5. **环境查询：**

    - 修复环境查询无效问题。

6. **用户管理：**

    - 修复用户管理筛选取值类型警告。
    - 修复新增用户时密码重复加密问题，提示填写密码。

7. **交易日历：**

    - 去除交易日历编辑删除操作。

8. **策略参数展示：**

    - 更改策略参数列表展示判断的 code。

9. **其他修复：**

    - 修复合并时判断用户策略调整为 8。
    - 去除策略审批菜单。
    - 修复连续提交新增用户导致密码重复加密，造成密码强度不足问题。
    - 修复角色分页事件查询失效。

### 性能优化

- 封装 HTTP 请求中的提示功能，添加请求导出方法提醒。

### 数据字典

- 抽象封装数据字典方法。

### 插槽语法

- 修改插槽语法。

## 版本 1.5.5.0 更新内容

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

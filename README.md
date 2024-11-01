# HFT-BO-WEB

## 项目介绍

**HFT-BO-WEB** 是一款量化交易系统的 Web 前端平台，专为量化交易策略的管理、监控和优化而设计。它提供了全面的功能来支持交易策略的审批、参数管理、系统监控及数据权限控制，以满足量化交易中的复杂需求。

### 主要功能

- **策略管理**：支持量化策略的创建、审批、导入和导出。用户可以方便地管理和配置策略参数，并进行策略审批记录的查看和导出。
- **交易数据权限控制**：细化的权限管理功能，确保对订单、成交和持仓等交易数据的安全访问。
- **系统监控**：实时监控系统状态，包括交易环境和连接状态，保障系统的稳定性和可靠性。
- **账户管理**：管理实体账户和分账户，支持多层次的账户结构和权限设置。
- **报表查询**：强大的报表生成和查询功能，支持订单、成交和持仓等多种报表类型，助力数据分析和决策。

### 用户体验提升

- **动态背景效果**：通过 Canvas 绘制动态背景，增强界面的视觉效果，提升用户体验。
- **环境显示功能**：实时显示当前交易环境（如开发、测试或生产），提供清晰的环境状态信息。

**HFT-BO-WEB** 旨在为量化交易提供一个高效、直观的管理平台，通过优化的功能和用户体验，帮助用户更好地执行和调整交易策略，确保交易操作的高效性和数据的安全性。

## 安装与运行步骤

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
4. **更新版本：**

   ```bash
   npm run version x.x.x
   ```

## 版本关系

|   生产版本    | web 版本 |  Tag 版本  |
|:---------:|:------:|:--------:|
|   1.6.0   | 2.2.0  | v1.5.6.1 |
|   1.6.0   | 2.3.1  | v1.5.6.2 |
|   1.6.0   | 2.4.1  | v1.5.6.3 |
| 1.7.0(开发) | 2.5.1  |          |

## 版本 2.7.1 更新日志  2024-10-31

### 修复

**交易日历**

- 更新了监听器中的条件，检查tradeExchangeTypeList是否有值且exchangeCode未设置。
- 此更改避免了重复赋值，提高了稳定性。

## 版本 2.7.0 更新日志  2024-10-28

### 优化

- 菜单宽度优化：根据不同分辨率自适应且最大宽度为250px
- 分账户校验逻辑优化为every方法

## 版本 2.6.4 更新日志  2024-10-17

### 新增

- 新增python解密方法

### 修复

- 策略服务节点名称、策略服务节点Ip不支持排序

## 版本 2.6.3 更新日志  2024-10-12

### 优化

- 策略模板优化：策略文件类型、策略类型一经创建不可修改

## 版本 2.6.2 更新日志  2024-09-27

### 优化

- 实体账户中label更新为`密码(加密)`

## 版本 2.6.1 更新日志  2024-09-24

### 修复

- 用户管理中表格布局不统一的问题

## 版本 2.6.0 更新日志  2024-09-23

### 新增功能

- 编辑量化模板时，策略文件类型不可修改。

## 版本 2.5.2 更新日志  2024-09-18

### 优化

- 通用样式：封装了通用的 CSS 样式。
- 提示信息：将各种提示信息封装到常量中。

## 版本 2.5.1 更新日志  2024-09-11

### 优化

**菜单列表解析**

- 使用 `Map` 数据结构来加速节点查找，时间复杂度降至 O(n),性能提升100倍。
- 将节点创建和树结构构建分为两个步骤，提高代码可读性和维护性。
- 适应性强，能够处理不同层级的节点关系。

## 版本 2.5.0 更新日志  2024-09-09

### 新增功能

- 打包时自动读取readme最新版本号，并修改package.json对应的version
- 新增获取策略服务节点接口
- 量化策略、策略审批中新增策略服务节点`ruleNodeName`字段
- 量化策略列表、策略审批新增策略服务节点`ruleNodeName、ruleNodeIp`

### 优化

- 配置iView-loader,解决iView组件 忽略前缀i的问题

## 版本 2.4.2 更新日志  2024-09-06

### 修复问题

- 修复查看策略参数过长时显示横向滚动条的问题
- 修复订单列表报单量字段错误
- 交易通道只展示Trade或者Both类型

### 优化

- 抽取参数列表封装为公共方法展示，优化代码结构

## 版本 2.4.1 更新日志  2024-09-05

### 优化

- 新增http错误处理blob的限制判断，预先判断是否为blob类型

## 版本 2.4.0 更新日志  2024-09-04

### 新增功能

- 文件上传限制：增加了对 HTTP `413` 状态码的判断，以检测文件是否超出上传限制。
- 上传进度显示：新增了上传策略文件的进度展示功能。
- 上传取消功能：新增了取消上传策略文件的功能，并提供相关提示。

### 优化功能

- 参数字段清理：去除多余的策略参数字段 `range、group 和 readonly`。

## 版本 2.3.2 更新日志  2024-09-02

### 修复问题

- 策略ID处理：修复了上传策略文件第一次失败时未清空 value 导致第二次上传失败的问题。

### 优化功能

- 请求提示校验：优化了文件上传请求成功后的提示，增加了 code 为 `0` 的校验

## 版本 2.3.1 更新日志  2024-08-29

### 修复问题

- 修复了 header 布局遮挡问题。
- 修复了编辑策略时上传文件名未清空的问题。
- 修复了做市策略 tab 页面“新增策略”按钮的文本，改为“新增做市策略”。
- 修复了量化策略 tab 页面“新增策略”按钮的文本，改为“新增策略模板”。
- 修复了新增/编辑策略模板时，切换策略类型从“套利策略”到“用户策略”时，策略文件路径和名称未同步更新的问题。

## 版本 2.3.0 更新日志  2024-08-27

### 新增功能

- Login页面新增版本号展示，注释打包自动生成版本号.txt文件，降低维护成本
- router跳转限制，增加token判断

### 修复问题

- 新增策略提示应为:`策略文件名称必须以.so结尾`
- 操作日志表头修改为`用户编号、用户名称`
- 交易日历计算Label名称修改、日期组件宽度调整

### 重构与优化

- SSE长链接存放在worker线程呢，避免阻塞主线程
- 图片大小压缩，优化项目体积与页面加载速度

## 版本 2.2.0 更新日志  2024-08-23

### 新增功能

1. **审批操作及策略管理：**
    - 新增审批通过和拒绝时的二次确认弹窗。
    - 新增导出策略参数功能，便于后续的导入和管理。
    - 新增策略审批记录的导出功能。
    - 新增策略参数布尔类型，支持下拉菜单选择。

2. **打包和配置优化：**
    - 修改 vue.config.js 文件，将打包目录输出至 /build。
    - 更新 .gitignore 文件，忽略 /build 目录。
    - 生产环境时禁用 console.log 日志打印。

3. **界面和功能优化：**
    - 切换策略类型时，自动映射到相应的存储路径。
    - 在 POST 接口中，为特殊场景增加提示 okMessage。
    - 菜单超出长度时提供滚动条，并且隐藏样式、优化 Header 组件布局。
    - 输入框新增 tooltip 提示。
    - 新增策略文件名称和路径字段，修改策略类型映射策略路径的对应关系，策略 Table 中策略存储位置拆分为两个字段。

### 修复内容

1. **功能和界面修复：**
    - 增加对登录页面的限制，修复主页刷新调用接口的问题。
    - 新增对 Blob 请求错误的解析。
    - 删除策略实例中的状态字段。
    - 修复策略模板角色名称列悬浮遮挡的问题。
    - 修正导入和导出参数时的报错问题，提升功能稳定性。
    - 修复在编辑“我的审批”时 row 为空的问题，提升用户体验。
    - 文件上传界面现在能正确显示上传文件的名称。
    - 解决策略实例列表中点击删除按钮无响应的问题。
    - 修复在“我的策略申请”页面点击编辑按钮时页面没有正确响应的问题。
    - 解决在“新增策略模板”页面导入参数时，未能上传策略文件的问题。
    - 改善策略模板列表的页面显示，解决显示不完整的问题。
    - 修复策略模板列表中多选操作的问题。
    - 修复导出文件名称不正确的问题，更新为“我的审批”。
    - 确保策略实例页面的翻页操作正常。
    - 修复在切换策略类型时加载策略存储位置的问题。
    - 修复在策略审批页面刷新时出现的报错问题，确保页面稳定性。
    - 修复修改后策略文件路径又恢复为默认值的问题。
    - 修复内容为空展示空白提示框的问题。
    - 修复首次进入登录页提示账号过期的问题。

## 版本 2.1.0 更新日志 2024-08-08

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

## 版本 2.0.0 更新内容 2024-06-01

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

## 版本 1.0.0 更新内容 2023-05-15

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


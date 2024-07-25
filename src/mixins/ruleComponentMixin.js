import {http} from "@/utils/request";
import {getRuleFileType, getRuleType, handleExport, handleSort} from "@/common/common";
import ParamsTable from "@/components/ParamsTable.vue";
import {URL} from "@/api/serverApi";

const ruleComponentMixin = {
    data() {
        let paramList = [
            {
                name: "account id",
                description: "分账户",
                type: 3,
                value: "testgy_sim01",
                group: "account",
                range: '100',
                readOnly: 'true'
            },
        ]
        return {
            fileType: '',
            rulePath: '',
            uploadFlag: false,
            chooseRule: false,
            userValidRules: {},
            userStrategyInfo: {
                ruleFileType: "",
                ruleId: "",
                rulePath: "",
                ruleVersion: "",
                ruleName: "",
                customerId: "",
                ruleType: "",
                ruleParams: [],
            },
            paramList,
            userList: [],
        };
    },
    methods: {
        handleExport,
        getRuleFileType,
        getRuleType,
        handleSort,
        // 清空参数列表
        clearParamList() {
            this.paramList = []
        },
        // 添加一行参数列表
        addRow() {
            this.paramList.push({
                name: "",
                description: "",
                type: "",
                value: "",
                group: "",
                range: "",
                readOnly: "false"
            },);
        },
        // 检查重复的 name 字段的函数
        checkDuplicateNames(paramList) {
            const nameCountMap = {};
            const duplicateNames = [];
            paramList.forEach((param) => {
                const name = param.name;
                nameCountMap[name] = (nameCountMap[name] || 0) + 1;
            });
            // 过滤出出现超过一次的名称
            Object.keys(nameCountMap).forEach((name) => {
                if (nameCountMap[name] > 1) {
                    duplicateNames.push({name, count: nameCountMap[name]});
                }
            });
            return duplicateNames;
        },
        // 上传策略或参数文件
        uploadFile(type) {
            this.fileType = type
            // 获取文件输入元素
            const fileInput = document.getElementById('fileInput');
            fileInput.click()
        },
        // 新建策略时获取策略ID及存储位置
        fetchNewPolicyInfo(code) {
            if (code) {
                http.get(`${URL.ruleIdPath}?type=${code}`, (response) => {
                    const {ruleId, rulePath} = response.data;
                    this.userStrategyInfo.ruleId = ruleId;
                    this.rulePath = rulePath
                    this.userStrategyInfo.rulePath = rulePath;
                })
            }
        },
        getUserResponse(res) {
            setTimeout(() => {
                this.loading = false;
            }, 200);
            this.pagination.total = res.data.total;
            this.tableData = res.data.dataList || [];
        },
        // 获取用户代码
        getUserList() {
            http.get(URL.userList, (res) => {
                this.userList = res.data;
            });
        },
        handleShowParamsTable(e) {
            this.chooseRule = e === '8';
            switch (e) {
                // 0 银行间双边做市策略-->./Rules/libMM_strategy.so
                // 1 银行间指示性报价策略->./Rules/indicative_strategy.so
                // 3 交易所新债平台做市策略-->./Rules/libmm_strategy_rate.so
                // 4 交易所固收平台做市策略-->./Rules/libmm_strategy_fi.so
                case '0':
                    this.userStrategyInfo.rulePath = './Rules/libMM_strategy.so'
                    break
                case '1':
                    this.userStrategyInfo.rulePath = './Rules/indicative_strategy.so'
                    break
                case '3':
                    this.userStrategyInfo.rulePath = './Rules/libmm_strategy_rate.so'
                    break
                case '4':
                    this.userStrategyInfo.rulePath = './Rules/libmm_strategy_fi.so'
                    break
                default:
                    this.userStrategyInfo.rulePath = this.rulePath || this.userStrategyInfo.rulePath
                    break
            }
        },
        // 新增弹窗关闭
        cancel() {
            this.showAddModal = false;
            this.paramList = []
        },
        // 公共方法：显示消息提示
        showMessage(content, type = 'info', duration = 6) {
            this.$Message[type]({
                content,
                duration,
            });
        },
        handleFileChange(event, type, path) {
            // 获取用户选择的文件
            const file = event.target.files[0];
            if (file) {
                // 根据 type 判断处理逻辑
                if (type === 'strategy') {
                    // 使用注释逻辑
                    const url = `${path}/${this.userStrategyInfo.ruleId}`;
                    // 执行上传操作，你可以调用相应的上传方法，比如 http.uploadFile
                    console.log('选择的文件：', file, event);
                    // TODO: 调用上传操作的代码
                    http.uploadFile(url, file, {},
                        (response) => {
                            this.$Message.success('上传成功');
                            // 处理上传成功后的逻辑
                        },
                        (error) => {
                            this.$Message.error('上传失败');
                            // 处理上传失败后的逻辑
                        }
                    );
                    document.getElementById('fileInput').value = '';
                } else {
                    // 使用处理 JSON 文件的逻辑
                    // 检查文件类型是否为 JSON
                    if (file.type === 'application/json') {
                        // 创建一个 FileReader 对象
                        const reader = new FileReader();
                        // 为文件加载完成时触发的事件注册处理程序
                        reader.onload = (event) => {
                            try {
                                // event.target.result 包含文件内容，这里假设文件内容是 JSON 格式的
                                const jsonContent = JSON.parse(event.target.result).param;
                                // 检查重复的 name 字段
                                const duplicateNames = this.checkDuplicateNames(jsonContent);
                                if (duplicateNames.length > 0) {
                                    const messages = duplicateNames.map(({name, count}) => `${name} 有${count}条`);
                                    const message = `参数名重复：${messages.join('、')}`;
                                    // 有重复的 name 字段，显示警告消息
                                    this.showMessage(message, 'error', 6)
                                } else {
                                    // 没有重复的 name 字段，显示成功消息
                                    this.$Message.success('导入参数列表成功');
                                }
                                // 更新 paramList
                                this.paramList = jsonContent;
                            } catch (error) {
                                this.$Message.error('导入参数列表失败');
                                console.error('读取 JSON 文件时发生错误：', error);
                            }
                        };
                        // 开始读取文件，以文本格式读取
                        reader.readAsText(file);
                    } else {
                        // 文件不是 JSON 类型，进行相应的处理
                        this.$Message.error('选择的文件不是 JSON 文件');
                    }
                }
            }
            // 在上传后添加以下代码
            document.getElementById('fileInput').value = '';
        },
    },
}
const ruleVettingColumn = {
    data() {
        let columns1 = [
            {
                title: "策略ID",
                key: "ruleId",
                minWidth: 120,
                resizable: true,
                sortable: 'custom',
                width: null,
            },
            {
                title: "策略文件类型",
                key: "ruleFileType",
                minWidth: 140,
                resizable: true,
                width: null,
                sortable: 'custom',
                render: (h, {row}) => {
                    const result = getRuleFileType(row.ruleFileType, true);
                    return h("span", result.description);
                },
            },
            {
                title: "策略文件存储位置",
                key: "rulePath",
                sortable: 'custom',
                resizable: true,
                width: null,
                minWidth: 220,
            },
            {
                title: "策略版本",
                key: "ruleVersion",
                sortable: 'custom',
                resizable: true,
                width: null,
                minWidth: 120,
            },
            {
                title: "策略名称",
                key: "ruleName",
                sortable: 'custom',
                resizable: true,
                width: null,
                minWidth: 120,
            },
            {
                title: "用户代码",
                key: "customerId",
                sortable: 'custom',
                resizable: true,
                width: null,
                minWidth: 120,
            },
            {
                title: "策略类型",
                key: "ruleType",
                sortable: 'custom',
                resizable: true,
                width: null,
                minWidth: 220,
                render: (h, {row}) => {
                    const result = getRuleType(row.ruleType, true);
                    return h("span", result.description);
                },
            },
            {
                title: "状态",
                key: "ruleVettingStatus",
                resizable: true,
                width: null,
                minWidth: 120,
                sortable: 'custom',
                render: (h, params) => {
                    const colorList = ["#dcba0e", "#19be6b", "#ed4014", "#616261"]
                    const statusInfo = getRuleVettingStatus(params.row.ruleVettingStatus)
                    const createIcon = (code) => {
                        return h("Icon", {
                            props: {
                                type: "ios-radio-button-on",
                                color: colorList[code],
                            },
                        });
                    };
                    return h("span", [
                        createIcon(statusInfo.code - 1),
                        statusInfo.description,
                    ]);
                },
            },
            {title: "操作", slot: "operator", width: 180},
        ];
        return {columns1};
    }
}

export {ruleVettingColumn, ruleComponentMixin}
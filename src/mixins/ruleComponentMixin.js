import {http} from "@/utils/request";
import {getRuleFileType, getRuleMakeMarketType, getRuleVettingStatus, handleExport, handleSort} from "@/common/common";
import {URL} from "@/api/serverApi";
import {tableMixin} from "@/mixins/tableMixin";
import axios from "axios";
import {ERROR_MSG, SUCCESS_MSG} from "@/common/constant";

const ruleComponentMixin = {
    mixins: [tableMixin],
    data() {
        // let paramList = [
        //     {
        //         name: "account id",
        //         description: "分账户",
        //         type: 3,
        //         value: "testgy_sim01",
        //         group: "account",
        //         range: '100',
        //         readOnly: 'true'
        //     },
        // ]
        return {
            fileType: '',
            uploadFlag: false,
            chooseRule: false,
            userStrategyInfo: {
                ruleFileType: "",
                ruleId: "",
                ruleLocation: "",
                ruleFileName: "",
                ruleVersion: "",
                ruleName: "",
                customerId: "",
                ruleType: "",
                active: true,
                ruleNodeName: "",
                ruleParams: [],
            },
            userValidRules: {},
            paramList: [],
            userList: [],
            fileUploadProgress: 0,
            cancelTokenSource: null, // 用于保存取消令牌源
            ruleMonitorNodes: [], // 策略服务节点
        };
    },
    methods: {
        handleExport,
        getRuleFileType,
        getRuleMakeMarketType,
        handleSort,
        // 清空参数列表
        clearParamList() {
            this.paramList = []
        },
        exportParamList() {
            const data = {
                param: this.paramList
            }
            // 将数据转换为 JSON 字符串
            const jsonString = JSON.stringify(data, null, 2);
            // 创建一个 Blob 对象
            const blob = new Blob([jsonString], {type: 'application/json'});

            if (typeof window !== 'undefined' && window.URL && window.URL.createObjectURL) {
                // 在浏览器环境中创建下载链接
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'params-list.json';

                // 触发下载
                document.body.appendChild(a);
                a.click();

                // 清理
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                console.error('URL.createObjectURL is not supported in this environment.');
            }
        },
        // 添加一行参数列表
        addRow() {
            this.paramList.push({
                name: null,
                description: null,
                type: null,
                value: null,
                // group: null,
                // range: null,
                // readOnly: "false"
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
                    this.userStrategyInfo.ruleLocation = rulePath;
                })
                this.userStrategyInfo.ruleFileName = code === '1' ? 'main.py' : ""
            }
        },
        handleChangeRulePath(e) {
            this.rulePath = e.target.value
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
        // 获取策略服务节点列表
        getRuleMonitorNodesList() {
            http.get(URL.ruleMonitorNodes, (res) => {
                this.ruleMonitorNodes = res.data
            })
        },
        handleShowParamsTable(e) {
            this.chooseRule = e === '8';
            this.fileName = ""
            this.fileUploadProgress = 0
            // 配置对象，将策略代码映射到各自的路径和文件名
            const strategyConfig = {
                '1': {path: './Rules/', fileName: 'libMM_strategy.so'},           // 银行间双边做市策略
                '6': {path: './Rules/', fileName: 'indicative_strategy.so'},      // 银行间指示性报价策略
                'a': {path: './Rules/', fileName: 'libmm_strategy_rate.so'},      // 交易所新债平台做市策略
                'b': {path: './Rules/', fileName: 'libmm_strategy_fi.so'},        // 交易所固收平台做市策略
                'c': {path: './Rules/', fileName: 'libBond_Spread.so'},           // 套利策略
            };
            // 判断 e 是否在 strategyConfig 中存在对应的配置
            if (strategyConfig[e]) {
                // 如果存在配置，并且 ruleFileType 是 '0'，则设置规则文件路径和文件名
                if (this.userStrategyInfo.ruleFileType === '0') {
                    // 如果有对应的路径配置，则使用配置的路径，否则使用默认路径
                    this.userStrategyInfo.ruleLocation = strategyConfig[e].path || this.rulePath || this.userStrategyInfo.ruleLocation;
                    // 如果有对应的文件名配置，则使用配置的文件名，否则保持原来的文件名
                    this.userStrategyInfo.ruleFileName = strategyConfig[e].fileName !== undefined ? strategyConfig[e].fileName : this.userStrategyInfo.ruleFileName;
                }
            } else {
                // 如果 e 没有在配置中，清空规则文件路径和文件名
                this.userStrategyInfo.ruleLocation = '';
                this.userStrategyInfo.ruleFileName = '';
            }
        },
        // 新增弹窗关闭
        cancel() {
            this.showAddModal = false;
            this.paramList = []
            // 关闭弹窗时取消上传请求
            if (this.cancelTokenSource) {
                this.cancelTokenSource.cancel('已取消上传策略文件');
            }
        },
        /**
         * 消息提示
         * @param content - 消息内容
         * @param type - 消息提示类型，默认INFO
         * @param duration - 提示延迟关闭时间，默认6秒
         */
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
                const fileName = file.name
                // 根据 type 判断处理逻辑
                if (type === 'strategy') {
                    this.fileUploadProgress = 0
                    this.fileName = ""
                    if (!this.userStrategyInfo.ruleId) {
                        this.showMessage('请先获取策略ID', 'error')
                    } else {
                        // 取消之前的请求（如果有的话）
                        if (this.cancelTokenSource) {
                            this.cancelTokenSource.cancel('已取消上传策略文件');
                        }
                        // 创建新的取消令牌源
                        this.cancelTokenSource = axios.CancelToken.source();
                        // 使用注释逻辑
                        const url = `${path}/${this.userStrategyInfo.ruleId}`;
                        // 创建一个取消令牌
                        console.log('选择的文件：', file, event);

                        // const reader = new FileReader();
                        // reader.onload = (e) => {
                        //     // 将文件内容转换为base64编码的字符串
                        //     this.userStrategyInfo.ruleFileContent = e.target.result;  // 可以选择 base64 或 ArrayBuffer
                        // };
                        // reader.readAsDataURL(file);  // 读取为base64

                        // TODO: 调用上传操作的代码
                        http.uploadFile(url, file, {}, this.cancelTokenSource.token, // 传递取消令牌
                            progressPercent => {
                                this.fileUploadProgress = progressPercent
                            },
                            (response) => {
                                this.fileName = fileName;
                                this.$Message.success(SUCCESS_MSG.uploadSuccess);
                                // 处理上传成功后的逻辑
                            }
                        );
                    }
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
                                    this.$Message.success(SUCCESS_MSG.importSuccess);
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
                        this.$Message.error(ERROR_MSG.fileNotJson);
                    }
                }
            }
            // 在上传后添加以下代码
            document.getElementById('fileInput').value = '';
        },
    },
}

export {ruleComponentMixin}
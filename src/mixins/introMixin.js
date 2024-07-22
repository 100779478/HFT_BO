// introMixin.js

export default {
    methods: {
        startIntro() {
            this.$introJs()
                .setOptions({
                    tooltipTitle: '<h3>引导标题</h3>',
                    steps: [
                        {
                            element: '#currentEnv',
                            intro: '第一步：查看当前环境',
                            position: 'bottom',
                            title: '环境信息'
                        },
                        {
                            element: '#environmentDropdown',
                            intro: '第二步：请选择环境',
                            position: 'left',
                            title: '选择环境'
                        },
                        // Add more steps if needed
                    ],
                    buttonClass: 'ivu-btn ivu-btn-info',
                    exitOnOverlayClick: false, // 禁止点击遮罩层关闭引导
                    nextLabel: '下一步',
                    prevLabel: '上一步',
                    hidePrev: true,
                    hideNext: true,
                    // doneLabel: '完成',
                    skipLabel: '', // 隐藏右上角关闭按钮
                    exitOnEsc: false,
                })
                .onbeforeexit(function () {
                    return false;
                }).start();
        },
        exitIntro() {
            this.$introJs().exit()
        },
        closeIntro() {
            this.$introJs().onexit(function () {
                alert("exit of introduction");
            });
        }
    }
}

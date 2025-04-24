> [HFT-BO 运维监控系统字段说明](https://pxmzlp33z9g.feishu.cn/docx/BOT8d9wNtoDDMtxI4BzcCn3rnDf "HFT-BO 运维监控系统字段说明")
```js
container: [
        {
          width: 150,
          height: 120,
          left: 70,
          top: 20,
          title: '国债期货',
          background: 'rgba(80,135,255,0.25)'
        },
        {
          width: 460,
          height: 120,
          left: 370,
          top: 20,
          title: '交易所',
          background: 'rgba(255,127,80,0.25)'
        },
        {
          width: 750,
          height: 120,
          left: 850,
          top: 20,
          title: 'CFETS',
          background: 'rgba(202,29,95,0.25)'
        },
      ],
      nodes: [
        // 第一层
        {
          label: '中金所',
          node: 'femas',
          to: [{target: 'pegasusCounter', strokeDash: 0}],
          level: 1,
          x: 0.0445,
          speed: 0,
          monitor: false
          // arrow: true,
          // background: 'rgb(253,37,37)'
        },
        {
          label: '上交所固收平台',
          node: 'fixSh',
          to: [{target: 'zjOms', strokeDash: 0, offset: {sx: -20}}, {target: 'termFixMdReader'}],
          level: 1,
          x: 0.22,
        },
        {
          label: '上交所新债平台',
          node: 'debtSh',
          to: [{target: 'zjOms', strokeDash: 0, offset: {sx: -20}}, {target: 'termMdReader'}],
          level: 1,
          x: 0.29,
        },
        {
          label: '深交所平台',
          node: 'exchangeSe',
          to: [{target: 'zjOms', strokeDash: 0, offset: {sx: -20}}, {target: 'termSZSEmd'}],
          level: 1,
          x: 0.36,
        },
        {
          label: '报价',
          node: 'economic',
          to: [{target: 'gateWay', strokeDash: 0}],
          level: 1,
          x: 0.46,
        },
        {
          label: 'CMDM',
          node: 'cmdm',
          to: [{target: 'gateWay', strokeDash: 0}],
          level: 1,
          x: 0.54,
        },
        {
          label: '双边',
          node: 'bond',
          to: [{target: 'gateWay', strokeDash: 0}],
          level: 1,
          x: 0.62,
        },
        {
          label: 'XBOND',
          node: 'xbond',
          to: [{target: 'gateWay', strokeDash: 0}],
          level: 1,
          x: 0.7,
        },
        {
          label: 'XSWAP',
          node: 'xswap',
          to: [{target: 'gateWay', strokeDash: 0}],
          level: 1,
          x: 0.78,
        },

        // 第二层
        {
          label: '飞马柜台',
          node: 'pegasusCounter',
          to: [
            {target: 'termTrade', strokeDash: 0, offset: {sx: -65}},
            {target: 'termFemas', offset: {sx: 67}},
          ],
          level: 2,
          x: 0.01,
          width: 250,
        },
        {
          label: '中金OMS',
          node: 'zjOms',
          to: [{target: 'termOMS', strokeDash: 0}],
          level: 2,
          x: 0.15,
          arrow: true,
        },
        {
          label: '恒泰',
          node: 'gateWay',
          to: [{target: 'termCMDM', route: ['left', 'top']}, {
            target: 'termXQUANT',
            offset: {sx: 20, tx: 20}
          }, {target: 'termXQUANT', offset: {sx: -20, tx: -20}}],
          level: 2,
          x: 0.62,
          badge: 0
        },
        {
          label: 'RDI信息',
          node: 'rdi',
          to: [{target: 'tinit'}],
          level: 2,
          x: 0.71,
          shape: 'elliptical',
        },
        {
          label: '中金北斗',
          node: 'zjbd',
          to: [{target: 'tinit'}],
          level: 2,
          x: 0.8,
          monitor: false,
          // speed: 0,
          shape: 'elliptical',
        },

        // 第三层
        {
          label: '期货交易',
          node: 'termTrade',
          to: [{target: 'ignore', strokeDash: 0}],
          level: 3,
          x: 0.01,
          monitor: {
            cpu: 20,
            memory: 10,
          },
          badge: Math.ceil(Math.random() * 10)
        },
        {
          label: '期货行情',
          node: 'termFemas',
          to: [{target: 'ignore'}],
          level: 3,
          x: 0.08,
          badge: Math.ceil(Math.random() * 10)
        },
        {
          label: '交易所交易',
          node: 'termOMS',
          to: [{target: 'ignore', strokeDash: 0}],
          level: 3,
          speed: 1,
          x: 0.15,
          badge: Math.ceil(Math.random() * 10)
        },
        {
          label: '上交所固收行情',
          node: 'termFixMdReader',
          to: [{target: 'ignore'}],
          level: 3,
          x: 0.22,
          badge: Math.ceil(Math.random() * 10)
        },
        {
          label: '上交所新债行情',
          node: 'termMdReader',
          to: [{target: 'ignore'}],
          level: 3,
          x: 0.29, badge: Math.ceil(Math.random() * 10)
        },
        {
          label: '深交所行情',
          node: 'termSZSEmd',
          to: [{target: 'ignore'}],
          level: 3,
          x: 0.36,
          badge: Math.ceil(Math.random() * 10)
        },
        {
          label: 'CMDM行情',
          node: 'termCMDM',
          to: [{target: 'ignore'}],
          level: 3,
          x: 0.5,
          badge: Math.ceil(Math.random() * 10)
        },
        {
          label: '恒泰行情及交易',
          node: 'termXQUANT',
          color: '#0fcc0f',
          // arrow: true,
          to: [{target: 'ignore', offset: {sx: 20}}, {
            target: 'gateWay',
            route: ['top', 'bottom'],
            offset: {sx: -20, tx: -20},
            strokeDash: 0
          }],
          level: 3,
          x: 0.62,
          badge: Math.ceil(Math.random() * 10)
        },

        // 隐藏点
        {
          label: '',
          node: 'ignore',
          to: [{
            target: 'TKernel',
            offset: {sx: 20, tx: 2}
          }, {
            target: 'TKernel',
            strokeDash: 0,
            offset: {tx: -22}
          }, {target: 'termXQUANT', route: ['right', 'bottom'], strokeDash: 0, offset: {tx: -20}}],
          level: 3,
          x: 0.38,
          y: 0.5,
          width: 0,
          height: 0,
          hidden: true
        },

        // 第四层
        {
          label: '初始化',
          node: 'tinit',
          to: [{target: 'TKernel', route: ['left', 'top'], offset: {tx: 20}}],
          color: 'red',
          level: 4,
          x: 0.59,
          y: 0.6,
          badge: Math.ceil(Math.random() * 10)
        },

        // 第五层
        {
          label: 'MYSQL',
          node: 'mysql',
          to: [{target: 'tinit', route: ['top', 'right']}, {target: 'bo', route: ['right', 'left']}],
          arrow: true,
          level: 5,
          shape: 'elliptical',
          x: 0.68,
        },
        {label: 'BO', node: 'bo', to: [], level: 5, x: 0.78},

        // 第六层
        {
          label: '风控',
          node: 'risk',
          to: [{target: 'TKernel', route: ['right', 'left']}],
          arrow: true,
          level: 6,
          x: 0.24
        },
        {
          label: '交易核心',
          node: 'TKernel',
          x: 0.36,
          to: [{target: 'client'}, {
            target: 'm2db',
            route: ['right', 'left']
          }],
          level: 6,
          badge: Math.ceil(Math.random() * 10)
        },
        {
          label: '数据持久化',
          node: 'm2db',
          to: [{target: 'mysql', route: ['right', 'bottom']}],
          x: 0.59,
          level: 6,
          badge: Math.ceil(Math.random() * 10)
        },

        // 第七层
        {label: '客户端', node: 'client', x: 0.36, to: [], level: 7, badge: Math.ceil(Math.random() * 10)},
      ]
```
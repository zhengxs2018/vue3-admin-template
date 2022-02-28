export default {
  '/guide': [
    {
      text: '介绍',
      link: '/guide/'
    },
    {
      text: '微应用',
      children: [
        {
          text: '创建应用',
          link: '/guide/app/create'
        },
        {
          text: '命名空间',
          link: '/guide/app/namespace'
        },
        {
          text: '主题配置',
          link: '/guide/app/theme'
        }
      ]
    },
    {
      text: '教程',
      children: [
        {
          text: '接入到 Lyra 平台',
          link: '/guide/tutorials/lyra'
        }
      ]
    },
    {
      text: '词汇表',
      link: '/guide/glossary'
    },
    {
      text: '常见问题',
      link: '/guide/qa'
    }
  ],
  '/plugins': [
    {
      text: '框架',
      link: '/plugins/framework'
    },
    {
      text: '微应用/子应用',
      link: '/plugins/app'
    },
    {
      text: '微模块',
      link: '/plugins/module'
    }
  ]
}

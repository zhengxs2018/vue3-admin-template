const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  pages: {
    index: {
      title: process.env.VUE_APP_SITE_TITLE,
      description: process.env.VUE_APP_SITE_DESCRIPTION,
      entry: 'src/main.ts'
    }
  },
  transpileDependencies: true,
  lintOnSave: false
})

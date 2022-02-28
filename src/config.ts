import navbar from './configs/navbar'
import sidebar from './configs/sidebar'

export default {
  lang: process.env.VUE_APP_LANG,
  title: process.env.VUE_APP_SITE_TITLE,
  description: process.env.VUE_APP_SITE_DESCRIPTION,
  head: [],
  themeConfig: {
    navbar,
    sidebar
  }
}

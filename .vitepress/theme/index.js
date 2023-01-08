import DefaultTheme from 'vitepress/dist/client/theme-default'
import Layout from './Layout.vue'
import './sponsors.css'
import VueSchoolLink from '../components/VueSchoolLink.vue'
import VueMasteryLogoLink from '../components/VueMasteryLogoLink.vue'

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    app.component('VueSchoolLink', VueSchoolLink)
    app.component('VueMasteryLogoLink', VueMasteryLogoLink)
    // app is the Vue 3 app instance from createApp()
    // router is VitePress' custom router (see `lib/app/router.js`)
    // siteData is a ref of current site-level metadata.
  },
}

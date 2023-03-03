import DefaultTheme from 'vitepress/theme'
import { Theme } from 'vitepress'
import './styles/vars.css'
import './styles/sponsors.css'
import VueSchoolLink from './components/VueSchoolLink.vue'
import VueMasteryLogoLink from './components/VueMasteryLogoLink.vue'

const theme: Theme = {
  ...DefaultTheme,

  enhanceApp({ app }) {
    app.component('VueSchoolLink', VueSchoolLink)
    app.component('VueMasteryLogoLink', VueMasteryLogoLink)
  },
}

export default theme
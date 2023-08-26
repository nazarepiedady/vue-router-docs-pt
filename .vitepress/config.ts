import { defineConfig, HeadConfig } from 'vitepress'

const META_URL = 'https://router.vuejs.org'
const META_TITLE = 'Vue Router'
const META_IMAGE = null
const META_DESCRIPTION = 'O roteador oficial para a Vue.js.'

const isProduction = process.env.NETLIFY && process.env.CONTEXT === 'production'

const productionHead: HeadConfig[] = [
  [
    'script',
    { 
      //src: 'https://unpkg.com/thesemetrics@latest',
      src: 'https://unpkg.com/thesemetrics@0.3.0/dist/browser.min.js',
      // @ts-expect-error: vitepress bug
      async: true,
      type: 'text/javascript',
    },
  ],
  [
    'script', 
    { 
      src: 'https://vueschool.io/banner.js?affiliate=vuerouter&type=top',
      // @ts-expect-error: vitepress bug
      async: true,
      type: 'text/javascript'
    }
  ],
]

if (process.env.NETLIFY) {
  console.log('Netlify build', process.env.CONTEXT)
}

const rControl = /[\u0000-\u001f]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g
const rCombining = /[\u0300-\u036F]/g

/**
 * Default slugification function
 */
export const slugify = (str: string): string =>
  str
    .normalize('NFKD')
    // Remove accents
    .replace(rCombining, '')
    // Remove control characters
    .replace(rControl, '')
    // Replace special characters
    .replace(rSpecial, '-')
    // ensure it doesn't start with a number
    .replace(/^(\d)/, '_$1')

const config = defineConfig({
  title: META_TITLE,
  appearance: 'dark',
  description: META_DESCRIPTION,

  markdown: {
    theme: {
      dark: 'one-dark-pro',
      light: 'github-light',
    },

    /*
    attrs: {
      leftDelimiter: '{',
      rightDelimiter: '}',
    },*/

    anchor: {
      slugify,
    },
  },
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['meta', { name: 'wwads-cn-verify', content: '7e7757b1e12abcb736ab9a754ffb617a' }],

    ['meta', { property: 'og:url', content: META_URL }],
    ['meta', { property: 'og:title', content: META_TITLE }],
    ['meta', { property: 'og:description', content: META_DESCRIPTION }],
    ['meta', { property: 'twitter:url', content: META_URL }],
    ['meta', { property: 'twitter:title', content: META_TITLE }],
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    //['meta', { property: 'twitter:image', content: META_IMAGE }],
    ['meta', { property: 'twitter:description', content: META_DESCRIPTION }],

    ...(isProduction ? productionHead : []),
  ],

  locales: {
    root: { label: 'Português', lang: 'pt-PT', link: '/' },
    en: { label: 'English', lang: 'en-US', link: 'https://router.vuejs.org/' },
    zh: { label: '简体中文', lang: 'zh-CN', link: 'https://router.vuejs.org/zh/' },
    ko: { label: '한국어', lang: 'ko-KR', link: 'https://router.vuejs.kr/' },
  },

  themeConfig: {
    logo: '/logo.svg',
    outline: [2, 3],

    socialLinks: [
      { icon: 'twitter', link: 'https://twitter.com/posva' },
      { icon: 'github', link: 'https://github.com/vuejs/router' },
      { icon: 'discord', link: 'https://chat.vuejs.org' },
    ],

    footer: {
      copyright: 'Direitos de autor © 2014-presente Evan You, Eduardo San Martin Morote',
      message: 'Lançado sob a licença MIT.',
    },

    editLink: {
      pattern: 'https://github.com/nazarepiedady/vue-router-docs-pt/edit/main/:path',
      text: 'Sugerir mudanças para esta página',
    },

    nav: [
      { text: 'Guia', link: '/guide/', activeMatch: '^/guide/' },
      { text: 'API',  link: '/api/', activeMatch: '^/api/' },
      {
        text: 'v4.x',
        items: [{ text: 'v3.x', link: 'https://v3.router.vuejs.org' }],
      },
      {
        text: 'Ligações',
        items: [
          { text: 'Discussões', link: 'https://github.com/vuejs/router/discussions' },
          { 
            text: 'Relatório de Mudança', 
            link: 'https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md'
          }
        ]
      },
    ],

    sidebar: {
      // catch-all fallback
      '/': [
        {
          text: 'Configuração',
          items: [
            {
              text: 'Introdução',
              link: '/introduction.html'
            },
            {
              text: 'Instalação',
              link: '/installation.html'
            }
          ]
        },
        {
          text: 'Fundamentos',
          collapsible: false,
          items: [
            {
              text: 'Começar',
              link: '/guide/',
            },
            {
              text: 'Correspondência de Rota Dinâmica',
              link: '/guide/essentials/dynamic-matching.html',
            },
            {
              text: "Sintaxe de Correspondência das Rotas",
              link: '/guide/essentials/route-matching-syntax.html',
            },
            {
              text: 'Rotas Encaixadas',
              link: '/guide/essentials/nested-routes.html',
            },
            {
              text: 'Navegação Programática',
              link: '/guide/essentials/navigation.html',
            },
            {
              text: 'Rotas Nomeadas',
              link: '/guide/essentials/named-routes.html',
            },
            {
              text: 'Visões Nomeadas',
              link: '/guide/essentials/named-views.html',
            },
            {
              text: 'Redirecionamento e Pseudónimos',
              link: '/guide/essentials/redirect-and-alias.html',
            },
            {
              text: 'Passagem de Propriedades para Componentes Rota',
              link: '/guide/essentials/passing-props.html',
            },
            {
              text: 'Diferentes Modos de História',
              link: '/guide/essentials/history-mode.html',
            },
          ],
        },
        {
          text: 'Avançado',
          collapsible: false,
          items: [
            {
              text: 'Guardas de Navegação',
              link: '/guide/advanced/navigation-guards.html',
            },
            {
              text: 'Campos de Meta da Rota',
              link: '/guide/advanced/meta.html',
            },
            {
              text: 'Requisição de Dados',
              link: '/guide/advanced/data-fetching.html',
            },
            {
              text: 'API de Composição',
              link: '/guide/advanced/composition-api.html',
            },
            {
              text: 'Transições',
              link: '/guide/advanced/transitions.html',
            },
            {
              text: 'Comportamento de Deslocamento',
              link: '/guide/advanced/scroll-behavior.html',
            },
            {
              text: 'Rotas de Carregamento Preguiçoso',
              link: '/guide/advanced/lazy-loading.html',
            },
            {
              text: 'Rotas com Tipos',
              link: '/guide/advanced/typed-routes.html',
            },
            {
              text: 'Estendendo o RouterLink',
              link: '/guide/advanced/extending-router-link.html',
            },
            {
              text: 'Falhas de Navegação',
              link: '/guide/advanced/navigation-failures.html',
            },
            {
              text: 'Roteamento Dinâmico',
              link: '/guide/advanced/dynamic-routing.html',
            },
          ],
        },
        {
          text: 'Guia de Migração',
          link: '/guide/migration/index.html',
        },
      ],
      '/api/': [
        { text: 'Pacotes', items: [{ text: 'vue-router', link: '/api/' }] }
      ],
    },

    algolia: {
      appId: 'BTNTW3I1XP',
      apiKey: '771d10c8c5cc48f7922f15048b4d931c',
      indexName: 'next_router_vuejs',
    },

    carbonAds: {
      code: 'CEBICK3I',
      //custom: 'CEBICK3M',
      placement: 'routervuejsorg',
    },

  },
})

export default config

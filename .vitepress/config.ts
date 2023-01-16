import { defineConfig, UserConfig } from 'vitepress'

const head: UserConfig['head'] = [
  ['link', { rel: 'icon', href: `/logo.png` }],
  [
    'meta',
    { name: 'wwads-cn-verify', content: '7e7757b1e12abcb736ab9a754ffb617a' },
  ],
  [
    'script',
    {
      src: 'https://vueschool.io/banners/main.js',
      async: true,
      type: 'text/javascript',
    },
  ],
]

if (process.env.NODE_ENV === 'production') {
  head.push([
    'script',
    {
      src: 'https://unpkg.com/thesemetrics@latest',
      async: '',
    },
  ])
}

const config = defineConfig({
  lang: 'pt-PT',
  title: 'Vue Router',
  description: 'O roteador oficial para Vue.js.',
  head,
  // serviceWorker: true,

  locales: {
    '/': {
      lang: 'pt-PT',
      title: 'Vue Router',
      description: 'O roteador oficial para Vue.js.',
    }
  },

  themeConfig: {
    repo: 'vuejs/router',
    docsRepo: 'nazarepiedady/vue-router-docs-pt',
    docsDir: '',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: 'Sugerir mudanças para esta página',

    carbonAds: {
      carbon: 'CEBICK3I',
      custom: 'CEBICK3M',
      placement: 'routervuejsorg',
    },

    algolia: {
      appId: 'BTNTW3I1XP',
      apiKey: '771d10c8c5cc48f7922f15048b4d931c',
      indexName: 'next_router_vuejs',
      // searchParameters: {
      //   facetFilters: ['tags:guide,api,migration'],
      // },
    },

    locales: {
      // Português
      '/': {
        label: 'Português',
        selectText: 'Idiomas',
        nav: [
          {
            text: 'Guia',
            link: '/guide/',
          },
          {
            text: 'Referência da API',
            link: '/api/',
          },
          {
            text: 'v4.x',
            items: [{ text: 'v3.x', link: 'https://v3.router.vuejs.org' }],
          },
          {
            text: 'Idiomas',
            items: [
              { text: 'English', link: 'https://router.vuejs.org' },
              { text: '简体中文', link: 'https://router.vuejs.org/zh/' }
            ]
          },
          {
            text: 'Relatório de Mudança',
            link: 'https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md',
          },
        ],

        sidebar: [
          {
            text: 'Introdução',
            link: '/introduction.html',
          },
          {
            text: 'Instalação',
            link: '/installation.html',
          },
          {
            text: 'Fundamentos',
            collapsable: false,
            children: [
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
            collapsable: false,
            children: [
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
            text: 'Migrando a partir da Vue 2',
            link: '/guide/migration/index.html',
          },
        ],
      }
    },
  },
})

export default config

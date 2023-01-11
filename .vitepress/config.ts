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
    },
    '/en/': {
      lang: 'en-US',
      title: 'Vue Router',
      description: 'The official router for Vue.js.',
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'Vue Router',
      description: 'Vue.js 的官方路由',
    }
  },

  themeConfig: {
    repo: 'vuejs/router',
    docsRepo: 'nazarepiedady/vue-router-docs-pt',
    docsDir: 'nazarepiedady/vue-router-docs-pt',
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
            text: 'Changelog',
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
      },
      // English
      '/en/': {
        label: 'English',
        selectText: 'Languages',
        nav: [
          {
            text: 'Guide',
            link: 'https://router.vuejs.org/guide/',
          },
          {
            text: 'API Reference',
            link: 'https://router.vuejs.org//api/',
          },
          {
            text: 'v4.x',
            items: [{ text: 'v3.x', link: 'https://v3.router.vuejs.org' }],
          },
          {
            text: 'Changelog',
            link: 'https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md',
          },
        ],

        sidebar: [
          {
            text: 'Introduction',
            link: 'https://router.vuejs.org/introduction.html',
          },
          {
            text: 'Installation',
            link: 'https://router.vuejs.org/installation.html',
          },
          {
            text: 'Essentials',
            collapsable: false,
            children: [
              {
                text: 'Getting Started',
                link: 'https://router.vuejs.org/guide/',
              },
              {
                text: 'Dynamic Route Matching',
                link: 'https://router.vuejs.org/guide/essentials/dynamic-matching.html',
              },
              {
                text: "Routes' Matching Syntax",
                link: 'https://router.vuejs.org/guide/essentials/route-matching-syntax.html',
              },
              {
                text: 'Nested Routes',
                link: 'https://router.vuejs.org/guide/essentials/nested-routes.html',
              },
              {
                text: 'Programmatic Navigation',
                link: 'https://router.vuejs.org/guide/essentials/navigation.html',
              },
              {
                text: 'Named Routes',
                link: 'https://router.vuejs.org/guide/essentials/named-routes.html',
              },
              {
                text: 'Named Views',
                link: 'https://router.vuejs.org/guide/essentials/named-views.html',
              },
              {
                text: 'Redirect and Alias',
                link: 'https://router.vuejs.org/guide/essentials/redirect-and-alias.html',
              },
              {
                text: 'Passing Props to Route Components',
                link: 'https://router.vuejs.org/guide/essentials/passing-props.html',
              },
              {
                text: 'Different History modes',
                link: 'https://router.vuejs.org/guide/essentials/history-mode.html',
              },
            ],
          },
          {
            text: 'Advanced',
            collapsable: false,
            children: [
              {
                text: 'Navigation guards',
                link: 'https://router.vuejs.org/guide/advanced/navigation-guards.html',
              },
              {
                text: 'Route Meta Fields',
                link: 'https://router.vuejs.org/guide/advanced/meta.html',
              },
              {
                text: 'Data Fetching',
                link: 'https://router.vuejs.org/guide/advanced/data-fetching.html',
              },
              {
                text: 'Composition API',
                link: 'https://router.vuejs.org/guide/advanced/composition-api.html',
              },
              {
                text: 'Transitions',
                link: 'https://router.vuejs.org/guide/advanced/transitions.html',
              },
              {
                text: 'Scroll Behavior',
                link: 'https://router.vuejs.org/guide/advanced/scroll-behavior.html',
              },
              {
                text: 'Lazy Loading Routes',
                link: 'https://router.vuejs.org/guide/advanced/lazy-loading.html',
              },
              {
                text: 'Typed Routes',
                link: 'https://router.vuejs.org/guide/advanced/typed-routes.html',
              },
              {
                text: 'Extending RouterLink',
                link: 'https://router.vuejs.org/guide/advanced/extending-router-link.html',
              },
              {
                text: 'Navigation Failures',
                link: 'https://router.vuejs.org/guide/advanced/navigation-failures.html',
              },
              {
                text: 'Dynamic Routing',
                link: 'https://router.vuejs.org/guide/advanced/dynamic-routing.html',
              },
            ],
          },
          {
            text: 'Migrating from Vue 2',
            link: 'https://router.vuejs.org/guide/migration/index.html',
          },
        ],
      },
      // 简体中文
      '/zh/': {
        label: '中文',
        selectText: '选择语言',
        editLinkText: '为此页提供修改建议',
        nav: [
          {
            text: '教程',
            link: 'https://router.vuejs.org/zh/guide/',
          },
          {
            text: 'API 参考',
            link: 'https://router.vuejs.org/zh/api/',
          },
          {
            text: 'v4.x',
            items: [{ text: 'v3.x', link: 'https://v3.router.vuejs.org/zh' }],
          },
          {
            text: '更新日志',
            link: 'https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md',
          },
        ],

        sidebar: [
          {
            text: '介绍',
            link: 'https://router.vuejs.org/zh/introduction.html',
          },
          {
            text: '安装',
            link: 'https://router.vuejs.org/zh/installation.html',
          },
          {
            text: '基础',
            collapsable: false,
            children: [
              {
                text: '入门',
                link: 'https://router.vuejs.org/zh/guide/',
              },
              {
                text: '动态路由匹配',
                link: 'https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html',
              },
              {
                text: '路由的匹配语法',
                link: 'https://router.vuejs.org/zh/guide/essentials/route-matching-syntax.html',
              },
              {
                text: '嵌套路由',
                link: 'https://router.vuejs.org/zh/guide/essentials/nested-routes.html',
              },
              {
                text: '编程式导航',
                link: 'https://router.vuejs.org/zh/guide/essentials/navigation.html',
              },
              {
                text: '命名路由',
                link: 'https://router.vuejs.org/zh/guide/essentials/named-routes.html',
              },
              {
                text: '命名视图',
                link: 'https://router.vuejs.org/zh/guide/essentials/named-views.html',
              },
              {
                text: '重定向和别名',
                link: 'https://router.vuejs.org/zh/guide/essentials/redirect-and-alias.html',
              },
              {
                text: '路由组件传参',
                link: 'https://router.vuejs.org/zh/guide/essentials/passing-props.html',
              },
              {
                text: '不同的历史记录模式',
                link: 'https://router.vuejs.org/zh/guide/essentials/history-mode.html',
              },
            ],
          },
          {
            text: '进阶',
            collapsable: false,
            children: [
              {
                text: '导航守卫',
                link: 'https://router.vuejs.org/zh/guide/advanced/navigation-guards.html',
              },
              {
                text: '路由元信息',
                link: 'https://router.vuejs.org/zh/guide/advanced/meta.html',
              },
              {
                text: '数据获取',
                link: 'https://router.vuejs.org/zh/guide/advanced/data-fetching.html',
              },
              {
                text: '组合式 API',
                link: 'https://router.vuejs.org/zh/guide/advanced/composition-api.html',
              },
              {
                text: '过渡动效',
                link: 'https://router.vuejs.org/zh/guide/advanced/transitions.html',
              },
              {
                text: '滚动行为',
                link: 'https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html',
              },
              {
                text: '路由懒加载',
                link: 'https://router.vuejs.org/zh/guide/advanced/lazy-loading.html',
              },
              {
                text: '扩展 RouterLink',
                link: 'https://router.vuejs.org/zh/guide/advanced/extending-router-link.html',
              },
              {
                text: '导航故障',
                link: 'https://router.vuejs.org/zh/guide/advanced/navigation-failures.html',
              },
              {
                text: '动态路由',
                link: 'https://router.vuejs.org/zh/guide/advanced/dynamic-routing.html',
              },
            ],
          },
          {
            text: '从 Vue2 迁移',
            link: 'https://router.vuejs.org/zh/guide/migration/index.html',
          },
        ],
      },
    },
  },
})

export default config

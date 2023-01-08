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
      // Portuguese
      '/': {
        label: 'Português',
        selectText: 'Languages',
        nav: [
          {
            text: 'Guide',
            link: '/guide/',
          },
          {
            text: 'API Reference',
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
            text: 'Introduction',
            link: '/introduction.html',
          },
          {
            text: 'Installation',
            link: '/installation.html',
          },
          {
            text: 'Essentials',
            collapsable: false,
            children: [
              {
                text: 'Getting Started',
                link: '/guide/',
              },
              {
                text: 'Dynamic Route Matching',
                link: '/guide/essentials/dynamic-matching.html',
              },
              {
                text: "Routes' Matching Syntax",
                link: '/guide/essentials/route-matching-syntax.html',
              },
              {
                text: 'Nested Routes',
                link: '/guide/essentials/nested-routes.html',
              },
              {
                text: 'Programmatic Navigation',
                link: '/guide/essentials/navigation.html',
              },
              {
                text: 'Named Routes',
                link: '/guide/essentials/named-routes.html',
              },
              {
                text: 'Named Views',
                link: '/guide/essentials/named-views.html',
              },
              {
                text: 'Redirect and Alias',
                link: '/guide/essentials/redirect-and-alias.html',
              },
              {
                text: 'Passing Props to Route Components',
                link: '/guide/essentials/passing-props.html',
              },
              {
                text: 'Different History modes',
                link: '/guide/essentials/history-mode.html',
              },
            ],
          },
          {
            text: 'Advanced',
            collapsable: false,
            children: [
              {
                text: 'Navigation guards',
                link: '/guide/advanced/navigation-guards.html',
              },
              {
                text: 'Route Meta Fields',
                link: '/guide/advanced/meta.html',
              },
              {
                text: 'Data Fetching',
                link: '/guide/advanced/data-fetching.html',
              },
              {
                text: 'Composition API',
                link: '/guide/advanced/composition-api.html',
              },
              {
                text: 'Transitions',
                link: '/guide/advanced/transitions.html',
              },
              {
                text: 'Scroll Behavior',
                link: '/guide/advanced/scroll-behavior.html',
              },
              {
                text: 'Lazy Loading Routes',
                link: '/guide/advanced/lazy-loading.html',
              },
              {
                text: 'Typed Routes',
                link: '/guide/advanced/typed-routes.html',
              },
              {
                text: 'Extending RouterLink',
                link: '/guide/advanced/extending-router-link.html',
              },
              {
                text: 'Navigation Failures',
                link: '/guide/advanced/navigation-failures.html',
              },
              {
                text: 'Dynamic Routing',
                link: '/guide/advanced/dynamic-routing.html',
              },
            ],
          },
          {
            text: 'Migrating from Vue 2',
            link: '/guide/migration/index.html',
          },
        ],
      },

      // TODO: Delete this in the future updates
      // English
      /*
      '/en': {
        label: 'English',
        selectText: 'Languages',
        nav: [
          {
            text: 'Guide',
            link: '/guide/',
          },
          {
            text: 'API Reference',
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
            text: 'Introduction',
            link: '/introduction.html',
          },
          {
            text: 'Installation',
            link: '/installation.html',
          },
          {
            text: 'Essentials',
            collapsable: false,
            children: [
              {
                text: 'Getting Started',
                link: '/guide/',
              },
              {
                text: 'Dynamic Route Matching',
                link: '/guide/essentials/dynamic-matching.html',
              },
              {
                text: "Routes' Matching Syntax",
                link: '/guide/essentials/route-matching-syntax.html',
              },
              {
                text: 'Nested Routes',
                link: '/guide/essentials/nested-routes.html',
              },
              {
                text: 'Programmatic Navigation',
                link: '/guide/essentials/navigation.html',
              },
              {
                text: 'Named Routes',
                link: '/guide/essentials/named-routes.html',
              },
              {
                text: 'Named Views',
                link: '/guide/essentials/named-views.html',
              },
              {
                text: 'Redirect and Alias',
                link: '/guide/essentials/redirect-and-alias.html',
              },
              {
                text: 'Passing Props to Route Components',
                link: '/guide/essentials/passing-props.html',
              },
              {
                text: 'Different History modes',
                link: '/guide/essentials/history-mode.html',
              },
            ],
          },
          {
            text: 'Advanced',
            collapsable: false,
            children: [
              {
                text: 'Navigation guards',
                link: '/guide/advanced/navigation-guards.html',
              },
              {
                text: 'Route Meta Fields',
                link: '/guide/advanced/meta.html',
              },
              {
                text: 'Data Fetching',
                link: '/guide/advanced/data-fetching.html',
              },
              {
                text: 'Composition API',
                link: '/guide/advanced/composition-api.html',
              },
              {
                text: 'Transitions',
                link: '/guide/advanced/transitions.html',
              },
              {
                text: 'Scroll Behavior',
                link: '/guide/advanced/scroll-behavior.html',
              },
              {
                text: 'Lazy Loading Routes',
                link: '/guide/advanced/lazy-loading.html',
              },
              {
                text: 'Typed Routes',
                link: '/guide/advanced/typed-routes.html',
              },
              {
                text: 'Extending RouterLink',
                link: '/guide/advanced/extending-router-link.html',
              },
              {
                text: 'Navigation Failures',
                link: '/guide/advanced/navigation-failures.html',
              },
              {
                text: 'Dynamic Routing',
                link: '/guide/advanced/dynamic-routing.html',
              },
            ],
          },
          {
            text: 'Migrating from Vue 2',
            link: '/guide/migration/index.html',
          },
        ],
      },
      */
    },
  },
})

export default config

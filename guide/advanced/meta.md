# Campos de Meta da Rota

<VueSchoolLink
  href="https://vueschool.io/lessons/route-meta-fields"
  title="Aprenda a usar os campos de meta da rota"
/>

Algumas vezes, podes querer anexar informações arbitrárias às rotas como: nomes de transições, ou rótulos para controlar quem pode acessar a rota, etc. Isto pode ser alcançado através da propriedade `meta` que aceita um objeto de propriedades e pode ser acessado na localização da rota e nas guardas da navegação. Tu podes definir as propriedades de `meta` tais como:

```js
const routes = [
  {
    path: '/posts',
    component: PostsLayout,
    children: [
      {
        path: 'new',
        component: PostsNew,
        // apenas utilizadores autenticados podem fazer publicações
        meta: { requiresAuth: true }
      },
      {
        path: ':id',
        component: PostsDetail,
        // qualquer um pode ler uma publicação
        meta: { requiresAuth: false }
      }
    ]
  }
]
```

Então como acessamos este campo `meta`?

<!-- TODO: the explanation about route records should be explained before and things should be moved here -->

Primeiro, cada objeto de rota na configuração de `routes` é chamado de um **registo de rota**. Os registos de rota podem ser encaixados. Portanto quando uma rota é correspondida, ela pode potencialmente corresponder mais do que um registo de rota.

Por exemplo, com a configuração de rota acima, a URL `/posts/new` corresponderá ambos registo de rota pai (`path: '/posts'`) e o registo de rota filha (`path: 'new'`).

Todos registos de rota correspondidos por uma rota são expostos sobre o objeto `$route` (e igualmente os objetos de rota nas guardas da navegação) como o arranjo `$route.matched`. Nós poderíamos percorrer este arranjo para verificar todos campos `meta`, porém a Vue Router também fornece-te um `$route.meta` que é uma combinação não recursiva de **todos campos `meta`** desde o pai ao filho. Quer dizer que podes simplesmente escrever:

```js
router.beforeEach((to, from) => {
  // no lugar de ter que verificar cada registo de rota com
  // to.matched.some(record => record.meta.requiresAuth)
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    // esta rota exige autenticação, verifica se está iniciado
    // se não, redireciona para página de inicialização `login`
    return {
      path: '/login',
      // guarde a localização de onde estávamos para voltarmos mais tarde
      query: { redirect: to.fullPath },
    }
  }
})
```

## TypeScript

É possível definir tipo para o campo `meta` pela extensão da interface `RouteMeta` da `vue-router`:

```ts
// Isto pode ser diretamente adicionado para todos os teus ficheiros `.ts` como `router.ts`
// Ele pode também ser adicionado para um ficheiro `.d.ts`,
// no qual caso precisas adicionar uma exportação
// para garantir que ele está a ser tratado como um módulo
export {}

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // é opcional
    isAdmin?: boolean
    // deve ser declarado por cada rota
    requiresAuth: boolean
  }
}
```

# Roteamento Dinâmico

<VueSchoolLink
  href="https://vueschool.io/lessons/vue-router-4-dynamic-routing"
  title="Aprenda como adicionar rotas em tempo de execução"
/>

A adição de rotas no teu roteador é normalmente feito através da [opção `routes`](../../api/#routes) mas em algumas situações, podes querer adicionar ou remover rotas enquanto a aplicação já está em execução. Aplicações com interfaces extensivas como [Interface de Utilizador da Interface da Linha de Comando da Vue](https://cli.vuejs.org/dev-guide/ui-api.html) podem usar isto para fazerem a aplicação escrever.

## Adicionar Rotas

O roteamento dinâmico é alcançado principalmente através de duas funções: `router.addRoute()` e `router.removeRoute()`. Elas **apenas** registam uma nova rota, querendo dizer que se a rota adicionada recentemente corresponder a localização atual, exigiria que **navegasses manualmente** com a `router.push()` ou `router.replace()` para exibir aquela nova rota. Vejamos um exemplo:

Suponha que tens o seguinte roteador com uma única rota:

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/:articleName', component: Article }],
})
```

Ir para qualquer página, `/about`, `/store`, ou `/3-tricks-to-improve-your-routing-code` acabamos por apresentar o componente `Article`. Se estamos na `/about` e adicionamos uma nova rota:

```js
router.addRoute({ path: '/about', component: About })
```

A página continuará a exibir o componente `Article`, precisamos de chamar manualmente o `router.replace()` para mudar a localização atual e sobrescrever onde estávamos (ao invés de empurrar uma nova entrada, acabamos na mesma localização duas vezes na história):

```js
router.addRoute({ path: '/about', component: About })
// nós poderíamos também usar `this.$route` ou `route = useRoute()` (dentro de uma `setup`)
router.replace(router.currentRoute.value.fullPath)
```

Lembra-te de que podes `await router.replace()` se precisares de esperar que a nova rota seja exibida.

## Adding Routes inside navigation guards

If you decide to add or remove routes inside of a navigation guard, you should not call `router.replace()` but trigger a redirection by returning the new location:

```js
router.beforeEach(to => {
  if (!hasNecessaryRoute(to)) {
    router.addRoute(generateRoute(to))
    // trigger a redirection
    return to.fullPath
  }
})
```

The example above assumes two things: first, the newly added route record will match the `to` location, effectively resulting in a different location from the one we were trying to access. Second, `hasNecessaryRoute()` returns `false` after adding the new route to avoid an infinite redirection.

Because we are redirecting, we are replacing the ongoing navigation, effectively behaving like the example shown before. In real world scenarios, adding is more likely to happen outside of navigation guards, e.g. when a view component mounts, it register new routes.

## Removing routes

There are few different ways to remove existing routes:

- By adding a route with a conflicting name. If you add a route that has the same name as an existing route, it will remove the route first and then add the route:
  ```js
  router.addRoute({ path: '/about', name: 'about', component: About })
  // this will remove the previously added route because they have the same name and names are unique
  router.addRoute({ path: '/other', name: 'about', component: Other })
  ```
- By calling the callback returned by `router.addRoute()`:
  ```js
  const removeRoute = router.addRoute(routeRecord)
  removeRoute() // removes the route if it exists
  ```
  This is useful when the routes do not have a name
- By using `router.removeRoute()` to remove a route by its name:
  ```js
  router.addRoute({ path: '/about', name: 'about', component: About })
  // remove the route
  router.removeRoute('about')
  ```
  Note you can use `Symbol`s for names in routes if you wish to use this function but want to avoid conflicts in names.

Whenever a route is removed, **all of its aliases and children** are removed with it.

## Adding nested routes

To add nested routes to an existing route, you can pass the _name_ of the route as its first parameter to `router.addRoute()`, this will effectively add the route as if it was added through `children`:

```js
router.addRoute({ name: 'admin', path: '/admin', component: Admin })
router.addRoute('admin', { path: 'settings', component: AdminSettings })
```

This is equivalent to:

```js
router.addRoute({
  name: 'admin',
  path: '/admin',
  component: Admin,
  children: [{ path: 'settings', component: AdminSettings }],
})
```

## Looking at existing routes

Vue Router gives you two functions to look at existing routes:

- [`router.hasRoute()`](../../api/#hasroute): check if a route exists
- [`router.getRoutes()`](../../api/#getroutes): get an array with all the route records.

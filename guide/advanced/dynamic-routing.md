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

## Adicionar Rotas dentro das Guardas de Navegação

Se decidires adicionar ou remover as rotas dentro de uma guarda de navegação, não deves chamar `router.replace()` mas acionar um redirecionamento com o retorno da nova localização:

```js
router.beforeEach(to => {
  if (!hasNecessaryRoute(to)) {
    router.addRoute(generateRoute(to))
    // acionar um redirecionamento
    return to.fullPath
  }
})
```

O exemplo acima assume duas coisas: primeiro, o registo da rota adicionada recentemente corresponderá a localização `to`, resultando efetivamente em uma localização diferente daquela que estávamos a tentar acessar. Segundo, `hasNecessaryRoute()` retorna `false` depois de adicionar a nova rota para evitar um redirecionamento infinito.

Uma vez que estamos a redirecionar, estamos a substituir a navegação em curso, comportando-se efetivamente como exemplo mostrado antes. Em cenários do mundo real, é mais provável que adição aconteça fora das guardas de navegação, por exemplo, quando um componente de visão monta, regista as novas rotas.

## Remover Rotas

Existem maneiras diferentes de remover as rotas existentes:

- Com a adição de uma rota com um nome contraditório. Se adicionas uma rota que tem o mesmo nome de uma rota existente, primeiro removerá a rota e depois adicionará a rota:

  ```js
  router.addRoute({ path: '/about', name: 'about', component: About })
  // isto removerá a rota adicionada anteriormente porque elas têm o mesmo nome e nomes são únicos
  router.addRoute({ path: '/other', name: 'about', component: Other })
  ```

- Com a chamada da função de resposta retornada pela `router.addRouter()`:

  ```js
  const removeRoute = router.addRoute(routeRecord)
  removeRoute() // remove a rota se existir
  ```

  Isto é útil quando as rotas não têm um nome

- Com o uso do `router.removeRoute()` para remover uma rota pelo seu nome:

  ```js
  router.addRoute({ path: '/about', name: 'about', component: About })
  // remover a rota
  router.removeRoute('about')
  ```

  Nota que podes usar os `Symbol` para nomes em rotas se desejas usar esta função mas queres evitar conflitos em nomes.

Sempre que uma rota for removida, **todos os seus pseudónimos e filhos** são removidos com ela.

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

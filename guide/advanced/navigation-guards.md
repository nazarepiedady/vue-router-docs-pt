# Guardas da Navegação

<VueSchoolLink
  href="https://vueschool.io/lessons/route-guards"
  title="Saiba como adicionar guardas de navegação"
/>

Conforme o nome sugere, as guardas da navegação fornecidas pela Vue Router sao primariamente usadas para guardar as navegações ou pelo redirecionamento dela ou cancelamento dela. Existem várias maneiras de prender a guarda no processo de navegação da rota: globalmente, por rota, ou dentro do componente.

## Guardas "Em Face De" Globais

Tu podes registar as guardas "em face de" globais usando `router.beforeEach`:

```js
const router = createRouter({ ... })

router.beforeEach((to, from) => {
  // ...
  // retorna explicitamente `false` para cancelar a navegação
  return false
})
```

As guardas em face de globais são chamadas dentro da ordem de criação, sempre que uma navegação for acionada. As guardas podem ser resolvidas de maneira assíncrona, e a navegação é considerada **pendente** antes de todos os gatilhos serem resolvidos.

Toda função de guarda recebe dois argumentos:

- **`to`**: a localização da rota de destino [em um formato normalizado](../../api/#routelocationnormalized) para onde tencionas ir.
- **`from`**: a localização da rota atual [em um formato normalizado](../../api/#routelocationnormalized) de onde tencionas sair.

E podem opcionalmente retornar quaisquer dos seguintes valores:

- `false`: cancela a navegação atual. Se a URL do navegador for mudada (ou manualmente pelo utilizador ou através do botão retornar), será reiniciada para aquela da rota do `from`.
- Uma [Localização de Rota](../../api/#routelocationraw): Redireciona para uma localização diferente com a passagem de uma localização de rota como se estivesses a chamar [`router.push()`](../../api/#push), que permite-te passar as opções como `replace: true` ou `name: 'home'`. A navegação atual é largada e uma nova é criada com o mesmo `from`.

  ```js
  router.beforeEach(async (to, from) => {
    if (
      // certifica-te que utilizador está autenticado
      !isAuthenticated &&
      // ❗️ Evite um redirecionamento infinito
      to.name !== 'Login'
    ) {
      // redireciona o utilizador para uma página `login`
      return { name: 'Login' }
    }
  })
  ```

Também é possível lançar um `Error` se uma situação inesperada ocorrer. Isto também cancelará a navegação e chamará qualquer função de resposta registada através do [`router.onError()`](../../api/#onerror).

Se nada inesperado ocorrer, `undefined` ou `true` é retornado, **a navegação é validada**, e a próxima guarda da navegação é chamada.

Todas as coisas acima **funcionam da mesma maneira com as funções `async`** e Promessas:

```js
router.beforeEach(async (to, from) => {
  // `canUserAccess()` retorna `true` ou `false`
  const canAccess = await canUserAccess(to)
  if (!canAccess) return '/login'
})
```

### O Terceiro Argumento Opcional `next`

Nas versões anteriores da Vue Router, também era possível usar um _terceiro argumento_ `next`, isto era uma fonte comum de confusões e passou por um [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0037-router-return-guards.md#motivation) para removê-lo. No entanto, continua a ser suportado, querendo dizer que podes passar um terceiro argumento para qualquer guarda de navegação. Neste caso, **deves chamar a `next` exatamente uma vez** em alguma dada passagem de uma guarda de navegação. Ele pode aparecer mais de uma vez, mas apenas se os caminhos lógicos não tiverem nenhuma sobreposição, de outro modo o gatilho nunca será resolvido ou produzirá erros. No exemplo abaixo apresentamos **maneira errada** de redirecionar os utilizadores para a rota `/login` se não estiverem autenticados:

```js
// BAD
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  // se o utilizador não estiver autenticado, `next` será chamada duas vezes
  next()
})
```

Agora abaixo apresentamos a **maneira correta**:

```js
// GOOD
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```

## Global Resolve Guards

You can register a global guard with `router.beforeResolve`. This is similar to `router.beforeEach` because it triggers on **every navigation**, but resolve guards are called right before the navigation is confirmed, **after all in-component guards and async route components are resolved**. Here is an example that ensures the user has given access to the Camera for routes that [have defined a custom meta](./meta.md) property `requiresCamera`:

```js
router.beforeResolve(async to => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... handle the error and then cancel the navigation
        return false
      } else {
        // unexpected error, cancel the navigation and pass the error to the global handler
        throw error
      }
    }
  }
})
```

`router.beforeResolve` is the ideal spot to fetch data or do any other operation that you want to avoid doing if the user cannot enter a page.

<!-- TODO: how to combine with [`meta` fields](./meta.md) to create a [generic fetching mechanism](#TODO). -->

## Global After Hooks

You can also register global after hooks, however unlike guards, these hooks do not get a `next` function and cannot affect the navigation:

```js
router.afterEach((to, from) => {
  sendToAnalytics(to.fullPath)
})
```

<!-- TODO: maybe add links to examples -->

They are useful for analytics, changing the title of the page, accessibility features like announcing the page and many other things.

They also reflect [navigation failures](./navigation-failures.md) as the third argument:

```js
router.afterEach((to, from, failure) => {
  if (!failure) sendToAnalytics(to.fullPath)
})
```

Learn more about navigation failures on [its guide](./navigation-failures.md).

## Per-Route Guard

You can define `beforeEnter` guards directly on a route's configuration object:

```js
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
]
```

`beforeEnter` guards **only trigger when entering the route**, they don't trigger when the `params`, `query` or `hash` change e.g. going from `/users/2` to `/users/3` or going from `/users/2#info` to `/users/2#projects`. They are only triggered when navigating **from a different** route.

You can also pass an array of functions to `beforeEnter`, this is useful when reusing guards for different routes:

```js
function removeQueryParams(to) {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash }
}

function removeHash(to) {
  if (to.hash) return { path: to.path, query: to.query, hash: '' }
}

const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: [removeQueryParams, removeHash],
  },
  {
    path: '/about',
    component: UserDetails,
    beforeEnter: [removeQueryParams],
  },
]
```

Note it is possible to achieve a similar behavior by using [route meta fields](./meta.md) and [global navigation guards](#global-before-guards).

## In-Component Guards

Finally, you can directly define route navigation guards inside route components (the ones passed to the router configuration)

### Using the options API

You can add the following options to route components:

- `beforeRouteEnter`
- `beforeRouteUpdate`
- `beforeRouteLeave`

```js
const UserDetails = {
  template: `...`,
  beforeRouteEnter(to, from) {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
  },
  beforeRouteUpdate(to, from) {
    // called when the route that renders this component has changed, but this component is reused in the new route.
    // For example, given a route with params `/users/:id`, when we navigate between `/users/1` and `/users/2`,
    // the same `UserDetails` component instance will be reused, and this hook will be called when that happens.
    // Because the component is mounted while this happens, the navigation guard has access to `this` component instance.
  },
  beforeRouteLeave(to, from) {
    // called when the route that renders this component is about to be navigated away from.
    // As with `beforeRouteUpdate`, it has access to `this` component instance.
  },
}
```

The `beforeRouteEnter` guard does **NOT** have access to `this`, because the guard is called before the navigation is confirmed, thus the new entering component has not even been created yet.

However, you can access the instance by passing a callback to `next`. The callback will be called when the navigation is confirmed, and the component instance will be passed to the callback as the argument:

```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // access to component public instance via `vm`
  })
}
```

Note that `beforeRouteEnter` is the only guard that supports passing a callback to `next`. For `beforeRouteUpdate` and `beforeRouteLeave`, `this` is already available, so passing a callback is unnecessary and therefore _not supported_:

```js
beforeRouteUpdate (to, from) {
  // just use `this`
  this.name = to.params.name
}
```

The **leave guard** is usually used to prevent the user from accidentally leaving the route with unsaved edits. The navigation can be canceled by returning `false`.

```js
beforeRouteLeave (to, from) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (!answer) return false
}
```

### Using the composition API

If you are writing your component using the [composition API and a `setup` function](https://v3.vuejs.org/guide/composition-api-setup.html#setup), you can add update and leave guards through `onBeforeRouteUpdate` and `onBeforeRouteLeave` respectively. Please refer to the [Composition API section](./composition-api.md#navigation-guards) for more details.

## The Full Navigation Resolution Flow

1. Navigation triggered.
2. Call `beforeRouteLeave` guards in deactivated components.
3. Call global `beforeEach` guards.
4. Call `beforeRouteUpdate` guards in reused components.
5. Call `beforeEnter` in route configs.
6. Resolve async route components.
7. Call `beforeRouteEnter` in activated components.
8. Call global `beforeResolve` guards.
9. Navigation is confirmed.
10. Call global `afterEach` hooks.
11. DOM updates triggered.
12. Call callbacks passed to `next` in `beforeRouteEnter` guards with instantiated instances.

# Aguardando pelo resultado de uma Navegação

<VueSchoolLink
  href="https://vueschool.io/lessons/vue-router-4-detecting-navigation-failures"
  title="Aprenda como detetar falhas de navegação"
/>

Quando estiveres a usar o `router-link`, a Vue Router chama o `router.push` para acionar uma navegação. Enquanto o comportamento esperado para a maioria das ligações é navegar um utilizador para uma nova página, existem algumas situações onde os utilizadores continuarão na mesma página:

- Os utilizadores já estão na página para qual estão a tentar navegar.
- Uma [guarda de navegação](./navigation-guards.md) aborta a navegação fazendo `return false`.
- Uma nova guarda de navegação ocorre enquanto a anterior ainda não terminou.
- Uma [guarda de navegação](./navigation-guards.md) redireciona noutro lugar retornando uma nova localização (por exemplo, `return '/login'`).
- Uma [guarda de navegação](./navigation-guards.md) lança um `Error`.

Se quisermos fazer alguma coisa depois de uma navegação for terminada, precisamos de uma maneira de esperar depois da chamada de `router.push`. Suponha que temos um menu de dispositivo móvel que permite-nos ir para páginas diferentes e apenas queremos esconder o menu assim que tivermos navegado para a nova página, poderemos querer fazer alguma coisa como:

```js
router.push('/my-profile')
this.isMenuOpen = false
```

Mas isto fechará o menu imediatamente porque as **navegações são assíncronas**, precisamos do `wait` para esperar a promessa retornada pelo `router.push`:

```js
await router.push('/my-profile')
this.isMenuOpen = false
```

Agora o menu fechará assim que a navegação for terminada mas também fechará se a navegação foi impedida. Nós precisamos de uma maneira de detetar se realmente mudamos a página em que estamos ou não.

## Detecting Navigation Failures

If a navigation is prevented, resulting in the user staying on the same page, the resolved value of the `Promise` returned by `router.push` will be a _Navigation Failure_. Otherwise, it will be a _falsy_ value (usually `undefined`). This allows us to differentiate the case where we navigated away from where we are or not:

```js
const navigationResult = await router.push('/my-profile')

if (navigationResult) {
  // navigation prevented
} else {
  // navigation succeeded (this includes the case of a redirection)
  this.isMenuOpen = false
}
```

_Navigation Failures_ are `Error` instances with a few extra properties that gives us enough information to know what navigation was prevented and why. To check the nature of a navigation result, use the `isNavigationFailure` function:

```js
import { NavigationFailureType, isNavigationFailure } from 'vue-router'

// trying to leave the editing page of an article without saving
const failure = await router.push('/articles/2')

if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
  // show a small notification to the user
  showToast('You have unsaved changes, discard and leave anyway?')
}
```

::: tip
If you omit the second parameter: `isNavigationFailure(failure)`, it will only check if `failure` is a _Navigation Failure_.
:::

## Differentiating Navigation Failures

As we said at the beginning, there are different situations aborting a navigation, all of them resulting in different _Navigation Failures_. They can be differentiated using the `isNavigationFailure` and `NavigationFailureType`. There are three different types:

- `aborted`: `false` was returned inside of a navigation guard to the navigation.
- `cancelled`: A new navigation took place before the current navigation could finish. e.g. `router.push` was called while waiting inside of a navigation guard.
- `duplicated`: The navigation was prevented because we are already at the target location.

## _Navigation Failures_'s properties

All navigation failures expose `to` and `from` properties to reflect the current location as well as the target location for the navigation that failed:

```js
// trying to access the admin page
router.push('/admin').then(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
    failure.to.path // '/admin'
    failure.from.path // '/'
  }
})
```

In all cases, `to` and `from` are normalized route locations.

## Detecting Redirections

When returning a new location inside of a Navigation Guard, we are triggering a new navigation that overrides the ongoing one. Differently from other return values, a redirection doesn't prevent a navigation, **it creates a new one**. It is therefore checked differently, by reading the `redirectedFrom` property in a Route Location:

```js
await router.push('/my-profile')
if (router.currentRoute.value.redirectedFrom) {
  // redirectedFrom is resolved route location like to and from in navigation guards
}
```

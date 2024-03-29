# Aguardando pelo Resultado de uma Navegação {#waiting-for-the-result-of-a-navigation}

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

Agora o menu fechará assim que a navegação for terminada mas também fechará se a navegação foi impedida. Nós precisamos de uma maneira de detetar se realmente mudamos a página em que estamos ou não estamos.

## Detetando Falhas de Navegação {#detecting-navigation-failures}

Se uma navegação for impedida, resultando em o utilizador continuar na mesma página, o valor resolvido da `Promise` retornada pelo `router.push` será uma _Falha de Navegação_. De outro modo, será um valor falso ou melhor `falsy` (normalmente `undefined`). Isto permite-nos diferenciar o caso de onde navegamos a partir de onde estamos ou não estamos:

```js
const navigationResult = await router.push('/my-profile')

if (navigationResult) {
  // navegação impedida
} else {
  // navegação bem-sucedida (isto inclui o caso de um redirecionamento)
  this.isMenuOpen = false
}
```

As _falhas de navegação_ são instâncias de `Error` com algumas propriedades adicionais que entregam-nos informações suficiente para saber qual navegação foi impedida e o porquê. Para verificar a natureza de um resultado de navegação, use a função `isNavigationFailure`:

```js
import { NavigationFailureType, isNavigationFailure } from 'vue-router'

// tentando sair da página de edição de um artigo sem o guardar
const failure = await router.push('/articles/2')

if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
  // mostrar uma pequena notificação para o utilizador
  showToast('You have unsaved changes, discard and leave anyway?')
}
```

:::tip Dica
Se omitires o segundo parâmetro: `isNavigationFailure(failure)`, ela apenas verifica se `failure` é uma _Falha de Navegação_.
:::

## Diferenciando Falhas de Navegação {#differentiating-navigation-failures}

Conforme dissemos no início, existem situações diferentes que abortam uma navegação, todas elas resultando em diferentes _Falhas de Navegação_. Eles podem ser diferenciados usando a `isNavigationFailure` e o `NavigationFailureType`. Existem três tipos diferentes:

- `aborted`: `false` foi retornado dentro de uma guarda de navegação para a navegação.
- `cancelled`: Uma nova navegação ocorreu antes da navegação atual puder terminar, por exemplo, o `router.push` foi chamado enquanto espera dentro de uma guarda de navegação.
- `duplicated`: A navegação foi impedida porque já estamos localização de destino.

## Propriedades das _Falhas de Navegação_ {#navigation-failures-s-properties}

Todas as falhas de navegação expõem as propriedades `to` e `from` para refletir a localização atual bem como a localização de destino para a navegação que falhou:

```js
// tentando acessar a página de administrador
router.push('/admin').then(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
    failure.to.path // '/admin'
    failure.from.path // '/'
  }
})
```

Em todos casos, `to` e `from` são localizações de rota normalizadas.

## Detetando Redirecionamentos {#detecting-redirections}

Quando estivermos a retornar uma nova localização dentro de uma Guarda de Navegação, estamos a acionar uma nova navegação que se sobrepõe aquela em curso. Diferentemente de outros valores de retorno, um redirecionamento não impede uma navegação, **ele cria uma uma nova**. Ele é portanto verificado de forma diferente, lendo a propriedade `redirectedFrom` em uma Localização de Rota:

```js
await router.push('/my-profile')
if (router.currentRoute.value.redirectedFrom) {
  // `redirectedFrom` é uma localização de rota resolvida como `to` e `from` nas guardas de navegação
}
```

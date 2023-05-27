# Guardas da Navegação {#navigation-guards}

<VueSchoolLink
  href="https://vueschool.io/lessons/route-guards"
  title="Saiba como adicionar guardas de navegação"
/>

Conforme o nome sugere, as guardas da navegação fornecidas pela Vue Router sao primariamente usadas para guardar as navegações ou pelo redirecionamento dela ou cancelamento dela. Existem várias maneiras de prender a guarda no processo de navegação da rota: globalmente, por rota, ou dentro do componente.

## Guardas de Navegação `Before` Globais {#global-before-guards}

Tu podes registar as guardas `before` globais usando `router.beforeEach`:

```js
const router = createRouter({ ... })

router.beforeEach((to, from) => {
  // ...
  // retorna explicitamente `false` para cancelar a navegação
  return false
})
```

As guardas `before` globais são chamadas dentro da ordem de criação, sempre que uma navegação for acionada. As guardas podem ser resolvidas de maneira assíncrona, e a navegação é considerada **pendente** antes de todos os gatilhos serem resolvidos.

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

### O Terceiro Argumento Opcional `next` {#optional-third-argument-next}

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

## Guardas de Navegação `Resolve` Globais {#global-resolve-guards}

Tu podes registar uma guarda global com `router.beforeResolve`. Isto é parecido com `router.beforeEach` porque aciona-se em **toda navegação***, porém as guardas `resolve` são chamadas exatamente antes da navegação ser confirmada, **depois de todas as guardas em componente e componentes de rotas assíncronas serem resolvidos**. No exemplo abaixo demonstramos como garantir que o utilizador deu acesso à Câmara para rotas que [definiram uma propriedade de meta personalizada](./meta.md) `requiresCamera`:

```js
router.beforeResolve(async to => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... manipular o erro e depois cancelar a navegação
        return false
      } else {
        /*
          erro inesperado, cancelar a navegação e
          passar o erro para o manipulador global
        */
        throw error
      }
    }
  }
})
```

A `router.beforeResolve` é o sítio ideal para realizar a requisição de dados ou fazer qualquer outra operação que queres evitar fazer se o utilizador não puder entrar em uma página.

<!-- TODO: how to combine with [`meta` fields](./meta.md) to create a [generic fetching mechanism](#TODO). -->

## Gatilhos `After` Globais {#global-after-hooks}

Tu também podes registar gatilhos `after` globais, no entanto ao contrário das guardas, estes gatilhos não recebem uma função `next` e não pode afetar a navegação:

```js
router.afterEach((to, from) => {
  sendToAnalytics(to.fullPath)
})
```

<!-- TODO: maybe add links to examples -->

Eles são úteis para os analíticos, mudar o título da página, funcionalidades de acessibilidade como anunciando a página e muitas outras coisas.

Eles também refletem as [falhas da navegação](./navigation-failures.md) como terceiro argumento:

```js
router.afterEach((to, from, failure) => {
  if (!failure) sendToAnalytics(to.fullPath)
})
```

Saiba mais sobre as falhas da navegação no [seu guia](./navigation-failures.md).

## Guarda Por Rota {#per-route-guard}

Tu podes definir guardas `beforeEnter` diretamente em um objeto de configuração da rota:

```js
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // rejeitar a navegação
      return false
    },
  },
]
```

As guardas `beforeEnter` **só acionam quando a rota estiver entrando**, não acionam quando o `params`, `query` ou `hash` mudar, por exemplo ir de `/users/2` para `/users/3` ou ir de `/users/2#info` para `/users/2#projects`. Elas só são acionadas quando estiveres a navegar **de uma rota diferente**.

Tu também podes passar um arranjo de funções para `beforeEnter`, isto é útil quando estiveres a reutilizar as guardas para diferentes rotas:

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

Nota que é possível alcançar um comportamento parecido usando os [campos de meta da rota] e as [guardas de navegação global](#global-before-guards).

## Guardas de Navegação dentro do Componente {#in-component-guards}

Finalmente, podes definir as guardas de navegação da rota diretamente dentro dos componentes de rota (aquelas passadas para a configuração do roteador).

### Usando a API de Opções {#using-the-options-api}

Tu podes adicionar as seguintes opções para os componentes de rota:

- `beforeRouteEnter`
- `beforeRouteUpdate`
- `beforeRouteLeave`

```js
const UserDetails = {
  template: `...`,
  beforeRouteEnter(to, from) {
    // chamada antes da rota que apresenta este componente for confirmada.
    // NÃO tem acesso à instância `this` do componente,
    // porque o componente ainda não foi criado quando esta guarda é chamada!
  },
  beforeRouteUpdate(to, from) {
    // chamada quando a rota que apresenta este componente mudou, mas este componente é reutilizado na nova rota.
    // Por exemplo, dada uma rota com parâmetros `/users/:id`, quando navegamos entre `/users/1` e `/users/2`,
    // a mesma instância do componente `UserDetails` será reutilizada, e este gatilho serão chamados quando aquilo acontecer.
    // Uma vez que o componente é montado enquanto isto acontece, a guarda da navegação tem acesso para a instância `this` do componente.
  },
  beforeRouteLeave(to, from) {
    // chamado quando a rota que apresenta este componente está prestes a ser abandonada (quando estiveres a deixar a rota).
    // Tal como `beforeRouteUpdate`, ele tem acesso à instância `this` do componente.
  },
}
```

A guarda `beforeRouteEnter` **NÃO** tem acesso ao `this`, porque a guarda é chamada antes da navegação ser confirmada, assim o novo componente entrando ainda foi criado.

No entanto, podes acessar a instância passando uma função de resposta para `next`. A função de resposta será chamada quando a navegação for confirmada, e a instância do componente será passada para a função de resposta como argumento:

```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // acessar a instância pública do componente através do `vm`
  })
}
```

Nota que `beforeRouteEnter` é a única guarda que suporta a passagem de uma função de resposta para `next`. Para `beforeRouteUpdate` e `beforeRouteLeave`, a `this` já está disponível, então a passagem de uma função de resposta é desnecessária e portanto _não suportada_:

```js
beforeRouteUpdate (to, from) {
  // apenas use a `this`
  this.name = to.params.name
}
```

A **guarda de saída** é normalmente usada para evitar que o utilizador deixe acidentalmente a rota com edições por guardar. A navegação pode ser cancelada ao retornar `false`.

```js
beforeRouteLeave (to, from) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (!answer) return false
}
```

### Usando a API de Composição {#using-the-composition-api}

Se estiveres a escrever o teu componente usando a [API de composição e uma função de `setup`](https://v3.vuejs.org/guide/composition-api-setup.html#setup), podes adicionar as guardas de saída e atualização através de `onBeforeRouteUpdate` e `onBeforeRouteLeave` respetivamente. Consulte a [seção da API de Composição](./composition-api.md#navigation-guards) para mais detalhes.
## O Fluxo Completo de Resolução da Navegação {#the-full-navigation-resolution-flow}

1. Navegação acionada.
2. Chamar as guardas `beforeRouteLeave` nos componentes desativados.
3. Chamar as guardas `beforeEach` globais.
4. Chamar as guardas `beforeRouteUpdate` nos componentes reutilizados.
5. Chamar `beforeEnter` nas configurações da rota.
6. Resolver os componentes de rota assíncrona.
7. Chamar `beforeRouteEnter` nos componentes ativados.
8. Chamar as guardas `beforeResolve` globais.
9. Navegação é confirmada.
10. Chamar os gatilhos `afterEach` globais.
11. Atualizações do DOM acionadas.
12. Chamar as funções de resposta passadas para a `next` nas guardas `beforeRouteEnter` com as instâncias instanciadas.

# Correspondência de Rota Dinâmica com Parâmetros

<VueSchoolLink
  href="https://vueschool.io/lessons/dynamic-routes"
  title="Estude a correspondência de rota dinâmica com parâmetros"
/>

Com muita frequência precisaremos mapear as rotas com o dado padrão para o mesmo componente. Por exemplo podemos ter um componente `User` que deve ser apresentado para todos os utilizadores mas com identificadores de utilizador diferentes. Na Vue Router podemos usar um segmento dinâmico no caminho para atingir isto, chamamos isto de _parâmetro_:

```js
const User = {
  template: '<div>User</div>',
}

// Estes são passados para a função `createRouter`
const routes = [
  // os segmentos dinâmicos começam com um sinal de dois pontos
  { path: '/users/:id', component: User },
]
```

Agora as URLs como `/users/johnny` e `/users/jolyne` ambas mapearão para a mesma rota.

Um _parâmetro_ é representado por um sinal de dois pontos `:`. Quando uma rota for correspondida, o valor destes _parâmetros_ serão expostos como `this.$route.params` dentro de cada componente. Portanto, podemos exibir o identificador do utilizador atual ao atualizar o modelo de marcação do `User` para isto:

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>',
}
```

Tu podes ter vários _parâmetros_ na mesma rota, e eles mapearão para os campos correspondentes no `$route.params`. Exemplos:

| padrão                        | caminho correspondido            | \$route.params                           |
| ------------------------------ | ------------------------ | ---------------------------------------- |
| /users/:username               | /users/eduardo           | `{ username: 'eduardo' }`                |
| /users/:username/posts/:postId | /users/eduardo/posts/123 | `{ username: 'eduardo', postId: '123' }` |

Além do `$route.params`, o objeto `$route` também expõe outras informações úteis tais como `$route.query` (se houver uma consulta na URL), `$route.hash`, etc. Tu podes verificar os detalhes completos na [Referência da API](../../api/#routelocationnormalized).

Uma demonstração em funcionamento deste exemplo pode ser encontrado [nesta ligação](https://codesandbox.io/s/route-params-vue-router-examples-mlb14?from-embed&initialpath=%2Fusers%2Feduardo%2Fposts%2F1).

<!-- <iframe
  src="https://codesandbox.io/embed//route-params-vue-router-examples-mlb14?fontsize=14&theme=light&view=preview&initialpath=%2Fusers%2Feduardo%2Fposts%2F1"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="Route Params example"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe> -->

## Reagindo as Mudanças de Parâmetros

<VueSchoolLink
  href="https://vueschool.io/lessons/reacting-to-param-changes"
  title="Saiba como reagir as mudanças de parâmetro"
/>

Uma coisa para prestar atenção quando estamos a usar rotas com parâmetros é que quando o utilizador navegar de `/users/johnny` para `/users/jolyne`, **a mesma instância do componente será reutilizada**. Já que ambas as rotas apresentam o mesmo componente, isto é mais eficiente do que destruir a instância antiga e depois criar uma nova instância. **No entanto, isto também significa que os gatilhos do ciclo de vida do componente não serão chamados**.

Para reagir as mudanças de parâmetros no mesmo componente, podes de modo simples observar qualquer coisa no objeto `$route`, neste cenário, o `$route.params`:

```js
const User = {
  template: '...',
  created() {
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        // reagir as mudanças de rota...
      }
    )
  },
}
```

Ou, usar a [guarda de navegação](../advanced/navigation-guards.md) `beforeRouteUpdate`, que também permite cancelar a navegação:

```js
const User = {
  template: '...',
  async beforeRouteUpdate(to, from) {
    // reagir as mudanças de rota...
    this.userData = await fetchUser(to.params.id)
  },
}
```

## Captura total / Rota não encontrada 404

<VueSchoolLink
  href="https://vueschool.io/lessons/404-not-found-page"
  title="Saiba como fazer uma captura total/rota não encontrada 404"
/>

Os parâmetros regulares apenas corresponderão os caracteres entre os fragmentos de URL, separados pelo `/`. Se quisermos corresponder **qualquer coisa**, podemos usar uma expressão regular de _parâmetro_ personalizado ao adicionar a expressão regular dentro de parêntesis exatamente depois do `parâmetro`:

```js
const routes = [
  /*
    corresponderá tudo e o
    colocará sob `$route.params.pathMatch`
  */
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  /*
    corresponderá qualquer coisa começando com `/user-` e o
    colocará sob `$route.params.afterUser`
  */
  { path: '/user-:afterUser(.*)', component: UserGeneric },
]
```

Neste cenário específico estamos a usar uma [expressão regular personalizada](./route-matching-syntax.md#custom-regexp-in-params) entre parêntesis e marcando o parâmetro `pathMatch` como [opcionalmente repetitível](./route-matching-syntax.md#optional-parameters). Isto permite-nos navegar diretamente para a rota se precisarmos ao separar o `path` em um arranjo:

```js
this.$router.push({
  name: 'NotFound',
  /*
    preserva o caminho atual e
    remove o primeiro carácter para evitar a URL de destino começando com `//`
  */
  params: { pathMatch: this.$route.path.substring(1).split('/') },
  // preserve a `query` e o `hash` existentes se houver algum
  query: this.$route.query,
  hash: this.$route.hash,
})
```

Acompanhe mais na seção [parâmetros repetidos](./route-matching-syntax.md#repeatable-params).

Se estiveres a usar o [mode de História](./history-mode.md), certifica-te também de seguir as instruções para configurar corretamente o teu servidor.

## Padrões de Correspondência Avançados

A Vue Router usa a sua própria sintaxe de correspondência de caminho, inspirada por aquela usada pela `express`, assim ela suporta muitos padrões de correspondência avançados tais como parâmetros opcionais, zero ou mais / um ou mais requisitos, e até padrões de expressão regular personalizado. Consulte a documentação da [Correspondência Avançada](./route-matching-syntax.md) para explorá-las.

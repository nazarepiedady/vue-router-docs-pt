# Requisição de Dados

Algumas vezes precisas pedir dados do servidor quando uma rota é ativada. Por exemplo, antes de apresentar um perfil de utilizador, precisas pedir do servidor os dados do utilizador. Nós podemos alcançar isto de duas maneiras:

- **Requisitar Depois da Navegação**: realizar a navegação primeiro, e depois pedir os dados no gatilho de ciclo de vida do próximo componente. Exibir um estado de carregamento enquanto os dados estão a ser pedidos.

- **Requisitar Antes da Navegação**: pedir os dados antes da navegação na guarda da rota de entrada, e realizar a navegação depois dos dados tiverem sido recebidos.

Tecnicamente, ambas são escolhas válidas . isto definitivamente depende da experiência de uso que queres entregar.

## Requisitar Depois da Navegação

Quando estivermos a usar esta abordagem, navegamos e apresentamos o próximo componente imediatamente, e pedimos os dados no gatilho `created` do componente. Isto dá-nos a oportunidade de exibir um estado de carregamento enquanto os dados trafegam sobre a rede, e também podemos manipular o carregamento de maneira diferente para cada visão.

Vamos assumir que temos um componente `Post` que precisa pedir os dados para uma publicação baseada no `$route.params.id`:

```html
<template>
  <div class="post">
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>
```

```js
export default {
  data() {
    return {
      loading: false,
      post: null,
      error: null,
    }
  },
  created() {
    // observar os parâmetros da rota para pedir os dados novamente
    this.$watch(
      () => this.$route.params,
      () => {
        this.fetchData()
      },
      // pedir os dados quando a visão estiver criada e
      // os dados já estiverem a ser observados
      { immediate: true }
    )
  },
  methods: {
    fetchData() {
      this.error = this.post = null
      this.loading = true
      // substituir `getPost` pelo teu utilitário de requisição de dados
      // ou envolvedor de API
      getPost(this.$route.params.id, (err, post) => {
        this.loading = false
        if (err) {
          this.error = err.toString()
        } else {
          this.post = post
        }
      })
    },
  },
}
```

## Requisitar Antes da Navegação

Com esta abordagem pedimos os dados antes de fato navegar para a próxima rota. Nós podemos realizar a requisição dos dados na guarda `beforeRouteEnter` no próximo componente, e apenas chamar `next` quando o pedido estiver concluído. A função de resposta passada para `next` será chamada **depois que o componente estiver montado**:

```js
export default {
  data() {
    return {
      post: null,
      error: null,
    }
  },
  beforeRouteEnter(to, from, next) {
    getPost(to.params.id, (err, post) => {
      // `setData` é um método definido abaixo
      next(vm => vm.setData(err, post))
    })
  },
  // quando a rota muda e este componente já está desenhado,
  // a lógica será ligeiramente diferente.
  async beforeRouteUpdate(to, from) {
    this.post = null
    try {
      this.post = await getPost(to.params.id)
    } catch (error) {
      this.error = error.toString()
    }
  },
  methods: {
    setData(error, post) {
      if (error) {
        this.error = error
      } else {
        this.post = post
      }
    }
  }
}
```

O utilizador continuará na visão anterior enquanto o recurso estiver a ser pedido para a próxima visão. É portanto recomendado exibir uma barra de progresso ou algum tipo de indicador enquanto os dados estiverem a ser pedidos. Se o pedido dos dados falhar, também é necessário exibir algum tipo de mensagem de aviso global.

<!-- ### Using Composition API -->

<!-- TODO: -->

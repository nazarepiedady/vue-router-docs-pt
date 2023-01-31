# Requisição de Dados

Algumas vezes precisas pedir dados do servidor quando uma rota é ativada. Por exemplo, antes de apresentar um perfil de utilizador, precisas pedir do servidor os dados do utilizador. Nós podemos alcançar isto de duas maneiras:

- **Requisitar Depois da Navegação**: realizar a navegação primeiro, e depois pedir os dados no gatilho de ciclo de vida do próximo componente. Exibir um estado de carregamento enquanto os dados estão a ser pedidos.

- **Requisitar Antes da Navegação**: pedir os dados antes da navegação na guarda da rota de entrada, e realizar a navegação depois dos dados tiverem sido recebidos.

Tecnicamente, ambas são escolhas válidas . isto definitivamente depende da experiência de uso que queres entregar.

## Fetching After Navigation

When using this approach, we navigate and render the incoming component immediately, and fetch data in the component's `created` hook. It gives us the opportunity to display a loading state while the data is being fetched over the network, and we can also handle loading differently for each view.

Let's assume we have a `Post` component that needs to fetch the data for a post based on `$route.params.id`:

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
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      () => {
        this.fetchData()
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    )
  },
  methods: {
    fetchData() {
      this.error = this.post = null
      this.loading = true
      // replace `getPost` with your data fetching util / API wrapper
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

## Fetching Before Navigation

With this approach we fetch the data before actually navigating to the new
route. We can perform the data fetching in the `beforeRouteEnter` guard in the incoming component, and only call `next` when the fetch is complete. The callback passed to `next` will be called **after the component is mounted**:

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
      // `setData` is a method defined below
      next(vm => vm.setData(err, post))
    })
  },
  // when route changes and this component is already rendered,
  // the logic will be slightly different.
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

The user will stay on the previous view while the resource is being fetched for the incoming view. It is therefore recommended to display a progress bar or some kind of indicator while the data is being fetched. If the data fetch fails, it's also necessary to display some kind of global warning message.

<!-- ### Using Composition API -->

<!-- TODO: -->

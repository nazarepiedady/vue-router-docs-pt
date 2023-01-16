# Começar

<VueSchoolLink
  href="https://vueschool.io/courses/vue-router-4-for-everyone"
  title="Aprenda a construir Aplicações de Página Única poderosas com a Vue School"
>Assista um Curso em Vídeo Gratuito sobre a Vue Router</VueSchoolLink>

A criação de uma Aplicação de Página Única com a Vue + Vue Router acontece de maneira natural: com a Vue.js, já estamos a compor a nossa aplicação com componentes. Quando adicionamos a Vue Router para a mistura, todo o que precisamos fazer é mapear os nossos componentes para rotas e deixar a Vue Router saber onde apresentá-las. Aqui está um exemplo básico:

## HTML

```html
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/vue-router@4"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- use o componente router-link para navegação. -->
    <!-- especifique a ligação passando a propriedade `to`. -->
    <!-- `<router-link>` produzirá um marcador `<a>` com o atributo `href` correto -->
    <router-link to="/">Go to Home</router-link>
    <router-link to="/about">Go to About</router-link>
  </p>
  <!-- modo de canalização da rota -->
  <!-- componente correspondido pela rota será apresentado cá -->
  <router-view></router-view>
</div>
```

### `router-link`

Nota como que ao invés de usar os marcadores `a` normais, usamos um componente personalizado `router-link` para criar ligações. Isto permite que a Vue Router para mudar a URL sem recarregar a página, manipular a geração de URL bem como a sua codificação. Nós veremos depois como tiver proveito destas funcionalidades.

### `router-view`

O `router-view` exibirá o componente que corresponde a URL. Tu podes colocá-lo em qualquer lugar para adaptá-lo para o teu esquema.

<VueMasteryLogoLink></VueMasteryLogoLink>

## JavaScript

```js
// 1. Defina componentes de rota.
// Estes podem ser importados a partir de outros ficheiros
const Home = { template: '<div>Home</div>' }
const About = { template: '<div>About</div>' }

// 2. Defina algumas rotas
// Cada rota deve mapear para um componente.
// Falaremos sobre rotas encaixadas depois.
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]

// 3. Crie a instância de rota e passe a opção `routes`
// Tu podes passar opções adicionais aqui, mas
// preservar a simplicidade por agora.
const router = VueRouter.createRouter({
  // 4. Fornece a implementação da história para usar.
  // Aqui nós estamos a usar a história de hash por simplicidade.
  history: VueRouter.createWebHashHistory(),
  routes, // abreviação para `routes: routes`
})

// 5. Criar e montar a instância raiz.
const app = Vue.createApp({})
// Certifica-te de _usar_ a instância do roteador para
// fazer a aplicação tomar conhecimento do roteador.
app.use(router)

app.mount('#app')

// Agora a aplicação foi inicializada!
```

Ao chamar `app.use(router)`, recebemos acesso para ele como `this.$router` bem como a rota atual como `this.$route` dento de qualquer componente:

```js
// Home.vue
export default {
  computed: {
    username() {
      // Nós veremos o que `params` é em breve
      return this.$route.params.username
    },
  },
  methods: {
    goToDashboard() {
      if (isAuthenticated) {
        this.$router.push('/dashboard')
      } else {
        this.$router.push('/login')
      }
    },
  },
}
```

Para acessar o roteador ou a rota dentro da função `setup`, chame as funções `useRouter` ou `useRoute`. Nós aprenderemos mais a respeito disto na [API de Composição](./advanced/composition-api.md#accessing-the-router-and-current-route-inside-setup)

Em toda documentação, usaremos com frequência a instância `router`. Lembra-te de que usar `this.$router` é exatamente o mesmo que usar diretamente a instância `router` criado através da função `createRouter`. O motivo de usarmos `this.$router` é o de não querermos importar o roteador em todo componente individual que precisa manipular o roteamento.

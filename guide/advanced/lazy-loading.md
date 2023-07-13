# Rotas de Carregamento Preguiçoso {#lazy-loading-routes}

<VueSchoolLink
  href="https://vueschool.io/lessons/lazy-loading-routes-vue-cli-only"
  title="Estude sobre as rotas de carregamento preguiçoso"
/>

Quando estiveres a construir aplicações com um empacotador, o pacote de JavaScript pode tornar-se muito grande, e assim afetar o tempo do carregamento da página. Seria mais eficiente se pudéssemos separar cada componente de rota em pedaços separados, e somente carregá-los quando a rota for visitada.

A Vue Router suporta [importações dinâmicas](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) fora da caixa, querendo dizer que podes substituir aquelas importações estáticas pelas importações dinâmicas:

```js
// substitua
// import UserDetails from './views/UserDetails'
// por
const UserDetails = () => import('./views/UserDetails.vue')

const router = createRouter({
  // ...
  routes: [{ path: '/users/:id', component: UserDetails }],
})
```

A opção `component` (e `components`) aceitam uma função que retorna uma promessa de um componente e a Vue Router **irá apenas buscá-lo quando estiver para apresentar a página pela primeira vez**, depois usa a versão armazenada para consulta imediata. O que significa que também podes ter funções mais complexas enquanto elas retornarem uma promessa:

```js
const UserDetails = () =>
  Promise.resolve({
    /* definição do componente */
  })
```

Em geral, é uma boa ideia **sempre usar importações dinâmicas** para todas as tuas rotas.

:::tip Nota
**Não** usar [componentes Assíncronos](https://vuejs.org/guide/component-dynamic-async#async-components) para as rotas. Os componentes assíncronos podem continuar a ser usados dentro dos componentes de rota mas os mesmos componentes de rota são apenas importações dinâmicas.
:::

Quando estiveres a usar um empacotador como o Webpack, este se beneficiará automaticamente da [separação de código](https://webpack.js.org/guides/code-splitting/).

Quando estiveres a usar o Babel, precisarás de adicionar a extensão [`syntax-dynamic-import`](https://babeljs.io/docs/plugins/syntax-dynamic-import/) para o Babel poder analisar a sintaxe apropriadamente.

## Agrupar Componentes no Mesmo Pedaço {#grouping-components-in-the-same-chunk}

### Com a Webpack {#with-webpack}

Algumas vezes podemos querer agrupar todos os componentes encaixados sob a mesma rota no mesmo pedaço assíncrono. Para alcançar isto precisamos usar [pedaços nomeados](https://webpack.js.org/guides/code-splitting/#dynamic-imports) fornecendo um nome de pedaço usando uma sintaxe especial de comentário (exige versão de webpack > 2.4):

```js
const UserDetails = () =>
  import(/* webpackChunkName: "group-user" */ './UserDetails.vue')
const UserDashboard = () =>
  import(/* webpackChunkName: "group-user" */ './UserDashboard.vue')
const UserProfileEdit = () =>
  import(/* webpackChunkName: "group-user" */ './UserProfileEdit.vue')
```

O Webpack agrupará qualquer módulo assíncrono com o mesmo nome de pedaço no mesmo pedaço assíncrono.

### Com a Vite {#with-vite}

Na Vite podes definir os pedaços sob a [`rollupOptions`](https://vitejs.dev/config/#build-rollupoptions):

```js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/guide/en/#outputmanualchunks
      output: {
        manualChunks: {
          'group-user': [
            './src/UserDetails',
            './src/UserDashboard',
            './src/UserProfileEdit',
          ],
        },
    },
  },
})
```

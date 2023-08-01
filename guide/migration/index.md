# Migrando da Vue 2 {#migrating-from-vue-2}

A maioria da parte da API da Vue Router permaneceu inalterada durante a sua reescrita da versão 3 (para Vue 2) para versão 4 (para Vue 3) mas ainda existem algumas mudanças de rutura que podes encontrar enquanto migras a tua aplicação. Este guia está aqui para ajudar-te a entender o porquê estas mudanças aconteceram e como adaptar a tua aplicação para fazê-la funcionar com a Vue Router 4.

## Mudanças de Rutura {#breaking-changes}

As mudanças estão organizadas pelo seu uso. É portanto recomendado seguir esta lista em ordem.

### `new Router` Torna-se `createRouter` {#new-router-becomes-createrouter}

A Vue Router já não é uma classe mas um conjunto de funções. No lugar de escrever `new Router()`, agora tens de chamar `createRouter`:

```js
// anteriormente era
// import Router from 'vue-router'
import { createRouter } from 'vue-router'

const router = createRouter({
  // ...
})
```

### A Nova Opção `history` para Substituir o `mode` {#new-history-option-to-replace-mode}

A opção `mode: 'history'` foi substituída com uma mais flexível nomeada `history`. Dependendo de qual modo que estavas a usar, terás de substituí-lo com a função apropriada:

- `"history"`: `createWebHistory()`
- `"hash"`: `createWebHashHistory()`
- `"abstract"`: `createMemoryHistory()`

Cá está um trecho completo:

```js
import { createRouter, createWebHistory } from 'vue-router'
// também existe `createWebHashHistory` e `createMemoryHistory`

createRouter({
  history: createWebHistory(),
  routes: [],
})
```

Na interpretação no lado do servidor (SSR), precisas de manualmente passar a história apropriada:

```js
// router.js
let history = isServer ? createMemoryHistory() : createWebHistory()
let router = createRouter({ routes, history })
// em algum lugar no teu `server-entry.js`
router.push(req.url) // url da requisição
router.isReady().then(() => {
  // resolver a requisição
})
```

**Motivo**: ativa a agitação da árvore de histórias não usadas bem como implementar as histórias personalizadas para casos de uso avançados como soluções nativas.

### Mudou-se a Opção `base` {#moved-the-base-option}

A opção `base` agora é passada como o primeiro argumento para `createWebHistory` (e outras histórias):

```js
import { createRouter, createWebHistory } from 'vue-router'
createRouter({
  history: createWebHistory('/base-directory/'),
  routes: [],
})
```

### Remoção da Opção `fallback` {#removal-of-the-fallback-option}

A opção `fallback` já não é suportada quando criares o roteador:

```diff
-new VueRouter({
+createRouter({
-  fallback: false,
// outras opções...
})
```

**Motivo**: Todos os navegadores suportados pela Vue suportam a [API de História da HTML5](https://developer.mozilla.org/en-US/docs/Web/API/History_API), permitindo-nos evitar malabarismos em torno da modificação de `location.hash` e usar diretamente `history.pushState()`.

### Rotas `*` (estrela ou captura total) removida {#removed-star-or-catch-all}

A captura de todas as rotas (`*`, `/*`) agora deve ser definida usando um parâmetro com uma expressão regular personalizada:

```js
const routes = [
  // `pathMatch` é o nome do parâmetro, por exemplo, indo para `/not/found`
  // { params: { pathMatch: ['not', 'found'] }}

  // isto é graças ao último `*`, que significa parâmetros repetidos
  // e é necessário se planeamos navegar diretamente para rota `not-found`
  // usando o seu nome
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },

  // se omitirmos o último `*`, o carácter `/` nos parâmetros serão codificados
  // quando ao resolverem ou empurrarem.
  { path: '/:pathMatch(.*)', name: 'bad-not-found', component: NotFound },
]

// mau exemplo se usamos rotas nomeadas:
router.resolve({
  name: 'bad-not-found',
  params: { pathMatch: 'not/found' },
}).href // '/not%2Ffound'

// bom exemplo:
router.resolve({
  name: 'not-found',
  params: { pathMatch: ['not', 'found'] },
}).href // '/not/found'
```

:::tip DICA
Nós não precisamos adicionar o `*` para parâmetros repetidos se não planeamos empurrar diretamente para a rota não encontrada usando o seu nome. Se chamarmos `router.push('/not/found/url')`, fornecerá o parâmetro `pathMatch` correto.
:::

**Motivo**: A Vue Router não mais `path-to-regexp`, ao invés disto implementa o seu próprio sistema de analise que permite a classificação de rota e ativa o roteamento dinâmico. Uma vez que normalmente adicionamos uma única rota de captura total por projeto, não existe grande benefício em suportar uma sintaxe especial para `*`. A codificação dos parâmetros está codificação através das rotas, sem exceção para tornar as coisas mais fáceis de predizer.

### Substituiu `onReady` por `isReady` {#replaced-onready-with-isready}

A função `router.onReady()` existente tem sido substituída por `router.isReady()` que não recebe nenhum argumento e retorna uma promessa:

```js
// substituir
router.onReady(onSuccess, onError)
// por
router.isReady().then(onSuccess).catch(onError)
// ou usar await:
try {
  await router.isReady()
  // onSuccess
} catch (err) {
  // onError
}
```

### Mudanças de `scrollBehavior` {#scrollbehavior-changes}

O objeto retornado em `scrollBehavior` é agora semelhante ao [`ScrollToOptions`](https://developer.mozilla.org/en-US/docs/Web/API/ScrollToOptions): `x` foi renomeado para `left` e `y` foi renomeado para `top`. Consulte o [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0035-router-scroll-position.md).

**Motivo**: tornar o objeto semelhante ao `ScrollToOptions` para torná-lo mais familiar com as APIs de JavaScript nativa do navegador e potencialmente ativar futuras novas opções.

### `<router-view>`, `<keep-alive>`, e `<transition>` {#router-view-keep-alive-transition}

`transition` e `keep-alive` devem agora ser usados **dentro** do `RouterView` através da API `v-slot`:

```vue
<router-view v-slot="{ Component }">
  <transition>
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </transition>
</router-view>
```

**Motivo**: Isto foi uma mudança necessária. Consulte o [RFC relacionado](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0034-router-view-keep-alive-transitions.md).

### Remoção da propriedade `append` no `<router-link>` {#removal-of-append-prop-in-router-link}

A propriedade `append` tem sido removida do `<router-link>`. Tu podes concatenar manualmente o valor à um `path` existente:

```html
replace
<router-link to="child-route" append>to relative child</router-link>
with
<router-link :to="append($route.path, 'child-route')">
  to relative child
</router-link>
```

Tu deves definir uma função global `append` na instância da tua _Aplicação_:

```js
app.config.globalProperties.append = (path, pathToAppend) =>
  path + (path.endsWith('/') ? '' : '/') + pathToAppend
```

**Motivo**: `append` não era usado com muita frequência, é fácil replicar na terra do utilizador.

### Remoção das propriedades `event` e `tag` no `<router-link>` {#removal-of-event-and-tag-props-in-router-link}

Ambas propriedades `event` e `tag` têm sido removida do `<router-link>`. Tu podes usar a [API `v-slot`](../../api/#router-link-s-v-slot) para personalizar completamente o `<router-link>`:

```html
replace
<router-link to="/about" tag="span" event="dblclick">About Us</router-link>
with
<router-link to="/about" custom v-slot="{ navigate }">
  <span @click="navigate" @keypress.enter="navigate" role="link">About Us</span>
</router-link>
```

**Motivo**: Estas propriedades eram com frequência usadas juntas para usar algo diferente dum marcador `<a>` mas foram introduzidas antes da API `v-slot` e não são usadas o bastante para justificar a adição ao tamanho do pacote para todos.

### Remoção da propriedade `exact` no `<router-link>` {#removal-of-the-exact-prop-in-router-link}

A propriedade `exact` tem sido removida porque a advertência que estava a corrigir já não está mais presente então deverias ser capaz de seguramente removê-la. Existem no entanto duas coisas de que deves estar ciente:

- As rotas são agora ativas baseadas nos registos de rota que apresentam ao invés dos objetos de localização de rota gerado e suas propriedades `path`, `query`, e `hash`
- Apenas a seção `path` é correspondida, `query`, e `hash` não são mais levados em conta

Se desejas personalizar este comportamento, por exemplo, levar em conta a seção `hash`, deves usar a [API `v-slot`](/api/#router-link-s-v-slot) para estender `<router-link>`.

**Motivo**: Consulte o [RFC sobre as mudanças de correspondência ativa](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0028-router-active-link.md#summary) por mais detalhes.

### As guardas de navegação nas misturas são ignoradas {#navigation-guards-in-mixins-are-ignored}

Neste momentos as guardas de navegação nas misturas não são suportadas. Tu podes rastrear seu suporte em [vue-router#454](https://github.com/vuejs/router/issues/454).

### Remoção da `router.match` e mudanças para `router.resolve` {#removal-of-router-match-and-changes-to-router-resolve}

Ambas `router.match` e `router.resolve` foram fundidas em `router.resolve` com uma assinatura ligeiramente diferente. [Consulte a API](../../api/#resolve) por mais detalhes.

**Motive**: Unir vários métodos que eram usados para o mesmo propósito.

## Remoção do `router.getMatchedComponents()` {#removal-of-router-getmatchedcomponents}

O método `router.getMatchedComponents` foi removido visto que os componentes correspondidos podem ser recuperados a partir de `router.currentRoute.value.matched`:

```js
router.currentRoute.value.matched.flatMap(record =>
  Object.values(record.components)
)
```

**Motivo**: Este método apenas foi usado durante a interpretação no lado do servidor e é uma solução de uma linha que pode ser feita pelo utilizador.

### Redirecionar registos que não podem usar caminhos especiais {#redirect-records-cannot-use-special-paths}

Anteriormente, um funcionalidade não documentada permitia definir um redirecionamento de registo para um caminho especial como `/events/:id` e reutilizaria um parâmetro `id` existente. Isto já não é possível e existem duas opções:

- Usando o nome da rota sem o parâmetro: `redirect: { name: 'events' }`. Nota que isto não funcionará se o parâmetro `:id` for opcional.
- Usando uma função para recriar a nova localização baseado no alvo: `redirect: to => ({ name: 'events', params: to.params })`.

**Motivo**: Esta sintaxe era raramente usada e _uma outra maneira de fazer coisas_ que não eram curtas o suficiente comparadas as versões acima enquanto introduzia alguma complexidade e tornava o roteador mais pesado.

### **Todas** as navegações agora são sempre assíncronas {#all-navigations-are-now-always-asynchronous}

Todas as navegações, incluindo a primeira, são agora assíncronas, o que significa que, se usares uma `transition`, podes precisar de ter de esperar o roteador estar _pronto_ antes de montar a aplicação:

```js
app.use(router)
// Nota: no lado do servidor, podes empurrar manualmente a localização inicial
router.isReady().then(() => app.mount('#app'))
```

De outro modo existirá uma transição inicial como se fornecesses a propriedade `appear` à `transition` porque o roteador exibe sua localização inicial (nada) e depois exibe a primeira localização.

Nota que **se tiveres guardas de navegação sobre a navegação inicial**, podes não querer bloquear o desenho da aplicação até forem resolvidas a menos que estejas a fazer interpretação no lado do servidor. Neste cenário, não esperar o roteador estar pronto para montar a aplicação produziria o mesmo resultado que na Vue 2.

### Remoção da `router.app` {#removal-of-router-app}

`router.app` costumava a representar o último componente da raiz (instância de Vue) que injetou o roteador. A Vue Router pode agora ser seguramente usada por várias aplicações de Vue ao mesmo tempo. Tu ainda podes adicioná-la quando usares o roteador:

```js
app.use(router)
router.app = app
```

Tu podes também estender a definição de TypeScript da interface `Router` para adicionar a propriedade `app`.

**Motivo**: As aplicações de Vue 3 não existem na Vue 2 e agora suportamos apropriadamente várias aplicações usando a mesma instância do roteador, assim ter uma propriedade `app` teria sido enganoso porque teria sido a aplicação ao invés da instância da raiz.

### Passando conteúdo para o `<slot>` dos componentes da rota {#passing-content-to-route-components-slot}

Antes poderias passar diretamente um modelo de marcação para ser desenhado por um `<slot>` dos componentes da rota encaixando-o sob um componente `<router-view>`:

```html
<router-view>
  <p>In Vue Router 3, I render inside the route component</p>
</router-view>
```

Por causa da introdução da API de `v-slot` para `<router-view>`, deves passá-lo ao `<component>` usando a API de `v-slot`:

```html
<router-view v-slot="{ Component }">
  <component :is="Component">
    <p>In Vue Router 3, I render inside the route component</p>
  </component>
</router-view>
```

### Remoção de `parent` das localizações da rota {#removal-of-parent-from-route-locations}

A propriedade `parent` foi removida das localizações da rota normalizada (`this.$route` e o objeto retornado por `router.resolve`). Tu ainda podes acessá-lo através do vetor `matched`:

```js
const parent = this.$route.matched[this.$route.matched.length - 2]
```

**Motivo**: Ter `parent` e `children` cria referências circulares desnecessárias enquanto as propriedades já poderiam ser recuperadas através de `matched`.

### Remoção de `pathToRegexpOptions` {#removal-of-pathtoregexoptions}

As propriedades `pathToRegexpOptions` e `caseSensitive` dos registos de rota foram substituídas pelas `sensitive` e `strict` para `createRouter()`. Elas agora podem também ser diretamente passadas quando crias o roteador com `createRouter()`. Qualquer outra opção específica para `path-to-regexp` foi removida visto que `path-to-regexp` não é mais usada para analisar caminhos.

### Remoção de parâmetros não nomeados {#removal-of-unnamed-parameters}

Devido a remoção de `path-to-regexp`, os parâmetros não nomeados não são mais suportados:

- `/foo(/foo)?/suffix` torna-se `/foo/:_(foo)?/suffix`
- `/foo(foo)?` torna-se `/foo:_(foo)?`
- `/foo/(.*)` torna-se `/foo/:_(.*)`

:::tip DICA
Nota que podes usar qualquer nome no lugar de `_` para o parâmetro. O ponto é fornecer um.
:::

### Uso de `history.state` {#usage-of-history-state}

A Vue Router guarda informação na `history.state`. Se tiveres qualquer código chamando manualmente `history.pushState()`, provavelmente deves evitá-lo ou refazê-lo com um `route.push()` normal e um `history.replaceState()`:

```js
// substituir
history.pushState(myState, '', url)
// por
await router.push(url)
history.replaceState({ ...history.state, ...myState }, '')
```

De maneira semelhante, se estivesses a chamar `history.replaceState()` sem preservar o estado atual, precisarás de passar a `history.state` atual:

```js
// substituir
history.replaceState({}, '', url)
// por
history.replaceState(history.state, '', url)
```

**Motivo**: Nós usamos o estado da história para guardar informação sobre a navegação como a posição do deslocamento, localização anterior, etc.

### A opção `routes` é obrigatória nas `options` {#routes-options-is-required-in-options}

A propriedade `routes` agora é obrigatória nas `options`.

```js
createRouter({ routes: [] })
```

**Motivo**: O roteador está desenhado para ser criado com as rotas muito embora possas adicioná-los mais tarde. Tu precisas de ao menos uma rota na maioria dos cenários e este é escrito uma vez por aplicação em geral.

### Rotas nomeadas que não existem {#non-existent-named-routes}

Empurrar ou resolver uma rota nomeada que não existe lança um erro:

```js
// Oops, cometemos um erro de digitação no nome
router.push({ name: 'homee' }) // throws
router.resolve({ name: 'homee' }) // throws
```

**Motivo**: Anteriormente, o roteador navegaria para `/` mas não exibia nada (no lugar da página principal). Lançar um erro faz mais sentido porque não podemos produzir uma URL válida para onde navegar.

### `params` obrigatório em falta nas rotas nomeadas {#missing-required-params-on-named-routes}

Empurrar ou resolver uma rota nomeada sem seus parâmetros obrigatórios lançará um erro:

```js
// dada a seguinte rota:
const routes = [{ path: '/users/:id', name: 'user', component: UserDetails }]

// o parâmetro em falta `id` falhará
router.push({ name: 'user' })
router.resolve({ name: 'user' })
```

**Motivo**: O mesmo que está acima.

### rotas de filhos nomeados com um `path` vazio não mais anexam uma barra {#named-children-routes-with-an-empty-path-no-longer-appends-an-slash}

Dado qualquer rota nomeada encaixada com um `path` vazio:

```js
const routes = [
  {
    path: '/dashboard',
    name: 'dashboard-parent',
    component: DashboardParent,
    children: [
      { path: '', name: 'dashboard', component: DashboardDefault },
      {
        path: 'settings',
        name: 'dashboard-settings',
        component: DashboardSettings,
      },
    ],
  },
]
```

Navegar ou resolver para a rota nomeada `dashboard` produzirá uma URL **sem uma barra à direita**:

```js
router.resolve({ name: 'dashboard' }).href // '/dashboard'
```

Isto tem um efeito colateral importante sobre os registos de `redirect` dos filhos como estes:

```js
const routes = [
  {
    path: '/parent',
    component: Parent,
    children: [
      // isto agora redirecionaria para `/home` ao invés de `/parent/home`
      { path: '', redirect: 'home' },
      { path: 'home', component: Home },
    ],
  },
]
```

Nota que isto funcionaria se `path` fosse `/parent/` como localização relativa de `home` para `/parent/` é de fato `/parent/home/` mas a localização relativa de `home` para `/parent` é  `/home`.

<!-- Learn more about relative links [in the cookbook](../../cookbook/relative-links.md). -->

**Motivo**: Isto é para tornar o comportamento de barra à direita consistente: por padrão todas as rotas permitem uma barra à direita. Isto pode ser desativado usando a opção `strict` e manualmente anexando (ou não) uma barra às rotas.

<!-- TODO: maybe a cookbook entry -->

### Codificação das propriedades de `$route` {#route-properties-encoding}

Os valores descodificados nos `params`, `query`, e `hash` agora são consistentes não importa onde a navegação foi iniciada (os navegadores ainda produzirão `path` e `fullPath` não descodificados). A navegação inicial deve produzir os mesmos resultados que as navegações na aplicação.

Dada qualquer [localização de rota normalizada](../../api/#routelocationnormalized):

- Os valores em `path`, `fullPath` não são mais descodificados. Eles aparecerão como foram fornecidos pelo navegador (a maioria dos navegadores fornece-os codificados). Por exemplo, escrever diretamente na barra de endereço `https://example.com/hello world` produzirá a versão codificada: `https://example.com/hello%20world` e ambos `path` e `fullPath` serão `/hello%20world`.
- `hash` agora é descodificado, desta maneira pode ser copiado: `router.push({ hash: $route.hash })` e ser usado diretamente na opção `el` do [`scrollBehavior`](../../api/#scrollbehavior)
- Quando usamos `push`, `resolve`, e `replace` e fornecemos uma localização de `string` ou uma propriedade `path` num objeto, **deve ser codificado** (como na versão anterior). Por outro lado, `params`, `query`, `hash` deve ser fornecido na sua versão não codificada.
- O carácter barra (`/`) agora é apropriadamente descodificado dentro de `params` embora ainda produza uma versão codificada na URL: `%2F`.

**Motivo**: Isto permite copiar facilmente propriedades existentes duma localização quando chamamos `router.push()` e `router.resolve()`, e torna a localização da rota resultante consistente através dos navegadores.  `router.push()` agora é idempotente, significando que chamar `router.push(route.fullPath)`, `router.push({ hash: route.hash })`, `router.push({ query: route.query })`, e `router.push({ params: route.params })` não criará codificação adicional.

### Mudanças de TypeScript {#typescript-changes}

Para tornar os tipos mais consistentes e expressivos, alguns dos tipos foram renomeados:

| `vue-router@3` | `vue-router@4`          |
| -------------- | ----------------------- |
| RouteConfig    | RouteRecordRaw          |
| Location       | RouteLocation           |
| Route          | RouteLocationNormalized |

## Novas Funcionalidades {#new-features}

Algumas das novas funcionalidades para ficar de olho na Vue Router 4 incluem:

- [Roteamento Dinâmico](../advanced/dynamic-routing)
- [API de Composição](../advanced/composition-api)
<!-- - Custom History implementation -->

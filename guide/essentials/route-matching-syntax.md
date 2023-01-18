# Sintaxe de Correspondência da Rota

<VueSchoolLink
  href="https://vueschool.io/lessons/vue-router-4-advanced-routes-matching-syntax"
  title="Aprenda a como usar a sintaxe de correspondência de rotas de rota avançada"
/>

A maioria das aplicações usarão rotas estáticas como `/about` e rotas dinâmicas como `/users/:userId` como já vimos na [Correspondência de Rota Dinâmica](./dynamic-matching.md), mas a Vue Router tem muito mais a oferecer!

:::tip Dica
Para fins de simplicidade, todos registos da rota **estão a omitir a propriedade `component`** para focar no valor `path`.
:::

## Expressão Regular Personalizada nos Parâmetros

Quando estivermos a definir um parâmetro como `:userId`, usaremos internamente a seguinte expressão regular `([^/]+)` (pelo menos um carácter que não é uma barra `/`) para extrair os parâmetros das URLs. Isto funciona bem a menos que precises fazer diferenciar duas rotas baseadas no conteúdo do parâmetro. Suponha duas rotas `/:orderId` e `/productName`, ambas corresponderiam exatamente as mesmas URLs, assim precisamos de uma maneira de diferenciá-las. A maneira mais fácil seria adicionar uma seção estática ao caminho que as diferencia:

```js
const routes = [
  // corresponde a "/o/3549"
  { path: '/o/:orderId' },
  // corresponde a "/p/books"
  { path: '/p/:productName' },
]
```

Mas em alguns cenários não queremos adicionar aquela seção estática `/o`/`p`. No entanto, `orderId` sempre é um número enquanto `productName` pode ser qualquer coisa, assim podemos especificar uma expressão regular personalizada para um parâmetro entre parêntesis:

```js
const routes = [
  // "/:orderId" -> corresponde apenas a números
  { path: '/:orderId(\\d+)' },
  // "/:productName" -> corresponde qualquer coisa
  { path: '/:productName' },
]
```

Agora, ir para `/25` corresponderá ao `/:orderId` enquanto ir para qualquer coisa corresponderá ao `/:productName`. A ordem do arranjo `routes` nem sequer importa!

:::tip Dica
Certifica-te de **escapar as barras oblíquas invertidas (`/`)** como fizemos com `\d` (torna-se `\\d`) para realmente passar o carácter barra oblíqua invertida na sequência de caracteres em JavaScript.
:::

## Parâmetros Repetitivos

Se precisas corresponder rotas com várias seções como `/first/second/third`, deves marcar um parâmetro como repetitivo com `*` (0 ou mais) e `+` (1 ou mais):

```js
const routes = [
  // "/:chapters" -> corresponde a "/one", "/one/two", "/one/two/three", etc
  { path: '/:chapters+' },
  // "/:chapters" -> corresponde a "/", "/one", "/one/two", "/one/two/three", etc
  { path: '/:chapters*' },
]
```

Isto dar-te-á um arranjo de parâmetros no lugar de uma sequência de caracteres e também exigirá que passes um arranjo quando estiveres a usar rotas nomeadas:

```js
// dado o { path: '/:chapters*', name: 'chapters' },
router.resolve({ name: 'chapters', params: { chapters: [] } }).href
// produz "/"
router.resolve({ name: 'chapters', params: { chapters: ['a', 'b'] } }).href
// produz "/a/b"

// dado { path: '/:chapters+', name: 'chapters' },
router.resolve({ name: 'chapters', params: { chapters: [] } }).href
// lança um erro porque o `chapters` está vazio
```

Estes também podem ser combinados com uma expressão regular personalizada ao adicioná-las **depois dos parêntesis de fechamento**:

```js
const routes = [
  // apenas corresponde a números
  // corresponde a "/1", "/1/2", etc
  { path: '/:chapters(\\d+)+' },
  // corresponde a "/", "/1", "/1/2", etc
  { path: '/:chapters(\\d+)*' },
]
```

## Opções de Rota Estritas e Sensíveis

Por padrão, todas rotas são insensíveis às diferenças entre maiúsculas e minúsculas e correspondem a rotas com ou sem uma barra de caminho, por exemplo uma rota `/users` corresponde a `/users`, `/users/`, e até mesmo `/Users/`. Este comportamento pode ser configurado com as opções `strict` e `sensitive`, podem ser definidas ambas no nível de um roteador e rota:

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // corresponderá a "/users/posva" mas não:
    // - "/users/posva/" por causa do strict: true
    // - "/Users/posva" por causa do sensitive: true
    { path: '/users/:id', sensitive: true },
    // corresponderá a "/users", "/Users", e "/users/42" não a "/users/" ou "/users/42/"
    { path: '/users/:id?' },
  ],
  strict: true, // aplica-se à todas rotas
})
```

## Parâmetros Opcionais

Tu também podes marcar um parâmetro como opcional com o uso do modificador `?` (0 ou 1):

```js
const routes = [
  // corresponderá a "/users" e "/users/posva"
  { path: '/users/:userId?' },
  // corresponderá a "/users" e "/users/42"
  { path: '/users/:userId(\\d+)?' },
]
```

Nota que tecnicamente `*` também marca um parâmetro como opcional mas parâmetros `?` não podem ser repetidos.

## Depuração

Se precisas escavar como as tuas rotas são transformadas em uma expressão regular para entenderes o porquê de uma rota não ser correspondida ou, comunicar um bug, podes usar a [ferramenta classificadora de caminho](https://paths.esm.dev/?p=AAMeJSyAwR4UbFDAFxAcAGAIJXMAAA..#). Ela ajuda a partilhar as tuas rotas através da URL.

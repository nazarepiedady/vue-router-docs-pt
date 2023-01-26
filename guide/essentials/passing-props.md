# Passando Propriedades para os Componentes de Rota

<VueSchoolLink
  href="https://vueschool.io/lessons/route-props"
  title="Aprenda como passar propriedades para os componentes de rota"
/>

Usar `$route` no teu componente cria um acoplamento apertado com a rota o que limita a flexibilidade do componente já que ele apenas pode ser usado sobre certas URLs. Enquanto que isto não é necessariamente uma coisa má, podemos desfazer o acoplamento deste comportamento com uma opção `props`:

Nós podemos substituir

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
const routes = [{ path: '/user/:id', component: User }]
```

por

```js
const User = {
  // certifica-te de adicionar uma propriedade nomeada exatamente como o parâmetro da rota
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const routes = [{ path: '/user/:id', component: User, props: true }]
```

Isto permite-te usar o componente em qualquer lugar, o que torna o componente mais fácil de reutilizar e testar.

## Modo booleano

Quando o `props` for definido para `true`, a `route.params` serão definidas como propriedades do componente.

## Visões Nomeadas

Para rotas com visões nomeadas, tens que definir a opção `props` para cada visão nomeada:

```js
const routes = [
  {
    path: '/user/:id',
    components: { default: User, sidebar: Sidebar },
    props: { default: true, sidebar: false }
  }
]
```

## Modo de objeto

Quando `props` for um objeto, este será definido como propriedades de componente como está. Útil para quando as propriedades forem estáticas.

```js
const routes = [
  {
    path: '/promotion/from-newsletter',
    component: Promotion,
    props: { newsletterPopup: false }
  }
]
```

## Mode de função

Tu podes criar uma função que retorna propriedades. Isto permite-te moldar parâmetros com outros tipos, combinar valores estáticos com valores baseados em rota etc.

```js
const routes = [
  {
    path: '/search',
    component: SearchUser,
    props: route => ({ query: route.query.q })
  }
]
```

A URL `/search?q=vue` passaria `{ query: 'vue' }` como propriedades para o componente `SearchUser`.

Tente manter a função `props` sem estado (stateless, em Inglês), já que é apenas avaliada sobre as mudanças da rota. Use um componente invólucro (wrapper, em Inglês) se precisares de estado para definir as propriedades, desta maneira a Vue pode reagir às mudanças do estado.

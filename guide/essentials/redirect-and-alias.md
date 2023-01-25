# Redirecionamento e Pseudónimos

<VueSchoolLink
  href="https://vueschool.io/lessons/vue-router-4-redirect-and-alias"
  title="Aprenda como usar o redirecionamento e pseudónimos"
/>

## Redirecionar

O redirecionamento também é feito na configuração de `routes`. Para redirecionar de `/home` para `/`:

```js
const routes = [{ path: '/home', redirect: '/' }]
```

O `redirect` também pode apontar para uma rota nomeada:

```js
const routes = [{ path: '/home', redirect: { name: 'homepage' } }]
```

Ou mesmo usar uma função para o redirecionamento dinâmico:

```js
const routes = [
  {
    // /search/screens -> /search?q=screens
    path: '/search/:searchText',
    redirect: to => {
      // a função recebe a rota alvo como argumento
      // nós retornamos um `path/location` de `redirect` aqui.
      return { path: '/search', query: { q: to.params.searchText } }
    },
  },
  {
    path: '/search',
    // ...
  },
]
```

Nota que os **[Guardas da Navegação](../advanced/navigation-guards.md) não são aplicados na rota que redireciona, apenas no seu alvo**. Por exemplo, no exemplo acima, adicionar um guarda `beforeEnter` para a rota `/home` não teria qualquer efeito.

Quando estiveres a escrever um `redirect`, podes omitir a opção `component` porque ele nunca é alcançado diretamente então não existe componente a apresentar. As únicas exceções são as [rotas encaixadas](./nested-routes.md): se um registo de rota tiver uma propriedade `children` e `redirect`, ela também deve ter uma propriedade `component`.

### Redirecionamento relativo

É também possível redirecionar para uma localização relativa:

```js
const routes = [
  {
    // sempre redirecionará o `/users/123/posts` para `/users/123/profile`
    path: '/users/:id/posts',
    redirect: to => {
      // a função recebe a rota alvo como argumento
      // uma localização relativa não começa com `/`
      // ou { path: 'profile' }
      return 'profile'
    },
  },
]
```

## Pseudónimos

Um redirecionamento significa que quando o utilizador visitar `/home`, a URL será pelo `/`, e depois correspondida como `/`. Mas o que é um pseudónimo?

**Um pseudónimo de `/` como `/home` significa que quando o utilizador visitar `/home`, a URL continua `/home`, mas será correspondida como se o utilizador estivesse a visitar `/`.**

O que está acima pode ser expressado na configuração de rota como:

```js
const routes = [{ path: '/', component: Homepage, alias: '/home' }]
```

Um pseudónimo dá-te a liberdade de mapear uma estrutura de Interface de Utilizador (UI, sigla em Inglês) à uma URL arbitrária, ao invés de ser limitado pela estrutura de encaixamento da configuração. Faça o pseudónimo começar com uma `/` para fazer o caminho absolute nas rotas encaixadas. Tu até podes combinar ambos e fornecer vários pseudónimos com um arranjo:

```js
const routes = [
  {
    path: '/users',
    component: UsersLayout,
    children: [
      // isto apresentará o `UserList` para estas 3 URLs
      // - /users
      // - /users/list
      // - /people
      { path: '', component: UserList, alias: ['/people', 'list'] },
    ],
  },
]
```

Se a tua rota tiver parâmetros, certifica-te de incluí-las em qualquer pseudónimo absoluto:

```js
const routes = [
  {
    path: '/users/:id',
    component: UsersByIdLayout,
    children: [
      // isto apresentará o `UserDetails` para estas 3 URLs
      // - /users/24
      // - /users/24/profile
      // - /24
      { path: 'profile', component: UserDetails, alias: ['/:id', ''] },
    ],
  },
]
```

**Nota sobre SEO**: quando estiveres a usar os pseudónimos, certifica-te de [definir ligações canónicas](https://support.google.com/webmasters/answer/139066?hl=en).

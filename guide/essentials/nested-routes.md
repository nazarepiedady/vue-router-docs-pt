# Rotas Encaixadas

<VueSchoolLink
  href="https://vueschool.io/lessons/nested-routes"
  title="Aprenda sobre as rotas encaixadas"
/>

Algumas UIs da aplicação são compostas de componentes que são encaixados vários níveis de profundidade. Neste caso, é muito comum que os segmentos de uma URL corresponda à uma certa estrutura de componentes encaixados, por exemplo:

```
/user/johnny/profile                     /user/johnny/posts
+------------------+                  +-----------------+
| User             |                  | User            |
| +--------------+ |                  | +-------------+ |
| | Profile      | |  +------------>  | | Posts       | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```

Com a Vue Router, podes expressar este relacionamento usando as configurações de rota encaixada.

Dada a aplicação que criamos no último capítulo:

```html
<div id="app">
  <router-view></router-view>
</div>
```

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>',
}

// estas rotas são passadas para o `createRouter`
const routes = [{ path: '/user/:id', component: User }]
```

O `<router-view>` aqui é um `router-view` de alto nível. Ele apresenta o componente correspondido por uma rota de alto nível. Similarmente, o componente apresentado também pode conter o seu próprio, `<router-view>` encaixado. Por exemplo, se adicionarmos um dentro do modelo de marcação do componente `User`:

```js
const User = {
  template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `,
}
```

Para apresentar os componentes dentro deste `router-view` encaixado, precisamos usar a opção `children` em quaisquer das rotas:

```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        /*
          UserProfile será apresentado dentro do <router-view> do User
          quando `/user/:id/profile` for correspondido
        */
        path: 'profile',
        component: UserProfile,
      },
      {
        /*
          UserPosts será apresentado dentro do <router-view> do User
          quando `/user/:id/posts` for correspondido
        */
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
]
```

**Nota que caminhos encaixados que começam com `/` serão tratados como um caminho de raiz. Isto permite-te influenciar o encaixamento do componente sem ter de usar uma URL encaixada.**

Conforme podes ver a opção `children` é apenas um outro arranjo de rotas como o próprio `routes`. Portanto, podes continuar a encaixar as visões tanto quanto precisares.

Até este ponto, com a configuração acima, quando visitas `/user/eduardo`, nada será apresentado dentro da `router-view` do `User`, porque nenhuma rota encaixada é correspondida. Talvez queiras apresentar alguma coisa lá. Em tal caso podes fornecer um caminho encaixado vazio:

```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      /*
        UserHome será apresentado dentro da `<router-view>` do User
        quando `/user/:id` for correspondido
      */
      { path: '', component: UserHome },

      // ...outras sub-rotas
    ],
  },
]
```

Uma demonstração em funcionamento deste exemplo pode ser encontrada [nesta ligação](https://codesandbox.io/s/nested-views-vue-router-4-examples-hl326?initialpath=%2Fusers%2Feduardo).

## Rotas Encaixadas Nomeadas

Quando estamos a lidar com [Rotas Nomeadas](./named-routes.md), normalmente **nomeias as rotas filhas**:

```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    // repara em como apenas a rota filha tem um nome
    children: [{ path: '', name: 'user', component: UserHome }],
  },
]
```

Isto garantira que a navegação para `/user/:id` sempre exibirá a rota encaixada.

Em alguns cenários, podes querer navegar para uma rota nomeada sem navegar para a rota encaixada. Por exemplo, se quiseres navegar para `/user/:id` sem exibir a rota encaixada. Neste caso, **também** podes nomear a rota pai mas nota que ao **recarregar a página sempre exibirá a filha encaixada** já que é considerada uma navegação para o caminho `/users/:id` ao invés da rota nomeada:

```js
const routes = [
  {
    path: '/user/:id',
    name: 'user-parent'
    component: User,
    children: [{ path: '', name: 'user', component: UserHome }],
  },
]
```

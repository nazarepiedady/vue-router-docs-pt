# Visões Nomeadas {#named-views}

<VueSchoolLink
  href="https://vueschool.io/lessons/vue-router-4-named-views"
  title="Aprenda como usar as visões nomeadas"
/>

Algumas vezes precisas exibir várias visões ao mesmo tempo ao invés de encaixá-las, por exemplo, criar um esquema com uma visão `sidebar` e uma visão `main`. Isto é onde as visões nomeadas dão jeito. Ao invés de ter uma único modo de canalização na tua visão, podes ter vários e dar a cada um deles um nome. Um `router-view` sem um nome será dado `default` como seu nome.

```html
<router-view class="view left-sidebar" name="LeftSidebar"></router-view>
<router-view class="view main-content"></router-view>
<router-view class="view right-sidebar" name="RightSidebar"></router-view>
```

Uma visão é apresentada com o uso de um componente, portanto várias visões exigem vários componentes para a mesma rota. Certifica-te de usar a `components` (com uma opção **s**):

```js
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      components: {
        default: Home,
        // abreviação para LeftSidebar: LeftSidebar
        LeftSidebar,
        // eles correspondem o atributo `name` no `<router-view>`
        RightSidebar,
      },
    },
  ],
})
```

Uma demonstração em funcionamento deste exemplo pode ser encontrado [nesta ligação](https://codesandbox.io/s/named-views-vue-router-4-examples-rd20l).

## Visões Nomeadas Encaixadas {#nested-named-views}

É possível criar esquemas complexos usando visões nomeadas com visões encaixadas. Quando estiveres a fazer isto, também precisarás dar ao `router-view` encaixado um nome. Consideremos um exemplo de painel de Definições:

```
/settings/emails                                       /settings/profile
+-----------------------------------+                  +------------------------------+
| UserSettings                      |                  | UserSettings                 |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
| | Nav | UserEmailsSubscriptions | |  +------------>  | | Nav | UserProfile        | |
| |     +-------------------------+ |                  | |     +--------------------+ |
| |     |                         | |                  | |     | UserProfilePreview | |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
+-----------------------------------+                  +------------------------------+
```

- `Nav` é apenas um componente regular
- `UserSettings` é componente de visão pai
- `UserEmailsSubscriptions`, `UserProfile`, `UserProfilePreview` são componentes de visão encaixados

**Nota**: _Vamos esquecer de como a HTML/CSS deveriam se parecer para representar tal esquema e concentrar-nos nos componentes usados._

A seção `<template>` para o componente `UserSettings` no esquema acima se pareceria com alguma como isto:

```html
<!-- UserSettings.vue -->
<div>
  <h1>User Settings</h1>
  <NavBar />
  <router-view />
  <router-view name="helper" />
</div>
```

Então podes alcançar o esquema acima com esta configuração de rota:

```js
{
  path: '/settings',
  // Tu poderias também ter visões nomeadas no top
  component: UserSettings,
  children: [{
    path: 'emails',
    component: UserEmailsSubscriptions
  }, {
    path: 'profile',
    components: {
      default: UserProfile,
      helper: UserProfilePreview
    }
  }]
}
```

Uma demonstração em funcionamento deste exemplo pode ser encontrado [nesta ligação](https://codesandbox.io/s/nested-named-views-vue-router-4-examples-re9yl?&initialpath=%2Fsettings%2Femails).
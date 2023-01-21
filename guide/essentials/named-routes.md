# Rotas Nomeadas

<VueSchoolLink
  href="https://vueschool.io/lessons/named-routes"
  title="Aprenda sobre as rotas nomeadas"
/>

Junto do `path`, podes fornecer um `name` para qualquer rota. Isto tem as seguintes vantagens:

- Nada de URLs definidas manualmente
- Codificação/descodificação automática de `params`
- Impedi-te de ter um erro na URL
- Contornar a classificação do caminho (por exemplo, exibir uma)

```js
const routes = [
  {
    path: '/user/:username',
    name: 'user',
    component: User
  }
]
```

Para ligar à uma rota nomeada, podes passar um objeto para propriedade `to` do componente `router-link`:

```html
<router-link :to="{ name: 'user', params: { username: 'erina' }}">
  User
</router-link>
```

Este é o exato mesmo objeto usado programaticamente com o `router.push()`:

```js
router.push({ name: 'user', params: { username: 'erina' } })
```

Em ambos casos, o roteador navegará para o caminho `/user/erina`.

O exemplo completo [encontra-se aqui](https://github.com/vuejs/vue-router/blob/dev/examples/named-routes/app.js).

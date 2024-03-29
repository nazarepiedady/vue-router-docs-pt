# Transições {#transitions}

<VueSchoolLink
  href="https://vueschool.io/lessons/route-transitions"
  title="Aprenda como aplicar transições às rotas"
/>

Para usares as transições nos teus componentes de rota e animar as navegações. precisas usar a API `v-slot`:

```html
<router-view v-slot="{ Component }">
  <transition name="fade">
    <component :is="Component" />
  </transition>
</router-view>
```

[Todas APIs de transição](https://vuejs.org/guide/transitions-enterleave) funcionam da mesma maneira que as da Vue.

## Transição por Rota {#per-route-transition}

O uso de cima aplicará a mesma transição para todas as rotas. Se quiseres que cada componente da rota tenha transições diferentes, podes combinar os [campos meta](./meta) e um `name` dinâmico na `<transition>`:

```js
const routes = [
  {
    path: '/custom-transition',
    component: PanelLeft,
    meta: { transition: 'slide-left' },
  },
  {
    path: '/other-transition',
    component: PanelRight,
    meta: { transition: 'slide-right' },
  },
]
```

```html
<router-view v-slot="{ Component, route }">
  <!-- Usar qualquer transição personalizada e para desvanecer (`fade`) -->
  <transition :name="route.meta.transition || 'fade'">
    <component :is="Component" />
  </transition>
</router-view>
```

## Transição Dinâmica Baseada em Rota {#route-based-dynamic-transition}

Também é possível determinar a transição a usar dinamicamente baseada no relacionamento entre a rota alvo e a rota atual. Com uso de um fragmento de código muito similar aquele que vimos antes:

```html
<!-- use um nome de transição dinâmico -->
<router-view v-slot="{ Component, route }">
  <transition :name="route.meta.transition">
    <component :is="Component" />
  </transition>
</router-view>
```

Nós podemos adicionar um [gatilho depois da navegação](./navigation-guards#global-after-hooks) para dinamicamente adicionar informação ao campo `meta` baseada na profundidade da rota:

```js
router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})
```

## Forçar uma Transição entre Visões Reutilizadas {#forcing-a-transition-between-reused-views}

A Vue pode automaticamente reutilizar componentes parecidos, evitando qualquer transição. Felizmente, é possível [adicionar um atributo `key`](https://vuejs.org/api/special-attributes#key) para forçar transições. Isto também permite-te acionar as transições enquanto continuares na mesma rota com parâmetros diferentes:

```vue
<router-view v-slot="{ Component, route }">
  <transition name="fade">
    <component :is="Component" :key="route.path" />
  </transition>
</router-view>
```

<!-- TODO: interactive example -->
<!-- See full example [here](https://github.com/vuejs/vue-router/blob/dev/examples/transitions/app.js). -->

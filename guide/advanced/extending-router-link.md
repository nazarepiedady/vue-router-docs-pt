# Estendendo o RouterLink

<VueSchoolLink
  href="https://vueschool.io/lessons/extending-router-link-for-external-urls"
  title="Aprenda a como estender o router-link"
/>

O componente `RouterLink` expõe `props` suficientes para abastecer as aplicações mais básicas mas não tenta cobrir todo possível caso de uso e provavelmente encontraras-te-á a usar o `v-slot` para alguns casos avançados. Nas aplicações de mais médio à grande porte, é importante criar um se não vários componentes `RouterLink` personalizados para reutilizá-los por toda a tua aplicação. Alguns exemplos são, Ligações em um Menu de Navegação, manipulação de ligações externas, adição de um `inactive-class`, etc.

Vamos estender o `RouterLink` para manipular ligações externas bem como e adicionar uma `inactive-class` em um ficheiro `AppLink.vue`:

```vue
<template>
  <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank">
    <slot />
  </a>
  <router-link
    v-else
    v-bind="$props"
    custom
    v-slot="{ isActive, href, navigate }"
  >
    <a
      v-bind="$attrs"
      :href="href"
      @click="navigate"
      :class="isActive ? activeClass : inactiveClass"
    >
      <slot />
    </a>
  </router-link>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
  name: 'AppLink',
  inheritAttrs: false,

  props: {
    // adicionar @ts-ignore se estiveres a usar TypeScript
    ...RouterLink.props,
    inactiveClass: String,
  },

  computed: {
    isExternalLink() {
      return typeof this.to === 'string' && this.to.startsWith('http')
    },
  },
}
</script>
```

If you prefer using a render function or create `computed` properties, you can use the `useLink` from the [Composition API](./composition-api.md):

```js
import { RouterLink, useLink } from 'vue-router'

export default {
  name: 'AppLink',

  props: {
    // add @ts-ignore if using TypeScript
    ...RouterLink.props,
    inactiveClass: String,
  },

  setup(props) {
    // `props` contains `to` and any other prop that can be passed to <router-link>
    const { navigate, href, route, isActive, isExactActive } = useLink(props)

    // profit!

    return { isExternalLink }
  },
}
```

In practice, you might want to use your `AppLink` component for different parts of your application. e.g. using [Tailwind CSS](https://tailwindcss.com), you could create a `NavLink.vue` component with all the classes:

```vue
<template>
  <AppLink
    v-bind="$attrs"
    class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 focus:outline-none transition duration-150 ease-in-out hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
    active-class="border-indigo-500 text-gray-900 focus:border-indigo-700"
    inactive-class="text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300"
  >
    <slot />
  </AppLink>
</template>
```

# Vue Router e a API de Composição

<VueSchoolLink
  href="https://vueschool.io/lessons/router-and-the-composition-api"
  title="Aprenda a como usar a Vue Router com a API de Composição"
/>

A introdução de `setup` e [API de Composição](https://v3.vuejs.org/guide/composition-api-introduction.html) da Vue, abre possibilidades novas mas para ser capaz de receber o potencial completo da Vue Router, precisaremos usar algumas funções novas para substituir o acesso ao `this` e às guardas de navegação em componente.

## Acessar o Roteador e a Rota atual dentro de `setup`

Uma vez que não temos acesso ao `this` dentro de `setup`, já não podemos acessar `this.$router` ou `this.$route` diretamente. No lugar destes usamos as funções `useRouter`:

```js
import { useRouter, useRoute } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()

    function pushWithQuery(query) {
      router.push({
        name: 'search',
        query: {
          ...route.query,
          ...query,
        },
      })
    }
  },
}
```

O objeto `route` é um objeto reativo, assim quaisquer uma de suas propriedades podem ser observadas e deves **evitar observar o objeto `route` inteiro**. Na maioria dos cenários, deves observar diretamente o parâmetro que estiveres a espera que mude:

```js
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'

export default {
  setup() {
    const route = useRoute()
    const userData = ref()

    // pedir as informações do utilizador quando os parâmetros mudarem
    watch(
      () => route.params.id,
      async newId => {
        userData.value = await fetchUser(newId)
      }
    )
  },
}
```

Nota que continuamos a ter o acesso ao `$router` e `$router` nos modelos de marcação, então não existe a necessidade de retornar o `router` ou `route` de dentro de `setup`.

## Navigation Guards

While you can still use in-component navigation guards with a `setup` function, Vue Router exposes update and leave guards as Composition API functions:

```js
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { ref } from 'vue'

export default {
  setup() {
    // same as beforeRouteLeave option with no access to `this`
    onBeforeRouteLeave((to, from) => {
      const answer = window.confirm(
        'Do you really want to leave? you have unsaved changes!'
      )
      // cancel the navigation and stay on the same page
      if (!answer) return false
    })

    const userData = ref()

    // same as beforeRouteUpdate option with no access to `this`
    onBeforeRouteUpdate(async (to, from) => {
      // only fetch the user if the id changed as maybe only the query or the hash changed
      if (to.params.id !== from.params.id) {
        userData.value = await fetchUser(to.params.id)
      }
    })
  },
}
```

Composition API guards can also be used in any component rendered by `<router-view>`, they don't have to be used directly on the route component like in-component guards.

## `useLink`

Vue Router exposes the internal behavior of RouterLink as a Composition API function. It gives access to the same properties as the [`v-slot` API](../../api/#router-link-s-v-slot):

```js
import { RouterLink, useLink } from 'vue-router'
import { computed } from 'vue'

export default {
  name: 'AppLink',

  props: {
    // add @ts-ignore if using TypeScript
    ...RouterLink.props,
    inactiveClass: String,
  },

  setup(props) {
    const { route, href, isActive, isExactActive, navigate } = useLink(props)

    const isExternalLink = computed(
      () => typeof props.to === 'string' && props.to.startsWith('http')
    )

    return { isExternalLink, href, navigate, isActive }
  },
}
```

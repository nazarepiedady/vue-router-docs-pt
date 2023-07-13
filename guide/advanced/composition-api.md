# Vue Router e a API de Composição {#vue-router-and-the-composition-api}

<VueSchoolLink
  href="https://vueschool.io/lessons/router-and-the-composition-api"
  title="Aprenda a como usar a Vue Router com a API de Composição"
/>

A introdução de `setup` e [API de Composição](https://vuejs.org/guide/composition-api-introduction) da Vue, abre possibilidades novas mas para ser capaz de receber o potencial completo da Vue Router, precisaremos usar algumas funções novas para substituir o acesso ao `this` e às guardas de navegação em componente.

## Acessar o Roteador e a Rota atual dentro de `setup` {#accessing-the-router-and-current-route-inside-setup}

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

## Guardas da Navegação {#navigation-guards}

Embora continues a poder usar as guardas da navegação em componente com uma função `setup`, a Vue Router expõe as guardas de atualização e saída como funções da API de Composição:

```js
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { ref } from 'vue'

export default {
  setup() {
    // o mesmo que a opção beforeRouteLeave sem o acesso ao `this`
    onBeforeRouteLeave((to, from) => {
      const answer = window.confirm(
        'Do you really want to leave? you have unsaved changes!'
      )
      // cancela a navegação e permanece na mesma página
      if (!answer) return false
    })

    const userData = ref()

    // o mesmo que a opção beforeRouteUpdate sem o acesso ao `this`
    onBeforeRouteUpdate(async (to, from) => {
      // apenas peça o utilizador se o `id` foi mudado já que talvez apenas a `query` ou `hash` foram mudadas
      if (to.params.id !== from.params.id) {
        userData.value = await fetchUser(to.params.id)
      }
    })
  },
}
```

As guardas da API de Composição também podem ser usadas em qualquer componente apresentado pelo `<router-view>`, não precisam ser usados diretamente no componente da rota como guardas em componente.

## `useLink` {#uselink}

A Vue Router expõe o comportamento interno de `RouterLink` como uma função da API de Composição. Ela concede o acesso às mesmas propriedades tal como a [API `v-slot`](../../api/#router-link-s-v-slot):

```js
import { RouterLink, useLink } from 'vue-router'
import { computed } from 'vue'

export default {
  name: 'AppLink',

  props: {
    // adicione @ts-ignore se estiveres a usar TypeScript
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

# Comportamento do Deslocamento

<VueSchoolLink
  href="https://vueschool.io/lessons/scroll-behavior"
  title="Aprenda a como personalizar o comportamento do deslocamento"
/>

Quando estivermos a usar o roteamento no lado do cliente, podemos querer se deslocar para o topo da página quando estivermos a navegar para uma nova rota, ou preservar a posição do deslocamento das entradas de história tal como o recarregamento original da página faz. A Vue Router permite-nos alcançar estes e ainda melhor, permite-nos personalizar completamente o comportamento do deslocamento na navegação da rota.

**Nota: esta funcionalidade apenas funciona se o navegador suportar `history.pushState`.**

Quando estiveres a criar uma instância do roteador, podes fornecer a função `scrollBehavior`:

```js
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // retornar a posição desejada
  }
})
```

A função `scrollBehavior` recebe os objetos de rota `to` e `from`, como [Guardas da Navegação](./navigation-guards.md). O terceiro argumento, `savedPosition`, apenas está disponível se esta for uma navegação `popstate` (acionada pelos botões recuar/avançar do navegador).

A função pode retornar um objeto de posição [`ScrollToOptions`](https://developer.mozilla.org/en-US/docs/Web/API/ScrollToOptions):

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // deslocar sempre para o topo
    return { top: 0 }
  },
})
```

Tu também podes passar um seletor de CSS ou um elemento do DOM através de `el`. Neste cenário, `to` e `left` serão tratados como compensações relativas a este elemento.

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // always scroll 10px above the element #main
    return {
      // could also be
      // el: document.getElementById('main'),
      el: '#main',
      top: -10,
    }
  },
})
```

Se um valor falso ou um objeto vazio for retornado, nenhum deslocamento acontecerá.

Retornar o `savedPosition` resultará em um comportamento parecido com o nativo quando navegar com os botões recuar/avançar:

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})
```

Se quiseres simular o comportamento "deslocar até a âncora":

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
      }
    }
  },
})
```

Se o teu navegador suporta [comportamento de deslocamento](https://developer.mozilla.org/en-US/docs/Web/API/ScrollToOptions/behavior), podes torná-lo suave:

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
  }
})
```

## Atrasar o deslocamento

Algumas vezes precisamos esperar um pouco antes de se deslocar na página. Por exemplo, quando lidamos com transições, queremos esperar a transição terminar antes de se deslocar. Para fazer isto podes retornar uma promessa que retorna o descritor da posição desejada. Aqui está um exemplo onde esperamos 500ms antes de se deslocar:

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ left: 0, top: 0 })
      }, 500)
    })
  },
})
```

É possível conectar isto com eventos de uma componente de transição de nível da página para fazer o comportamento do deslocamento correr bem com as transições da tua página, mas por causa da possível discrepância e complexidade em casos de uso, simplesmente fornecemos este primitivo para ativar implementações específicas do cliente.

---
sidebarDepth: 0
---

# Navegação Programática

<VueSchoolLink
  href="https://vueschool.io/lessons/vue-router-4-programmatic-navigation"
  title="Aprenda como navegar programaticamente"
/>

À parte de usar `<router-link>` para criar marcadores de âncoras para navegação declarativa, nós podemos fazer isto programaticamente usando os métodos da instância do roteador.

## Navegar para uma localização diferente

**Nota: Dentro de uma instância de Vue, tens acesso à instância do roteador como `$router`. Tu podes portanto chamar `this.$router.push`.**

Para navegar para uma URL diferente, use `router.push`. Este método empurra uma nova entrada para pilha da história, então quando os utilizadores clicarem no botão retornar ou voltar do navegador serão levados para URL anterior.

Este é o método chamado internamente quando clicas em um `<router-link>`, assim o clicar em `<router-link :to="...">` é o equivalente de chamar o `router.push(...)`.

| Declarativo               | Programático       |
| ------------------------- | ------------------ |
| `<router-link :to="...">` | `router.push(...)` |

O argumento pode ser um caminho de sequência de caracteres, ou um objeto descritor da localização. Exemplos:

```js
// caminho de sequência de caracteres literal
router.push('/users/eduardo')

// objeto com o caminho (`path`, em Inglês)
router.push({ path: '/users/eduardo' })

// rota nomeada com os parâmetros para permitir o roteador construir a URL
router.push({ name: 'user', params: { username: 'eduardo' } })

// com a consulta (`query`, em Inglês), resultando em `/register?plan=private`
router.push({ path: '/register', query: { plan: 'private' } })

// com a hash, resultando em `/about#team`
router.push({ path: '/about', hash: '#team' })
```

**Nota:** Os `params` são ignorados se um `path` for fornecido, o que não é o caso para a `query`, como mostrado no exemplo acima. Ao invés disto, precisas fornecer o `name` da rota ou manualmente especificar o `path` inteiro com qualquer parâmetro:

```js
const username = 'eduardo'
// nós podemos manualmente construir a url mas teremos que manipular nós mesmos a codificação
router.push(`/user/${username}`) // -> /user/eduardo
// o mesmo que
router.push({ path: `/user/${username}` }) // -> /user/eduardo
// se possível use `name` e `params` para beneficiar-se da codificação automática da URL
router.push({ name: 'user', params: { username } }) // -> /user/eduardo
// o `params` não pode ser usado em conjunto com do `path`
router.push({ path: '/user', params: { username } }) // -> /user
```

Quando especificares o `params`, certifica-te de fornecer tanto uma `string` ou `number` (ou um `array` destes para os [parâmetros repetitivos](./route-matching-syntax.md#repeatable-params)). **Qualquer outro tipo (como `undefined`, `false`, etc) serão automaticamente transformadas em sequências de caracteres**. Para os [parâmetros opcionais](./route-matching-syntax.md#optional-parameters), podes fornecer uma sequência de caracteres vazia (`""`) como valor para ignorá-lo.

Já que a propriedade `to` aceita o mesmo tipo de objeto que o `router.push`, as mesmíssimas regras aplicam-se à ambos os dois.

O `router.push` e todos os outros métodos de navegação retornam uma _Promessa_ que permite-nos esperar até a navegação ser terminada e saber se foi bem-sucedida ou não. Nós falaremos mais a respeito disto na [Manipulação da Navegação](../advanced/navigation-failures.md).

## Replace current location

It acts like `router.push`, the only difference is that it navigates without pushing a new history entry, as its name suggests - it replaces the current entry.

| Declarative                       | Programmatic          |
| --------------------------------- | --------------------- |
| `<router-link :to="..." replace>` | `router.replace(...)` |

It's also possible to directly add a property `replace: true` to the `routeLocation` that is passed to `router.push`:

```js
router.push({ path: '/home', replace: true })
// equivalent to
router.replace({ path: '/home' })
```

## Traverse history

<VueSchoolLink
  href="https://vueschool.io/lessons/go-back"
  title="Learn how to use Vue Router to go back"
/>

This method takes a single integer as parameter that indicates by how many steps to go forward or go backward in the history stack, similar to `window.history.go(n)`.

Examples

```js
// go forward by one record, the same as router.forward()
router.go(1)

// go back by one record, the same as router.back()
router.go(-1)

// go forward by 3 records
router.go(3)

// fails silently if there aren't that many records
router.go(-100)
router.go(100)
```

## History Manipulation

You may have noticed that `router.push`, `router.replace` and `router.go` are counterparts of [`window.history.pushState`, `window.history.replaceState` and `window.history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History), and they do imitate the `window.history` APIs.

Therefore, if you are already familiar with [Browser History APIs](https://developer.mozilla.org/en-US/docs/Web/API/History_API), manipulating history will feel familiar when using Vue Router.

It is worth mentioning that Vue Router navigation methods (`push`, `replace`, `go`) work consistently no matter the kind of [`history` option](../../api/#history) is passed when creating the router instance.

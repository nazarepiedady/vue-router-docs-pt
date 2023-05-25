---
sidebarDepth: 0
---

# Navegação Programática {#programmatic-navigation}

<VueSchoolLink
  href="https://vueschool.io/lessons/vue-router-4-programmatic-navigation"
  title="Aprenda como navegar programaticamente"
/>

À parte de usar `<router-link>` para criar marcadores de âncoras para navegação declarativa, nós podemos fazer isto programaticamente usando os métodos da instância do roteador.

## Navegar para uma Localização Diferente {#navigation-to-a-different-location}

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

## Substituir a Localização Atual {#replace-current-location}

Isto comporta-se como `router.push`, a única diferença é que ele navega sem empurrar uma nova entrada na história, como o seu nome sugeri - ele substitui a entrada atual.

| Declarativo                       | Programático          |
| --------------------------------- | --------------------- |
| `<router-link :to="..." replace>` | `router.replace(...)` |

Também é possível adicionar diretamente uma propriedade `replace: true` ao `routerLocation` que é passado para o `router.push`:

```js
router.push({ path: '/home', replace: true })
// equivalente ao
router.replace({ path: '/home' })
```

## Percorrer a História {#traverse-history}

<VueSchoolLink
  href="https://vueschool.io/lessons/go-back"
  title="Aprenda como usar a Vue Router para voltar atrás"
/>

Este método recebe um inteiro único como parâmetro que indica em quantas etapas avançar ou regressar na pilha da história, similar ao `window.history.go(n)`.

Exemplos:

```js
// avançar em um registo, o mesmo que router.forward()
router.go(1)

// regressar em um registo, o mesmo que router.back()
router.go(-1)

// avançar em 3 registos
router.go(3)

// falha silenciosamente se não existir tantos registos
router.go(-100)
router.go(100)
```

## Manipulação da História {#history-manipulation}

Tu podes ter notado que o `router.push`, `router.replace` e `router.go` são os equivalentes dos [`window.history.pushState`, `window.history.replaceState` and `window.history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History), e eles imitam as APIs da `window.history`.

Portanto, se já estiveres familiarizado com as [APIs de História do Navegador](https://developer.mozilla.org/en-US/docs/Web/API/History_API), manipular a história não será algo de outro mundo quando estiveres a usar a Vue Router.

É digno de menção que os métodos de navegação da Vue Router (`push`, `replace`, e `go`) funcionam de maneira consistente não importando o tipo de [opção de `history`](../../api/#history) é passada quando estiveres a criar a instância do roteador.

# Diferentes Modos de História

<VueSchoolLink
  href="https://vueschool.io/lessons/history-mode"
  title="Aprenda as diferenças entre o Modo de Hash e Modo de HTML5"
/>

A opção `history` quando estivermos a criar a instância do roteador permite-nos escolher entre diferentes modos de história.

## Modo de Hash

O modo hash da história é criado com `createWebHashHistory()`:

```js
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    //...
  ],
})
```

Ele usa um character de cardinal (`#`) antes da URL real que é internamente passado. Uma vez que esta seção da URL nunca é enviada para o servidor, ela não exige qualquer tratamento especial no nível do servidor. **Ele tem no entanto um impacto nocivo na SEO**. Se isto for uma preocupação para ti, use o modo HTML5 da história.

## Modo de HTML5

O modo de HTML5 é criado com `createWebHistory()` e é o modo recomendado:

```js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //...
  ],
})
```

Quando estiveres a usar `createWebHistory()`, a URL terá uma aparência "normal", por exemplo `http://example.com/user/id`. Lindo!

Temos cá um problema: Já que a nossa aplicação é uma aplicação de cliente de única página, sem a configuração de servidor apropriada, os utilizadores receberão um erro de página não encontrada 404 se acessarem `https://example.com/user/id` diretamente em seus navegadores. Agora que feito!

Não te preocupes: Para corrigir o problema, tudo o que precisas fazer é adicionar uma simples rota de resposta geral para o teu servidor. Se a URL não corresponder a quaisquer recursos estáticos, o servidor deve servir a mesma página `index.html` onde a tua aplicação reside. Lindo, novamente!

## Modo de Memória

O modo de memória da história não presume um ambiente navegador e portanto não interage com a URL **nem aciona automaticamente a navegação inicial**. Isto torna-o perfeito para ambiente da Node e SSR. Isto é criado com `createMemoryHistory()` e **exige que empurres a navegação inicial** depois da chamada de `app.use(router)`.

```js
import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    //...
  ],
})
```

Embora não seja recomendado, podes usar este modo dentro de aplicações de Navegador mas nota que **não existirá história**, querendo dizer que não serás capaz de _regressar_ ou _avançar_.

## Exemplos de Configurações de Servidor

**Nota**: Os seguintes exemplos assumem que estás a servir a tua aplicação a partir da pasta de raiz. Se implementares para uma sub-pasta, deves usar [a opção `publicPath` da Interface da Linha de Comando de Vue](https://cli.vuejs.org/config/#publicpath) e a [propriedade `base` relacionada do roteador](../../api/#createwebhistory). Tu também precisas ajustar os exemplos abaixo para usarem a sub-pasta no lugar da pasta de raiz (por exemplo, substituindo `RewriteBase /` por `RewriteBase /nome-da-tua-sub-pasta/`).

### Apache

```apacheconf
<IfModule mod_negotiation.c>
  Options -MultiViews
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

No lugar de `mod_rewrite`, poderias também usar [`FallbackResource`](https://httpd.apache.org/docs/2.2/mod/mod_dir.html#fallbackresource).

### nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Node.js Nativa

```js
const http = require('http')
const fs = require('fs')
const httpPort = 80

http
  .createServer((req, res) => {
    fs.readFile('index.html', 'utf-8', (err, content) => {
      if (err) {
        console.log('We cannot open "index.html" file.')
      }

      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
      })

      res.end(content)
    })
  })
  .listen(httpPort, () => {
    console.log('Server listening on: http://localhost:%s', httpPort)
  })
```

### Node.js com Express

Para Node.js/Express, considere usar o [intermediário `connect-history-api-fallback`](https://github.com/bripkens/connect-history-api-fallback).

### Serviços de Informação de Internet (IIS)

1. Instale [`UrlRewrite` da IIS](https://www.iis.net/downloads/microsoft/url-rewrite)
2. Crie um ficheiro `web.config` no diretório de raiz da tua aplicação com o seguinte:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Handle History Mode and custom 404/500" stopProcessing="true">
          <match url="(.*)" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

### Caddy v2

```
try_files {path} /
```

### Caddy v1

```
rewrite {
    regexp .*
    to {path} /
}
```

### Hospedagem da Firebase

Adicione isto no teu `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Netlify

Crie um ficheiro `_redirects` que é incluído com os teus ficheiros implementados em produção:

```
/* /index.html 200
```

Nos projetos da interface da linha de comando da Vue, Nuxt e Vite, este ficheiro normalmente vai sob uma pasta nomeada `static` ou `public`.

Tu podes informar-te mais a respeito da sintaxe na [documentação da Netlify](https://docs.netlify.com/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps). Tu podes também [criar um `netlify.toml`](https://docs.netlify.com/configure-builds/file-based-configuration/) para combinar os _redirecionamentos (redirections)_ com as outras funcionalidades da Netlify.

### Vercel

Crie um ficheiro `vercel.json` sob o diretório de raiz do teu projeto com o seguinte:

```json
{
  "rewrites": [{ "source": "/:path*", "destination": "/index.html" }]
}
```

## Advertência

Existe uma advertência para isto: O teu servidor não mais reportará erros de página não encontrada já que todos os caminhos não encontrados servem agora o teu ficheiro `index.html`. Para solucionar este problema, deves implementar uma rota de resposta geral dentro da tua aplicação de Vue para mostrar uma página não encontrada 404:

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/:pathMatch(.*)', component: NotFoundComponent }],
})
```

Alternativamente, se estiveres a usar um servidor de Node.js, podes implementar a função de resposta usando o roteador no lado do servidor para corresponder a URL de chegada e responder com 404 se nenhuma rota for correspondida. Consulte a [documentação da interpretação no lado do servidor da Vue](https://v3.vuejs.org/guide/ssr/introduction.html#what-is-server-side-rendering-ssr) para mais informações.

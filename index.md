---
layout: home

title: Vue Router
titleTemplate: O roteador oficial para a Vue.js

hero:
  name: Vue Router
  text: O roteador oficial para a Vue.js
  tagline: Roteamento expressivo, configurável e conveniente para a Vue.js
  image:
    src: /logo.svg
    alt: Logótipo da Vue Router
  actions:
    - theme: brand
      text: Começar
      link: /installation
    - theme: cta vueschool
      text: Curso Gratuito
      link: https://vueschool.io/courses/vue-router-4-for-everyone?friend=vuerouter&utm_source=vuerouter&utm_medium=link&utm_campaign=homepage
    - theme: cta vue-mastery
      text: Folha de Consulta da Vue Router
      link: https://www.vuemastery.com/vue-router?coupon=ROUTER-DOCS&via=eduardo

features:
  - title: 🛣 Sintaxe de rota expressiva
    details: Defina rotas dinâmicas e estáticas com uma sintaxe poderosa e intuitiva.
  - title: 🛑 Controlo de Navegação Finamente Granulado
    details: Intercete qualquer navegação e controle precisamente o seu resultado.
  - title: 🧱 Configuração Baseada em Componente
    details: Indique cada rota ao componente que deve exibir.
  - title: 🔌 Modos de História
    details: Escolha entre os modos de história da HTML5, Hash ou Memória.
  - title: 🎚 Controlo de Deslocamento
    details: Controle com precisão a posição do deslocamento dentro de cada página.
  - title: 🌐 Codificação Automática
    details: Use diretamente caracteres unicode (你好) no teu código.
---

<script setup>
import '.vitepress/theme/styles/home-links.css'
import HomeSponsors from '.vitepress/theme/components/HomeSponsors.vue'
</script>

<HomeSponsors />

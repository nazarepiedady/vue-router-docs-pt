<template>
  <div class="sponsors_outer">
    <div>
      <HomeSponsorsGroup v-if="sponsors.platinum.length" name="platinum" size="96" />

      <HomeSponsorsGroup v-if="sponsors.gold.length" name="gold" size="48" />

      <HomeSponsorsGroup v-if="sponsors.silver.length" name="silver" size="24" />

      <a
        class="become-sponsor button white"
        href="https://github.com/sponsors/posva"
      >{{ translations[site.lang] || translations.pt }}</a>
    </div>
  </div>
</template>

<script setup>
import HomeSponsorsGroup from './HomeSponsorsGroup.vue'
import sponsors from './sponsors.json'
import { useData } from 'vitepress'

const { site } = useData()

const translations = {
  'en-US': 'Become a Sponsor!',
  'zh-CN': '成为赞助者！',
  'pt-PT': 'Torna-te um Patrocinador!'
}
</script>

<style scoped>
.sponsors_outer {
  text-align: center;
  padding: 35px 20px 45px;
  background-color: var(--c-bg-accent);
  /* transition when toggling dark mode */
  transition: background-color 300ms ease-in-out, color 300ms ease-in-out;
}
</style>

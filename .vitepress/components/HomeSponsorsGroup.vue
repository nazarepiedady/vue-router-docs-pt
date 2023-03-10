<template>
  <h3>Patrocinadores {{ translateNameToPortuguese(name) }}</h3>

  <p>
    <a
      v-for="sponsor in list"
      :key="sponsor.href"
      :href="sponsor.href"
      :title="sponsor.alt"
      target="_blank"
      rel="sponsored noopener"
      class="sponsor_wrapper"
    >
      <img
        :src="sponsor.imgSrc"
        :class="
          isDark &&
          sponsor.imgSrcLight === sponsor.imgSrcDark &&
          'invert-colors'
        "
        :alt="sponsor.alt"
        :style="{ height: size + 'px' }"
      />
    </a>
  </p>
</template>

<script setup lang="ts">
import sponsors from './sponsors.json'
import { isDark } from '../theme/dark-theme'
import { computed } from 'vue'
import { useData } from 'vitepress'

const props = withDefaults(
  defineProps<{
    name: 'gold' | 'platinum' | 'silver' | 'bronze'
    size: number | string
  }>(),
  { size: 140 }
)

const isPortuguese = (): boolean => {
  const { site } = useData()
  return site.value.lang === 'pt-PT'
}

const translateNameToPortuguese = (typeName): string => {
  let sponsorsTypes = {
    gold: 'ouro',
    platinum: 'platina',
    silver: 'prata',
    bronze: 'bronze'
  }

  if (isPortuguese()) {
    return sponsorsTypes[typeName]
  } else {
    return typeName
  }

}

const list = computed(() =>
  sponsors[props.name.toLowerCase()].map(sponsor => ({
    ...sponsor,
    imgSrc: isDark.value ? sponsor.imgSrcDark : sponsor.imgSrcLight,
  }))
)
</script>

<style scoped>
.sponsor_wrapper {
  padding: 5px;
  margin: 0 3px;

  display: inline-block;
  text-decoration: none;
  vertical-align: middle;

  transition: background-color 300ms ease-in-out;
}

p {
  margin: 0;
}

h3 {
  margin: 0 0 10px;
}

img {
  transition: all 0.3s ease;
  filter: grayscale(100%);
  opacity: 0.66;
}

html:not(.light) img.invert-colors {
  filter: invert(1) grayscale(100%);
}

img:hover {
  filter: none !important;
  opacity: 1;
}
</style>

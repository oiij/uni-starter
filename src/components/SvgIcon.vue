<script setup lang='ts'>
withDefaults(defineProps<{
  prefix?: string
  name: string
  width?: number
  height?: number
  customClass?: string
}>(), {
  prefix: 'icon',
  width: 48,
  height: 48,
})
</script>

<template>
  <image
    :src="`/static/${prefix}-${name}.svg`"
    mode="aspectFit"
    :style="{ width: `${width}px`, height: `${height}px` }"
    :class="[customClass]"
  />
</template>

<style scoped lang='less'>

</style>

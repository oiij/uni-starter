<script setup lang="ts">
import { useNotify, useToast } from '@wot-ui/ui'

definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
  },
})
const toast = useToast()
const notify = useNotify()
</script>

<template>
  <WdNavbar safe-area-inset-top title="WotUi" />
  <WdToast />
  <WdNotify />
  <div class="flex-col gap-[10px] p-[10px]">
    <WdCellGroup title="WotDesignUI" border>
      <WdCell title="wdToast" clickable @click="() => toast.show('WotDesign Toast')" />
      <WdCell title="wdNotify" clickable @click="() => notify.showNotify({ message: 'WotDesign Notify', position: 'bottom' })" />
    </WdCellGroup>
    <WdButton type="success" loading>
      成功按钮
    </WdButton>
    <WdSignature />
    <div>
      <i class="i-custom-shiliu" />
      <i class="i-ri-user-fill" />
    </div>
  </div>
</template>

<style scoped lang="less">

</style>

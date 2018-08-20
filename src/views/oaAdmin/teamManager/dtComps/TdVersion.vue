<template>
  <div class="badge"
       :class="{'badge-secondary':value==='hand_writing', 'badge-info':value==='computer_generated'}">
    {{ value ? $t('general.' + value) : '-' }}
  </div>
</template>

<script>
export default {
  props: ['value']
}
</script>

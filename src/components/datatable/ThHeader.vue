<template>
  <span class="th-field">
    {{ $t(title) }}
  </span>
</template>

<script>
export default {
  props: [
    'title',
    'field'
  ]
}
</script>

<style>
.th-field {
  white-space: nowrap;
}
</style>

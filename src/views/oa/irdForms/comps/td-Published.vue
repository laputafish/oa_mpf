<template>
  <div class="text-primary">
    <i v-if="row.published" class="fa fa-check"></i>
    <i v-else class="fa fa-square-o"></i>
  </div>
</template>

<script>
export default {
  props: ['row', 'nested']
}
</script>

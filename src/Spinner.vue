<template>
<div class="spinner">
  <span>sdflksdjfljsdlkfjds</span>
  <i class="fa fa-spinner fa-spin"></i>
</div>
</template>

<script>
export default {
  name: 'spinner',
  mounted () {
    alert('mounted')
  },
  created () {
    alert('created')
  }
}
</script>

<style>
.spinner i {
  font-size: 144px;
  display: block;
}
/*[v-cloak].spinner {*/
  /*display: block;*/
/*}*/
</style>

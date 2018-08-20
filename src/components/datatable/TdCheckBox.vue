<template>
 <span>
   <i v-if="value"
      class="fa fa-check-square-o"></i>
    <i v-else
       class="fa fa-square-o"></i>
 </span>
</template>

<script>
export default {
  props: [
    'value'
  ]
}
</script>

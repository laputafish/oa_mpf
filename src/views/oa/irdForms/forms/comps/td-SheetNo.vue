<template>
  <span>
    {{ sheetNo }}
  </span>
</template>

<script>
export default {
  props: ['row'],
  computed: {
    sheetNo () {
      let vm = this
      let result = '-'
      if (vm.row.sheet_no) {
        if (vm.row.sheet_no !== 0) {
          result = vm.row.sheet_no
        }
      }
      return result
    }
  }
}
</script>

<template>
  <div class="badge"
       :class="badgeClass">
    {{ value ? $t('tax.' + value.toLowerCase()) : '-' }}
  </div>
</template>

<script>
export default {
  props: [
    'value'
  ],
  mounted () {
    console.log('TdFormType :: value: ', this.value)
  },
  computed: {
    badgeClass () {
      let vm = this
      switch (vm.value.toLowerCase()) {
        case 'commencement':
          return 'badge-primary'
        case 'departure':
          return 'badge-warning'
        case 'termination':
          return 'badge-danger'
        case 'salary':
          return 'badge-success'
        default:
          return 'badge-secondary'
      }
    }
  }
}
</script>

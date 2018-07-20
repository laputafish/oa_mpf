<template>
  <div>
    {{ joinedDate }}
  </div>
</template>

<script>
// import {EventBus} from '@/event-bus'
export default {
  data () {
    return {
      joinedDate: ''
    }
  },
  props: ['row', 'nested'],
  watch: {
    row: function (value) {
      this.updateJoinedDate()
    }
  },
  methods: {
    updateJoinedDate () {
      let vm = this
      let m = vm.$moment(vm.row.joinedDate)
      console.log(m.toString())
      vm.joinedDate = m.format('Y-MM-DD')
    }
  },
  mounted () {
    this.updateJoinedDate()
    // $(this.$el).find('button[title]').tooltip()
  }
}
</script>

<style>
</style>

<template>
  <div>
    <span :class="badgeClass" class="badge">
      {{ $t(caption) }}
    </span>
    <!--<span v-for="(step,index) in steps" :key="index">-->
      <!--<i class="fa fa-caret-right" v-if="index>0" style="margin-left:5px;"></i>-->
      <!--<span class="badge"-->
          <!--:class="{'badge-primary':row.status===step.value, 'badge-light':row.status!==step.value}">-->
      <!--{{ $t(step.captionTag) }}-->
      <!--</span>-->
    <!--</span>-->
  </div>
</template>

<script>
// import EventBus from '@/event-bus.js'

export default {
  data () {
    return {
      // steps: [
      //   {captionTag: 'general.pending', value: 'pending'},
      //   {captionTag: 'general.generating', value: 'generating'},
      //   {captionTag: 'general.ready', value: 'ready'},
      //   {captionTag: 'general.completed', value: 'completed'}
      // ]
    }
  },
  props: ['row', 'nested'],
  computed: {
    caption () {
      let vm = this
      return 'general.' + vm.row.status
    },
    badgeClass () {
      let vm = this
      switch (vm.row.status) {
        case 'pending':
          return 'badge-primary'
        case 'ready_for_processing':
        case 'generating':
        case 'processing':
        case 'terminated':
          return 'badge-danger'
        case 'ready':
          return 'badge-primary'
        case 'completed':
          return 'badge-success'
      }
      return 'badge-secondary'
    }
  }
}
</script>

<style>

</style>

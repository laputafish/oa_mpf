<template>
  <div>
    <a v-if="row.status==='ready'"
      :href="formUrl" target="_blank">
      <img :src="imgSrc" class="form-icon"/>
    </a>
    <img v-else
         :src="imgSrc" class="form-icon"/>
  </div>
</template>

<script>
// import EventBus from '@/event-bus.js'
import * as constants from '@/store/constants'

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
    imgSrc () {
      let vm = this
      switch (vm.row.status) {
        case 'ready':
          return constants.apiUrl + '/media/icons/defaults/pdf'
        case 'pending':
        case 'generating':
        default:
          return constants.apiUrl + '/media/icons/defaults/unknown'
      }
    },
    formUrl () {
      return this.row.form_url
    },
    caption () {
      let vm = this
      switch (vm.row.status) {
        case 'pending':
          return 'general.pending'
        case 'generating':
          return 'general.under_generation'
        case 'ready':
          return 'general.forms_ready'
        case 'completed':
          return 'general.completed'
      }
    },
    badgeClass () {
      let vm = this
      switch (vm.row.status) {
        case 'pending':
          return 'badge-primary'
        case 'generating':
          return 'badge-danger'
        case 'ready':
          return 'badge-primary'
        case 'completed':
          return 'badge-success'
      }
    }
  }
}
</script>

<style>
.form-icon {
  width: 24px;
  height: 24px;
}
</style>

<template>
  <div class="btn-group btn-group-sm btn-group-gap">
      <button type="button"
              :disabled="row.status==='processing'||row.status==='ready_for_processing'"
              class="btn btn-danger"
              @click="deleteRecord">
      <i class="fa fa-fw fa-close"></i>
      <!--<button class="btn btn-danger"-->
      <!--:class="{ '-nested-comp-open-btn': isDisplayRowVisible }"-->
      <!--@click="toggleNestedComp('DisplayRow')">-->
      <!--<i class="fa fa-fw fa-close"></i>-->
    </button>
  </div>
</template>
<script>
import {EventBus} from '@/event-bus'

export default {
  props: ['row', 'nested'],
  mounted () {
    // $(this.$el).find('button[title]').tooltip()
  },
  computed: {
    // confirmMessage () {
    //   return this.$t('messages.are_you_sure') + '?'
    // }
    // isDisplayRowVisible () {
    //   if (this.nested.comp !== 'DisplayRow') return
    //   return this.nested.visible
    // },
    // isFriendsTableVisible () {
    //   if (this.nested.comp !== 'FriendsTable') return
    //   return this.nested.visible
    // }
  },
  methods: {
    alertMsg (msg) {
      alert(msg)
    },
    deleteRecord () {
      let vm = this
      EventBus.$emit('commencementEmployeeDeleted', vm.row)
    },
    toggleNestedComp (comp) {
      const { nested } = this
      if (nested.comp === comp) return nested.$toggle()
      nested.$toggle(comp, true)
    }
  }
}
</script>
<style>
  .-nested-comp-open-btn {
    color: #fff !important;
    background-color: #337ab7 !important;
  }
</style>

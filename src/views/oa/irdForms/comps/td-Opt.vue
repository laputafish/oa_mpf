<template>
  <div class="btn-group btn-group-sm btn-group-gap">
    <button class="btn btn-primary" @click="editRecord">
      <i class="fa fa-fw fa-edit"></i>
    <!--<button class="btn btn-default"-->
            <!--:class="{ '-nested-comp-open-btn': isDisplayRowVisible }"-->
            <!--@click="toggleNestedComp('DisplayRow')">-->
      <!--<button class="btn btn-default" title="Display row"-->
      <!--:class="{ '-nested-comp-open-btn': isDisplayRowVisible }"-->
      <!--@click="toggleNestedComp('DisplayRow')">-->
      <!--<i class="fa fa-list-ul"></i>-->
    </button>
    <button class="btn btn-secondary"
            :disabled="row.status!=='ready'"
            @click="downloadRecord">
      <i class="fa fa-fw fa-download"></i>
      <!--<button class="btn btn-danger"-->
      <!--:class="{ '-nested-comp-open-btn': isDisplayRowVisible }"-->
      <!--@click="toggleNestedComp('DisplayRow')">-->
      <!--<i class="fa fa-fw fa-close"></i>-->
    </button>
    <button class="btn btn-danger"
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
    downloadRecord () {
      EventBus.$emit('downloadRecord', this.row)
    },
    deleteRecord () {
      let vm = this
      let options = {
        okText: vm.$t('buttons.ok'),
        cancelText: vm.$t('buttons.cancel'),
        animation: 'bounce'
      }
      vm.$dialog.confirm(vm.$t('messages.are_you_sure') + '?', options).then(function (dialogRef) {
        EventBus.$emit('deleteRecord', vm.row)
      })
    },
    editRecord () {
      EventBus.$emit('editRecord', this.row)
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

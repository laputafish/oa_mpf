<template>
  <div class="btn-group btn-group-sm btn-group-gap">
    <button class="btn btn-primary" @click="editRecord">
      <i class="fa fa-fw fa-edit"></i>
    </button>
  </div>
</template>

<script>
import {EventBus} from '@/event-bus'

export default {
  props: ['row'],
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
    editRecord () {
      EventBus.$emit('editRecord', this.row)
    }
  }
}
</script>

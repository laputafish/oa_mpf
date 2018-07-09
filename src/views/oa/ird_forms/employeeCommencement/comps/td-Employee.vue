<template>
  <div class="btn-group btn-group-sm">
    <button class="btn btn-default"
            :class="{ '-nested-comp-open-btn': isDisplayRowVisible }"
            @click="toggleNestedComp('DisplayRow')">
      <i class="fa fa-list-ul"></i>
    </button>
      <!--<button class="btn btn-default" title="Display row"-->
      <!--:class="{ '-nested-comp-open-btn': isDisplayRowVisible }"-->
      <!--@click="toggleNestedComp('DisplayRow')">-->
  </div>
</template>

<script>
// import EventBus from '@/event-bus.js'

export default {
  props: ['row', 'nested'],
  computed: {
    isDisplayRowVisible () {
      return false
    }
  }
}
</script>

<style>

</style>

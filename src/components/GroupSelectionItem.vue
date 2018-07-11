<template>
  <div class="p-1 group-selection-item pb-1 pointer d-flex flex-row align-items-start"
       @click="selectGroup">
    <span
      class="badge badge-primary"
      :style="groupBkgd(group)">{{ group.name }}</span>
  </div>
</template>

<script>
export default {
  props: {
    group: {
      type: Object,
      default () {
        return null
      }
    }
  },
  methods: {
    groupBkgd (group) {
      return {
        backgroundColor: group.color
      }
    },
    selectGroup () {
      this.$emit('onSelected', this.group)
    }
  }
}
</script>

<style>
  .group-selection-item {
    cursor: pointer;
  }
  .group-selection-item:hover {
    background-color: #28ada7;
    color: white;
  }

</style>

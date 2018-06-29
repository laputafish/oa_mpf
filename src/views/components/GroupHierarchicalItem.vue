<template>
  <li>
    <div @click="onCurrentGroupSelected()"
         :class="{'tax-group-selected':selectedGroup===groupItem}"
         class="tax-group">{{ groupItem.name }}</div>
    <ul>
    <group-hierarchical-item
        :groupItem="group"
        v-for="(group, index) in groupItem.children"
        :key="index"
        :selectedGroup="selectedGroup"
        @onGroupSelected="onGroupSelected"></group-hierarchical-item>
    </ul>
  </li>
</template>

<script>

export default {
  name: 'group-hierarchical-item',
  props: {
    selectedGroup: {
      type: Object,
      default () {
        return null
      }
    },
    groupItem: {
      type: Object,
      default () {
        return {
          name: String,
          children: []
        }
      }
    }
  },
  methods: {
    onCurrentGroupSelected () {
      console.log('GroupHierarchicalItem :: onCurrentGroupSelected')
      this.$emit('onGroupSelected', this.groupItem)
    },
    onGroupSelected (groupItem) {
      console.log('GroupHierarchicalItem :: onGroupSelected')
      this.$emit('onGroupSelected', groupItem)
    }
  }
}
</script>

<style>
  .tax-group {
    display: inline-block;
    cursor: pointer;
    color: darkgray;
    white-space: nowrap;
    background-color: transparent;
  }
  .tax-group.tax-group-selected {
    color: white;
    background-color: #28ADA7;
  }
</style>

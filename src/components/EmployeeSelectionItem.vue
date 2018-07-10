<template>
  <div class="employee-selection-item pb-1 pointer d-flex flex-row align-items-start"
    @click="selectEmployee">
    <div class="d-flex flex-row align-items-center">
      <div class="avatar">
        <img class="img-avatar b-a-1" :src="avatarSrc">
      </div>
      <span class="ml-1 mar-r mar-l text-nowrap">{{ employee.displayName }}</span>
    </div>
    <span class="ml-1 flex-grow-1" style="margin-top:0.3rem;">
      <div v-for="group in employee.groups"
           :key="group.id"
           class="badge badge-primary"
           style="margin-right: 0.25rem;"
           :style="groupBkgd(group)">
        {{ group.name }}
      </div>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    employee: {
      type: Object,
      default () {
        return null
      }
    }
  },
  computed: {
    avatarSrc () {
      if (this.employee.avatar) {
        return this.employee.avatarUrl
      } else {
        return 'https://hr.yoov.com' + this.employee.avatarUrl
      }
    }
  },
  methods: {
    groupBkgd (group) {
      return {
        backgroundColor: group.color
      }
    },
    selectEmployee () {
      this.$emit('onSelected', this.employee)
    }
  }
}
</script>

<style>
.employee-selection-item {
  cursor: pointer;
}
</style>

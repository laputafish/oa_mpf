<template>
  <div class="employee-selection-item pb-1 pointer d-flex flex-row align-items-start"
       @click="selectEmployee">
    <div v-if="false" class="d-flex flex-row align-items-center">
      <div class="avatar">
        <img class="img-avatar b-a-1" :src="avatarSrc">
      </div>
      <span class="ml-1 mar-r mar-l text-nowrap">{{ employee.displayName }}</span>
    </div>
    <span v-if="false" class="ml-1 flex-grow-1 align-self-center">
      <div v-for="group in employee.groups"
           :key="group.id"
           class="badge badge-primary"
           style="margin-right: 0.25rem;"
           :style="groupBkgd(group)">
        {{ group.name }}
      </div>
    </span>
    <div class="d-flex flex-row align-items-center">
      <div class="avatar">
        <img class="img-avatar b-a-1" :src="avatarSrc">
      </div>
      <div style="line-height: 1;">
        <table>
          <tr>
            <td>
              <span class="ml-1 mar-r mar-l text-nowrap">{{ employee.displayName }}</span><br/>
              <span class="badge badge-info" style="line-height: 8px;font-size: 10PX;margin-left:  0.25rem;">
                          {{ employee.joinedDate ? employee.joinedDate.substr(0,10) : '' }}
                          <span v-show="employee.endedDate">
                            <i class="fa fa-long-arrow-right"></i>
                            {{ employee.endedDate ? employee.endedDate.substr(0,10) : '' }}
                          </span>
                      </span>
            </td>
            <td>
              <div class="ml-1 flex-grow-1 align-self-center employee-group-list">
                <div v-for="group in employee.groups"
                     :key="group.id"
                     class="badge badge-primary"
                     style="margin-right: 0.25rem;"
                     :style="groupBkgd(group)">
                  {{ group.name }}
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
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

  .group-selection-item .badge {
    padding: 0.5rem;
  }

  .employee-selection-item .employee-group-list .badge {
    margin-bottom: 1px;
  }
</style>

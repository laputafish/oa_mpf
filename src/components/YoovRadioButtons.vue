<template>
  <div>
    <button type="button"
            :key="index"
            @click="onSelect(button)"
            v-for="(button, index) in buttons"
            :class="{'btn-primary':button[valueField]===selectedValue, 'btn-default':button[valueField]!==selectedValue}"
            class="btn btn-sm btn-width-80">
      {{ button[labelField] }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    buttons: {
      type: Array,
      default () {
        return []
      }
    },
    selectedValue: {
      type: String,
      default: ''
    },
    labelField: {
      type: String,
      default: 'label'
    },
    valueField: {
      type: String,
      default: 'value'
    }
  },
  methods: {
    onSelect (button) {
      this.$emit('click', button)
    }
  },
  mounted () {
    this.$emit('moveToLast')
  },
  watch: {
    buttons: function (value) {
      console.log('watch(buttons)')
      this.$emit('moveToLast')
    }
  }
}
</script>

<style>

</style>

<template>
  <div>
    <button type="button"
            :key="index"
            @click="onSelect(button)"
            v-for="(button, index) in buttons"
            :class="{'btn-primary':button.selected, 'btn-default':!button.selected}"
            class="btn btn-sm btn-width-80">
      {{ button[fieldName] }}
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
    fieldName: {
      type: String,
      default: ''
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

<template>
  <div class="yoov-checkbox-toggle">
    <button type="button"
            :disabled="disabled"
            class="btn btn-min-width-80"
            v-for="(option) in options"
            :key="option[optionValueField]"
            :class="{'btn-primary':selectedValues.indexOf(option[optionValueField])>=0,'btn-default':selectedValues.indexOf(option[optionValueField])<0}"
            @click="selectOption(option[optionValueField])">
      {{ optionTitleTag != '' ? $t(option[optionTitleTag]) : option[optionTitle] }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      required: true
    },
    optionTitleTag: {
      type: String,
      default: ''
    },
    optionTitle: {
      type: String,
      default: 'label'
    },
    optionValueField: {
      type: String,
      default: 'value'
    },
    value: {
      type: [String, Number]
    }
  },
  created () {
    console.log('YoovRadioToggle.created: options: ', this.options)
  },
  data () {
    return {
      selectedValues: []
    }
  },
  mounted () {
    this.selectedValues = this.value ? this.value.split(',') : []
  },
  watch: {
    'value': {
      handler: function (val) {
        this.selectedValues = val ? val.split(',') : []
      },
      deep: true
    }
  },
  methods: {
    selectOption (optionValue) {
      let vm = this
      let index = vm.selectedValues.indexOf(optionValue)
      if (index >= 0) {
        vm.selectedValues.splice(index, 1)
      } else {
        vm.selectedValues.push(optionValue)
      }
      let value = vm.selectedValues.length === 0 ? '' : vm.selectedValues.join(',')
      console.log('YoovCheckboxToggle :: selectOption :: selectedValues: ', vm.selectedValues)
      console.log('YoovCheckboxToggle :: selectOption :: value = ' + value)
      vm.$emit('input', value)
    }
  }
}
</script>

<style>
  .yoov-checkbox-toggle button {
    border-radius: 0;
    margin-right: 1px;
  }
  .yoov-checkbox-toggle button[disabled=disabled] {
    cursor: not-allowed
  }

</style>

<template>
  <div class="yoov-radio-toggle">
    <button type="button"
            :disabled="disabled"
            class="btn btn-min-width-80"
            v-for="(option) in options"
            :key="option[optionValueField]"
            :class="{'btn-primary':value===option[optionValueField],'btn-default':value!==option[optionValueField]}"
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
  watch: {
    'value': {
      handler: function (val) {
      },
      deep: true
    }
  },
  methods: {
    selectOption (optionValue) {
      this.$emit('input', optionValue)
    }
  }
}
</script>

<style>
  .yoov-radio-toggle button {
    border-radius: 0;
    margin-right: 1px;
  }
  .yoov-radio-toggle button[disabled=disabled] {
    cursor: not-allowed
  }
  .yoov-radio-toggle button:first-child {
    border-top-left-radius: 0.4rem !important;
    border-bottom-left-radius: 0.4rem !important;
  }
  .yoov-radio-toggle button:last-child {
    border-top-right-radius: 0.4rem !important;
    border-bottom-right-radius: 0.4rem !important;
  }

</style>

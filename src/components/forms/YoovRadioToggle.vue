<template>
  <div class="yoov-radio-toggle">
    <button type="button"
            class="btn btn-width-80"
            v-for="(option) in options"
            :key="option[optionValueField]"
            :class="{'btn-primary':value===option[optionValueField],'btn-default':value!==option[optionValueField]}"
            @click="selectOption(option[optionValueField])">
      {{ $t(option[optionTitleTag]) }}
    </button>
    value = {{ value }}
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    optionTitleTag: {
      type: String,
      default: ''
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
  .yoov-radio-toggle button:first-child {
    border-top-left-radius: 0.5rem !important;
    border-bottom-left-radius: 0.5rem !important;
  }
  .yoov-radio-toggle button:last-child {
    border-top-right-radius: 0.5rem !important;
    border-bottom-right-radius: 0.5rem !important;
  }

</style>

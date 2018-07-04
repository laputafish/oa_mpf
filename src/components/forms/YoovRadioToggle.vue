<template>
  <div class="yoov-radio-toggle">
    <button type="button"
            class="btn"
            :class="{'btn-primary':value===option[optionValueField],'btn-default':value!==option[optionValueField]}"
            @click="selectOption(option[optionValueField])"
      v-for="option in options"
      :key="option[optionValueField]">
      {{ $t(option[optionTitleTag]) }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => {
        return []
      }
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
      type: String
    }
  },
  watch: {
    'value': function (val) {

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

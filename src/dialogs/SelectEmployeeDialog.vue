<template>
  <b-modal :title="$t('message.please_select_department_employee')"
           class="modal-primary"
           v-model="showingModal"
           @ok="closeDialog">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
    in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </b-modal>
</template>

<script>
export default {
  data () {
    return {
      showingModal: false
    }
  },
  model: {
    prop: 'showingDialog',
    event: 'ok'
  },
  props: {
    showingDialog: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    let vm = this
    vm.showingModal = vm.showingDialog
  },
  watch: {
    showingDialog: function (value) {
      let vm = this
      vm.showingModal = vm.showingDialog
    }
  },
  methods: {
    closeDialog () {
      this.$emit('ok', false)
    }
  }

}
</script>

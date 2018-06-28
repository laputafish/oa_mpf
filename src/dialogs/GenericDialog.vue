<template>
  <yoov-modal @close="$emit('close')" v-show="modalVisible" :showModalFooter="false">
    <div slot="header" class="text-left header flex-grow-1" style="position:relative;"
      v-show="modalTitle">
      <button class="btn btn-primary pull-right"
              @click="onCloseClicked">{{ $t('buttons.close') }}
      </button>
      <h3 class="dialog-title d-inline">
        {{ modalTitle }}
      </h3>
    </div>
    <div slot="body">
      {{ modalMessage }}
    </div>
    <div slot="footer">
      <button class="btn btn-primary"
              @click="onCloseClicked">{{ $t('buttons.close') }}
      </button>
    </div>
  </yoov-modal>
</template>

<script>
import YoovModal from '@/components/Modal'

export default {
  components: {
    'yoov-modal': YoovModal
  },
  data () {
    return {}
  },
  computed: {
    modalTitle () {
      return this.$store.getters.modalTitle
    },
    modalVisible () {
      return this.$store.getters.modalVisible
    },
    modalMessage () {
      return this.$store.getters.modalMessage
    }
  },
  methods: {
    onCloseClicked () {
      this.$store.commit('hideModal')
    }

  }
}
</script>

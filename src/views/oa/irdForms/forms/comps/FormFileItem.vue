<template>
  <div class="form-file-item">
    <div class="text-center d-flex flex-column align-items-center" @click="showFileItem(documentUrl)">
      <img :src="imgSrc" class="form-file-item-icon"/>
      <small>{{ $t('tax.'+file.labelTag) }}</small>
    </div>
  </div>
</template>

<script>
import * as constants from '@/store/constants.json'

export default {
  props: {
    file: {
      type: Object
    }
  },
  computed: {
    imgSrc () {
      let vm = this
      return constants.apiUrl + '/media/icons/defaults/' + vm.file.iconType
    },
    documentUrl () {
      let vm = this
      return constants.apiUrl + vm.file.url
    },
    targetPage () {
      let vm = this
      return (vm.file.iconType === 'xml' || vm.file.iconType === 'xsd') ? '_self' : '_blank'
    }
  },
  methods: {
    showFileItem (documentUrl) {
      let vm = this
      vm.axios.post(documentUrl).then(function (response) {
        if (response.data.status) {
          // download => attachment
          // open in tab => inline
          let fetchType = (vm.file.iconType === 'xml' || vm.file.iconType === 'xsd') ? 'download' : 'show'
          window.open(constants.apiUrl + '/temp/' + response.data.key + '/' + fetchType, vm.targetPage)
        }
      })
    }
  }
}
</script>

<style>
  .form-file-item {
    display: inline-block;
    padding: 2px 10px;
    min-width: 60px;
  }
  .form-file-item .form-file-item-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  .form-file-item:hover {
    cursor: pointer;
  }
</style>

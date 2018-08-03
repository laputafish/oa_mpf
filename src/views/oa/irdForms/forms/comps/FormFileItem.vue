<template>
  <div class="form-file-item">
    <div class="text-center d-flex flex-column">
      <a :href="documentUrl" :target="targetPage">
        <img :src="imgSrc" class="form-file-item-icon"/>
      </a>
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
</style>

<template>
  <yoov-modal id="yoovImageDialog">
    <div slot="header" class="text-left header flex-grow-1" style="position:relative;">
      <button class="btn btn-primary pull-right"
              @click="$emit('close')">Close
      </button>
      <h3 class="dialog-title d-inline">
        {{ title }}
      </h3>
    </div>
    <div slot="body">
      <img :src="imageSrc"/>
    </div>
    <div slot="footer">
      <button class="btn btn-primary"
              @click="$emit('close')">Close
      </button>
    </div>
  </yoov-modal>
</template>

<script>
import * as constants from '@/store/constants'
import YoovModal from '@/components/Modal'

export default {
  components: {
    'yoov-modal': YoovModal
  },
  props: {
    imageUrl: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Image'
    }
  },
  computed: {
    imageSrc () {
      return constants.apiUrl + this.imageUrl
    }
  }
}
</script>

<style>
  #yoovImageDialog .modal-wrapper {
    vertical-align: top;
  }

  #yoovImageDialog .modal-container {
    margin-top: 80px;
    width: 1000px;
    max-width: 90%;
  }

  #yoovImageDialog .modal-container img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  #yoovImageDialog .modal-container .modal-body {
    max-height: 600px;
    overflow-y: scroll;
  }

</style>

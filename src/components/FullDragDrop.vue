<template>
  <div class="full-drag-drop">
    <div class="upload">
      <table v-if="files.length">
        <tr v-for="(file) in files" :key="file.id">
          <td>{{file.name}}</td> -
          <td>{{file.size | formatSize}}</td> -
          <td v-if="file.error">{{file.error}}</td>
          <td v-else-if="file.success">success</td>
          <td v-else-if="file.active">active</td>
          <td v-else-if="file.active">active</td>
          <td v-else></td>
        </tr>
      </table>
      <table v-else>
        <tr>
          <td>
            <div class="text-center p-2">
              <h4>Drop files anywhere to upload<br/>or</h4>
              <label for="file" class="btn btn-lg btn-primary">Select Files</label>
            </div>
          </td>
        </tr>
      </table>

      <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
        <h3>Drop files to upload</h3>
      </div>

      <div class="example-btn" style="">
        <file-upload
          class="btn btn-primary"
          :post-action="uploadUrl"
          :multiple="true"
          accept="true"
          :drop="true"
          :drop-directory="true"
          v-model="files"
          ref="upload">
          <i class="fa fa-plus"></i>
          Select files
        </file-upload>
        <button type="button" class="btn btn-success" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
          <i class="fa fa-arrow-up" aria-hidden="true"></i>
          Start Upload
        </button>
        <button type="button" class="btn btn-danger"  v-else @click.prevent="$refs.upload.active = false">
          <i class="fa fa-stop" aria-hidden="true"></i>
          Stop Upload
        </button>
      </div>
    </div>
  </div>
</template>
<style>
  .full-drag-drop {
    background-color: lightgray;
  }

  .full-drag-drop label.btn {
    margin-bottom: 0;
    margin-right: 1rem;
  }

  .full-drag-drop .drop-active {
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    position: fixed;
    z-index: 9999;
    opacity: .6;
    text-align: center;
    background: #000;
  }

  .full-drag-drop .drop-active h3 {
    margin: -.5em 0 0;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    font-size: 40px;
    color: #fff;
    padding: 0;
  }

  .full-drag-drop .upload > table {
    width: 100%;
  }
</style>

<script>
import * as constants from '@/store/constants'
import FileUpload from 'vue-upload-component'

export default {
  components: {
    'file-upload': FileUpload
  },
  data () {
    return {
      files: []
    }
  },
  computed: {
    uploadUrl () {
      return constants.apiUrl + '/media/upload'
    }
  },
  watch: {
    '$refs.upload.uploaded': function (newValue, oldValue) {
      if (newValue) {
        alert('uploaded')
      }
    }
  }
}
</script>

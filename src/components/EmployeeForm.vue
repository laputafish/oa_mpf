<template>
  <div class="employee-form">
    <div class="employee-form-image-wrapper">
      <img class="employee-form-image" :src="formSrc"/>
    </div>
    <div class="form-title">
      {{ form.fiscalYear }}
      <!--<div class="fiscal-year badge badge-primary">{{ form.fiscalYear }}</div>-->
    </div>
  </div>
</template>

<script>
import * as constants from '@/store/constants'

export default {
  props: {
    form: {
      type: Object,
      default () {
        return {
          employeeFormId: '',
          fiscalYear: '',
          formCode: '',
          status: 'pending',
          formDescription: ''
        }
      }
    }
    /*
        employeeFormId: '1-1',
        fiscalYear: '05/06',
        formCode: 'IR56B',
        status: 'ready', //
        formDescription: '薪酬申報表格'
     */
  },
  computed: {
    formSrc () {
      let vm = this
      let irdFormCode = 0
      // if (vm.form.status === 'ready') {
      //   irdFormCode = vm.form.employeeFormId
      // }
      irdFormCode = vm.form.status === 'ready' ? '1' : '0'
      let url = constants.apiUrl + '/ird_forms/' + irdFormCode
      return url
    }
  }
}
</script>

<style>
  .employee-form {
    display: inline-block;
    width: 200px;
    margin-bottom: 20px;
  }
  .employee-form .employee-form-image-wrapper {
    text-align: center;
  }
  .employee-form .employee-form-image {
    width: 120px;
    max-height: 160px;
    object-fit: contain;
  }
  .employee-form .form-title {
    text-align: center;
    position: relative;
    padding-top: 5px;
  }
  .employee-form .form-title .fiscal-year {
    display: inline-block;
    position: absolute;
  }

</style>

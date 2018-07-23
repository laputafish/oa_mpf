<template>
  <div class="animated fadeIn" id="my-ird-forms">
    <b-card>
      <div slot="header" >
        <!--<div class="btn-group btn-group-gap">-->
          <!--<button type="button"-->
                  <!--@click="showSettings"-->
                  <!--class="pull-right btn btn-outline-primary">-->
            <!--<i class="fa fa-gear"></i>&nbsp;{{ $t('buttons.settings') }}-->
          <!--</button>-->
        <!--</div>-->
        {{ $t($route.name) }}
      </div>
      <div>
        <employee-form v-for="(form,index) in forms"
                       :form="form"
                       :key="index"></employee-form>
      </div>
    </b-card>
  </div>
</template>

<script>
import EmployeeForm from '@/components/EmployeeForm'

export default {
  components: {
    'employee-form': EmployeeForm
  },
  data () {
    return {
      forms: []
    }
  },
  mounted () {
    let vm = this
    vm.forms = [
      {
        employeeFormId: '1-1',
        fiscalYear: '05/06',
        formCode: 'IR56B',
        status: 'ready', //
        formDescription: '薪酬申報表格'
      },
      {
        employeeFormId: '1-1',
        fiscalYear: '06/07',
        formCode: 'IR56B',
        status: 'ready', //
        formDescription: '薪酬申報表格'
      },
      {
        employeeFormId: '1-1',
        fiscalYear: '05/06',
        formCode: 'IR56B',
        status: 'ready', //
        formDescription: '薪酬申報表格'
      },
      {
        employeeFormId: '1-1',
        fiscalYear: '06/07',
        formCode: 'IR56B',
        status: 'ready', //
        formDescription: '薪酬申報表格'
      },
      {
        employeeFormId: '1-1',
        fiscalYear: '05/06',
        formCode: 'IR56B',
        status: 'ready', //
        formDescription: '薪酬申報表格'
      },
      {
        employeeFormId: '1-1',
        fiscalYear: '06/07',
        formCode: 'IR56B',
        status: 'ready', //
        formDescription: '薪酬申報表格'
      },
      {
        employeeFormId: '1-1',
        fiscalYear: '07/08',
        formCode: 'IR56B',
        status: 'ready', //
        formDescription: '薪酬申報表格'
      }
    ]
  }
}
</script>

<style>
  #my-ird-forms .card-header > div {
    position: relative;
  }

  #my-ird-forms .card-header div div.btn-group {
    position: absolute;
    top: -1px;
    right: -5px;
  }
</style>

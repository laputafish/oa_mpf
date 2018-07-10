<template>
  <div style="position:relative;">
    <div class="row">
      <div class="col-sm-12">
        <div class="btn-group btn-group-gap pull-right">
          <button type="button" class="btn btn-width-80 btn-primary"
                  @click="saveRecord">{{ $t('buttons.submit') }}</button>
          <button type="button" class="btn btn-width-80 btn-default"
                  @click="cancel">{{ $t('buttons.cancel') }}</button>
        </div>
      </div>
    </div>
    <hr/>
    <div class="row">
      <div class="col-sm-6">
        <div class="form-group row">
          <label class="col-sm-4 col-form-label" for="formDate">{{ $t('tax.form_date') }}</label>
          <div class="col-sm-8">
            <date-picker v-model="form.form_date"
                         id="formDate"
                         type="date" format="YYYY-MM-DD"></date-picker>
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="form-group row">
          <label class="col-sm-4 col-form-label" for="formDate">{{ $t('general.status') }}</label>
          <div class="col-sm-8">
            <input type="text" readonly class="form-control" id="status" :value="form.status">
          </div>
        </div>
      </div>
    </div>
    <div class="for-group row">
      <label class="col-sm-12 col-form-label">{{ $t('general.employees') }}</label>
    </div>
    <hr/>
    <employee-table :employees="form.employees"></employee-table>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import EmployeeTable from './EmployeeTable'

export default {
  components: {
    'date-picker': DatePicker,
    'employee-table': EmployeeTable
  },
  data () {
    return {
      form: {
        type: Object,
        default () {
          return {
            form_date: null
          }
        }
      }
    }
  },
  props: {
    record: {
      type: Object,
      default: function () {
        return null
      }
    }
  },
  mounted () {
    console.log('CommencementForm mounted: record: ', this.record)
    if (this.record) {
      this.form = JSON.parse(JSON.stringify(this.record))
    }
  },
  watch: {
    record: function (value) {
      console.log('CommencementForm watch: record: ', value)
      if (value) {
        this.form = JSON.parse(JSON.stringify(value))
      }
    }
  },
  methods: {
    saveRecord (record) {
      this.$emit('onModeChanged', 'list')
    },
    cancel () {
      this.$emit('onModeChanged', 'list')
    }
  }
}
</script>

<style>

</style>

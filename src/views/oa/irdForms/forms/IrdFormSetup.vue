<template>
  <div id="ird-form-setup" style="position:relative;">
    <div class="row">
      <div class="col-sm-12 text-right">
        <button type="button"
                @click="save"
                class="btn btn-outline-success">
          <i class="fa fa-disk"></i>
          {{ $t('buttons.save') }}
        </button>
      </div>
    </div>
    <hr/>
    <div class="row" v-show="loading">
      <div class="col-sm-12 text-center">
        <div class="ird-form-setup-spinner">
          <i class="fa fa-spinner fa-spin"></i>
        </div>
      </div>
    </div>
    <div class="row" v-show="!loading">
      <div class="col-sm-12">
        <table style="width:100%;">
          <tr>
            <td style="width:160px; border-right: 1px solid lightgray;padding-right:10px;vertical-align:top;">
              <div class="option-group-list">
                <ul>
                  <li>
                    <div key="basic"
                         @click="activeOptionGroup='basic'"
                         :class="{'active':activeOptionGroup==='basic'}"
                         class="option-group-button">
                      <div class="border-0 rounded-2 title-container form-control ">
                        {{ $t('general.basic') }}
                      </div>
                    </div>
                  </li>
                  <!--<li>-->
                    <!--<div key="apply"-->
                         <!--@click="activeOptionGroup='salary_apply_computerized_form'"-->
                         <!--:class="{'active':activeOptionGroup==='salary_apply_computerized_form'}"-->
                         <!--class="option-group-button">-->
                      <!--<div class="border-0 rounded-2 title-container form-control">-->
                        <!--{{ $t('tax.apply_for_computerized_ir56b')}}-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</li>-->
                  <li>
                    <div key="salary">
                      <div class="border-0 rounded-2 title-container form-control ">
                        {{ $t('tax.salary_form_ir56b')}}
                      </div>
                    </div>
                    <ul style="padding-left: 40px;">
                      <li>
                        <div key="salary"
                             @click="activeOptionGroup='ir56b_income_mapping'"
                             :class="{'active':activeOptionGroup==='ir56b_income_mapping'}"
                             class="option-group-button">
                          <div class="border-0 rounded-2 title-container form-control ">
                            {{ $t('tax.income_field_mapping') }}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>                  <li>
                  <div key="salary">
                    <div class="border-0 rounded-2 title-container form-control ">
                      {{ $t('tax.salary_form_ir56f')}}
                    </div>
                  </div>
                  <ul style="padding-left: 40px;">
                    <li>
                      <div key="salary"
                           @click="activeOptionGroup='ir56f_income_mapping'"
                           :class="{'active':activeOptionGroup==='ir56f_income_mapping'}"
                           class="option-group-button">
                        <div class="border-0 rounded-2 title-container form-control ">
                          {{ $t('tax.income_field_mapping') }}
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                </ul>
                <!--<div v-for="button in optionGroupButtons"-->
                <!--:key="button.value"-->
                <!--@click="activeOptionGroup=button.value"-->
                <!--:class="{'bg-primary':activeOptionGroup===button.value, 'bg-default':activeOptionGroup!==button.value}"-->
                <!--class="border-0 rounded-2 form-control option-group-button">-->
                <!--{{ $t(button.captionTag) }}-->
                <!--</div>-->
              </div>
            </td>
            <td>
              <!-- ****************************************** -->
              <!--               Basic Setting                -->
              <!-- ****************************************** -->
              <div v-if="activeOptionGroup==='basic'" class="table-striped">
                <!-- Languages -->
                <div class="form-group row">
                  <label class="text-sm-right col-sm-4 col-form-label" for="signatureName">
                    {{ $t('general.language') }}
                  </label>
                  <div class="col-sm-8">
                    <yoov-radio-toggle
                      :options="languageOptions"
                      optionTitleTag="titleTag"
                      v-model="settings.langId">
                    </yoov-radio-toggle>
                  </div>
                </div>

                <!-- File No -->
                <div class="form-group row">
                  <label class="text-sm-right col-sm-4 col-form-label" for="fileNo">{{ $t('tax.employer_file_no')
                    }}*</label>
                  <div class="col-sm-8">
                    <input v-model="settings.fileNo"
                           name="fileNo"
                           id="fileNo"
                           class="form-control max-width-300"
                           :class="{'border-danger':errors.has('fileNo')}"
                           type="text"/>
                    <span class="error"
                          v-if="errors.has('fileNo')">{{ $t('messages.employer_file_no_is_required') }}</span>
                  </div>
                </div>

                <!-- Signature Name -->
                <div class="form-group row">
                  <label class="text-sm-right col-sm-4 col-form-label" for="signatureName">{{ $t('tax.signature_name')
                    }}</label>
                  <div class="col-sm-8">
                    <input v-model="settings.signatureName"
                           name="signatureName"
                           id="signatureName"
                           class="form-control max-width-300"
                           :class="{'border-danger':errors.has('signatureName')}"
                           type="text"/>
                    <span class="error"
                          v-if="errors.has('designation')">{{ $t('messages.signature_name_is_required') }}</span>
                  </div>
                </div>

                <!-- Designation -->
                <div class="form-group row">
                  <label class="text-sm-right col-sm-4 col-form-label" for="designation">{{
                    $t('tax.signature_designation') }}</label>
                  <div class="col-sm-8 co-md-7 co-lg-6">
                    <input v-model="settings.designation"
                           name="designation"
                           id="designation"
                           class="form-control max-width-300"
                           :class="{'border-danger':errors.has('designation')}"
                           type="text"/>
                    <span class="error"
                          v-if="errors.has('designation')">{{ $t('messages.designation_is_required') }}</span>
                  </div>
                </div>
              </div>

              <!-- ****************************************** -->
              <!--      IR56B Income particular mapping       -->
              <!-- ****************************************** -->
              <table v-if="activeOptionGroup==='ir56b_income_mapping'" class="table-striped" style="width: 100%;">
                <tr v-for="item in settings.ir56bIncomes"
                    :key="item.id">
                  <td class="particular-label salary-item" v-tooltip="$t('tax.'+item.name_tag)">{{ $t('tax.' +
                    item.name_tag) }}
                  </td>
                  <td>
                    <input v-if="item.is_default"
                           type="text"
                           readonly
                           class="form-control-plaintext bg-lightgray text-darkgray px-2 border"
                           :value="$t(item.description_tag)">
                    <v-select v-else
                              multiple
                              label="code"
                              v-model="item.pay_types"
                              :options="payTypes">
                      <template slot="option"
                                slot-scope="option">
                        <span>[{{ option.code }}]&nbsp;{{ option.name }}</span>
                      </template>
                    </v-select>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <hr/>
                    <h6 class="remark">* {{ $t('tax.others_placed_in_salary') }}</h6>
                  </td>
                </tr>

              </table>

              <!-- ****************************************** -->
              <!--      IR56F Income particular mapping       -->
              <!-- ****************************************** -->
              <table v-if="activeOptionGroup==='ir56f_income_mapping'" class="table-striped" style="width: 100%;">
                <tr v-for="item in settings.ir56fIncomes"
                    :key="item.id">
                  <td class="particular-label salary-item" v-tooltip="$t('tax.'+item.name_tag)">{{ $t('tax.' +
                    item.name_tag) }}
                  </td>
                  <td>
                    <input v-if="item.is_default"
                           type="text"
                           readonly
                           class="form-control-plaintext bg-lightgray text-darkgray px-2 border"
                           :value="$t(item.description_tag)">
                    <v-select v-else
                              multiple
                              label="code"
                              v-model="item.pay_types"
                              :options="payTypes">
                      <template slot="option"
                                slot-scope="option">
                        <span>[{{ option.code }}]&nbsp;{{ option.name }}</span>
                      </template>
                    </v-select>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <hr/>
                    <h6 class="remark">* {{ $t('tax.others_placed_in_salary') }}</h6>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import * as constants from '@/store/constants'

import YoovRadioToggle from '@/components/forms/YoovRadioToggle'
import YoovCheckboxToggle from '@/components/forms/YoovCheckboxToggle'
import vSelect from 'vue-select'
import DatePicker from 'vue2-datepicker'
import myMixin from '@/appHelpers'

export default {
  name: 'ird-form-setup',
  mixins: [myMixin],
  data () {
    return {
      loading: true,
      optionGroupButtons: [
        {captionTag: 'general.basic', value: 'basic'},
        {captionTag: 'tax.salary_form', value: 'salary'}
      ],
      activeOptionGroup: 'basic',
      settings: {
        langId: 0,
        fileNo: '',
        designation: '',
        signatureName: '',
        ir56bIncomes: [],
        ir56fIncomes: []
      }
      // ,
      // languageOptions: [
      //   // {
      //   //   id: 0,
      //   //   titleTag: 'general.user_customed',
      //   //   value: 'user_customed'
      //   // },
      //   {
      //     id: 1,
      //     titleTag: 'general.chinese',
      //     value: 'zh-hk'
      //   },
      //   {
      //     id: 2,
      //     titleTag: 'general.english',
      //     value: 'en-us'
      //   }
      // ]
    }
  },
  components: {
    'yoov-radio-toggle': YoovRadioToggle,
    'yoov-checkbox-toggle': YoovCheckboxToggle,
    'v-select': vSelect,
    'date-picker': DatePicker,
    'update': 0
  },
  methods: {
    save () {
      let vm = this
      let ir56bIncomes = []
      let ir56fIncomes = []
      let i
      let particular

      // IR56B
      for (i = 0; i < vm.settings.ir56bIncomes.length; i++) {
        particular = vm.settings.ir56bIncomes[i]
        ir56bIncomes.push({
          id: particular.id,
          name: particular.name,
          pay_type_ids: particular.pay_types.map(payType => payType.id)
        })
      }

      // IR56F
      for (i = 0; i < vm.settings.ir56fIncomes.length; i++) {
        particular = vm.settings.ir56fIncomes[i]
        ir56fIncomes.push({
          id: particular.id,
          name: particular.name,
          pay_type_ids: particular.pay_types.map(payType => payType.id)
        })
      }

      // save
      let data = {
        langId: vm.settings.langId,
        fileNo: vm.settings.fileNo,
        designation: vm.settings.designation,
        signatureName: vm.settings.signatureName,
        ir56bIncomes: ir56bIncomes,
        ir56fIncomes: ir56fIncomes,
        teamId: vm.teamId
      }
      // console.log('onOkClicked >> UPDATE_TAX_FORM_SETTINGS  data:', data)
      vm.$store.dispatch('UPDATE_TAX_FORM_SETTINGS', data).then(function (response) {
        console.log('UPDATE_INCOME: response: ', response)
        if (response.status) {
          vm.$emit('close')
        } else {
          vm.$dialog.alert({
            title: 'Warning',
            message: response.message
          })
        }
      })
    },
    // generate () {
    //   let vm = this
    //   let data = {
    //     lang: vm.sample.language, // en-us
    //     formCode: 'IR56B',
    //     formDate: vm.sample.formDate
    //   }
    //   vm.$store.dispatch('GENERATE_SAMPLE_FORM', data).then(function (response) {
    //     vm.$dialog.alert('Generation will be ready soon.')
    //   }).catch(function (error) {
    //     console.log('TaxFormSettingsDialog :: generate :: error: ', error)
    //   })
    // },

    getIcon (document) {
      return this.getIconByFileType(document.fileType)
    },
    getIconByFileType (fileType) {
      return constants.apiUrl + '/media/icons/defaults/' + fileType
    },
    setIr56bIncomes (incomeParticulars) {
      let vm = this
      if (typeof incomeParticulars === 'undefined') {
        incomeParticulars = vm.$store.getters.ir56bIncomes
      }
      let userParticulars = []
      if (vm.payTypes) {
        let data = incomeParticulars
        for (var i = 0; i < data.length; i++) {
          var item = data[i]
          userParticulars.push({
            id: item.id,
            is_default: item.is_default,
            description_tag: item.description_tag,
            name: item.name,
            name_tag: item.name_tag,
            pay_type_ids: item.pay_type_ids,
            pay_types: vm.payTypes
              ? vm.payTypes.filter(payType => {
                return item.pay_type_ids.indexOf(payType.id) >= 0
              })
              : []
          })
        }
        console.log('computed(ir56bIncomes) :: userParticulars: ', userParticulars)
      }
      vm.settings.ir56bIncomes = userParticulars
    },

    setIr56fIncomes (incomeParticulars) {
      let vm = this
      if (typeof incomeParticulars === 'undefined') {
        incomeParticulars = vm.$store.getters.ir56fIncomes
      }
      let userParticulars = []
      if (vm.payTypes) {
        let data = incomeParticulars
        for (var i = 0; i < data.length; i++) {
          var item = data[i]
          userParticulars.push({
            id: item.id,
            is_default: item.is_default,
            description_tag: item.description_tag,
            name: item.name,
            name_tag: item.name_tag,
            pay_type_ids: item.pay_type_ids,
            pay_types: vm.payTypes
              ? vm.payTypes.filter(payType => {
                return item.pay_type_ids.indexOf(payType.id) >= 0
              })
              : []
          })
        }
        console.log('computed(ir56fIncomes) :: userParticulars: ', userParticulars)
      }
      vm.settings.ir56fIncomes = userParticulars
    },

    // onSelectPayType (item, payTypes) {
    //   let vm = this
    //   vm.$store.dispatch('UPDATE_INCOME_PARTICULAR_PAYTYPES', {
    //     id: item.id,
    //     payTypes: payTypes
    //   })
    // },
    // onOkClicked () {
    //   let vm = this
    //   let particulars = []
    //
    //   let particular
    //   for (var i = 0; i < vm.settings.ir56bIncomes.length; i++) {
    //     particular = vm.settings.ir56bIncomes[i]
    //     particulars.push({
    //       id: particular.id,
    //       name: particular.name,
    //       pay_type_ids: particular.pay_types.map(payType => payType.id)
    //     })
    //   }
    //
    //   // save
    //   let data = {
    //     langId: vm.settings.langId,
    //     ir56bIncomes: particulars,
    //     teamId: vm.teamId
    //   }
    //   console.log('onOkClicked >> UPDATE_TAX_FORM_SETTINGS  data:', data)
    //   vm.$store.dispatch('UPDATE_TAX_FORM_SETTINGS', data).then(function (response) {
    //     console.log('UPDATE_INCOME: response: ', response)
    //     if (response.status) {
    //       vm.$emit('close')
    //     } else {
    //       vm.$dialog.alert({
    //         title: 'Warning',
    //         message: response.message
    //       })
    //     }
    //   })
    // },
    loadData () {
      let vm = this
      vm.loading = true
      vm.$store.dispatch('FETCH_PAY_TYPES').then(function (payTypes) {
        vm.$store.dispatch('FETCH_TEAM')
        console.log('loadData after FETCH_PAY_TYPES :: payTypes: ', payTypes)
        vm.$store.dispatch('FETCH_TAX_FORM_SETTINGS').then(function (result) {
          vm.setIr56bIncomes(result.ir56b_incomes)
          vm.setIr56fIncomes(result.ir56f_incomes)

          vm.settings.langId = result.langId
          vm.settings.fileNo = result.fileNo
          vm.settings.designation = result.designation
          vm.settings.signatureName = result.signatureName

          vm.loading = false

          // console.log('loadData after FETCH_IR56B_INCOMES :: particulars: ', particulars)
          // let item
          // let payTypeIdArray
          // for (var i = 0; i < particulars.length; i++) {
          //   item = particulars[i]
          //   payTypeIdArray = item.pay_type_ids
          //   vm.ir56bIncomes.push({
          //     id: item.id,
          //     is_default: item.is_default,
          //     description_tag: item.description_tag,
          //     name: item.name,
          //     pay_types: payTypes.filter(payType => {
          //       return payTypeIdArray.indexOf(payType.id) >= 0
          //     })
          //   })
          // }
        })
      })
    }
  },
  computed: {
    languageOptions () {
      let result = this.$store.getters.languageOptions
      return result
    },

    // 'applySoftcopies': '',
    // 'applyPrintedForms': '',
    selectedSoftcopyItems () {
      let vm = this
      let result = []
      let selectedItems = vm.sample.applySoftcopies.split(',')
      if (vm.softcopyItems) {
        for (var i = 0; i < vm.softcopyItems.length; i++) {
          var item = vm.softcopyItems[i]
          if (item['essential'] || selectedItems.indexOf(item['value']) >= 0) {
            result.push(item)
          }
        }
      }
      return result
    },
    selectedPrintedFormItems () {
      let vm = this
      let result = []
      let selectedSoftcopyItems = vm.sample.applySoftcopies.split(',')
      let selectedPrintedFormItems = vm.sample.applyPrintedForms.split(',')
      if (vm.printedFormItems) {
        for (var i = 0; i < vm.printedFormItems.length; i++) {
          var item = vm.printedFormItems[i]
          if (item['essential'] ||
            selectedSoftcopyItems.indexOf(item['value']) >= 0 ||
            selectedPrintedFormItems.indexOf(item['value']) >= 0) {
            result.push(item)
          }
        }
      }
      return result
    },
    xxincomeParticulars () {
      return this.$store.getters.ir56bIncomes
      // let vm = this
      // let userParticulars = []
      // if (vm.payTypes) {
      //   let data = this.$store.getters.ir56bIncomes
      //   for (var i = 0; i < data.length; i++) {
      //     var item = data[i]
      //     userParticulars.push({
      //       id: item.id,
      //       is_default: item.is_default,
      //       description_tag: item.description_tag,
      //       name: item.name,
      //       pay_type_ids: item.pay_type_ids,
      //       pay_types: vm.payTypes
      //         ? vm.payTypes.filter(payType => {
      //           return item.pay_type_ids.indexOf(payType.id) >= 0
      //         })
      //         : []
      //     })
      //   }
      //   console.log('computed(ir56bIncomes) :: userParticulars: ', userParticulars)
      // }
      // return userParticulars
    },
    oaTeam () {
      return this.$store.getters.oaTeam
    },
    teamId () {
      return this.$store.getters.teamId
    },
    payTypes () {
      let result = []
      let payType = null
      for (var i = 0; i < this.$store.getters.payTypes.length; i++) {
        payType = this.$store.getters.payTypes[i]
        result.push({
          id: payType.id,
          code: payType.code,
          name: payType.name
        })
      }
      console.log('computed.payTypes: ', result)
      return result
    }
  },
  watch: {
    ir56bIncomes: function (val) {
      this.setIr56bIncomes()
    },
    teamId: function (val) {
      alert('watch(teamId)')
      this.loadData()
    }
  },
  mounted () {
    // alert('mounted :: teamId = ' + this.teamId)
    let vm = this
    vm.loadData()
    // vm.sample.fiscal_start_year = vm.getCurrentFiscalStartYear()
    // vm.sample.formDate = vm.$moment().format('YYYY-MM-DD')
    // vm.necessaryDocuments = [
    //   {
    //     caption: vm.$t('tax._necessary_documents_item_1_'),
    //     type: 'inline',
    //     fileType: 'pdf',
    //     link: constants.apiUrl + '/media/forms/ir56b/apply_letter'
    //   },
    //   {
    //     caption: vm.$t('tax._necessary_documents_item_2_'),
    //     type: 'download',
    //     fileType: 'xml',
    //     link: constants.apiUrl + '/media/forms/ir56b/xml'
    //   },
    //   {
    //     caption: vm.$t('tax._necessary_documents_item_3_'),
    //     type: 'inline',
    //     fileType: 'pdf',
    //     link: constants.apiUrl + '/media/forms/ir56b/samples'
    //   },
    //   {
    //     caption: vm.$t('tax._necessary_documents_item_4_'),
    //     type: 'inline',
    //     fileType: 'pdf',
    //     link: constants.apiUrl + '/media/forms/ir56b/control_list'
    //   }
    // ]
  }
}
</script>

<style>
  #ird-form-setup .particular-label {
    max-width: 240px;
    width: 160px;
    overflow-x: hidden;
    padding: 7px 10px 0 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  #ird-form-setup .salary-item.particular-label:hover {
    background-color: rgba(30, 132, 127, .2);
    border-radius: 0.4rem;
    padding: 0 10px;
  }

  .bg-lightgray {
    background-color: rgba(0, 0, 0, .05);
  }

  .text-darkgray {
    color: darkgray;
  }

  .field-mapping-title {
    text-align: center;
    padding: 2px 0;
    background-color: #1E847F;
    color: white;
  }

  #ird-form-setup .option-group-list ul {
    list-style-type: none;
    padding: 0;
  }

  #ird-form-setup .option-group-list .option-group-button.active {
    color: #1c7974 !important;
  }

  #ird-form-setup .option-group-list .option-group-button > .title-container {
    background-color: transparent;
  }

  #ird-form-setup .option-group-list .option-group-button {
    text-align: left;
    white-space: nowrap;
  }

  #ird-form-setup .option-group-list .option-group-button.active > .title-container {
    display: inline-block;
    background-color: #28ada7 !important;
    color: white;
  }

  #ird-form-setup .option-group-list .option-group-button.active:hover > .title-container {
    background-color: #1c7974 !important;
  }

  #ird-form-setup .option-group-list .option-group-button:hover {
    cursor: pointer;
    background-color: rgba(30, 132, 127, .2);
    color: white;
  }

  /*#tax-form-settings-dialog .option-group-list .option-group-button.active:hover {*/
  /*background-color: #1c7974 !important;*/
  /*color:white*/
  /*}*/
  #ird-form-setup table tr td {
    vertical-align: top;
  }

  #ird-form-setup .modal-body input[type=search] {
    width: 100px !important;
  }

  #ird-form-setup .mx-input-append > .mx-calendar-icon {
    width: 100%;
    height: auto !important;
  }

  #ird-form-setup .requirement-list-table th {
    text-align: center;
  }
  #ird-form-setup .requirement-list-table th,
  #ird-form-setup .requirement-list-table td {
    padding: 0 15px;
    vertical-align: top;
  }

  #ird-form-setup .requirement-list-table .badge {
    white-space: initial;
    line-height: 1.2;
  }

  #ird-form-setup .requirement-list-table td.col-50 {
    width: 50%;
    vertical-align: top;
    text-align: left;
  }

  #ird-form-setup .requirement-list-table .item-list-table {
    width: 100%;
    border-width: 2px;
    border-style: solid;
    margin-bottom: 1px;
  }

  #ird-form-setup .employer-info-badge td {
    vertical-align: middle;
  }

  #ird-form-setup .employer-info-badge {
    min-width: 240px;
  }

  #ird-form-setup .employer-info-badge tr td:last-child {
    text-align: left;
  }

  #ird-form-setup .employer-info-badge tr td:first-child {
    text-align: right;
    font-size: 1.2em;
    line-height: 1.4;
  }

  #ird-form-setup .employer-info-badge tr td {
    padding: 0 10px;
  }

  #ird-form-setup .softcopy-col .item-list-table {
    min-height: 96px;
  }

  #ird-form-setup .printed-form-col .item-list-table {
    min-height: 180px;
  }

  #ird-form-setup .printed-form-col .item-list-table table {
    width: auto;
  }
  #ird-form-setup .requirement-list-table .document-icon {
    width: 16px;
    height: 16px;
  }

  #ird-form-setup .ird-form-setup-spinner {
    text-align: center;
    font-size: 48px;
    display: inline-block;
    vertical-align: middle;
  }

  #ird-form-setup .remark {
    color: darkgray;
    padding-left: 10px;
  }
</style>

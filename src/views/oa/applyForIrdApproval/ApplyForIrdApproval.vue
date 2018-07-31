<template>
  <div class="animated fadeIn mx-3" id="apply-for-ird-approval">
    <b-card>
      <div slot="header" class="row">
        <div class="col-sm-4">
          {{ $t('tax.apply_for_computerized_form_approval') }}
        </div>
        <div class="col-sm-4 text-center" style="min-height: 28px;">
          <div v-show="fieldDisabled">
            <i class="fa fa-spinner fa-spin"></i>&nbsp;{{ $t('general.' + sample.status)}}
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="col-sm-4 text-right">
          <div class="btn-group btn-group-gap" style="margin-bottom: -5px;">
            <!-- Button: Settings -->
            <button type="button"
                    @click="generate"
                    class="pull-right btn btn-outline-primary">
              <i class="fa fa-reply"></i>&nbsp;{{ $t('buttons.generate_necessary_documents') }}
            </button>
            <button type="button"
                    @click="save"
                    class="pull-right btn btn-outline-primary">
              <i class="fa fa-reply"></i>&nbsp;{{ $t('buttons.save') }}
            </button>
            <!--<button type="button"-->
            <!--@click="showSettings"-->
            <!--class="pull-right btn btn-outline-primary">-->
            <!--<i class="fa fa-gear"></i>&nbsp;{{ $t('buttons.settings') }}-->
            <!--</button>-->
          </div>
        </div>
      </div>
      <!-- ****************************************** -->
      <!-- Apply for submission of computerized forms -->
      <!-- ****************************************** -->
      <div>
        <div class="row">
          <div class="col-sm-6">
            <table style="width: 100%;">
              <tr><td></td><td></td></tr>
              <!-- Company Name -->
              <tr>
                <td class="particular-label">
                  {{ $t('tax.company_name') }}
                </td>
                <td>
                  <input
                    class="form-control-plaintext" v-model="sample.company_name"/>
                </td>
              </tr>
              <!-- Tel No. -->
              <tr>
                <td class="particular-label">
                  {{ $t('tax.tel_no') }}
                </td>
                <td>
                  <input v-validate="'required'"
                         :disabled="fieldDisabled"
                         name="tel_no"
                         :class="{'border-danger':errors.has('tel_no')}"
                         class="form-control" v-model="sample.tel_no"/>
                </td>
              </tr>
              <!-- Signature Name -->
              <tr>
                <td class="particular-label">
                  {{ $t('tax.signature_name') }}
                </td>
                <td>
                  <input v-validate="'required'"
                         :disabled="fieldDisabled"
                         name="signature_name"
                         :class="{'border-danger': errors.has('signature_name')}"
                         class="form-control" v-model="sample.signature_name"/>
                </td>
              </tr>
              <!-- Designation -->
              <tr>
                <td class="particular-label">
                  {{ $t('tax.designation') }}
                </td>
                <td>
                  <input v-validate="'required'"
                         :disabled="fieldDisabled"
                         name="designation"
                         :class="{'border-danger':errors.has['designation']}"
                         class="form-control" v-model="sample.designation"/>
                </td>
              </tr>
              <!-- Language -->
              <tr>
                <td class="particular-label">
                  {{ $t('general.language') }}
                </td>
                <td>
                  <yoov-radio-toggle
                    :disabled="fieldDisabled"
                    :options="languages"
                    optionTitle="name"
                    optionValueField="id"
                    v-model="sample.lang_id">
                  </yoov-radio-toggle>
                </td>
              </tr>
            </table>
          </div>
          <div class="col-sm-6">
            <table style="width: 100%;">
              <!-- Status -->
              <tr>
                <td class="particular-label">
                  {{ $t('general.status') }}
                </td>
                <td>
                  <input class="form-control-plaintext" :value="$t('general.' + sample.status)">
                </td>
              </tr>
              <!-- Company file no. -->
              <tr>
                <td class="particular-label">
                  {{ $t('tax.company_file_no') }}
                </td>
                <td>
                  <input class="form-control-plaintext" v-model="sample.company_file_no">
                </td>
              </tr>
              <!-- Application Date -->
              <tr>
                <td class="particular-label">
                  {{ $t('tax.application_date') }}
                </td>
                <td>
                  <date-picker
                    :disabled="fieldDisabled"
                    v-model="sample.application_date"
                    id="formDate"
                    type="date"
                    format="YYYY-MM-DD"></date-picker>
                </td>
              </tr>
              <!-- Update previously approval -->
              <tr>
                <td class="particular-label">
                  {{ $t('tax.update_previously_approval') }}
                </td>
                <td>
                  <yoov-radio-toggle
                    :disabled="fieldDisabled"
                    :options="[{label: $t('general.yes'), value:1},{label: $t('general.no'), value:0}]"
                    v-model="sample.is_update">
                  </yoov-radio-toggle>
                </td>
              </tr>
            </table>
          </div><!-- col 2 -->
        </div><!-- end of row -->
        <div class="row">
          <div class="col-sm-12">
            <table>
              <tr>
                <td class="particular-label">
                  {{ $t('tax.apply_for_approval_of_printed_forms') }}
                </td>
                <td>
                  <yoov-checkbox-toggle
                    :disabled="fieldDisabled"
                    :options="printedFormOptions"
                    v-model="sample.apply_printed_forms">
                  </yoov-checkbox-toggle>
                </td>
              </tr>
              <tr>
                <td class="particular-label">
                  {{ $t('tax.apply_for_approval_of_softcopy') }}
                </td>
                <td>
                  <yoov-checkbox-toggle
                    :disabled="fieldDisabled"
                    :options="softcopyOptions"
                    v-model="sample.apply_softcopies">
                  </yoov-checkbox-toggle>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <hr/>
        <!-- *****************-->
        <!-- Requirement List -->
        <!-- *****************-->
        <div style="position:relative;">
          <!--<button type="button" class="btn-sm btn btn-primary pull-right"-->
                  <!--@click="generate">-->
            <!--{{ $t('buttons.build_necessary_documents') }}-->
          <!--</button>-->
          <h4 class="text-center">
            {{ $t('tax.required_items_for_submission') }}
          </h4>
        </div>
        <hr/>
        <table class="requirement-list-table" style="width: 100%;">
          <thead>
          <tr>
            <th class="col-50">
              軟複本檔案
            </th>
            <th class="col-50">
              紙張印本
            </th>
          </tr>
          </thead>
          <tr>
            <td class="col-50 softcopy-col">
              <div class="badge badge-primary">需要儲存在可攜儲存裝置 (一隻磁碟/唯讀光碟(CD-ROM/DVD-ROM)/USB儲存裝置，並在其貼上標籤，註明偏主名稱，偏主檔案號碼及有關的課稅年度，以便記認。</div>
              <div  class="item-list-table rounded-2 border-1 border-info">
                <table>
                  <tr v-for="(item,index) in selectedSoftcopyItems"
                      :key="index">
                    <td>
                      <img v-if="sample.status !== 'ready'"
                           class="form-icon" :src="getIconByFileType('unknown')">
                      <a v-else
                         href="http://yoovapi/apiv2/media/sample_forms/3/239" target="_blank">
                        <img :src="getIconByFileType('pdf')" class="form-icon">
                      </a>
                    </td>
                    <td>{{ item['label'] }}</td>
                  </tr>
                </table>
              </div>
              <div class="text-left">
                <table class="employer-info-badge rounded-2 badge badge-info">
                  <tr>
                    <td class="label-in-badge">{{ $t('tax.employer_name') }}</td>
                    <td>{{ oaTeam ? oaTeam.name : '' }}</td>
                  </tr>
                  <tr>
                    <td class="label-in-badge">{{ $t('tax.company_file_no') }}</td>
                    <td>{{ oaTeam ? oaTeam.setting.registrationNumber : ''}}</td>
                  </tr>
                  <tr>
                    <td class="label-in-badge">{{ $t('tax.fiscal_years') }}</td>
                    <td>{{ fiscalYears(sample.fiscal_start_year) }}</td>
                  </tr>
                </table>
              </div>
            </td>
            <td class="col-50 printed-form-col">
              <div class="item-list-table rounded-2 border-1 border-info flex-grow-1">
                <table>
                  <tr v-for="(item,index) in selectedPrintedFormItems"
                      :key="index">
                    <td>
                      <img v-if="sample.status !== 'ready'"
                           class="form-icon" :src="getIconByFileType('unknown')">
                      <a v-else
                         href="http://yoovapi/apiv2/media/sample_forms/3/239" target="_blank">
                        <img :src="getIconByFileType('pdf')" class="form-icon">
                      </a>
                    </td>
                    <td>{{ item['label'] }}</td>
                  </tr>
                  <tr v-if="!selectedPrintedFormItems || selectedPrintedFormItems.length === 0">
                    <td class="text-center">
                      <br/><br/><br/>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </b-card>
  </div>
</template>

<script>
import * as constants from '@/store/constants'

import YoovRadioToggle from '@/components/forms/YoovRadioToggle'
import YoovCheckboxToggle from '@/components/forms/YoovCheckboxToggle'
import vSelect from 'vue-select'
import DatePicker from 'vue2-datepicker'
import myMixin from '@/appHelpers'
import helpers from '@/helpers.js'

export default {
  components: {
    'yoov-radio-toggle': YoovRadioToggle,
    'yoov-checkbox-toggle': YoovCheckboxToggle,
    'v-select': vSelect,
    'date-picker': DatePicker,
    'update': 0
  },
  name: 'apply-for-ird-approval',
  mixins: [myMixin],
  data () {
    return {
      necessaryDocuments: [],
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
      // ],
      sample: {
        'company_name': '',
        'tel_no': '',
        'signature_name': '',
        'lang_id': 0,
        'company_file_no': '',
        'application_date': '',
        'designation': '',
        'is_update': 0,

        'apply_softcopies': '',
        'apply_printed_forms': '',
        'fiscal_start_year': 2017
      },
      softcopyOptions: [
        {label: 'IR56B', value: 'ir56b'},
        {label: 'IR56M', value: 'ir56m'}
      ],
      printedFormOptions: [
        {label: 'IR56E', value: 'ir56e'},
        {label: 'IR56F', value: 'ir56f'},
        {label: 'IR56G', value: 'ir56g'},
        {label: 'IR56M', value: 'ir56m'}
      ],
      softcopyItems: [
        {label: 'IR56B 測試數據', value: 'ir56b', processing: true},
        {label: 'IR56M 測試數據', value: 'ir56m', processing: false}
      ],
      printedFormItems: [
        {label: '申請書', value: '0', essential: true, processing: false},
        // Soft
        {label: 'IR56B 測試數據紙張印本其中三份', value: 'ir56b', type: 'soft', processing: false},
        {label: 'IR56B 測試數據核對表 (所有測試數據)', value: 'ir56b', type: 'soft', processing: false},
        {label: 'IR56M 測試數據紙張印本其中三份', value: 'ir56m', type: 'soft', processing: false},
        {label: 'IR56M 測試數據核對表 (所有測試數據)', value: 'ir56m', type: 'soft', processing: false},
        // Print
        {label: 'IR56E 測試數據紙張印本三份', value: 'ir56e', type: 'print', processing: false},
        {label: 'IR56F 測試數據紙張印本三份', value: 'ir56f', type: 'print', processing: false},
        {label: 'IR56G 測試數據紙張印本三份', value: 'ir56g', type: 'print', processing: false},
        {label: 'IR56M 測試數據紙張印本三份', value: 'ir56m', type: 'print', processing: false}
      ]
    }
  },
  methods: {
    onFormStatusUpdated (data) {
      let statusInfo = data.statusInfo
      let formId = statusInfo.formId.toString()
      let status = statusInfo.status

      console.log('Pusher :: received: form#' + formId + ' (status=' + status + ')')
      this.updateFormStatus(formId, status)
    },
    onFormItemStatusUpdated (data) {
      let statusInfo = data.statusInfo
      let formId = statusInfo.formId.toString()
      let employeeId = statusInfo.employeeId.toString()
      let status = statusInfo.status
      this.updateFormEmployeeStatus(formId, employeeId, status)
      console.log('Pusher (formEmployee) :: form#' + formId + ' employee#' + employeeId + ' (status=' + status + ')')
      // let formId = statusInfo.formId.toString()
      // let status = statusInfo.status
      //
      // console.log('onEmployeeStatusUpdated :: data: ', data)
    },
    subscribe () {
      let vm = this
      helpers.subscribe(vm, vm.teamId, [
        {channel: 'ird_request_form_status_updated', handler: vm.onFormStatusUpdated},
        {channel: 'ird_request_form_item_status_updated', handler: vm.onFormItemStatusUpdated}
      ])
    },
    fiscalYears (startYear) {
      return startYear ? startYear.toString().substr(-2) + '/' + (startYear + 1).toString().substr(-2) : ''
    },
    generate () {
      let vm = this
      vm.$validator.validateAll()
      vm.$nextTick(function () {
        if (!vm.errors.any()) {
          let config = vm.sample
          vm.$store.dispatch('GENERATE_IRD_REQUEST_FORM', config).then(function (response) {
            vm.$dialog.alert(vm.$t('messages.generation_will_be_ready_soon'), {
              okText: vm.$t('buttons.close')
            })
            vm.sample.status = 'ready_for_processing'
          }).catch(function (error) {
            console.log('TaxFormSettingsDialog :: generate :: error: ', error)
          })
        } else {
          alert('has error')
        }
      })
    },
    save () {
      let vm = this

      vm.$validator.validateAll()
      vm.$nextTick(function () {
        if (!vm.errors.any()) {
          let config = vm.sample
          vm.$store.dispatch('UPDATE_APPROVAL_REQUEST_FORM', config).then(function (response) {
            vm.$dialog.alert(vm.$t('general.save_successfully') + '!', {
              okText: vm.$t('buttons.close')
            })
          }).catch(function (error) {
            console.log('TaxFormSettingsDialog :: generate :: error: ', error)
          })
        } else {
          alert('has error')
        }
      })
    },
    getIcon (document) {
      return this.getIconByFileType(document.fileType)
    },
    getIconByFileType (fileType) {
      return constants.apiUrl + '/media/icons/defaults/' + fileType
    },
    // onSelectPayType (item, payTypes) {
    //   let vm = this
    //   vm.$store.dispatch('UPDATE_INCOME_PARTICULAR_PAYTYPES', {
    //     id: item.id,
    //     payTypes: payTypes
    //   })
    // },
    onOkClicked () {
      let vm = this
      let particulars = []

      let particular
      for (var i = 0; i < vm.settings.inputParticulars.length; i++) {
        particular = vm.settings.inputParticulars[i]
        particulars.push({
          id: particular.id,
          name: particular.name,
          pay_type_ids: particular.pay_types.map(payType => payType.id)
        })
      }

      // save
      let data = {
        lang: vm.settings.language,
        incomeParticulars: particulars,
        teamId: vm.teamId
      }
      console.log('onOkClicked >> UPDATE_TAX_FORM_SETTINGS  data:', data)
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
    loadData () {
      let vm = this
      vm.$store.dispatch('FETCH_PAY_TYPES').then(function (payTypes) {
        vm.$store.dispatch('FETCH_TEAM')
      })
    },
    update (oaTeam) {
      let vm = this
      if (vm.sample.fiscal_start_year === 0) {
        vm.sample.fiscal_start_year = vm.getCurrentFiscalStartYear()
      }
      if (vm.sample.application_date === '') {
        vm.sample.application_date = vm.$moment().format('YYYY-MM-DD')
      }
      if (oaTeam) {
        if (vm.sample.company_file_no === '') {
          vm.sample.company_file_no = vm.oaTeam.setting.registrationNumber
        }
        if (vm.sample.company_name === '') {
          vm.sample.company_name = vm.oaTeam.name
        }
      }
    }
  },
  computed: {
    fieldDisabled () {
      let vm = this
      return vm.sample.status === 'ready_for_processing' || vm.sample.status === 'processing'
    },
    // 'apply_softcopies': '',
    // 'apply_printed_forms': '',
    languages () {
      return this.$store.getters.languages
    },
    selectedSoftcopyItems () {
      let vm = this
      let result = []
      if (vm.sample.apply_softcopies) {
        let selectedItems = vm.sample.apply_softcopies.split(',')
        if (vm.softcopyItems) {
          for (var i = 0; i < vm.softcopyItems.length; i++) {
            var item = vm.softcopyItems[i]
            var valid = item.type ? (item.type === 'soft') : true
            if ((item['essential'] || selectedItems.indexOf(item['value']) >= 0) && valid) {
              result.push(item)
            }
          }
        }
      }
      return result
    },
    selectedPrintedFormItems () {
      let vm = this
      let result = []
      if (vm.sample.apply_softcopies) {
        let selectedSoftcopyItems = vm.sample.apply_softcopies.split(',')
        let selectedPrintedFormItems = vm.sample.apply_printed_forms.split(',')
        if (vm.printedFormItems) {
          for (var i = 0; i < vm.printedFormItems.length; i++) {
            var item = vm.printedFormItems[i]
            // var valid = item.type ? (item.type === 'print') : true
            if (item['essential'] ||
              (selectedSoftcopyItems.indexOf(item['value']) >= 0 && item['type'] === 'soft') ||
              (selectedPrintedFormItems.indexOf(item['value']) >= 0 && item['type'] === 'print')) {
              if (item['value'] === 'ir56m') {
                if (
                  (selectedSoftcopyItems.indexOf('ir56m') >= 0) &&
                  (selectedPrintedFormItems.indexOf('ir56m') >= 0)
                ) {
                  if (item['type'] === 'soft') {
                    result.push(item)
                  }
                } else {
                  result.push(item)
                }
              } else {
                result.push(item)
              }
            }
          }
        }
      }
      return result
    },
    xxincomeParticulars () {
      return this.$store.getters.incomeParticulars
      // let vm = this
      // let userParticulars = []
      // if (vm.payTypes) {
      //   let data = this.$store.getters.incomeParticulars
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
      //   console.log('computed(incomeParticulars) :: userParticulars: ', userParticulars)
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
    incomeParticulars: function (val) {
      this.setInputParticulars()
    },
    teamId: function (val) {
      this.loadData()
    },
    oaTeam: function (val) {
      let vm = this
      vm.update(val)
    }
  },
  created () {
    this.$store.dispatch('FETCH_LANGUAGES')
  },
  beforeDestroy () {
    helpers.unSubscribe(this)
  },
  mounted () {
    // alert('mounted :: teamId = ' + this.teamId)
    let vm = this
    vm.subscribe()
    vm.loadData()
    vm.$store.dispatch('FETCH_SAMPLE_FORM').then(function (response) {
      vm.sample = response
      vm.update(vm.oaTeam)
    })

    vm.necessaryDocuments = [
      {
        caption: vm.$t('tax._necessary_documents_item_1_'),
        type: 'inline',
        fileType: 'pdf',
        link: constants.apiUrl + '/media/forms/ir56b/apply_letter'
      },
      {
        caption: vm.$t('tax._necessary_documents_item_2_'),
        type: 'download',
        fileType: 'xml',
        link: constants.apiUrl + '/media/forms/ir56b/xml'
      },
      {
        caption: vm.$t('tax._necessary_documents_item_3_'),
        type: 'inline',
        fileType: 'pdf',
        link: constants.apiUrl + '/media/forms/ir56b/samples'
      },
      {
        caption: vm.$t('tax._necessary_documents_item_4_'),
        type: 'inline',
        fileType: 'pdf',
        link: constants.apiUrl + '/media/forms/ir56b/control_list'
      }
    ]
  }
}
</script>

<style>
  #apply-for-ird-approval .particular-label {
    max-width: 240px;
    width: 160px;
    overflow-x: hidden;
    padding: 7px 10px 0 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  #apply-for-ird-approval .salary-item.particular-label:hover {
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

  #apply-for-ird-approval .option-group-list ul {
    list-style-type: none;
    padding: 0;
  }

  #apply-for-ird-approval .option-group-list .option-group-button.active {
    color: #1c7974 !important;
  }

  #apply-for-ird-approval .option-group-list .option-group-button > .title-container {
    background-color: transparent;
  }

  #apply-for-ird-approval .option-group-list .option-group-button {
    text-align: left;
    white-space: nowrap;
  }

  #apply-for-ird-approval .option-group-list .option-group-button.active > .title-container {
    display: inline-block;
    background-color: #28ada7 !important;
    color: white;
  }

  #apply-for-ird-approval .option-group-list .option-group-button.active:hover > .title-container {
    background-color: #1c7974 !important;
  }

  #apply-for-ird-approval .option-group-list .option-group-button:hover {
    cursor: pointer;
    background-color: rgba(30, 132, 127, .2);
    color: white;
  }

  /*#tax-form-settings-dialog .option-group-list .option-group-button.active:hover {*/
  /*background-color: #1c7974 !important;*/
  /*color:white*/
  /*}*/
  #apply-for-ird-approval table tr td {
    vertical-align: top;
  }

  #apply-for-ird-approval .modal-body input[type=search] {
    width: 100px !important;
  }

  #apply-for-ird-approval .mx-input-append > .mx-calendar-icon {
    width: 100%;
    height: auto !important;
  }

  #apply-for-ird-approval .requirement-list-table th {
    text-align: center;
  }
  #apply-for-ird-approval .requirement-list-table th,
  #apply-for-ird-approval .requirement-list-table td {
    padding: 0 15px;
    vertical-align: top;
  }

  #apply-for-ird-approval .requirement-list-table .badge {
    white-space: initial;
    line-height: 1.2;
  }

  #apply-for-ird-approval .requirement-list-table td.col-50 {
    width: 50%;
    vertical-align: top;
    text-align: left;
  }

  #apply-for-ird-approval .requirement-list-table .item-list-table {
    width: 100%;
    border-width: 2px;
    border-style: solid;
    margin-bottom: 1px;
  }

  #apply-for-ird-approval .employer-info-badge td {
    vertical-align: middle;
  }

  #apply-for-ird-approval .employer-info-badge {
    min-width: 240px;
  }

  #apply-for-ird-approval .employer-info-badge tr td:last-child {
    text-align: left;
  }

  #apply-for-ird-approval .employer-info-badge tr td:first-child {
    text-align: right;
    font-size: 1.2em;
    line-height: 1.4;
  }

  #apply-for-ird-approval .employer-info-badge tr td {
    padding: 0 10px;
  }

  #apply-for-ird-approval .softcopy-col .item-list-table {
    min-height: 96px;
  }

  #apply-for-ird-approval .printed-form-col .item-list-table {
    min-height: 180px;
  }

  #apply-for-ird-approval .printed-form-col .item-list-table table {
    width: auto;
  }
  #apply-for-ird-approval .item-list-table .form-icon {
    width: 24px;
    height: 24px;
  }
</style>

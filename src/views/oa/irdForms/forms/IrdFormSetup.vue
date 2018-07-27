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
    <div class="row">
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
                  <li>
                    <div key="apply"
                         @click="activeOptionGroup='salary_apply_computerized_form'"
                         :class="{'active':activeOptionGroup==='salary_apply_computerized_form'}"
                         class="option-group-button">
                      <div class="border-0 rounded-2 title-container form-control">
                        {{ $t('tax.apply_for_computerized_ir56b')}}
                      </div>
                    </div>
                  </li>
                  <li>
                    <div key="salary">
                      <div class="border-0 rounded-2 title-container form-control ">
                        {{ $t('tax.salary_form_ir56b')}}
                      </div>
                    </div>
                    <ul style="padding-left: 40px;">
                      <li>
                        <div key="salary"
                             @click="activeOptionGroup='salary_income_mapping'"
                             :class="{'active':activeOptionGroup==='salary_income_mapping'}"
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
              <table v-if="activeOptionGroup==='basic'" class="table-striped">
                <tr>
                  <td class="particular-label">
                    {{ $t('general.language') }}
                  </td>
                  <td>
                    <yoov-radio-toggle
                      :options="languageOptions"
                      optionTitleTag="titleTag"
                      v-model="settings.language">

                    </yoov-radio-toggle>
                  </td>
                </tr>
              </table>
              <!-- ****************************************** -->
              <!--         Income particular mapping          -->
              <!-- ****************************************** -->
              <table v-if="activeOptionGroup==='salary_income_mapping'" class="table-striped" style="width: 100%;">
                <tr v-for="item in settings.inputParticulars"
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
              </table>
              <!-- ****************************************** -->
              <!-- Apply for submission of computerized forms -->
              <!-- ****************************************** -->
              <div v-if="activeOptionGroup==='salary_apply_computerized_form'">
                <table style="width: 100%;">
                  <tr>
                    <td class="particular-label">
                      {{ $t('general.language') }}
                    </td>
                    <td>
                      <yoov-radio-toggle
                        :options="languageOptions"
                        optionTitleTag="titleTag"
                        v-model="sample.language">
                      </yoov-radio-toggle>
                    </td>
                  </tr>
                  <tr>
                    <td class="particular-label">
                      {{ $t('tax.apply_for_approval_of_softcopy') }}
                    </td>
                    <td>
                      <yoov-checkbox-toggle
                        :options="softcopyOptions"
                        v-model="sample.applySoftcopies">
                      </yoov-checkbox-toggle>
                    </td>
                  </tr>
                  <tr>
                    <td class="particular-label">
                      {{ $t('tax.apply_for_approval_of_printed_forms') }}
                    </td>
                    <td>
                      <yoov-checkbox-toggle
                        :options="printedFormOptions"
                        v-model="sample.applyPrintedForms">
                      </yoov-checkbox-toggle>
                    </td>
                  </tr>
                  <tr>
                    <td class="particular-label">
                      {{ $t('tax.update_previously_approval') }}
                    </td>
                    <td>
                      <yoov-radio-toggle
                        :options="[{label: $t('general.yes'), value:1},{label: $t('general.no'), value:0}]"
                        v-model="sample.is_update">
                      </yoov-radio-toggle>
                    </td>
                  </tr>
                  <tr>
                    <td class="particular-label">
                      {{ $t('tax.form_date') }}
                    </td>
                    <td>
                      <date-picker v-model="sample.formDate"
                                   id="formDate"
                                   type="date"
                                   format="YYYY-MM-DD"></date-picker>
                    </td>
                  </tr>
                </table>
                <hr/>
                <!-- *****************-->
                <!-- Requirement List -->
                <!-- *****************-->
                <div style="position:relative;">
                  <button type="button" class="btn-sm btn btn-primary pull-right"
                          @click="generate">
                    {{ $t('buttons.build_necessary_documents') }}
                  </button>
                  <h4>
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
                            <td><img class="document-icon" :src="getIconByFileType('pdf')"></td>
                            <td>{{ item['label'] }}</td>
                          </tr>
                        </table>
                      </div>
                      <div class="text-left">
                        <table class="employer-info-badge rounded-2 badge badge-info">
                          <tr>
                            <td class="label-in-badge">僱主名稱</td>
                            <td>{{ oaTeam.name }}</td>
                          </tr>
                          <tr>
                            <td class="label-in-badge">僱主檔案號碼</td>
                            <td>{{ oaTeam.setting.registrationNumber }}</td>
                          </tr>
                          <tr>
                            <td class="label-in-badge">課稅年度</td>
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
                            <td><img class="document-icon" :src="getIconByFileType('pdf')"></td>
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
      necessaryDocuments: [],
      optionGroupButtons: [
        {captionTag: 'general.basic', value: 'basic'},
        {captionTag: 'tax.salary_form', value: 'salary'}
      ],
      activeOptionGroup: 'basic',
      settings: {
        language: 'en-us',
        inputParticulars: []
      },
      languageOptions: [
        // {
        //   id: 0,
        //   titleTag: 'general.user_customed',
        //   value: 'user_customed'
        // },
        {
          id: 1,
          titleTag: 'general.chinese',
          value: 'zh-hk'
        },
        {
          id: 2,
          titleTag: 'general.english',
          value: 'en-us'
        }
      ],
      sample: {
        'language': 'en-us',
        'formDate': '',
        'applySoftcopies': '',
        'applyPrintedForms': '',
        'is_update': 0,
        'sample.fiscal_start_year': 2017
      },
      softcopyOptions: [
        {label: 'IR56B', value: 'soft_ir56b'},
        {label: 'IR56M', value: 'soft_ir56m'}
      ],
      printedFormOptions: [
        {label: 'IR56E', value: 'print_ir56e'},
        {label: 'IR56F', value: 'print_ir56f'},
        {label: 'IR56G', value: 'print_ir56g'},
        {label: 'IR56M', value: 'print_ir56m'}
      ],
      softcopyItems: [
        {label: 'IR56B 測試數據', value: 'soft_ir56b'},
        {label: 'IR56M 測試數據', value: 'soft_ir56m'}
      ],
      printedFormItems: [
        {label: '申請書', value: '0', essential: true},
        {label: 'IR56B 測試數據紙張印本其中三份', value: 'soft_ir56b'},
        {label: 'IR56B 測試數據核對表 (所有測試數據)', value: 'soft_ir56b'},
        {label: 'IR56M 測試數據紙張印本其中三份', value: 'soft_ir56m'},
        {label: 'IR56M 測試數據核對表 (所有測試數據)', value: 'soft_ir56m'},
        {label: 'IR56E 測試數據紙張印本三份', value: 'print_ir56e'},
        {label: 'IR56F 測試數據紙張印本三份', value: 'print_ir56f'},
        {label: 'IR56G 測試數據紙張印本三份', value: 'print_ir56g'},
        {label: 'IR56M 測試數據紙張印本三份', value: 'print_ir56m'}
      ]
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
    fiscalYears (startYear) {
      return startYear.toString().substr(-2) + '/' + (startYear + 2).toString().substr(-2)
    },
    save () {
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
    generate () {
      let vm = this
      let data = {
        lang: vm.sample.language,
        formCode: 'IR56B',
        formDate: vm.sample.formDate
      }
      vm.$store.dispatch('GENERATE_SAMPLE_FORM', data).then(function (response) {
        vm.$dialog.alert('Generation will be ready soon.')
      }).catch(function (error) {
        console.log('TaxFormSettingsDialog :: generate :: error: ', error)
      })
    },

    getIcon (document) {
      return this.getIconByFileType(document.fileType)
    },
    getIconByFileType (fileType) {
      return constants.apiUrl + '/media/icons/defaults/' + fileType
    },
    setInputParticulars (incomeParticulars) {
      let vm = this
      if (typeof incomeParticulars === 'undefined') {
        incomeParticulars = vm.$store.getters.incomeParticulars
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
        console.log('computed(incomeParticulars) :: userParticulars: ', userParticulars)
      }
      vm.settings.inputParticulars = userParticulars
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
        console.log('loadData after FETCH_PAY_TYPES :: payTypes: ', payTypes)
        vm.$store.dispatch('FETCH_TAX_FORM_SETTINGS').then(function (result) {
          vm.setInputParticulars(result.income_particulars)
          vm.settings.lang = result.lang
          // console.log('loadData after FETCH_INCOME_PARTICULARS :: particulars: ', particulars)
          // let item
          // let payTypeIdArray
          // for (var i = 0; i < particulars.length; i++) {
          //   item = particulars[i]
          //   payTypeIdArray = item.pay_type_ids
          //   vm.inputParticulars.push({
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
      return result
    }
  },
  watch: {
    incomeParticulars: function (val) {
      this.setInputParticulars()
    },
    teamId: function (val) {
      this.loadData()
    }
  },
  mounted () {
    // alert('mounted :: teamId = ' + this.teamId)
    let vm = this
    vm.sample.fiscal_start_year = vm.getCurrentFiscalStartYear()
    vm.loadData()
    vm.sample.formDate = vm.$moment().format('YYYY-MM-DD')
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
</style>

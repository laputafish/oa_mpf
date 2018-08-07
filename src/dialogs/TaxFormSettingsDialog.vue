<template>
  <yoov-modal id="tax-form-settings-dialog" @close="$emit('close')" :modalSizeClass="'modal-size-lg'">
    <div slot="header" class="text-left header flex-grow-1" style="position:relative;">
      <!--<button class="btn btn-primary pull-right"-->
      <!--@click="onCloseClicked">{{ $t('buttons.close') }}-->
      <!--</button>-->
      <h3 class="dialog-title d-inline">{{ $t('tax.tax_form_settings') }}</h3>
    </div>
    <div slot="body" class="container" style="padding:0;">
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
                    <li>
                      <div key="salary"
                           @click="activeOptionGroup='salary_apply_computerized_form'"
                           :class="{'active':activeOptionGroup==='salary_apply_computerized_form'}"
                           class="option-group-button">
                        <div class="border-0 rounded-2 title-container form-control">
                          {{ $t('tax.apply_for_computerized_ir56b')}}
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
            <table v-if="activeOptionGroup==='salary_income_mapping'" class="table-striped" style="width: 100%;">
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
            </table>
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
              <table style="width: 100%;">
                <tr>
                  <td class="particular-label">
                    {{ $t('tax.required_items') }}
                    <button type="button" class="btn-sm btn btn-primary"
                            @click="generate">
                      {{ $t('buttons.build_necessary_documents') }}
                    </button>
                    <ol>
                      <li :key="document.caption" v-for="document in necessaryDocuments">
                        {{ document.caption }}
                        <a :href="document.link">
                          <img :src="getIcon(document)">
                        </a>
                      </li>
                    </ol>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div slot="footer">
      <button class="btn btn-primary"
              @click="onOkClicked">{{ $t('buttons.ok') }}
      </button>
      <button class="btn btn-primary"
              @click="$emit('close')">{{ $t('buttons.cancel') }}
      </button>
    </div>
  </yoov-modal>
</template>

<script>
import YoovModal from '@/components/Modal'
import YoovRadioToggle from '@/components/forms/YoovRadioToggle'
import vSelect from 'vue-select'
import * as constants from '@/store/constants'
import DatePicker from 'vue2-datepicker'

export default {
  data () {
    return {
      //
      //   {titleTag: 'tax.income_salary', paytypes: [], },
      //   {titleTag: 'tax.income_leave_pay', paytypes: []},
      //   {titleTag: 'tax.income_director_fee', paytypes: []},
      //   {titleTag: 'tax.income_commission', paytypes: []},
      //   {titleTag: 'tax.income_bonus', paytypes: []},
      //   {titleTag: 'tax.income_back_pay', paytypes: []},
      //   {titleTag: 'tax.income_certain_payments_from_retirement_schemes', paytypes: []},
      //   {titleTag: 'tax.income_salaries_tax_by_employer', paytypes: []},
      //   {titleTag: 'tax.income_education_benefits', paytypes: []},
      //   {titleTag: 'tax.income_gain_realized_under_share_option_scheme', paytypes: []},
      //   {titleTag: 'tax.income_other_rewards', paytypes: []},
      //   {titleTag: 'tax.income_pensions', paytypes: []}
      // ],
      // paytypes: [
      //   {label: 'PayType1', value: 'paytype1'},
      //   {label: 'PayType2', value: 'paytype2'},
      //   {label: 'PayType3', value: 'paytype3'},
      //   {label: 'PayType4', value: 'paytype4'},
      //   {label: 'PayType5', value: 'paytype5'},
      //   {label: 'PayType6', value: 'paytype6'},
      //   {label: 'PayType7', value: 'paytype7'}
      // ],
      necessaryDocuments: [],
      optionGroupButtons: [
        {captionTag: 'general.basic', value: 'basic'},
        {captionTag: 'tax.salary_form', value: 'salary'}
      ],
      activeOptionGroup: 'basic',
      settings: {
        language: 'en-us',
        ir56bIncomes: [],
        ir56fIncomes: []
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
        'formDate': ''
      }
    }
  },
  components: {
    'yoov-modal': YoovModal,
    'yoov-radio-toggle': YoovRadioToggle,
    'v-select': vSelect,
    'date-picker': DatePicker
  },
  methods: {
    generate () {
      let vm = this
      let data = {
        lang: vm.sample.language,
        formCode: 'IR56B',
        formDate: vm.sample.formDate
      }
      vm.$store.dispatch('GENERATE_IRD_REQUEST_FORM', data).then(function (response) {
        vm.$dialog.alert('Generation will be ready soon.')
      }).catch(function (error) {
        console.log('TaxFormSettingsDialog :: generate :: error: ', error)
      })
    },

    getIcon (document) {
      return constants.apiUrl + '/media/icons/defaults/' + document.fileType
    },
    setIr56fIncomes (ir56fIncomes) {
      let vm = this
      if (typeof ir56fIncomes === 'undefined') {
        ir56fIncomes = vm.$store.getters.ir56fIncomes
      }
      let userParticulars = []
      if (vm.payTypes) {
        let data = ir56fIncomes
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
      }
      vm.settings.ir56fIncomes = userParticulars
    },
    setIr56bIncomes (ir56bIncomes) {
      let vm = this
      if (typeof ir56bIncomes === 'undefined') {
        ir56bIncomes = vm.$store.getters.ir56bIncomes
      }
      let userParticulars = []
      if (vm.payTypes) {
        let data = ir56bIncomes
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
      }
      vm.settings.ir56bIncomes = userParticulars
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
      let particular
      let i

      // IR56B Income Mapping
      let ir56bIncomes = []
      for (i = 0; i < vm.settings.ir56bIncomes.length; i++) {
        particular = vm.settings.ir56bIncomes[i]
        ir56bIncomes.push({
          id: particular.id,
          name: particular.name,
          pay_type_ids: particular.pay_types.map(payType => payType.id)
        })
      }

      // IR56F Income Mapping
      let ir56fIncomes = []
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
        lang: vm.settings.language,
        ir56bIncomes: ir56bIncomes,
        ir56fIncomes: ir56fIncomes,
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
        console.log('loadData after FETCH_PAY_TYPES :: payTypes: ', payTypes)
        vm.$store.dispatch('FETCH_TAX_FORM_SETTINGS').then(function (result) {
          vm.setIr56bIncomes(result.ir56b_incomes)
          vm.setIr56fIncomes(result.ir56f_incomes)
          vm.settings.lang = result.lang
        })
      })
    }
  },
  computed: {
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
    ir56bIncomes: function (val) {
      this.setIr56bIncomes()
    },
    ir56fIncomes: function (val) {
      this.setIr56fIncomes()
    },
    teamId: function (val) {
      this.loadData()
    }
  },
  mounted () {
    // alert('mounted :: teamId = ' + this.teamId)
    let vm = this
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
  #tax-form-settings-dialog .modal-container {
    width: 95%;
    max-width: 800px;
  }

  #tax-form-settings-dialog .particular-label {
    max-width: 160px;
    width: 160px;
    overflow-x: hidden;
    padding: 7px 10px 0 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  #tax-form-settings-dialog .salary-item.particular-label:hover {
    background-color: rgba(30, 132, 127, .2);
    border-radius: 0.4rem;
    padding: 0 10px;
  }

  .modal-wrapper {
    vertical-align: middle !important;
  }

  .modal-container {
    max-height: 90%;
    margin-top: 0 !important;
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

  #tax-form-settings-dialog .option-group-list ul {
    list-style-type: none;
    padding: 0;
  }

  #tax-form-settings-dialog .option-group-list .option-group-button.active {
    color: #1c7974 !important;
  }

  #tax-form-settings-dialog .option-group-list .option-group-button > .title-container {
    background-color: transparent;
  }

  #tax-form-settings-dialog .option-group-list .option-group-button {
    text-align: left;
    white-space: nowrap;
  }

  #tax-form-settings-dialog .option-group-list .option-group-button.active > .title-container {
    display: inline-block;
    background-color: #28ada7 !important;
    color: white;
  }

  #tax-form-settings-dialog .option-group-list .option-group-button.active:hover > .title-container {
    background-color: #1c7974 !important;
  }

  #tax-form-settings-dialog .option-group-list .option-group-button:hover {
    cursor: pointer;
    background-color: rgba(30, 132, 127, .2);
    color: white;
  }

  /*#tax-form-settings-dialog .option-group-list .option-group-button.active:hover {*/
  /*background-color: #1c7974 !important;*/
  /*color:white*/
  /*}*/
  #tax-form-settings-dialog .container {
    height: 460px;
  }

  #tax-form-settings-dialog .container table {
    height: 100%;
  }

  #tax-form-settings-dialog .container table tr td {
    vertical-align: top;
  }

  #tax-form-settings-dialog .modal-body input[type=search] {
    width: 100px !important;
  }

  .mx-input-append > .mx-calendar-icon {
    width: 100%;
    height: auto !important;
  }
</style>

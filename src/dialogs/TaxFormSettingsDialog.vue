<template>
  <yoov-modal id="tax-form-settings-dialog" @close="$emit('close')" :modalSizeClass="'modal-size-lg'">
    <div slot="header" class="text-left header flex-grow-1" style="position:relative;">
      <!--<button class="btn btn-primary pull-right"-->
      <!--@click="onCloseClicked">{{ $t('buttons.close') }}-->
      <!--</button>-->
      <h3 class="dialog-title d-inline">{{ $t('tax.tax_form_settings') }}</h3>
    </div>
    <div slot="body" class="container">
      <div class="form-group row">
        <label for="language" class="col-sm-2 col-form-label">Language</label>
        <yoov-radio-toggle
          class="col-sm-10"
          :options="languageOptions"
          optionTitleTag="titleTag"
          v-model="settings.language">

        </yoov-radio-toggle>
      </div>
      <h6 class="field-mapping-title">Field Mapping</h6>
      <table class="table-striped table-striped col-sm-12">
        <tr v-for="item in inputParticulars"
            :key="item.id">
          <td class="particular-label" v-tooltip="item.name">{{ item.name }}</td>
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
        <!--<tr>-->
        <!--<td>Leave Pay</td>-->
        <!--<td><v-select multiple v-model="salary_paytypes" :options="paytypes"></v-select></td>-->
        <!--</tr>-->
        <!--<tr>-->
        <!--<td>Director's Fee</td>-->
        <!--<td><v-select multiple v-model="salary_paytypes" :options="paytypes"></v-select></td>-->
        <!--</tr>-->
        <!--<tr>-->
        <!--<td>Commission/Fees</td>-->
        <!--<td><v-select multiple v-model="salary_paytypes" :options="paytypes"></v-select></td>-->
        <!--</tr>-->
        <!--<tr>-->
        <!--<td>Bonus</td>-->
        <!--<td><v-select multiple v-model="salary_paytypes" :options="paytypes"></v-select></td>-->
        <!--</tr>-->
        <!--<tr>-->
        <!--<td>Back Pay</td>-->
        <!--<td><v-select multiple v-model="salary_paytypes" :options="paytypes"></v-select></td>-->
        <!--</tr>-->
        <!--<tr>-->
        <!--<td>Certain PayCommission/Fees</td>-->
        <!--<td><v-select multiple v-model="salary_paytypes" :options="paytypes"></v-select></td>-->
        <!--</tr>-->
        <!--<tr>-->
        <!--<td>Commission/Fees</td>-->
        <!--<td><v-select multiple v-model="salary_paytypes" :options="paytypes"></v-select></td>-->
        <!--</tr>-->

      </table>
      <div class="form-group row">
        <div class="col">

        </div>
        <div class="col">

        </div>
      </div>
      <div class="row">
        <div class="col">

        </div>
        <div class="col">

        </div>
      </div>
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
      inputParticulars: [],
      settings: {
        language: 'user_customed'
      },
      languageOptions: [
        {
          id: 0,
          titleTag: 'general.user_customed',
          value: 'user_customed'
        },
        {
          id: 1,
          titleTag: 'general.chinese',
          value: 'chinese'
        },
        {
          id: 2,
          titleTag: 'general.english',
          value: 'english'
        }
      ]
    }
  },
  components: {
    'yoov-modal': YoovModal,
    'yoov-radio-toggle': YoovRadioToggle,
    'v-select': vSelect
  },
  methods: {
    setInputParticulars () {
      let vm = this
      let userParticulars = []
      if (vm.payTypes) {
        let data = this.$store.getters.incomeParticulars
        for (var i = 0; i < data.length; i++) {
          var item = data[i]
          userParticulars.push({
            id: item.id,
            is_default: item.is_default,
            description_tag: item.description_tag,
            name: item.name,
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
      vm.inputParticulars = userParticulars
    },
    onSelectPayType (item, payTypes) {
      let vm = this
      vm.$store.dispatch('UPDATE_INCOME_PARTICULAR_PAYTYPES', {
        id: item.id,
        payTypes: payTypes
      })
    },
    onOkClicked () {
      let vm = this
      let particulars = []

      let particular
      for (var i = 0; i < vm.inputParticulars.length; i++) {
        particular = vm.inputParticulars[i]
        console.log('i=' + i + ': particular: ', particular)
        particulars.push({
          id: particular.id,
          name: particular.name,
          pay_type_ids: particular.pay_types.map(payType => payType.id)
        })
      }
      vm.$emit('submit', {
        data: {
          incomeParticulars: particulars,
          teamId: vm.teamId
        },
        callback: function (response) {
          if (response.status) {
            vm.$emit('close')
          } else {

          }
        }
      })
    },
    loadData () {
      let vm = this
      // alert('loadData')
      // vm.inputParticulars = []
      vm.$store.dispatch('FETCH_PAY_TYPES').then(function (payTypes) {
        console.log('loadData after FETCH_PAY_TYPES :: payTypes: ', payTypes)
        vm.$store.dispatch('FETCH_INCOME_PARTICULARS').then(function (particulars) {
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
    incomeParticulars () {
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
    this.loadData()
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
    white-space: nowrap;
    text-overflow: ellipsis;
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
</style>

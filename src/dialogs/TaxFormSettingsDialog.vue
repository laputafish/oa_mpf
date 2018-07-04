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
      <h6>Field Mapping</h6>
      <table class="table-striped table-striped col-sm-12">
        <tr v-for="item in inputParticulars"
          :key="item.id">
          <td class="particular-label" v-tooltip="item.name">{{ item.name }}</td>
          <td><v-select multiple v-model="item.pay_type_ids" :options="payTypes"></v-select></td>
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
    onOkClicked () {
      alert('onOkClicked')
    },
    loadData () {
      let vm = this
      // alert('loadData')
      this.$store.dispatch('FETCH_INCOME_PARTICULARS').then(function (result) {
        vm.inputParticulars = result
      })
      this.$store.dispatch('FETCH_PAY_TYPES')
    }
  },
  computed: {
    // incomeParticulars () {
    //   let vm = this
    //   vm.userParticulars = []
    //   let data = this.$store.getters.incomeParticulars
    //   for (var i = 0; i < data.length; i++) {
    //     var item = data[i]
    //     vm.userParticulars.push({
    //       id: item.id,
    //       name: item.name,
    //       pay_type_ids: item.pay_item_ids
    //     })
    //   }
    // },
    teamId () {
      return this.$store.getters.teamId
    },
    payTypes () {
      let result = []
      let payType = null
      for (var i = 0; i < this.$store.getters.payTypes.length; i++) {
        payType = this.$store.getters.payTypes[i]
        result.push({
          label: payType.code,
          value: payType.id,
          name: payType.name
        })
      }
      return result
    }
  },
  watch: {
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
    max-width: 80px;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

</style>

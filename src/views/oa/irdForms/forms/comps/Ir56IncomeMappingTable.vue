<template>
  <table id="ir56IncomeMappingTable" class="table-striped" style="width: 100%;">
    <tr v-for="item in incomeTypeList"
        :key="item.id">
      <td class="particular-label salary-item" v-tooltip="$t('tax.'+item.name_tag)">{{ $t('tax.' +
        item.name_tag) }}
      </td>
      <td>
        {{ payTypeList }}

        <input v-if="item.is_default"
               type="text"
               readonly
               class="form-control-plaintext bg-lightgray text-darkgray px-2 border"
               :value="$t(item.description_tag)">
        <multiselect v-else
                     v-model="item.pay_types"
                     class="form-control"
                     :multiple="true"
                     :close-on-select="false"
                     :clear-on-select="false"
                     :hide-selected="true"
                     :preserve-search="true"
                     label="code"
                     track-by="code"
                     :options="payTypeList">
          <template slot="tag"
                    slot-scope="props">
            <span class="custom__tag">
              <span class="custom__tag-nowrap">
                <span>{{ props.option.code }}</span>
                <span class="custom__remove" @click="removeOption(props, $event)">❌</span>
              </span>&nbsp;
            </span>
          </template>
          <template slot="option"
                    slot-scope="props">
              <div class="paytype-option"
                   @click="addPayType(item, props.option, $event)"
                :class="{'assigned':props.option.assigned}">
                [{{ props.option.code }}] {{ props.option.name }} {{ props.option.assigned ? 'assigned' : 'none' }}
              </div>
          </template>
          <!--<template slot="option"-->
          <!--slot-scope="option">-->
          <!--<span>[{{ option.code }}]&nbsp;{{ option.name }}</span>-->
          <!--</template>-->
        </multiselect>
        <!-- paytypes: [{id, code, name}..] -->
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <hr/>
        <h6 class="remark">* {{ $t('tax.others_placed_in_salary') }}</h6>
      </td>
    </tr>

  </table>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  data () {
    return {
      incomeTypeList: []
      // ,
      // payTypeList: []
    }
  },
  props: ['incomeTypes', 'payTypes'],
  model: {
    prop: 'incomeTypes',
    event: 'input'
  },
  components: {
    multiselect: Multiselect
  },
  watch: {
    incomeTypes: function (val) {
      this.refreshIncomeTypes(val)
    }
    // ,
    // payTypes: function (val) {
    //   this.refreshPayTypes(val)
    // }
  },
  computed: {
    payTypeList () {
      let vm = this
      let result = []
      let i
      for (i = 0; i < vm.payTypes.length; i++) {
        let payType = JSON.parse(JSON.stringify(vm.payTypes[i]))
        payType.assigned = false
        result.push(payType)
      }
      for (i = 0; i < vm.incomeTypeList.length; i++) {
        let incomeType = vm.incomeTypeList[i]
        let incomePayTypes = incomeType.pay_types
        for (var j = 0; j < incomePayTypes.length; j++) {
          let incomePayTypeId = incomePayTypes[j].id
          let relatedPayType = result.find(function (item) {
            return item.id === incomePayTypeId
          })
          if (relatedPayType) {
            relatedPayType.assigned = true
          }
        }
      }
      return result
    }
  },
  mounted () {
    let vm = this
    vm.refreshIncomeTypes(vm.incomeTypes)
    // vm.refreshPayTypes(vm.payTypes)
  },
  methods: {
    addPayType (item, option, $event) {
      let vm = this
      for (let i = 0; i < vm.incomeTypeList.length; i++) {
        let incomeType = vm.incomeTypeList[i]
        if (incomeType.id !== item.id) {
          let index = incomeType.pay_types.findIndex(function (item) {
            return item.id === option.id
          })
          if (index >= 0) {
            incomeType.pay_types.splice(index, 1)
          }
        }
      }
      vm.$emit('input', vm.incomeTypeList)
    },
    refreshIncomeTypes (incomeTypes) {
      this.incomeTypeList = JSON.parse(JSON.stringify(incomeTypes))
    },
    // refreshPayTypes (payTypes) {
    //   let vm = this
    //   vm.payTypeList = JSON.parse(JSON.stringify(payTypes))
    //   vm.updateAssignmentStatus()
    // },
    removeOption (props, event) {
      let vm = this
      event.preventDefault()
      event.stopPropagation()
      props.remove(props.option)
      console.log('removeOption: incomeTypeList: ', vm.incomeTypeList)
      vm.$emit('input', vm.incomeTypeList)
    },
    removeOptionx (item, props) {
      // let vm = this
      console.log('removeOption :: item: ', item)
      console.log('removeOption :: props: ', props)
    }
  }
}
</script>

<style>
  #ir56IncomeMappingTable .particular-label {
    max-width: 240px;
    width: 160px;
    overflow-x: hidden;
    padding: 7px 10px 0 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  #ir56IncomeMappingTable .salary-item.particular-label:hover {
    background-color: rgba(30, 132, 127, .2);
    border-radius: 0.4rem;
    padding: 0 10px;
  }

  #ir56IncomeMappingTable .multiselect__tags-wrap {
    white-space: normal;
  }

  #ir56IncomeMappingTable .multiselect__tags-wrap .custom__tag .custom__remove {
    cursor: pointer;
  }

  #ir56IncomeMappingTable .multiselect__tags-wrap .custom__tag .custom__tag-nowrap {
    white-space: nowrap;
  }

  #ir56IncomeMappingTable .multiselect__tags-wrap .custom__tag {
    color: #333;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    height: 26px;
    margin: 4px 1px 2px 3px;
    padding: 1px .25em;
    line-height: 29px;
    /*display: inline-block;*/
    /*padding: 3px 12px;*/
    /*background: #d2d7ff;*/
    /*margin-right: 8px;*/
    /*margin-bottom: 8px;*/
    /*border-radius: 10px;*/
    /*cursor: pointer;*/
  }

  .multiselect--active .multiselect__input {
    width: 100% !important;
    margin-top:5px;
  }

  .multiselect--active .multiselect__content-wrapper
  ul.multiselect__content .multiselect__element:hover
  .paytype-option.assigned {
    background-color: darkgray;
  }

  .multiselect--active .multiselect__content-wrapper
  ul.multiselect__content .multiselect__element:hover .paytype-option {
    background-color: #28ada7 !important;
    color: white;
  }

  .multiselect--active .multiselect__content-wrapper ul.multiselect__content .multiselect__element .paytype-option {
    cursor: pointer;
    color: black;
  }

  .multiselect--active .multiselect__content-wrapper ul.multiselect__content .multiselect__element .paytype-option.assigned {
    cursor: pointer;
    color: lightgray;
  }

  .multiselect--active .multiselect__content-wrapper ul.multiselect__content {
    display: inline-block;
    list-style: none;
    padding: 0;
  }

</style>

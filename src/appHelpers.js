export default {
  methods: {
    getCurrentFiscalStartYear () {
      let year = this.$moment().year()
      let fiscalYearStart = this.$moment({month: 3, day: 1}).format('YYYY-MM-DD')
      let today = this.$moment().format('YYYY-MM-DD')
      return today < fiscalYearStart ? year - 1 : year
    },
    fiscalYears (startYear) {
      return startYear.toString().substr(-2) + '/' + (startYear + 1).toString().substr(-2)
    }
  }
}

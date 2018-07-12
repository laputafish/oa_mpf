const getToday = () => {
  var dateObj = new Date()
  var month = dateObj.getUTCMonth() + 1
  var day = dateObj.getUTCDate()
  var year = dateObj.getUTCFullYear()

  let monthStr = month < 10 ? '0' + month.toString() : month.toString()
  let dayStr = day < 10 ? '0' + day.toString() : day.toString()
  let yearStr = year.toString()

  return yearStr + '-' + monthStr + '-' + dayStr
}

export default {
  getToday
}

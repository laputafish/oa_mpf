import Pusher from 'pusher-js' // import Pusher
import * as constants from '@/store/constants.json'

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

const subscribe = (vm, teamId, channelHandlers) => {
  if (vm.pusherSubscribed) {
    vm.unSubscribe()
  }
  // alert('subscribe  PUSHER_APP_KEY = ' + constants.PUSHER_CLUSTER)
  // alert('teamId = ' + teamId)

  if (teamId) {
    vm.pusher = new Pusher(constants.PUSHER_APP_KEY, {cluster: constants.PUSHER_CLUSTER})
    console.log('helpers: subscribe: created pusher')
    vm.pusher.subscribe('team_' + teamId)

    for (var i = 0; i < channelHandlers.length; i++) {
      let channelHandler = channelHandlers[i]
      console.log('helpers: subscribe: added channel: ' + channelHandler.channel)
      vm.pusher.bind(channelHandler.channel, data => channelHandler.handler(data))
    }

    vm.pusherSubscribed = true
  }
}

const unSubscribe = (vm) => {
  if (vm.pusher) {
    vm.pusher.disconnect()
  }
}

export default {
  getToday,
  subscribe,
  unSubscribe
}

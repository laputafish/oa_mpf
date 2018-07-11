<template>
  <div>
    {{ row.info.displayName }}
  </div>
</template>

<script>
// import EventBus from '@/event-bus.js'

export default {
  data () {
    return {
    }
  },
  props: ['row', 'nested']
}
</script>

<style>

</style>

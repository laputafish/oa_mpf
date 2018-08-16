<template>
  <aside class="aside-menu">
    <b-tabs>
      <b-tab :title="$t('general.system')" active>
        <div class="p-3">
          <div class="message">
            <div class="py-3 pb-5 mr-3 float-left">
              <router-link to="/setup">Settings</router-link>
              <i class="fa fa-gear fa-fw"></i>
              <button class="btn btn-primary"
                @click="close($event)"><i class="fa fa-fw fa-close"></i></button>
            </div>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </aside>
</template>

<script>
import Callout from './Callout'
import cSwitch from './Switch'

export default {
  name: 'app-aside',
  components: {
    Callout,
    cSwitch
  },
  methods: {
    close (e) {
      e.preventDefault()
      document.body.classList.toggle('aside-menu-hidden')
    }
  }
}
</script>

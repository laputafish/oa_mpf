<template>
  <aside class="aside-menu">
    <b-tabs>
      <b-tab :title="$t('general.system')" active>
        <div class="px-3">
          <div class="message">
            <div class="py-3 pb-5 mr-3">
              <router-link @click.native="close($event)" to="/ird_form_setup">
                <i class="fa fa-gear fa-fw"></i>&nbsp;
                {{ $t('tax.ird_form_setup') }}
              </router-link>
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

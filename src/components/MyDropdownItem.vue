<template>
  <b-dropdown-header v-if="menuItem.type==='header'" tag="div" class="text-center">
    <strong>{{ $t('general.account') }}</strong>
  </b-dropdown-header>

  <b-dropdown-item v-else-if="menuItem.link" :to="menuItem.link">
    <i class="fa" :class="menuItem.icon"></i>
    <span>
      {{ $t(menuItem.titleTag) }}
    </span>
    <span v-if="menuItem.badgeNo" class="badge" :class="menuItem.badgeClass">{{ menuItem.badgeNo }}</span>
  </b-dropdown-item>
  <b-dropdown-item v-else-if="menuItem.popup" @click="processPopup(menuItem.popup)">
    <i class="fa" :class="menuItem.icon"></i>
    <span>
      {{ $t(menuItem.titleTag) }}
    </span>
    <span v-if="menuItem.badgeNo" class="badge" :class="menuItem.badgeClass">{{ menuItem.badgeNo }}</span>
  </b-dropdown-item>
  <b-dropdown-item v-else-if="menuItem.command" @click="processCommand(menuItem.command)">
    <i class="fa" :class="menuItem.icon"></i>
    <span>
      {{ $t(menuItem.titleTag) }}
    </span>
    <span v-if="menuItem.badgeNo" class="badge" :class="menuItem.badgeClass">{{ menuItem.badgeNo }}</span>
  </b-dropdown-item>
</template>

<script>
export default {
  name: 'MyDropdownItem',
  props: {
    menuItem: {
      type: Object,
      default: null
    }
  },
  methods: {
    processPopup (popup) {
      let vm = this
      switch (popup) {
        case 'teamSelection':
          vm.$store.commit('showTeamSelection')
          break
        case 'teamSettings':
          vm.$store.commit('showTeamSettings')
          break
      }
    },
    processCommand (command) {
      let vm = this
      switch (command) {
        case 'logout':
          let promises = [
            vm.$store.dispatch('SET_TOKEN', null),
            vm.$store.dispatch('SET_USER', {user: null}),
            vm.$store.dispatch('REMOVE_COOKIE_TOKEN')
          ]
          Promise.all(promises).then(function (response) {
            console.log('Menu > Logout')
            vm.$router.push('/login')
          })
          break
      }
    }
  }
}
</script>

<style>
  .no-anchor-style {
    color: #212529;
    text-decoration: none;
  }
  .no-anchor-style:hover {
    color: #212529;
    text-decoration: none;
  }
</style>

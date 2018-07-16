<template>
  <yoov-modal @close="$emit('close')" :modalSizeClass="'modal-size-lg'">
    <div slot="header" class="text-left header flex-grow-1" style="position:relative;">
      <!--<button class="btn btn-primary pull-right"-->
      <!--@click="onCloseClicked">{{ $t('buttons.close') }}-->
      <!--</button>-->
      <h3 class="dialog-title d-inline">{{ $t('team.team_selection') }}</h3>
    </div>
    <div slot="body">
      <div class="team-list">
        <ul>
          <li
            @click="selectedTeam=team"
            :key="team.id"
            v-for="team in teams"
            :class="{selected:selectedTeam==team}"
            class="d-flex d-row align-items-center">
            <div class="company-logo d-flex flex-row mr-2 align-items-center justify-content-center">
              <img :src="team.logoUrl"/>
            </div>
            <div class="company-name-container flex-grow-1 d-flex flex-column">
              <h6 class="company-name flex-grow-1">{{ team.name }}</h6>
              <small>{{ team.code }}</small>
            </div>
          </li>
        </ul>
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

export default {
  components: {
    'yoov-modal': YoovModal
  },
  data () {
    return {
      selectedTeam: null
    }
  },
  computed: {
    teams () {
      return this.$store.getters.teams
    }
  },
  methods: {
    onOkClicked () {
      let vm = this
      this.$emit('onTeamSelected', vm.selectedTeam)
    }
  },
  mounted () {
    alert('x')
    this.$store.dispatch('FETCH_TEAMS')
  }
}
</script>

<style>
  .modal-size-lg {
    width: 640px;
  }
  .team-list {
    height: 320px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .team-list ul {
    list-style: none;
    padding: 0;
  }

  .team-list ul li {
    height: 40px;
    padding: 2px 3px;
    cursor: pointer;
  }

  .team-list ul li .company-name-container small {
    color: lightgray;
  }

  .team-list ul li .company-name {
    padding: 0;
    margin: 0;
    white-space: nowrap;
    overflow-x: hidden;
  }

  .team-list ul > li div.company-logo {
    min-width: 36px;
    width: 36px;
    height: 36px;
  }

  .team-list ul > li div.company-logo img {
    margin: auto;
    object-fit: contain;
    max-width: 100%;

  }

  .team-list ul > li:hover,
  .team-list ul > li.selected:hover {
    background-color: #37D1CA;
    color: white;
  }

  .team-list ul > li.selected {
    background-color: #28ADA7;
    color: white;
  }

</style>

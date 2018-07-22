<template>
  <div class="animated fadeIn" id="my-ird-forms">
    <b-card>
      <div slot="header" >
        <div class="btn-group btn-group-gap">
          <button type="button"
                  @click="showSettings"
                  class="pull-right btn btn-outline-primary">
            <i class="fa fa-gear"></i>&nbsp;{{ $t('buttons.settings') }}
          </button>
        </div>
        {{ $t($route.name) }}
      </div>
    </b-card>
  </div>
</template>

<script>
export default {

}
</script>

<style>
  #my-ird-forms .card-header > div {
    position: relative;
  }

  #my-ird-forms .card-header div div.btn-group {
    position: absolute;
    top: -1px;
    right: -5px;
  }
</style>

<template>
  <div class="animated fadeIn mx-3" id="ird-form-setup">
    <b-card>
      <div slot="header">
        <div class="btn-group btn-group-gap card-header-toolbar">
          <!-- Button: Settings -->
          <button type="button"
                  @click="returnLastMode"
                  class="pull-right btn btn-outline-primary">
            <i class="fa fa-reply"></i>&nbsp;{{ $t('buttons.back') }}
          </button>
          <!--<button type="button"-->
          <!--@click="showSettings"-->
          <!--class="pull-right btn btn-outline-primary">-->
          <!--<i class="fa fa-gear"></i>&nbsp;{{ $t('buttons.settings') }}-->
          <!--</button>-->
        </div>
        {{ $t('tax.setup') }}
      </div>
      <ird-form-setup
        @close="returnLastMode"
        ref="setupForm"></ird-form-setup>
    </b-card>
  </div>
</template>


<template>
  <div>
    <h2>MPF Manager</h2>
    <b-card>
      <div slot="header">
        <button type="button"
                @click="saveItem"
                class="ml-1 btn btn-primary pull-right">
          <i class="fa fa-fw fa-save"></i>&nbsp;Save
        </button>
        <button type="button"
                @click="cancel"
                class="btn btn-default pull-right">
          <i class="fa fa-fw fa-save"></i>&nbsp;Cancel
        </button>
      </div>
      <div class="col-sm-12">
      </div>
    </b-card>
  </div>
</template>

<script>
export default {
  methods: {
    cancel () {

    },
    saveItem () {

    }
  }
}
</script>

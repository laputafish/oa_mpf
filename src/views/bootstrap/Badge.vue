<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
        <h2>Badge</h2>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6">
        <b-card>
          <b-card-body>
            <div class="card-title">
              <h3>General</h3>
            </div>
            <h1>Example heading
              <b-badge>New</b-badge>
            </h1>
            <h2>Example heading
              <b-badge>New</b-badge>
            </h2>
            <h3>Example heading
              <b-badge>New</b-badge>
            </h3>
            <h4>Example heading
              <b-badge>New</b-badge>
            </h4>
            <h5>Example heading
              <b-badge>New</b-badge>
            </h5>
            <h6>Example heading
              <b-badge>New</b-badge>
            </h6>
          </b-card-body>
        </b-card>
        <b-card>
          <b-card-body>
            <div class="text-center">
              <b-button variant="primary">
                Notifications
                <b-badge variant="light">4</b-badge>
              </b-button>
            </div>
          </b-card-body>
        </b-card>
      </div>
      <div class="col-sm-6">
        <b-card>
          <b-card-body>
            <div class="card-title">
              <h3>Contextual variations</h3>
            </div>
            <div>
              <b-badge variant="primary">Primary</b-badge>
              <b-badge variant="secondary">Secondary</b-badge>
              <b-badge variant="success">Success</b-badge>
              <b-badge variant="danger">Danger</b-badge>
              <b-badge variant="warning">Warning</b-badge>
              <b-badge variant="info">Info</b-badge>
              <b-badge variant="light">Light</b-badge>
              <b-badge variant="dark">Dark</b-badge>
            </div>
            <br/>

            <div class="card-title">
              <h3>Pill badges</h3>
            </div>
            <div>
              <b-badge pill variant="primary">Primary</b-badge>
              <b-badge pill variant="secondary">Secondary</b-badge>
              <b-badge pill variant="success">Success</b-badge>
              <b-badge pill variant="danger">Danger</b-badge>
              <b-badge pill variant="warning">Warning</b-badge>
              <b-badge pill variant="info">Info</b-badge>
              <b-badge pill variant="light">Light</b-badge>
              <b-badge pill variant="dark">Dark</b-badge>
            </div>
            <br/>

            <div class="card-title">
              <h3>Actionable badges</h3>
            </div>
            <div>
              <b-badge href="#" variant="primary">Primary</b-badge>
              <b-badge href="#" variant="secondary">Secondary</b-badge>
              <b-badge href="#" variant="success">Success</b-badge>
              <b-badge href="#" variant="danger">Danger</b-badge>
              <b-badge href="#" variant="warning">Warning</b-badge>
              <b-badge href="#" variant="info">Info</b-badge>
              <b-badge href="#" variant="light">Light</b-badge>
              <b-badge href="#" variant="dark">Dark</b-badge>
            </div>

          </b-card-body>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'badge'
}
</script>

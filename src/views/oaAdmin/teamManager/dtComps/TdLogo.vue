<template>
  <div class="team-logo-container">
    <img class="team-logo" :src="value">
  </div>
</template>

<script>
export default {
  props: ['value']
}
</script>

<style>
  .team-logo-container {
    width: 64px;
    height: 32px;
    margin: 0 auto;
  }

  .team-logo-container img {
    max-width: 100%;
    width: auto;
    height: 100%;
    margin: 0 auto;
    object-fit: contain;
  }
</style>

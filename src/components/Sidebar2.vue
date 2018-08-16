<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <div slot="header">sdfdsfds</div>
      <ul class="nav">
        <li class="nav-item">
          <SidebarNavTitlte :name="$t('general.system')"></SidebarNavTitlte>
        </li>
        <li class="divider"></li>
        <SidebarNavLink :name="$t('general.settings')"
        :url="'/settings'"
        :icon="'fa fa-gear'"></SidebarNavLink>
      </ul>
      <div slot="footer"></div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'app-sidebar2'
}
</script>

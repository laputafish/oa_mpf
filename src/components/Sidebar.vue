<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <div slot="header"></div>
      <ul class="nav">
        <li class="nav-item"
            :key="index"
            v-for="(item, index) in navItems">
          <template v-if="item.title">
            <SidebarNavTitle :name="$t(item.name)"/>
          </template>
          <template v-else-if="item.divider">
            <li class="divider"></li>
          </template>
          <template v-else>
            <template v-if="item.children">
              <SidebarNavDropdown :name="$t(item.name)" :url="item.url" :icon="item.icon">
                <div :key="index"
                     v-for="(child, index) in item.children">
                  <template>
                    <template v-if="child.children">
                      <SidebarNavDropdown :name="$t(child.name)" :url="child.url" :icon="child.icon">
                        <li class="nav-item"
                            :key="index"
                            v-for="(child, index) in item.children">
                          <SidebarNavLink :name="$t(child.name)" :url="child.url" :icon="child.icon" :badge="child.badge"/>
                        </li>
                      </SidebarNavDropdown>
                    </template>
                    <template v-else>
                      <li class="nav-item">
                        <SidebarNavLink :name="$t(child.name)" :url="child.url" :icon="child.icon" :badge="child.badge"/>
                      </li>
                    </template>
                  </template>
                </div>
              </SidebarNavDropdown>
            </template>
            <template v-else>
              <SidebarNavLink :name="$t(item.name)" :url="item.url" :icon="item.icon" :badge="item.badge"/>
            </template>
          </template>
        </li>
      </ul>
      <slot></slot>
      <div slot="footer"></div>
    </nav>
  </div>
</template>

<script>
import SidebarNavDropdown from './SidebarNavDropdown'
import SidebarNavLink from './SidebarNavLink'
import SidebarNavTitle from './SidebarNavTitle'

export default {
  name: 'app-sidebar',
  data () {
    return {
      options: {
        height: '100%',
        size: 0
      },
      openedMenuName: ''
    }
  },
  props: {
    navItems: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  components: {
    SidebarNavDropdown,
    SidebarNavLink,
    SidebarNavTitle
  },
  methods: {
  }

}
</script>

<style lang="css">
  .nav-link {
    cursor:pointer;
  }
  .sidebar .nav .nav-item .nav-link {
    color: #878b91;
  }
  .sidebar {
    font-size: 0.8rem;
  }
</style>

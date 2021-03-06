<template>
  <yoov-modal id="folderTreeDialog">
    <div slot="header">
      <h3 class="dialog-title">
        Select Timeline
      </h3>
    </div>
    <div slot="body" class="yoov-modal-body">
      <div class="d-flex d-row">
        <button class="flex-grow-1"
                :class="{'btn-primary':activeTab=='personal'}"
                @click="activeTab='personal'">
          Personal
        </button>
        <button class="flex-grow-1"
                :class="{'btn-primary':activeTab=='public'}"
                @click="activeTab='public'">
          Public
        </button>
        <button class="flex-grow-1"
                :class="{'btn-primary':activeTab=='shared'}"
                @click="activeTab='shared'">
          Shared
        </button>
      </div>
      <div class="tree-container" v-if="activeTab==='personal'">
        <v-tree ref='tree' :data='personalFolders' :tpl='tpl' :halfcheck='true'/>
      </div>
      <div class="tree-container" v-else-if="activeTab==='public'">
        <v-tree ref='tree' :data='publicFolders' :tpl='tpl' :halfcheck='true'/>
      </div>
      <div class="tree-container" v-else>
        <v-tree ref='tree' :data='sharedFolders' :tpl='tpl' :halfcheck='true'/>
      </div>
      <!--<input type="text" v-model="searchword"/>-->
      <!--<button type="button" @click="search">GO</button>-->
    </div>
    <div slot="footer" style="width:100%;" class="mt-0 pt-0">
      <button class="btn btn-default"
              @click="$emit('close')">Cancel
      </button>
      <button class="btn btn-primary"
              :disabled="selectedNodes[activeTab]===0"
              @click="onConfirmed"
      >OK
      </button>
    </div>
  </yoov-modal>
</template>

<script>
import YoovModal from '@/components/Modal'

export default {
  props: {
    disabledFolderIds: {
      type: Array,
      default: () => {
        return []
      }
    },
    command: '',
    fileItem: null,
    fileType: ''
  },
  components: {
    'yoov-modal': YoovModal
  },
  computed: {
    userAllFolders () {
      return this.$store.getters.userAllFolders
    },
    user () {
      return this.$store.getters.user
    }
  },
  created () {
    this.$store.dispatch('GET_USER_ALL_FOLDERS', this.user.id)
  },
  mounted () {
    this.refreshUserAllFolders()
  },
  watch: {
    userAllFolders: {
      handler: function (value) {
        this.refreshUserAllFolders()
      },
      deep: true
    }
  },
  data () {
    return {
      activeTab: 'personal',
      selectedNodes: {
        'personal': 0,
        'public': 0,
        'shared': 0
      },
      searchword: '',
      personalFolders: [],
      publicFolders: [],
      sharedFolders: [],
      treeData: [{
        name: 'node1',
        expanded: true,
        children: [{
          name: 'node 1-1',
          expanded: true,
          children: [{
            name: 'node 1-1-1'
          }, {
            name: 'node 1-1-2'
          }, {
            name: 'node 1-1-3'
          }]
        }, {
          name: 'node 1-2',
          children: [{
            name: "<span style='color: red'>node 1-2-1</span>"
          }, {
            name: "<span style='color: red'>node 1-2-2</span>"
          }]
        }]
      }]
    }
  },
  methods: {
    onConfirmed () {
      let vm = this
      this.$emit('ok', {
        command: vm.command,
        folderId: vm.selectedNodes[vm.activeTab],
        fileItem: vm.fileItem,
        fileType: vm.fileType
      })
    },
    markDisabled (folders, disabled) {
      if (typeof disabled === 'undefined') {
        disabled = false
      }
      let vm = this
      if (folders) {
        for (var i = 0; i < folders.length; i++) {
          folders[i].disabled = disabled || vm.disabledFolderIds.indexOf(folders[i].id) >= 0
          if (folders[i].children) {
            vm.markDisabled(folders[i].children, folders[i].disabled)
          }
        }
      }
      return folders
    },
    refreshUserAllFolders () {
      let vm = this
      let publicFolders = JSON.parse(JSON.stringify(vm.userAllFolders.publicFolders))
      let personalFolders = JSON.parse(JSON.stringify(vm.userAllFolders.personalFolders))
      let sharedFolders = JSON.parse(JSON.stringify(vm.userAllFolders.sharedFolders))
      vm.publicFolders = vm.markDisabled(publicFolders)
      vm.personalFolders = vm.markDisabled(personalFolders)
      vm.sharedFolders = vm.markDisabled(sharedFolders)

      // console.log('refreshUserAllFolders :: publicFolders:', vm.publicFolders)
      // console.log('refreshUserAllFolders :: personalFolders:', vm.personalFolders)
      // console.log('refreshUserAllFolders :: sharedFolders:', vm.sharedFolders)
    },
    tpl (node, ctx) {
      let vm = this
      let isNodeDisabled = node.disabled // vm.disabledFolderIds.indexOf(node.id) >= 0
      let wrapperClass = isNodeDisabled ? 'node-disabled' : ''
      let titleClass = node.selected ? 'node-title node-selected bg-primary' : 'node-title'
      // console.log('disabledFolderIds = ' + vm.disabledFolderIds[0])
      // console.log('refreshUserAllFolders :: node.id = ' + node.id + ', node.name=' + node.name + ': ')
      if (node.searched) {
        titleClass += ' node-searched'
      }
      // console.log('node.name = ' + node.name)
      // console.log('ctx: ', ctx)
      return <span class={wrapperClass}>
        <span class={titleClass} domPropsInnerHTML={node.name} onClick={() => {
          if (!isNodeDisabled) {
            ctx.parent.nodeSelected(ctx.props.node)
            vm.selectedNodes[vm.activeTab] = ctx.parent.getSelectedNodes()[0].id
            // console.log(ctx.parent.getSelectedNodes())
          }
        }}></span>
      </span>
    },
    async asyncLoad (node) {
      // method1:
      this.$refs.tree.addNodes(node, await this.$api.demo.getChild())
      // method2:
      // this.$set(node, 'loading', true)
      // let data = await this.$api.demo.getChild()
      // this.$set(node, 'children', data)
      // this.$set(node, 'loading', false)
      // method3: use concat
    },
    search () {
      this.$refs.tree.searchNodes(this.searchword)
    }
  }
}
</script>

<style>
    #folderTreeDialog .tree-container {
        height: 400px;
        overflow-y: auto;
    }
    #folderTreeDialog span.node-disabled:hover {
        background-color: transparent;
    }
    #folderTreeDialog span.node-disabled:hover > span {
        background-color: transparent;
        cursor: default;
        color: lightgray;
    }

    #folderTreeDialog .node-disabled {
        cursor: default;
        color: lightgray;
    }

    .halo-tree .tree-close:after {
      padding-left: 1px;
    }
    .tree-node-el span.tree-open,
    .tree-node-el span.tree-close {
      line-height: 0.8;
    }
</style>

<template>
  <tree
    draggable
    v-model="data"
    :afterInsert="afterInsert"
  ></tree>
</template>

<script>
import tree from '../tree'

const EXAMPLE_DATA = [
  {
    key: '0',
    title: '女装',
    children: [
      {
        key: '0-1',
        title: '风衣'
      },
      {
        key: '0-2',
        title: '外套'
      }
    ]
  },
  {
    key: '1',
    title: '男装'
  },
  {
    key: '2',
    title: '图书',
    children: [
      {
        key: '2-0',
        title: '小说',
        children: [
          {
            key: '2-0-0',
            title: '九州牧云录'
          },
          {
            key: '2-0-1',
            title: '天空的城'
          },
          {
            key: '2-0-2',
            title: '三体'
          }
        ]
      },
      {
        key: '2-1',
        title: '经管',
        children: [
          {
            key: '2-1-0',
            title: '创京东'
          }
        ]
      },
      {
        key: '2-2',
        title: '科技',
        children: [
          {
            key: '2-2-0',
            title: 'JavaScript权威指南'
          },
          {
            key: '2-2-1',
            title: 'JavaScript高级程序设计'
          }
        ]
      }
    ]
  }
]

export default {
  component: {
    tree
  },
  name: 'vue-draggable-tree-demo',
  data () {
    return {
      data: EXAMPLE_DATA
    }
  },
  methods: {
    afterInsert () {
      console.log(this.data)
    }
  }
}
</script>

<style>
  .ivu-tree-arrow img {
    width: 100%;
  }
</style>

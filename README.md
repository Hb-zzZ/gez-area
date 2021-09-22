# gez-area

[![npm](https://img.shields.io/npm/v/ptm.svg)](https://www.npmjs.com/package/gez-area) ![GitHub repo size](https://img.shields.io/github/repo-size/Hb-zzZ/gez-area) ![GitHub top language](https://img.shields.io/github/languages/top/Hb-zzZ/gez-area) ![NPM](https://img.shields.io/npm/l/gez-area)


## Install

```
$ npm install gez-area
// or
$ yarn add gez-area


// main.js

...
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// gez-area
import GezArea from 'gez-area'

Vue.use(ElementUI)

Vue.use(GezArea, {
  // global config
  request: (data) => {
  // get area options
    return []
  }
})
...
```

## Example

```
<template>
 <gez-area ref="gezArea" :area-data="areaData" :area-list="areaList" />
</template>

<script>
 data() {
    return {
      areaData: {},
      areaList: [
        {
          model: 'province',
          type: 'province',
          label: '省',
          rules: [{ required: true, message: '必填' }]
        },
        {
          model: 'city',
          type: 'city',
          label: '市',
          rules: [{ required: true, message: '必填' }]
        },
        {
          model: 'area',
          type: 'area',
          label: '区',
          rules: [{ required: true, message: '必填' }]
        },
        {
          model: 'street',
          type: 'street',
          label: '街道',
          rules: [{ required: true, message: '必填' }]
        },
        {
          model: 'community',
          type: 'community',
          label: '社区'
        }
      ]
    }
  },
  methods: {
        getAreaData(){
           this.$refs['gezArea'].validate().then((data)=> {
                console.log(data)
           })
        }
  }
</script>

```

## props

### areaData(Object)

### rowAttrs(Object)[https://element.eleme.cn/#/zh-CN/component/layout#row-attributes]

```
{
   // default
   gutter: 15
}
```

### areaList

```
[
{
        // bind in areaData
        model: 'xxx',
        // area type
        type: 'city',
        label: '市',
        // when the first level is not province
        parentCode: '44xxxxx',
        // choose to show(String or Array)
        showCode: '44xxxx', // or ['44xxxx', '43xxxx']
        // validate rules(Array)
        rules: [{ required: true, message: 'required' }]
},
...
]
```

### disabled(Boolean)

### config(Object)

same as global config, the weight is higher

```
{
  request:(data) => {
     return []
     or
     return new Promise((resolve) => resolve([]))
     or
     return () => []
  },
  // options config
  requestLabelKey: 'label',
  requestValueKey: 'value'
}

```

## event

### change

when areaData change

## Thanks

If you find this project useful, you can give me a [[star](https://github.com/Hb-zzZ/gez-area)].

## LICENSE

MIT

## ChangeLog

[ChangeLog](./CHANGELOG.md)

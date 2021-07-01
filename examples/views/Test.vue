<template>
  <div class="example-wrap">
    <button @click="getFormData">获取formData</button>
    <button @click="submit">提交</button>
    <gez-area ref="gezArea" :area-data="areaData" :area-list="areaList" />
  </div>
</template>

<script>
export default {
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
    getFormData() {
      console.log(
        '%cthis.formData: ',
        'color: MidnightBlue; background: #7c28ff; font-size: 16px;',
        this.areaData
      )
    },
    submit() {
      this.$refs['gezArea'].validate().then((data) => {
        console.log(
          '%cdata: ',
          'color: MidnightBlue; background: #7c28ff; font-size: 16px;',
          data
        )
      })
    }
  }
}
</script>

<style lang="scss">
html,
body {
  margin: 0px;
  padding: 0px;
  height: 100%;
}
#app {
  height: 100%;
  background: rgb(98, 188, 240);
}
</style>

<style lang="scss" scoped>
.example-wrap {
  text-align: center;
  padding: 50px;

  .gez-area-wrap {
    margin-top: 20px;
  }

  /deep/ {
    .el-form-item__label {
      color: white;
    }
  }
}
</style>

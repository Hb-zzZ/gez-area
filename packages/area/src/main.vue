<template>
  <el-form
    ref="address"
    :disabled="disabled"
    :model="areaData"
    class="gez-area"
    v-bind="formAttrs"
  >
    <el-row v-bind="rowAttrs">
      <el-col
        v-for="(add, addIndex) in realAddList"
        :key="addIndex"
        :span="layoutSpan"
      >
        <el-form-item :prop="add.model" :rules="add.rules || []">
          <el-select
            :ref="add.type"
            :disabled="getSelectDisabled(add)"
            placeholder="请选择"
            v-model="selected[add.type]"
            v-bind="add.attrs"
            @change="(val) => onChange(val, add)"
          >
            <el-option
              v-for="(opt, optIndex) in add.options"
              :key="optIndex"
              :value="opt[requestValueKey]"
              :label="opt[requestLabelKey]"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { throttle } from 'throttle-debounce'
// type排列顺序
const ADDRESS_ORDER = ['province', 'city', 'area', 'street', 'community']

export default {
  name: 'GezArea',
  props: {
    areaData: {
      type: Object,
      default() {
        return {}
      }
    },
    formAttrs: {
      type: Object,
      default() {
        return {}
      }
    },
    rowAttrs: {
      type: Object,
      default() {
        return {
          gutter: 15
        }
      }
    },
    areaList: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 配置
    config: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 当前选择的value集合
      selected: {
        province: '',
        city: '',
        area: '',
        street: '',
        community: ''
      },
      // 当前地址对应的options,
      addOptions: {
        province: 'loading',
        city: 'loading',
        area: 'loading',
        street: 'loading',
        community: 'loading'
      },
      // 地址code options缓存
      addStore: {},
      // 值是否改变，等待options加载完毕后抛出change
      changeAwait: false
    }
  },
  computed: {
    realConfig() {
      return this.config || this.$gezAreaConfig || {}
    },
    requestValueKey() {
      return this.realConfig.requestValueKey || 'value'
    },
    requestLabelKey() {
      return this.realConfig.requestLabelKey || 'label'
    },
    // areaData内真实的值
    addressValue() {
      return this.areaList.reduce((map, item) => {
        const { type, model } = item
        map[type] = this.areaData[model]
        return map
      }, {})
    },
    realAddList() {
      let rules = false

      return this.areaList.reduce((list, item) => {
        let options = this.addOptions[item.type]

        if (
          (options !== 'loading' && options.length === 0) ||
          !this.isCanSelect(item)
        ) {
          // 如果获取不到则把后面都置为不需要填写
          rules = [{ required: false }]
        } else {
          rules = item.rules || []
        }

        options = Array.isArray(options) ? options : []

        const desc = {
          ...item,
          options,
          optionsValueKey: this.requestValueKey,
          optionsLabelKey: this.requestLabelKey
        }

        if (rules) {
          desc['rules'] = rules
        }

        list.push(desc)
        return list
      }, [])
    },
    layoutSpan() {
      const span = 24 / this.realAddList.length

      return span
    },
    // 请求结果
    requestAddress() {
      return this.realConfig.request
    },
    triggerChangeParmas() {
      return {
        wholeData: this.realAddList
      }
    }
  },
  watch: {
    addressValue: {
      immediate: true,
      deep: true,
      handler(addressValue) {
        for (const type in addressValue) {
          // areaData内值和组件内不一样时，更新值以和areaData一致
          if (this.selected[type] !== addressValue[type]) {
            this.selected[type] = addressValue[type]
          }
        }
        // todo:待优化，加入对比
        this.updateAddOptions()
      }
    },
    triggerChangeParmas: {
      immediate: true,
      deep: true,
      handler() {
        this.triggerChange()
      }
    }
  },
  methods: {
    triggerChange() {
      if (!this.triggerChangeTimer) {
        this.triggerChangeTimer = throttle(60, () => {
          const wholeData = this.realAddList
          const isDone = wholeData.every(
            (item) => this.addOptions[item.type] !== 'loading'
          )

          if (isDone && this.changeAwait) {
            this.changeAwait = false
            const areaData = this.addressValue
            this.$emit('change', { wholeData, areaData })
          }
        })
      }

      this.triggerChangeTimer()
    },
    onChange(val, item) {
      this.changeAreaData(val, item.model)
      this.autoResetFields(item)
      this.resetLowData(item)
      this.changeAwait = true
      this.triggerChange()
    },
    changeAreaData(value, model) {
      if (model) {
        this.$set(this.areaData, model, value)
      } else {
        throw Error('找不到匹配的对象')
      }
    },
    resetLowData(desc) {
      const { type } = desc
      let typeIndex = ADDRESS_ORDER.indexOf(type)

      if (~typeIndex) {
        const resetList = ADDRESS_ORDER.slice(typeIndex + 1)

        resetList.forEach((resetType) => {
          if (this.selected[resetType]) {
            const { model: resetModel } = this.realAddList.find(
              (item) => item['type'] === resetType
            )

            this.selected[resetType] = ''
            this.changeAreaData('', resetModel)
          }
        })
      }
    },
    autoResetFields(item) {
      this.validateField(item.model)
    },
    validateField(data) {
      return new Promise((resolve) => {
        resolve(
          this.$refs['address'] && this.$refs['address'].validateField(data)
        )
      })
    },
    updateAddOptions() {
      this.realAddList.forEach(async (add) => {
        let { type, showCode } = add
        const parentCode = this.isCanSelect(add)

        this.$set(this.addOptions, type, 'loading')

        if (parentCode) {
          // 可以点击的加载下拉选项
          if (!this.addStore[parentCode]) {
            await Promise.resolve(
              this.requestAddress({ type, parentCode })
            ).then((res) => {
              this.addStore[parentCode] = res
            })
          }

          let showStore = this.addStore[parentCode]

          if (showCode) {
            if (!Array.isArray(showCode)) {
              showCode = [showCode]
            }

            showStore = showStore.filter((item) => {
              const value = item[this.requestValueKey]

              if (showCode.includes(value)) {
                return true
              }
            })
          }

          this.$set(this.addOptions, type, showStore)
        } else {
          // 不可以下拉则重置为空
          this.$set(this.addOptions, type, [])
        }
      })
    },
    getSelectDisabled(desc) {
      return this.disabled || !this.isCanSelect(desc)
    },
    isCanSelect(desc) {
      const { type, parentCode } = desc

      const firstType = this.areaList[0] && this.areaList[0].type
      let typeIndex = ADDRESS_ORDER.indexOf(type)

      if (~typeIndex) {
        typeIndex -= 1

        if (type === 'province') {
          // 当前为第一个省级时
          return 'root'
        } else if (firstType === type) {
          // 自定义第一层级
          return parentCode
        } else if (~typeIndex) {
          return this.selected[ADDRESS_ORDER[typeIndex]]
        } else {
          return null
        }
      } else {
        return null
      }
    },
    // 对整个表单进行校验的方法
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs['address'].validate((result, errMsg) => {
          if (result) {
            resolve({
              result,
              areaData: this.areaData,
              wholeData: this.realAddList
            })
          } else {
            reject({ result, errMsg })
          }
        })
      })
    },
    // 移除表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果
    clearValidate(data) {
      return new Promise((resolve) => {
        resolve(this.$refs['address'].clearValidate(data))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.gez-area-wrap {
  /deep/ {
    .el-form-item__content {
      margin-left: 0px;
    }

    .el-col {
      &.el-col-4\.8 {
        width: percentage(4.8 / 24);
      }
    }

    .el-select {
      width: 100%;
    }
  }
}
</style>

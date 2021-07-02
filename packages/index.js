import packageJson from '../package.json'

// 自动引入所有组件
const components = {}

const req = require.context('./', true, /index\.js$/)
const requireAll = (requireContext) => {
  const files = requireContext.keys()

  return files.map((file, index, arr) => {
    const requireApi = requireContext(file, index, arr)
    const fileDefault = requireApi.default || requireApi
    if (fileDefault.name) {
      components[fileDefault.name] = fileDefault
    }

    return requireApi
  })
}
requireAll(req)

const install = function(Vue, opts = {}) {
  // 判断是否安装，安装过就不继续往下执行
  if (install.installed) return
  install.installed = true
  // 遍历注册所有组件
  Object.entries(components).map((item) => {
    const [key, component] = item
    Vue.component(key, component)
  })

  Vue.prototype.$gezAreaConfig = opts
}

export default {
  version: packageJson.version,
  install,
  ...components
}

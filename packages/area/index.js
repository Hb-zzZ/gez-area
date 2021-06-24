// 为组件提供 install 方法，供组件对外按需引入
import Area from './src/main'
Area.install = (Vue) => {
  Vue.component(Area.name, Area)
}
export default Area

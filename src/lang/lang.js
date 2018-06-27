import Vue from 'vue'
import VueI18n from 'vue-i18n'

import cn from './langs/cn.json'
import en from './langs/en.json'
import hk from './langs/hk.json'

Vue.use(VueI18n)
const locale = 'hk'
const messages = {
  cn: cn,
  hk: hk,
  en: en
}
export const i18n = new VueI18n({
  /** 默认值 */
  locale,
  messages
})

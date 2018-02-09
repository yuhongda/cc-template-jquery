/**
 * 公共js
 *
 */

import Vue from 'vue'
import VueI18n from 'vue-i18n'
import lang from '../lang/language.js'
import { getQueryString } from './util';

Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: (getQueryString('lang') ? getQueryString('lang') : navigator.language.split('-')[-0]) || 'zh',
    messages: lang, 
})

new Vue({
    el: '#app-content',
    i18n
});
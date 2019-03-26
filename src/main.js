import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import firebase from 'firebase/app'
import 'firebase/auth'
import router from './router'
import {store} from './store'
import Vuetify from 'vuetify'
import DateFilter from './filters/date'
import AlertCmp from './components/shared/alert'

Vue.use(Vuetify)
Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    firebase.initializeApp({
    apiKey: "API-KEY",
    authDomain: "this-meetup.firebaseapp.com",
    databaseURL: "https://this-meetup.firebaseio.com",
    projectId: "this-meetup",
    storageBucket: "this-meetup.appspot.com",
    messagingSenderId: "SENDERNUMBER"
    })
    
    //check if auth
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.$store.dispatch('autoSignIn', user)
      }
    })
    //load meetups from firebase
    this.$store.dispatch('loadMeetups')
  }
}).$mount('#app')

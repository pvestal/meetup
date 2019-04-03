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
import editMeetupDialog from './components/Meetup/EditMeetupDialog.vue'

Vue.use(Vuetify)
Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-meetupDialog', editMeetupDialog )
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    firebase.initializeApp({
    apiKey: "AIzaSyCAK88o-NhGzYyc9WGcyzyaZ16TymNT-BQ",
    authDomain: "this-meetup.firebaseapp.com",
    databaseURL: "https://this-meetup.firebaseio.com",
    projectId: "this-meetup",
    storageBucket: "gs://this-meetup.appspot.com",
    messagingSenderId: "521348580703"
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

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
import editMeetupDialog from './components/Meetup/Edit/EditMeetupDialog.vue'
import editMeetupDateDialog from './components/Meetup/Edit/EditMeetupDateDialog.vue'
import editMeetupTimeDialog from './components/Meetup/Edit/EditMeetupTimeDialog.vue'
import RegisterDialog from './components/Meetup/Registration/RegisterDialog.vue'

Vue.use(Vuetify)
Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-meetupDialog', editMeetupDialog )
Vue.component('app-edit-meetupDateDialog', editMeetupDateDialog )
Vue.component('app-edit-meetupTimeDialog', editMeetupTimeDialog )
Vue.component('app-register-meetupDialog', RegisterDialog )
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
        this.$store.dispatch('fetchUserData', user)
      }
    })
    //load meetups from firebase
    this.$store.dispatch('loadMeetups')
  }
}).$mount('#app')

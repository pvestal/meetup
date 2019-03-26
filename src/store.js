import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/firestore'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
      loadedMeetups: [
        {imageUrl: 'https://www.capitolhillhotel-dc.com/wp-content/uploads/2018/11/GettyImages-157316994-1.jpg', 
        id: 'oiusdoiasud', title: 'Meetup in DC', date: new Date(), location: "Washington, D.C.",
          description: "Get Kush in the Capital..."
        },  
        {imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Dallas_skyline_daytime.jpg', 
        id: 'o98sdasdasd', title: 'Meetup in Dallas', date: new Date(), location: "Dallas, Texas",
          description: "Get it while it's Hot!"
        },
        {imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Night_skyline_of_Toronto_May_2009.jpg', 
        id: 'iou8s7adasd', title: 'Meetup in Toronto', date: new Date(), location: "Toronto, Canada",
          description: "How bout a Bud, Ah?"
        }  
        ],
        user: null,
        loading: false,
        error: null
  },
  mutations: {
    createMeetup(state, payload) {
      state.loadedMeetups.push(payload)
    },
    SET_LOADED_MEETUPS(state, payload){
      state.loadedMeetups = payload
    },
    SET_USER(state, payload) {
      state.user = payload
    },
    SET_LOADING(state, payload) {
      state.loading = payload
    },
    SET_ERROR(state, payload) {
      state.error = payload
    },
    CLEAR_ERROR(state) {
      state.error = null
    }
  },
  actions: {
    loadMeetups({commit}) {
      commit('SET_LOADING', true)
      firebase.firestore().collection('meetups').get()
      .then((querySnapshot) => {
        let meetupsArray = []
        querySnapshot.forEach((doc) => {
        let meetup = doc.data()
            meetup.id = doc.id
            meetupsArray.push(meetup)
        })
        store.commit('SET_LOADED_MEETUPS', meetupsArray)
        commit('SET_LOADING', false)
      })
      .catch((error) => {
        console.log(error)
        commit('SET_LOADING', true)
      })
    },
    createMeetup({commit, getters}, payload) {
      //we could also just pass payload
      const meetup = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date,
        creatorId: getters.user.uid
      }
      //Reach out to Firebase and store
      firebase.firestore().collection('meetups').add(meetup)
      .then((data) => {
        //console.log(data)
        const id = data.id
        //console.log("id is: ", id)
        commit('createMeetup', {
          ...meetup,
          id: id
        })
      })
      .catch((error) => {
        console.log(error)
      })
    },
    signUserUp({commit}, payload) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then( user => {
        commit('SET_LOADING', false)
        const newUser = {
          id: user.uid,
          registeredMeetups: []
        }
        commit('SET_USER', newUser)
      })
      .catch(err => {
        commit('SET_LOADING', false)
        commit('SET_ERROR', err)
        console.log(err)
      })
    },
    signUserIn({commit}, payload) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then( user => {
        commit('SET_LOADING', false)
        const newUser = {
          id: user.uid,
          registeredMeetups: []
        }
        commit('SET_USER', newUser)
      })
      .catch(err => {
        commit('SET_LOADING', false)
        commit('SET_ERROR', err)
        console.log(err)
      })
    },
    clearError({commit}) {
      commit('CLEAR_ERROR')
    },
    autoSignIn({commit}, payload) {
      commit('SET_USER', {id: payload.uid, registeredMeetups: []})
    },
    signOut({commit}) {
      firebase.auth().signOut()
      commit('SET_USER', null)
    }
  },
  getters: {
    loadedMeetups(state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    featuredMeetups(state, getters) {
      return getters.loadedMeetups.slice(0,5)
    },
    loadedMeetup(state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id === meetupId
        })
      }
    },
    user(state) {
      return state.user
    },
    loading(state) {
      return state.loading
    },
    error(state) {
      return state.error
    }
  }
})

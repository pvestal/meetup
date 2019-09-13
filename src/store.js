import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

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
    REGISTER_FOR_MEETUP(state, payload) {
      const id = payload.id
      if(state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return
      }
      state.user.registeredMeetups.push(id)
    },
    UNREGISTER_FOR_MEETUP(state, payload) {
        let i = state.user.registeredMeetups.map(item => item.id).indexOf(payload)
        state.user.registeredMeetups.splice(i,1)
    },
    PUSH_MEETUP(state, payload) {
      state.loadedMeetups.push(payload)
    },
    SET_LOADED_MEETUPS(state, payload){
      state.loadedMeetups = payload
    },
    UPDATE_MEETUP(state, payload) {
      const meetup = state.loadedMeetups.find(meetup => {
        return meetup.id === payload.id
      })
      if(payload.title) {
        meetup.title = payload.title
      }
      if(payload.location) {
        meetup.location = payload.location
      }
      if(payload.description) {
        meetup.description = payload.description
      }
      if(payload.date) {
        meetup.date = payload.date
      }
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
    registerUserForMeetup({commit, getters}, payload) {
      commit('SET_LOADING', true)
      const user = getters.user
      firebase.firestore().collection('registrations')
      .add({meetupId: payload, userId: user.id, timestamp: firebase.firestore.Timestamp.fromDate(new Date())})
      .then(data => {
        console.log("data", data)
        commit('SET_LOADING', false)
        commit('REGISTER_FOR_MEETUP', 
        {id:payload, firebaseKey: data.key})
      })
      .catch(error => {
        console.log(error)
        commit('SET_LOADING', false)
      })
    },
    unregisterUserForMeetup({commit, getters}, payload) {
      commit('SET_LOADING', true)
      //const user = getters.user.registeredMeetups
      // if(!user.firebaseKeys) {
      //   console.log("firebasekeys not true")
      //   return
      // }
      console.log("payload", payload)
      console.log("payload", payload.key)
      firebase.firestore().collection('registrations').doc(payload).delete()
      .then(() => {
        commit('SET_LOADING', false)
        commit('UNREGISTER_FOR_MEETUP', payload)
      })
      .catch(error => {
        console.log(error)
        commit('SET_LOADING', false)
      })
    },
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
      commit('SET_LOADING', true)
      //we could also just pass payload
      const meetup = {
        title: payload.title,
        location: payload.location,
        //imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date,
        creatorId: getters.user.id
      }
      let imageUrl 
      let id
      
      //Reach out to Firebase and store
      firebase.firestore().collection('meetups').add(meetup)
      .then((data) => {
        //console.log(data)
        id = data.id
        return id
      })
      .then(id => {
        const fileName = payload.image.name
        const ext = fileName.slice(fileName.lastIndexOf('.'))
        //put the raw image file into firebase storage
        return firebase.storage().ref('meetups/' + id + '.' + ext).put(payload.image)
      })
      .then(fileData => {
        //return promise to save to firebase
        return fileData.ref.getDownloadURL()
      })
      .then(imageUrl => {
        //update firestore to include imageUrl
        return firebase.firestore().collection('meetups').doc(id).update({imageUrl:imageUrl})
      })
      .then(() => {
        commit('PUSH_MEETUP', {
        ...meetup,
        imageUrl: imageUrl,
        id: id
        })
        commit('SET_LOADING', false)
      })
      .catch((error) => {
        console.log(error)
      })
    },
    updateMeetupData({commit}, payload) {
      commit('SET_LOADING', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if(payload.description) {
        updateObj.description = payload.description
      }
      if(payload.location) {
        updateObj.location = payload.location
      }
      if(payload.date) {
        updateObj.date = payload.date 
      }
      firebase.firestore().collection('meetups').doc(payload.id).update(updateObj)
      .then(() => {
        commit('SET_LOADING', false)
        commit('UPDATE_MEETUP', payload)
      })
      .catch(error => {
        console.log(error)
        commit('SET_LOADING', false)
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
          registeredMeetups: [],
          firebaseKeys: {}
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
          registeredMeetups: [],
          firebaseKeys: {}
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
      commit('SET_USER', {id: payload.uid, registeredMeetups: [], firebaseKeys: {}})
    },
    fetchUserData({commit, getters}) {
      commit('SET_LOADING', true)
      firebase.firestore().collection('/users/' + getters.user.id + '/registrations/').once('value')
      .then(data => {
        const dataPairs = data.val()
        let registeredMeetups = []
        let swappedPairs = {}
        for (let key in dataPairs) {
          registeredMeetups.push(dataPairs[key])
          swappedPairs[dataPairs[key]] = key
        }
        const updatedUser = {
          id: getters.user.id,
          registeredMeetups: registeredMeetups,
          fbKeys: swappedPairs
        }
        commit('SET_LOADING', false)
        commit('SET_USER', updatedUser)
      })
      .catch(error => {
        console.log(error)
        commit('SET_LOADING', false)
        })
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

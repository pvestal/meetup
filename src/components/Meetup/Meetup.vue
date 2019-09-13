<template>
    <v-container>
        <v-layout row wrap v-if="isLoading">
          <v-flex xs12 class="text-xs-center">
            <v-progress-circular v-if="loading" indeterminate class="primary--text" :width="7" :size="70"></v-progress-circular>
          </v-flex>
        </v-layout> 
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h4 class="primary--text">{{meetup.title}}</h4>
                        <template v-if="userIsCreator">
                            <v-spacer></v-spacer>
                            <app-edit-meetupDialog :meetup="meetup"></app-edit-meetupDialog>
                        </template>
                    </v-card-title>
                        <v-img :src="meetup.imageUrl" height="400px"></v-img>
                        <v-card-text>
                            <div class="info--text">{{meetup.date | date}} - {{meetup.location}}</div>
                            <div>
                                <app-edit-meetupDateDialog :meetup="meetup" v-if="userIsCreator"></app-edit-meetupDateDialog>
                                <!--<app-edit-meetupTimeDialog :meetup="meetup" v-if="userIsCreator"></app-edit-meetupTimeDialog>-->
                            </div>
                            <div>{{meetup.description}}</div>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <app-register-meetupDialog :meetupId="meetup.id" v-if="userIsAuthenticated && !userIsCreator"></app-register-meetupDialog>
                        </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        props: ['id'],
        computed: {
            meetup() {
               return this.$store.getters.loadedMeetup(this.id)
            },
            userIsAuthenticated() {
                return this.$store.getters.user !== null && this.$store.getters.user !== undefined
            },
            userIsCreator() {
                if (!this.userIsAuthenticated) {
                    return false
                }
                return this.$store.getters.user.id === this.meetup.creatorId
            },
            isLoading() {
                return this.$store.getters.loading
            }
        }
    }
</script>

<style scoped>
.title {
  position: absolute;
  bottom: 50px;
  background-color: rgba(0,0,0,.5);
  color: white;
  font-size: 2em;
  padding: 20px;
}

  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
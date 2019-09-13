<template>
  <v-container>
    <v-layout>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular v-if="loading" indeterminate class="primary--text" :width="7" :size="70"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-for="meetup in meetups" :key="meetup.id" class="mb-2">
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-card class="info">
          <v-container fluid>
            <v-layout row>
              <v-flex xs5 sm4 md3>
                <v-img :src="meetup.imageUrl" height="125px"></v-img>
              </v-flex>
              <v-flex xs7 sm8 md9>
                <v-card-title>
                  <div>
                  <h5 class="white--text mb-0">{{meetup.title}}</h5>
                  <div>{{meetup.location}}</div>
                  <div>{{meetup.date}}</div>
                  
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat :to="'/meetups/' + meetup.id">
                    <v-icon left light>arrow_forward</v-icon>
                  View Meetup
                  </v-btn>
                </v-card-actions>
              </v-flex>
            </V-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    computed: {
      meetups() {
        return this.$store.getters.loadedMeetups
      },
      loading() {
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
</style>
<template>
    <nav>
        <v-toolbar app dark class="primary">
            <v-toolbar-side-icon @click="sideNav = !sideNav"></v-toolbar-side-icon>
            <v-toolbar-title>
                <router-link to="/" tag="span">MeetUps</router-link>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-xs-only">
                <v-btn
                  flat
                  v-for="item in menuItems"
                  :key="item.title"
                  :to="item.link">
                  <v-icon left dark>{{ item.icon }}</v-icon>
                  {{ item.title }}
                </v-btn>
                <v-btn
                  v-if="userIsAuthenticated" @click="onSignOut" flat>
                  <v-icon left dark>exit_to_app</v-icon>
                  Sign Out
                </v-btn>
              </v-toolbar-items>
        </v-toolbar>

        <v-navigation-drawer v-model="sideNav" temporary app class="primary">
            <v-list>
                <v-list-tile v-for="item in menuItems" :key="item.title" :to="item.link">
                    <v-list-tile-action>
                        <v-icon class="white--text">{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title class="white--text">{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>  
                </v-list-tile v-if="userIsAuthenticated" @click="onSignOut">
                    <v-list-tile>
                    <v-list-tile-action>
                        <v-icon class="white--text">exit_to_app</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title class="white--text">Sign Out</v-list-tile-title>
                    </v-list-tile-content>  
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
    </nav>
</template>

<script>
    export default {
        data() {
            return {
                sideNav: false
            }
        },
        computed: {
            menuItems() {
                let menuItems = [
                    { icon: 'face', title: 'Sign up', link: '/signup' },
                    { icon: 'lock_open', title: 'Sign in', link: '/signin' }
                ]
                if (this.userIsAuthenticated) {
                    menuItems = [
                        { icon: 'supervisor_account', title: 'View Meetups', link: '/meetups' },
                        { icon: 'room', title: 'Organize Meetup', link: '/meetup/new' },
                        { icon: 'person', title: 'Profile', link: '/profile' }
                    ]
                }
                return menuItems
            },
            userIsAuthenticated() {
                return this.$store.getters.user !== null && this.$store.getters.user !== undefined
            }
        },
        methods: {
            onSignOut() {
                this.$store.dispatch('signOut')
                this.$router.push('/')
            }
        }
    }
</script>

<template>
    <v-dialog width="350px" persistent v-model="editDialog">
        <v-btn accent slot="activator">
            Edit Date
        </v-btn>
        <v-card>
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title>Edit Meetup Date</v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-date-picker v-model="editableDate" style="width:100%" actions>
                            <template scope="{save, cancel}">
                                <v-btn class="blue--text darken-1" flat @click="editDialog=false">Close</v-btn>
                                <v-btn class="blue--text darken-1" flat @click="onSaveChanges">Save</v-btn>
                            </template>
                        </v-date-picker>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: ['meetup'],
        
        data() {
            return {
                editDialog: false,
                editableDate: null
            }
        },
        methods: {
            onSaveChanges() {
            const newDate = new Date(this.meetup.date)
            console.log("newDate", newDate)
            const newDay = new Date(this.editableDate).getDate()
            console.log("day", newDate)
             const newMonth = new Date(this.editableDate).getMonth()
             console.log("month", newDate)
             const newYear = new Date(this.editableDate).getFullYear()
             console.log("year", newDate)
             newDate.setDate(newDay)
             console.log("setnewDate", newDate)
             newDate.setMonth(newMonth)
             console.log("setnewMonth", newDate)
             newDate.setFullYear(newYear)
             console.log("setnewYear", newDate)
             this.$store.dispatch('updateMeetupData', {
               id: this.meetup.id,
               date: newDate.toISOString(0,10)
             })
             this.editDialog = false
           }
        },
        created() {
            //this.editableDate = new Date(this.meetup.date).toISOString(0,10)
        }
    }
</script>
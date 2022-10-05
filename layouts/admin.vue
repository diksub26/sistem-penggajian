<template>
    <v-app>
        <v-navigation-drawer v-model="isDrawerOpen" app hide-overlay fixed color="primary" dark>
            <v-sheet class="d-flex align-center pt-6 pb-8 hidden-sm flex-column grey--text text--darken-2" color="orange lighten-4">
                <img src="https://netkromsolution.com/wp-content/uploads/2019/03/cropped-Webp.net-resizeimage.png" width="65%" class="ml-n6">
                <div class="text-caption mt-2">Sistem Informasi Penggajian</div>
            </v-sheet>
            <v-list nav dense rounded>
                <v-list-group prepend-icon="mdi-file" no-action active-class="text--white orange">
                    <template v-slot:activator>
                        <v-list-item-title>Master Data</v-list-item-title>
                    </template>
                    <v-list-item nuxt link>
                        <v-list-item-content to="/master-data/jabatan">
                            <v-list-item-title v-text="'Jabatan'"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app elevation="0" color="white">
            <v-app-bar-nav-icon @click="isDrawerOpen = !isDrawerOpen"/>
            <v-toolbar-title class="primary--text"></v-toolbar-title>
            <v-spacer></v-spacer>
        </v-app-bar>

        <v-main>
            <Nuxt />
        </v-main>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

@Component
export default class AdminLayout extends Vue {
    isDrawerOpen : boolean = true
}
</script>

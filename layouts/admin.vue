<template>
    <v-app>
        <v-navigation-drawer v-model="isDrawerOpen" app hide-overlay fixed color="primary" dark>
            <v-sheet class="d-flex align-center pt-6 pb-8 hidden-sm flex-column grey--text text--darken-2" color="orange lighten-4">
                <img src="https://netkromsolution.com/wp-content/uploads/2019/03/cropped-Webp.net-resizeimage.png" width="65%" class="ml-n6">
                <div class="text-caption mt-2">Sistem Informasi Penggajian</div>
            </v-sheet>
            <v-list nav dense rounded>
                <v-list-group prepend-icon="mdi-folder" no-action active-class="white--text orange">
                    <template v-slot:activator>
                        <v-list-item-title>Master Data</v-list-item-title>
                    </template>
                    <v-list-item v-for="(appMenu, key) in appMenus" nuxt link :key="key">
                        <v-list-item-content :to="appMenu.URL">
                            <v-list-item-title v-text="appMenu.name"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app color="orange lighten-4" elevation="0">
            <v-app-bar-nav-icon @click="isDrawerOpen = !isDrawerOpen" class="grey--text text--darken-2"/>
            <v-toolbar-title class="primary--text">{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom origin="center center" transition="scale-transition" rounded="lg">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" v-bind="attrs" v-on="on" fab depressed small class="mr-4">
                        <v-icon size="30">mdi-account-outline</v-icon>
                    </v-btn>
                </template>
                <v-list width="160px">
                  <v-list-item nuxt link to="/user/profile">
                    <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Profil</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="() => {}">
                    <v-list-item-icon><v-icon>mdi-exit-to-app</v-icon></v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>

        <v-main>
            <v-container fluid>
                <v-sheet rounded="lg" class="pa-2 AppSheet" outlined>
                    <Nuxt />
                </v-sheet>
            </v-container>
        </v-main>
        <SnackbarHolder />
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import SystemStateHelper from '../helper/store/SystemState';
import SnackbarHolder from '../components/global/SnackbarHolder.vue';

@Component({
    components: { SnackbarHolder }
})
export default class AdminLayout extends Vue {
    get title () : string {
        return this.$store.getters[SystemStateHelper.getter.getTitle]
    }

    isDrawerOpen : boolean = true
    appMenus : any[] = [
        { URL : '/master/data/jabatan', name : "Master Jabatan" },
    ]
}
</script>

<style lang="scss" scoped>
.AppSheet {
    height: 675px;
    overflow: auto;
}
</style>

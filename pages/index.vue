<template>
    <v-sheet class="d-flex flex-column HomePageSheet pl-8 pt-12">
        <div class="text-h5 text-md-h3 orange--text text--lighten-2">Hallo {{ fullname}}</div>
        <div class="text-md-h6 orange--text">Selamat Datang di Sistem Informasi Penggajian</div>
    </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SystemStateHelper from '~/helper/store/SystemState';
import { mapGetters } from 'vuex';
@Component({
    layout: "admin",
    head: {
        title: "Home"
    },
    computed : {
        ...mapGetters('SystemState', ['getAuthData'])
    }
})
export default class HomePage extends Vue{
    created () {
        this.$store.commit(SystemStateHelper.mutation.updateTitle, "Home")
    }

    getAuthData!: System.AuthData

    get fullname () : string {
        return this.getAuthData.fullname
    }
}
</script>

<style lang="scss" scoped>
    .HomePageSheet {
        height: 100%;
    }
</style>

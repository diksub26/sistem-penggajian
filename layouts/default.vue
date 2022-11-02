<template>
    <v-app>
        <slot><nuxt/></slot>
        <SnackbarHolder />
    </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import SnackbarHolder from '../components/global/SnackbarHolder.vue';

@Component({
    components: { SnackbarHolder },
})
export default class DefaultLayout extends Vue {
    
}
</script>

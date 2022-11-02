<template>
    <v-app>
        <slot><nuxt/></slot>
    </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class DefaultLayout extends Vue {
    
}
</script>

<template>
    <div class="loginPage">
        <div class="ilustSection hidden-sm-and-down"></div>
        <v-sheet class="formSection px-6 d-flex justify-center align-center" color="orange lighten-4">
            <div class="d-flex flex-column flex-grow-1">
                <div class="formSection_heading d-flex flex-column">
                    <img src="https://netkromsolution.com/wp-content/uploads/2019/03/cropped-Webp.net-resizeimage.png" alt="Logo Netkrom" class="align-self-center mb-8">
                    <p class="grey--text text--darken-2 text-body-2 align-self-center text-center mb-2">Silahkan, Masukan email dan password untuk login.</p>
                    <v-form @submit.prevent="onSubmitFormLogin" ref="formLogin">
                        <v-text-field prepend-inner-icon="mdi-email" :disabled="processingLogin" v-model="form.email" solo flat class="LoginField rounded-md" label="Email" name="email" autofocus :rules="[inputFieldRequiredRules]"/>
                        <v-text-field prepend-inner-icon="mdi-key" :disabled="processingLogin" v-model="form.password" solo flat class="LoginField rounded-md" label="Password" name="password" :type="fieldTypeResolver(isPasswordShown)" :rules="[inputFieldRequiredRules]" :append-icon="revealerIconResolver(isPasswordShown)" @click:append="isPasswordShown = !isPasswordShown"/>
                        <div class="">
                            <v-btn type="submit" :disabled="processingLogin" large class="btn-submit float-right" dark outlined color="primary">
                            <template v-if="processingLogin">
                                <v-progress-circular size="25" indeterminate color="primary"/>
                            </template>
                            <template v-else>Masuk</template>
                            </v-btn>
                        </div>
                    </v-form>
                </div>
            </div>
        </v-sheet>
    </div>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import * as PasswordFieldHelper from '~/helper/utilities/PasswordFieldHeper'
import { mapGetters } from 'vuex';

@Component({
    layout: 'default',
    head: {
        title: "Login"
    },
    computed: {
        ...mapGetters('SystemState', ['getAuthToken', 'getIsLoggedIn'])
    },
    methods: { ...PasswordFieldHelper}
})
export default class LoginPage extends Vue {
    form = {
        email : '',
        password: ''
    }
    processingLogin : boolean = false
    isPasswordShown : boolean = false

    getAuthToken!: string
    getIsLoggedIn!: boolean

    $refs!: {
        formLogin: HTMLFormElement;
    }

    inputFieldRequiredRules = (v : any) =>  !!v|| 'Item Ini Wajib diisi'

    async onSubmitFormLogin () : Promise<void> {
        if(!this.$refs.formLogin.validate()) return

        this.processingLogin = true
        await this.$auth.doLogin(this.form).catch((error :any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        }).finally( () => this.processingLogin = false)

    }

    mounted () {
        if(this.getAuthToken !== '' || this.getIsLoggedIn === true ) return this.$router.push('/')
    }
}
</script>

<style lang="scss" scoped>
$form-section-width: 480px;
.loginPage {
    display: grid;
    grid-template-columns: 1fr #{$form-section-width};
    height: 100vh;

    @media screen and (max-width: #{map-get($grid-breakpoints, 'md')}) {
        grid-template-columns: 100%;
    }
    .formSection {
        height: inherit;
        & > div {
            max-width: $form-section-width;
            margin-top: -150px;
        }

        &_heading {
            & > img {
                width: 200px;
            }
        }

        .LoginField {
            &:deep {
                .error--text.v-messages {
                    color: white !important;
                }
                .v-label {
                  font-size: 0.8em;
                }
            }
        }
    }
    .ilustSection {
        background: url('/img/login-ilust.jpg') no-repeat;
        background-position: center center;
        background-size: 55%;
        height: inherit;
    }
}
</style>
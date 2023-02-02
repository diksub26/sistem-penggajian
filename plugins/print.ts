import Vue from 'vue';
import VueHtmlToPaper from 'vue-html-to-paper';

const options = {
    name: '_blank',
    specs: [
        'fullscreen=yes',
        'titlebar=yes',
        'scrollbars=yes'
    ],
    styles: [
        'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900',
        'https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css',
        'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css',
        'https://unpkg.com/kidlat-css/css/kidlat.css'
    ],
    timeout: 100, // default timeout before the print window appears
    autoClose: true, // if false, the window will not close after printing
    windowTitle: window.document.title, // override the window title
}

Vue.use(VueHtmlToPaper, options);
// or, using the defaults with no stylesheet
Vue.use(VueHtmlToPaper);
const mutation = {
    updateTitle : 'SystemState/UPDATE_TITLE',
    updateAuthData : 'SystemState/UPDATE_AUTH_DATA',
    updateIsLoggedIn : 'SystemState/UPDATE_IS_LOGGED_IN',
    clearAuthData : 'SystemState/CLEAR_AUTH_DATA',
}

const getter = {
    getTitle : 'SystemState/getTitle',
    getAuthToken: 'SystemState/getAuthToken',
    getAuthRole: 'SystemState/getAuthRole',
    getIsLoggedIn: 'SystemState/getIsLoggedIn',
    getAuthData: 'SystemState/getAuthData',
}

const action = {
    doLogin : 'SystemState/doLogin',
    logout : 'SystemState/logout'
}
const SystemStateHelper = {
    mutation, getter, action
}

export default SystemStateHelper
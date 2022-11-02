
declare namespace System {
    interface State {
        title : String,
        systemMessages : import("~/helper/utilities/ToastHelper").ToastMessage[],
        authData : AuthData,
        isLoggedIn : boolean
    }

    interface ApiReponse<T> {
        message : string,
        data : T
        error: [] | string
    }

    interface AuthData {
        token: string,
        role: string,
        email: string,
        fullname: string,
        employePosition: string
    }
}
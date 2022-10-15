
declare namespace System {
    interface State {
        title : String,
        systemMessages : import("~/helper/utilities/ToastHelper").ToastMessage[]
    }

    interface ApiReponse<T> {
        message : string,
        data : T
        error: [] | string
    }
}
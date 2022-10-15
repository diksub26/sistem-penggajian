declare namespace System {
    interface State {
        title : String
    }

    interface ApiReponse<T> {
        message : string,
        data : T
        error: [] | string
    }
}
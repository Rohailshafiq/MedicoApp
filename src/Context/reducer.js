const AppReducer = (prvState, action) => {
    switch (action.type) {
        case 'RETRIEVE_TOKEN':
            return {
                ...prvState,
                userToken: action.token,
            };
        case 'SIGN_IN':
            return {
                ...prvState,
                userToken: action.payload,
            };
        case 'SIGN_OUT':
            return {
                isLoading: false,
                userToken: null,
                user: null
            };
        case 'REGISTER':
            return {
                ...prvState,
                userToken: null,
                user: null
            };
        case 'STORE_USER':
            console.log("coing to store user")
            return {
                ...prvState,
                user: action.payload,
            };
        case 'SET_USER':
            return {
                ...prvState,
                user: action.value,
            };
        case 'LOADER_ON':
            return {
                ...prvState,
                isLoading: true,
            };
        case 'LOADER_OFF':
            return {
                ...prvState,
                isLoading: false,
            };
        case 'CHANGE_COLOR':
            return {
                ...prvState,
                theme: action.payload ? 'dark' : 'light'
            };
        case 'FCM_TOKEN':
            return {
                ...prvState,
                fcmTokenHash: action.payload,
            };
        default:
            return prvState
    }
};
export default AppReducer;
import AppReducer from "./reducer";
import initialState from "./initialStates";
import React, {createContext} from 'react';

export const AppContext = createContext();
const AppContextProvider = ({children}) => {
    const [userStateConfig, defaultDispatch] = React.useReducer(AppReducer, initialState);

    const dispatch = (type, payload) => {
        console.log('context', type, " payload ", payload)
        defaultDispatch({type, payload})
    }
    return (
        <AppContext.Provider value={{userStateConfig, dispatch}}>
            {children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;
export const useAppState = () => React.useContext(AppContext);
import { createContext, useEffect, useReducer } from "react";
import axios from "axios";

export const AuthContext = createContext()

function authReducer (state, action) {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer,{
        user: null
    })

    // useEffect(() => {
    //     const getUser = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:3000/auth/login/success',{
    //                 withCredentials: true
    //             });
    //             if (response.status === 200) {
    //                 dispatch({type: 'LOGIN', payload: response.data.user})
    //             } else {
    //                 console.log('Failed to authenticate user');
    //             }
    //         } catch (err) {
    //             console.log(err.message);
    //         }
            
    //     };

    //     getUser();
    // }, []);

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}
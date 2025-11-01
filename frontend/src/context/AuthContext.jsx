import React, {createContext, useState, useContext} from 'react';
//We will provide authentication context here, to authenticate
// 1. Create the context
const AuthContext = createContext();

//2. Create the provider component
export const AuthProvider = ({children}) => {
    //Check localStorage for existing user info
    const [userInfo, setUserInfo] = useState(() => {
        try {
            const storedUser = localStorage.getItem('userInfo');
            return storedUser? JSON.parse(storedUser) : null;
        } catch (error) {
            console.log('Failed to parse user info from local storage: -> ', error);
            return null;
        }
    });

    //Function to set user info in state and localStorage
    const login = (userData) => {
        setUserInfo(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
    }

    //Function to clear userinfo from state and local storage
    const logout = () => {
        setUserInfo(null);
        localStorage.removeItem('userInfo');
    }

    return (
        <AuthContext.Provider value={{userInfo, login, logout}}></AuthContext.Provider>
    );

} 
//3. Creating a custom hook to use the context
export const useAuth = () => {
    return useContext(AuthContext);
}
import React, { createContext, useContext, useState } from "react";
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

export const AccessTokenContext = createContext(null)

export const useAccessToken = () => {
    return useContext(AccessTokenContext)
}

export const AccessTokenProvider = ({ children }) => {

    const navigate = useNavigate()
    const location = useLocation()
    const [accessToken, setAccessToken] = useState(null)

    const handleSetAccessToken = (accessToken) => {
        setAccessToken(accessToken)
        const origin = location.state?.from?.pathname ||'/'
        navigate(origin)
    }

    const value = {
        accessToken,
        onSetAccessToken: handleSetAccessToken,
    }

    return (
        <AccessTokenContext.Provider value={value}>
            {children}
            <Outlet />
        </AccessTokenContext.Provider>
    )
}

export default AccessTokenProvider
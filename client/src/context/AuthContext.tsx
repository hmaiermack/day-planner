import React, { createContext, Dispatch, SetStateAction, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface IAuthContext {
    authState: IAuthState,
    setAuthState: (authInfo:IAuthState) => void,
    logout: () => void,
    isAuthenticated: () => boolean
}

interface IAuthState {
    AT: string | null,
    RT: string | null,
    expiresAt: string | null
}

const AuthContext = createContext<IAuthContext | null>(null)

const AuthProvider: React.FC = ({children}) => {
    const navigate = useNavigate()


    const AT = localStorage.getItem('AT')
    const RT = localStorage.getItem('RT')
    const expiresAt = localStorage.getItem('expiresAt')

    const [authState, setAuthState] = useState<IAuthState>({
        AT,
        RT,
        expiresAt
    })

    const setAuthInfo = ({AT, RT, expiresAt}: IAuthState) => {
        if(AT && RT && expiresAt) {
            localStorage.setItem('AT', AT)
            localStorage.setItem('RT', RT)
            localStorage.setItem('expiresAt', expiresAt)
    
            setAuthState({
                AT,
                RT,
                expiresAt
            })
        }
    }

    const logout = () => {
        const AT = localStorage.removeItem('AT')
        const RT = localStorage.removeItem('RT')
        const expiresAt = localStorage.removeItem('expiresAt')
        setAuthState({
            AT: null,
            RT: null,
            expiresAt: null
        })

        navigate('/')
    }

    const isAuthenticated = () => {
        if( !authState.AT || !authState.expiresAt) {
            return false
        }
        return (
            new Date().getTime() / 1000 < parseInt(authState.expiresAt)
            )
    }

  return (
    <AuthContext.Provider
        value={{
            authState,
            setAuthState: authInfo => setAuthInfo(authInfo),
            logout,
            isAuthenticated,
        }}
    >
        {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
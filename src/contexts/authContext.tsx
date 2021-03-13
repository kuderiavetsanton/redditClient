import axios from "axios";
import { createContext, useReducer, useContext, useEffect } from "react";
import jwt_decode from 'jwt-decode'

interface User{
    username:string,
    email:string,
}

interface State{
    user:User,
    authenticated:boolean,
    loading:boolean
}

interface Action{
    type:string,
    payload:any
}

let StateContext = createContext(null)

let DispatchContext = createContext(null)

const reducer = (state:State,action:Action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state,user:action.payload, authenticated:true }
            break;
        case 'LOGOUT':
            return { ...state, authenticated:false }
            break;
        case 'STOP_LOADING':{
            return { ...state, loading:false }
            break;
        }
        default:
            break;
    }
}

export default function AuthProvider( { children } ){
    const ISSERVER = typeof window === "undefined";
    let token:string|undefined;
    if(!ISSERVER){
        token = localStorage.getItem('token')
    }
    let decoded
    if(token){
         decoded = jwt_decode(token)
    }
    axios.defaults.headers.common['Authorization'] = token ?  `Bearer ${token}` : null
    let initialState:State 
    initialState = {
        user:decoded?.username && decoded?.email ? {
            username:decoded.username,
            email:decoded.email
        } : null,
        authenticated:decoded ? true : false,
        loading:false
    }
    const [ state,defaultDispatch ] = useReducer(reducer,initialState)
    const dispatch = (type:string,payload?:any) => defaultDispatch({ type, payload })

    useEffect(() => {
        async function loadUser(){
            try {
                let res = await axios.get('/auth/me')
                console.log(res)
                dispatch('LOGIN',res.data)
            } catch (error) {
                console.log({...error})
            }finally{
                dispatch('STOP_LOADING')
            }
        }
        loadUser()
    }, [])
    return (
        <div className="">
            <StateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>
                    { children }
                </DispatchContext.Provider>
            </StateContext.Provider>
        </div>
    )
}

export const useAuthState = () => useContext(StateContext)
export const useAuthDispatch = () => useContext(DispatchContext)

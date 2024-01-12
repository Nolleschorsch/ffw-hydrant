import { createSlice } from '@reduxjs/toolkit'
//import hydrantsData from './dummydata/hydrants.json'
import solutionData from '../../mocks/data/solution/solutionCompleteWithHome.json'
import routes from '../../mocks/data/routes/routes.json'

export const initialState = {
    accessToken: '',
    hydrantDraft: {},
    hydrants: [],
    solution: {},
    routes: [],
    solutionName: '',
    layers: {previous: [], current: []},
    sources: {previous: [], current: []},
    home: {},
    homeMode: false
}

/* export const initialStateTest = {
    hydrants: hydrantsData.hydrants,
    solution: solutionData,
    routes: routes,
    solutionName: 'Ettlingenweier 7 Gruppen',
    layers: {previous: [], current: []},
    sources: {previous: [], current: []}
} */

export const mapSlice = createSlice({
    name: 'map',
    initialState: initialState,//process.env.MY_ENV_VAR === 'Foo' ? initialState : initialStateTest,
    reducers: {
        resetToInitialState(state, action) {
            return { ...initialState }
        },
        setAccessToken(state, action) {
            return {
                ...state,
                accessToken: action.payload
            }
        },
        setHydrants(state, action) {
            return {
                ...state,
                hydrants: action.payload
            }
        },
        addHydrant(state, action) {
            return {
                ...state,
                hydrants: [...state.hydrants, action.payload]
            }
        },
        editHydrant(state, action) {
            const { payload: { modifiedHydrant, index } } = action
            const hydrants = [...state.hydrants]
            hydrants.splice(index, 1, modifiedHydrant)
            return {
                ...state,
                hydrants
            }
        },
        deleteHydrant(state, action) {
            const index = action.payload
            const hydrants = [...state.hydrants]
            hydrants.splice(index, 1)
            return {
                ...state,
                hydrants
            }
        },
        setHydrantDraft(state, action) {
            return {
                ...state,
                hydrantDraft: action.payload
            }
        },
        setSolution(state, action) {
            return {
                ...state,
                solution: action.payload
            }
        },
        setRoutes(state, action) {
            return {
                ...state,
                routes: action.payload
            }
        },
        setSolutionName(state, action) {
            return {
                ...state,
                solutionName: action.payload
            }
        },
        setSources(state, action) {
            return {
                ...state,
                sources: {previous: state.sources.current, current: action.payload}
            }
        },
        setLayers(state, action) {
            return {
                ...state,
                layers: {previous: state.layers.current, current: action.payload}
            }
        },
        setHomeMode(state, action) {
            return {
                ...state,
                homeMode: action.payload
            }
        },
        setHome(state, action) {
            return {
                ...state,
                home: action.payload
            }
        }
    }
})


export const {
    resetToInitialState,
    setAccessToken,
    setHydrants,
    addHydrant,
    editHydrant,
    deleteHydrant,
    setHydrantDraft,
    setSolution,
    setRoutes,
    setSolutionName,
    setSources,
    setLayers,
    setHome,
    setHomeMode
} = mapSlice.actions


export default mapSlice.reducer
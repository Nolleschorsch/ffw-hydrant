import { combineReducers, configureStore } from '@reduxjs/toolkit'
import mapReducer from '../features/map/mapSlice'
import toastReducer from '../features/map/toastSlice'
import { hydrantApi, mapboxApi, mapboxDirectionsApi } from '../features/map/api'


export const rootReducer = combineReducers({
    mapbox: mapReducer,
    toastService: toastReducer,
    [hydrantApi.reducerPath]: hydrantApi.reducer,
    [mapboxApi.reducerPath]: mapboxApi.reducer,
    [mapboxDirectionsApi.reducerPath]: mapboxDirectionsApi.reducer
})


export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            hydrantApi.middleware, mapboxApi.middleware, mapboxDirectionsApi.middleware
        )
})

export const setupStore = preloadedState => configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            hydrantApi.middleware, mapboxApi.middleware, mapboxDirectionsApi.middleware
        )
})

export default store
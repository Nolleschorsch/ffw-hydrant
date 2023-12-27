import { setupServer } from 'msw/node'
import handlers from './handlers' 
//import { drf_handlers, mapbox_optimization_v2_handlers, handlers } from "./handler"

//const handlers = [...drf_handlers, ...mapbox_optimization_v2_handlers]

//export const server = setupServer(...handlers.all_handlers)
export const server = setupServer()
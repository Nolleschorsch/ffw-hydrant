import { setupWorker } from 'msw/browser'
//import { handlers, external_handlers } from './handler'
import handlers from './handlers' 

//export const worker = setupWorker(...handlers.external_handlers)
//export const worker = setupWorker(...handlers.all_handlers)
export const worker = setupWorker(...handlers.drf_handlers)
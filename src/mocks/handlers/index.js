import { drf_handlers } from './django_rest_framework'
import { mapbox_directions_handlers } from './mapbox_directions'
import { mapbox_optimization_v2_handlers } from './mapbox_optimization_v2'

export default {
    drf_handlers, mapbox_directions_handlers, mapbox_optimization_v2_handlers,
    external_handlers: [...mapbox_optimization_v2_handlers, ...mapbox_directions_handlers],
    all_handlers: [...mapbox_optimization_v2_handlers, ...mapbox_directions_handlers, ...drf_handlers]
}
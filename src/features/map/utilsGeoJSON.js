// TODO: this is a stupid solution. Refactor it.
// BIGGEST PIECE OF SHIT EVER
import * as utilsGeoJSON from './utilsGeoJSON' // hack to mock stuff


export const createHomeSourceAndLayer = (home) => {
    //const features = createGeoJSONPointSource([home.lng, home.lat], {})
    //const features = createGeoJSONPointSource([], {})
    const lat = home ? home.lat : 48.928557711511985
    const lng = home ? home.lng : 8.382998438425176

    //const features = home ? createGeoJSONPointSource([lng, lat], {}) : []
    const features = home ? [createGeoJSONPointSource([home.lng, home.lat], {})] : []
    const featureCollection = createGeoJSONFeatureCollection(features)
    const source = {
        type: 'geojson',
        data: featureCollection,
        promoteId: 'home-source'
    }
    /* const layer = createPointLayer({
        layerName: 'home-layer',
        sourceName: 'home-source',
        color: '#11b4da'
    }) */

    const layer = {
        id: 'home-layer',
        type: 'circle',
        source: 'home-source',
        paint: {
            'circle-color': 'green',
            'circle-radius': 15,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    }

    return [source, layer]
}

export const createFooHydrantsSourceAndLayer = (hydrants) => {


    const features = hydrants.map((hyd, i) => createGeoJSONPointSource(
        [hyd.lng, hyd.lat],
        { ...hyd, index: i },
    ))

    const featureCollection = createGeoJSONFeatureCollection(features)
    const source = {
        type: 'geojson',
        data: featureCollection,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 20,
        promoteId: 'foobar123-source'
    }
    const layer = createPointLayer({
        layerName: 'foobar123-layer',
        sourceName: 'foobar123-source',
        color: 'red'
    })


    return [source, layer]
}

export const createSourcesAndLayers = (routes, solutionRoutes) => {
    const [sources1, layers1] = utilsGeoJSON.createRoutesSourceAndLayer(routes)
    const [sources2, layers2] = utilsGeoJSON.createHydrantsSourceAndLayer(solutionRoutes)
    return [sources1.concat(sources2), layers1.concat(layers2)]
}

export const createRoutesSourceAndLayer = (
    routes/* ,
    _createGeoJSONLineSource=createGeoJSONLineSource,
    _createLineLayer=createLineLayer */
) => {

    const sources = []
    const layers = []

    for (const route of routes) {
        const source = `routeSource-${route.name}`
        const _layers = [`routeLayer-${route.name}`]
        const geometry = { type: 'LineString', coordinates: route.coordinates }
        const routeSource = utilsGeoJSON.createGeoJSONLineSource(geometry, source)

        const routeLayer = utilsGeoJSON.createLineLayer(
            {
                routeLayerName: _layers[0], routeSourceName: source, routeColor: 'red',
                lineWidth: 4, lineGapWidth: 0
            })

        sources.push(routeSource)
        layers.push(routeLayer)
    }

    return [sources, layers]

}

export const createHydrantsSourceAndLayer = (solutionRoutes) => {

    const sources = []
    const layers = []
    for (const route of solutionRoutes) {

        const source = `hydrantSource-${route.vehicle}`
        const _layers = [`hydrantLayer-${route.vehicle}`, `symbolLayer-${route.vehicle}`]

        const pointFeatures = utilsGeoJSON.createPointFeaturesFromStops({ stops: route.stops, uniqueName: route.vehicle })
        const pointFeatureCollection = utilsGeoJSON.createGeoJSONFeatureCollection(pointFeatures)

        const pointLayer = utilsGeoJSON.createPointLayer({
            layerName: _layers[0],
            sourceName: source,
            color: 'red'
        })

        const symbolLayer = utilsGeoJSON.createSymbolLayer({
            layerName: _layers[1],
            sourceName: source,
            text: ['get', 'index']
        })

        sources.push({ type: 'geojson', data: pointFeatureCollection, promoteId: source })
        layers.push(pointLayer, symbolLayer)
    }

    return [sources, layers]
}


export const createPointFeaturesFromStops = ({ stops, uniqueName }) => {

    return stops.map((stop, index) => utilsGeoJSON.createGeoJSONPointSource(
        stop.location_metadata.supplied_coordinate,
        {
            name: stop.location,
            distance: stop.odometer,
            group: uniqueName,
            index
        }
    ))

}


export const createGeoJSONPointSource = (coordinates, properties) => {
    return {
        'type': 'Feature',
        'properties': properties,
        'geometry': {
            'type': 'Point',
            'coordinates': coordinates
        }
    }
}


export const createGeoJSONFeatureCollection = (features) => {
    return {
        'type': 'FeatureCollection',
        'features': features
    }
}


export const createGeoJSONLineSource = (geometry, name) => {
    return {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': geometry
        },
        'promoteId': name
    }
}


export const createPointLayer = (props) => {
    const { layerName, sourceName, color } = props
    return {
        'id': layerName,
        'type': 'circle',
        'source': sourceName,
        'paint': {
            'circle-color': color,
            'circle-radius': 15
        }
    }
}


export const createSymbolLayer = (props) => {
    const { layerName, sourceName, color, text } = props
    return {
        'id': layerName,
        'type': 'symbol',
        'source': sourceName,
        'layout': {
            'text-field': text
        },
        'paint': {
            'text-color': '#FFFFFF'
        }
    }
}


export const createLineLayer = (props) => {
    const { routeLayerName, routeSourceName, routeColor, lineWidth, lineGapWidth } = props
    return {
        'id': routeLayerName,
        'type': 'line',
        'source': routeSourceName,
        'layout': {
            'visibility': 'visible',
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': routeColor,
            'line-width': lineWidth,
            'line-gap-width': lineGapWidth
        }
    }
}


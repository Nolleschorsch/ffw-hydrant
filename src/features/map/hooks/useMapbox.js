import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min'
import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setHydrantDraft } from '../mapSlice'
import { createFooHydrantsSourceAndLayer } from '../utilsGeoJSON'


export const useMapbox = (map, mapContainer) => {

    const dispatch = useDispatch()

    const {
        accessToken, hydrants, solution, routes, layers, sources, hydrantDraft
    } = useSelector(state => state.mapbox)
    mapboxgl.accessToken = accessToken

    const geocoder = useRef(null)

    const WEIER_LNG = 8.3916033
    const WEIER_LAT = 48.9231337
    const lng = WEIER_LNG
    const lat = WEIER_LAT
    const zoom = 14//16
    const [mapLoaded, setMapLoaded] = useState(false)

    const resultGeocoder = e => {
        const { result: { center: [lng, lat], place_name: name } } = e
        dispatch(setHydrantDraft({ lat, lng, name, active: true }))
    }

    const clickLayer = (e) => {
        // workaround see https://github.com/mapbox/mapbox-gl-js/issues/9875#issuecomment-659088510
        e.clickOnLayer = true;
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        dispatch(setHydrantDraft(properties))
    }

    const clickMap = e => {
        if (e.clickOnLayer) return;

        const { lngLat: { lng, lat } } = e
        const properties = {
            lat, lng, name: 'Neuer Hydrant', active: true
        }
        dispatch(setHydrantDraft(properties))
    }

    const initializeMap = () => {
        map.current = new mapboxgl.Map({
            accessToken: mapboxgl.accessToken,
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
        })

        geocoder.current = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: false,
            countries: 'DE',
            testMode: true
        })
        geocoder.current.on('result', resultGeocoder)
        map.current.addControl(
            geocoder.current,
            'bottom-left'
        )

        map.current
            .on('click', 'unclustered-point', clickLayer)
            .on('click', clickMap)

        map.current.once('idle', () => {
            setMapLoaded(true)
        })

    }

    const setLayerVisibility = (layer, visible) => {
        const visibility = visible ? 'visible' : 'none'
        map.current.setLayoutProperty(layer, 'visibility', visibility)
    }

    const getLayerVisibility = (layer) => {
        const exists = map.current.getLayer(layer)
        return map.current.getLayer(layer) ? map.current.getLayoutProperty(layer, 'visibility') : 'visible'
        //return map.current.getLayoutProperty(layer, 'visibility')
    }

    useEffect(() => {
        /* istanbul ignore if */
        if (!map.current) {
            initializeMap()
        }
        if (!mapLoaded) return;

        const [fooSources, fooLayers] = createFooHydrantsSourceAndLayer(hydrants)
        const fooLayerNames = ['clusters', 'cluster-count', 'unclustered-point']

        for (const layer of fooLayerNames) {
            if (map.current.getLayer(layer)) {
                map.current.removeLayer(layer)
            }
        }

        if (map.current.getSource('foobar123-source')) {
            map.current.removeSource('foobar123-source')
        }

        map.current.addSource(fooSources.promoteId, fooSources)

        map.current.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'foobar123-source',
            filter: ['has', 'point_count'],
            paint: {
                // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
                // with three steps to implement three types of circles:
                //   * Blue, 20px circles when point count is less than 100
                //   * Yellow, 30px circles when point count is between 100 and 750
                //   * Pink, 40px circles when point count is greater than or equal to 750
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#51bbd6',
                    100,
                    '#f1f075',
                    750,
                    '#f28cb1'
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20,
                    100,
                    30,
                    750,
                    40
                ]
            }
        });

        map.current.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'foobar123-source',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': ['get', 'point_count_abbreviated'],
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });

        map.current.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'foobar123-source',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#11b4da',
                'circle-radius': 15,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            }
        });

    }, [hydrants, mapLoaded, hydrantDraft.lat]);


    useEffect(() => {
        if (!mapLoaded) return;

        for (const layer of layers.previous) {
            map.current.removeLayer(layer.id)
        }
        for (const source of sources.previous) {
            map.current.removeSource(source.promoteId)
        }
        for (const source of sources.current) {
            map.current.getSource(source.promoteId) ? null : map.current.addSource(source.promoteId, source)

        }
        for (const layer of layers.current) {
            map.current.getLayer(layer.id) ? null : map.current.addLayer(layer)
        }
    }, [mapLoaded, layers, sources])

    useEffect(() => {
        map.current.resize()
    }, [mapLoaded])

    return { mapLoaded, setLayerVisibility, getLayerVisibility }
}
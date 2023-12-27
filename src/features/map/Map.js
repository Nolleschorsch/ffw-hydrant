import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
//import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'
//import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import React, { useRef, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useSelector, useDispatch } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

import { useAccessToken } from '../../app/AccessTokenProvider';
import { useGetHydrantsQuery } from './api'
import { addHydrant, editHydrant, setHydrantDraft } from './mapSlice'
import { isNewOrModified } from './utils'

import PrintRoute from './PrintRoute';
import Popup from './Popup';
import HydrantPopup from './HydrantPopup';
import Menu from './Menu'

import './Map.css'
import { createFooHydrantsSourceAndLayer, createHydrantsSourceAndLayer, createSourcesAndLayers } from './utilsGeoJSON';

// TODO: hydrants
// no more rendering mass Marker instances (performance issue might be related to this)
// render FeatureCollection of type Feature: Point instead
// click event on this layer adds marker, disable locked, edit

/* export const getHydrantMarkers = async ({ hydrants, data, dispatch, editHydrant }) => {

    const markers = []

    for await (const [index, hydrant] of hydrants.entries()) {
        const { lng, lat, name } = hydrant

        const color = isNewOrModified(data, hydrant) ? 'red' : 'grey'

        const popupNode = document.createElement("div")
        const popupRoot = createRoot(popupNode)

        const dispatchEditHydrant = ({ index, modifiedHydrant }) => {
            dispatch(editHydrant({ index, modifiedHydrant }))
        }

        const hydProps = { ...hydrant, index, dispatchEditHydrant }

        popupRoot.render(<HydrantPopup {...hydProps} />)

        let p = new mapboxgl.Popup({ maxWidth: 'none' }).setDOMContent(popupNode)

        const marker = new mapboxgl.Marker({ color, draggable: true })
            .setLngLat([lng, lat])
            .setPopup(p)
            .on('dragend', (e) => {
                const { target: { _lngLat: { lat, lng } } } = e
                const modifiedHydrant = Object.assign({}, { ...hydrant }, { lat, lng })
                dispatch(editHydrant({ modifiedHydrant, index }))
            })

        markers.push(marker)
    }

    return Promise.resolve(markers)
} */

export const bla = (hydrant, data, dispatch, editHydrant, hydrantDraft) => {
    // TODO:
    // https://sparkgeo.com/blog/create-a-working-react-mapbox-popup/
    const { lng, lat, name, index } = hydrant

    const color = isNewOrModified(data, hydrant) ? 'red' : 'grey'

    const popupNode = document.createElement("div")
    const popupRoot = createRoot(popupNode)

    const dispatchEditHydrant = ({ index, modifiedHydrant }) => {
        dispatch(editHydrant({ index, modifiedHydrant }))
    }

    const hydProps = { ...hydrant, index, dispatchEditHydrant }
    //const hydProps = {...hydrantDraft, index, dispatchEditHydrant}

    popupRoot.render(<HydrantPopup {...hydProps} />)

    let p = new mapboxgl.Popup({ maxWidth: 'none' }).setDOMContent(popupNode)

    const marker = new mapboxgl.Marker({ color, draggable: true })
        .setLngLat([lng, lat])
        .setPopup(p)
        .on('dragend', (e) => {
            const { target: { _lngLat: { lat, lng } } } = e
            const modifiedHydrant = Object.assign({}, { ...hydrant }, { lat, lng })
            dispatch(editHydrant({ modifiedHydrant, index }))
            //dispatch(setHydrantDraft(modifiedHydrant))
        })

    return marker
}

const WEIER_LNG = 8.3916033
const WEIER_LAT = 48.9231337

export const MapComponent = (props) => {

    const { accessToken } = useAccessToken()

    mapboxgl.accessToken = accessToken

    //mapboxgl.accessToken = props.accessToken || ''

    const mapContainer = useRef(null);
    const map = useRef(null);
    //const directions = useRef(null);
    const geocoder = useRef(null);

    const dispatch = useDispatch()
    const mapState = useSelector(state => state.mapbox)
    const { data, error, isLoading, isSuccess } = useGetHydrantsQuery()

    const [markers, setMarkers] = useState([])
    const [showMarkers, setShowMarkers] = useState(true)
    const [mapLoaded, setMapLoaded] = useState(false)

    const hydrants = mapState.hydrants
    const solution = mapState.solution
    const routes = mapState.routes
    const layers = mapState.layers
    const sources = mapState.sources
    const hydrantDraft = mapState.hydrantDraft
    const lng = WEIER_LNG
    const lat = WEIER_LAT
    const zoom = 16


    // initialize mapbox stuff
    useEffect(() => {
        /* istanbul ignore if */
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            accessToken: mapboxgl.accessToken,
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom,
            testMode: true
        })

        /* directions.current = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            profile: 'mapbox/walking',
            unit: 'metric',
            interactive: false,
            flyTo: false,
            testMode: true
        }) */

        geocoder.current = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: false,
            countries: 'DE',
            testMode: true
        })

        map.current.addControl(
            geocoder.current,
            'bottom-left'
        )

        map.current.once('idle', () => {
            setMapLoaded(true)
        })

    });


    const clickLayer = (e) => {
        markers.forEach(marker => marker.remove())
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

        markers.forEach(marker => marker.remove())
        const { lngLat: { lng, lat } } = e
        const properties = {
            lat, lng, name: 'Neuer Hydrant', active: true
        }
        dispatch(setHydrantDraft(properties))
    }

    useEffect(() => {
        if (!mapLoaded) return;
        map.current
            .on('click', 'unclustered-point', clickLayer)
            .on('click', clickMap)

        return () => {
            map.current
                .off('click', 'unclustered-point', clickLayer)
                .off('click', clickMap)
        }
    }, [hydrants, mapLoaded, markers, mapState.hydrantDraft.lat])


    const resultGeocoder = e => {
        const { result: { center: [lng, lat], place_name: name } } = e
        //dispatch(addHydrant({ lat, lng, name }))
        dispatch(setHydrantDraft({ lat, lng, name, active: true }))
    }

    useEffect(() => {
        if (!geocoder.current) return;
        geocoder.current.on('result', resultGeocoder)

        return () => {
            geocoder.current.off('result', resultGeocoder)
        }
    }, [])

    /* useEffect(() => {
        if (!geocoder.current) return;
        geocoder.current.on('result', (e) => {
            const { result: { center: [lng, lat], place_name: name } } = e
            dispatch(setHydrantDraft({ lat, lng, name, active: true }))
        })
    }, []) */

    /*  useEffect(() => {
         if (!hydrants || !map.current) return;
 
         markers.forEach(marker => marker.remove())
 
         getHydrantMarkers({ hydrants, data, dispatch, editHydrant })
             .then(_markers => {
                 for (const m of _markers) {
                     m.addTo(map.current)
                 }
                 setMarkers(_markers)
             }).catch(error => { console.log("LMAO ERROR ", error) })
 
     }, [hydrants]) */

    // testing stuff
    useEffect(() => {
        if (/* !hydrants || !map.current ||  */!mapLoaded) return;

        const [fooSources, fooLayers] = createFooHydrantsSourceAndLayer(hydrants)
        const fooLayerNames = ['clusters', 'cluster-count', 'unclustered-point']


        console.log('MAP LOADED', map.current.loaded(), mapLoaded)

        for (const layer of fooLayerNames) {
            if (map.current.getLayer(layer)) {
                map.current.removeLayer(layer)
            }
        }

        if (map.current.getSource('foobar123-source')) {
            map.current.removeSource('foobar123-source')
        }
        //map.current.once('idle')

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


    }, [hydrants, mapLoaded])

    useEffect(() => {
        if (!map.current || !mapLoaded) return;

        const asyncFunc = async () => {
            for await (const layer of layers.previous) {
                map.current.removeLayer(layer.id)
            }
            for await (const source of sources.previous) {
                map.current.removeSource(source.promoteId)
            }
            for await (const source of sources.current) {
                await map.current.addSource(source.promoteId, source)
            }
            for await (const layer of layers.current) {
                await map.current.addLayer(layer)
            }
        }

        asyncFunc()


    }, [layers, sources, mapLoaded])


    const handleToggleMarkers = event => {
        showMarkers
            ? markers.forEach(marker => marker.remove())
            : markers.forEach(marker => marker.addTo(map.current))
        setShowMarkers(!showMarkers)
    }

    const setLayerVisibility = (layer, visible) => {
        const visibility = visible ? 'visible' : 'none'
        map.current.setLayoutProperty(layer, 'visibility', visibility)
    }

    const style = { position: "fixed", top: "50%", left: "50%" }

    return (
        <>
            {mapState.hydrantDraft.lat && <Popup map={map.current} />}
            <div className='no-print'>
                <Row style={{ height: "100%" }}>
                    <Col xs={12} xl={9} style={{ height: '90vh' }}>
                        {/* {isLoading && <Spinner style={style} />}
                        <Button onClick={handleToggleMarkers}>Toggle Hydrants</Button> */}
                        <div ref={mapContainer} className="map-container" />
                    </Col>
                    <Col xs={12} xl={3}>
                        <Menu setLayerVisibility={setLayerVisibility} routes={routes} />
                    </Col>
                </Row>
            </div>
            <div className='print'>
                <PrintRoute solution={solution} />
            </div>
        </>
    )
}

export default MapComponent;

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import React, { useRef, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

//import fooData from '../../../public/hydrants_deutschland_stripped.geojson'

import { useAccessToken } from '../../app/AccessTokenProvider';

//import './Map.css'

const WEIER_LNG = 8.3916033
const WEIER_LAT = 48.9231337

export const MapComponent = (props) => {
    const { accessToken } = useAccessToken()
    mapboxgl.accessToken = accessToken

    const mapContainer = useRef(null);
    const map = useRef(null);
    const lng = WEIER_LNG
    const lat = WEIER_LAT
    const zoom = 12


    // initialize mapbox stuff
    useEffect(() => {
        /* istanbul ignore if */
        if (map.current) return; // initialize map only once
        (async () => {
            map.current = new mapboxgl.Map({
                accessToken: mapboxgl.accessToken,
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom: zoom,
                testMode: true
            })
            map.current.on('load', () => {
                map.current.addSource('hydrants-bw', {
                    type: 'geojson',
                    // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
                    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
                    //data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
                    //data: 'http://localhost:8080/hydrants_bw_geojsons_stripped.geojson',
                    data: 'http://localhost:8080/hydrants_deutschland_stripped.geojson',
                    //data: '../public/hydrants_deutschland_stripped.geojson',
                    //data: fooData,
                    cluster: true,
                    clusterMaxZoom: 14, // Max zoom to cluster points on
                    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
                })
                map.current.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'hydrants-bw',
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
                    source: 'hydrants-bw',
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
                    source: 'hydrants-bw',
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': '#11b4da',
                        'circle-radius': 4,
                        'circle-stroke-width': 1,
                        'circle-stroke-color': '#fff'
                    }
                });
            })
            await map.current.once('idle')

        })()

    });

    const style = { position: "fixed", top: "50%", left: "50%" }


    return (
        <>
            <div className='no-print' style={{ height: "100vh", overflow: 'clip' }}>
                <Row style={{ height: "100%" }}>
                    <Col xs={12}>
                        <div ref={mapContainer} className="map-container" />
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default MapComponent;

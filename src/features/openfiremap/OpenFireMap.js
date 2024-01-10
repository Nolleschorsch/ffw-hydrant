import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import { useMapbox } from './hooks/useMapbox';
import './OpenFireMap.css'

const WEIER_LNG = 8.3916033
const WEIER_LAT = 48.9231337

export const MapComponent = (props) => {

    const mapContainer = useRef(null);
    const map = useRef(null);

    const isLoading = useMapbox(map, mapContainer)

    const style = { position: "absolute", top: "50%", left: "50%", zIndex:  1000}


    return (
        <>
            <div className='no-print map-wrapper' >
                <Row style={{ height: "100%" }}>
                    <Col xs={12}>
                        {isLoading && <div className="loading-spinner-overlay"><Spinner className="loading-spinner"/></div>}
                        <div ref={mapContainer} className="map-container" style={{display: isLoading ? 'none' : 'block'}}/>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default MapComponent;

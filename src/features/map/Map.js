import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux'

import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Spinner from 'react-bootstrap/Spinner'

import { useMapbox } from './hooks/useMapbox';
import { useHydrants } from './hooks/useHydrants';

import PrintRoute from './components/printroute';
import Popup from './components/popup';
import Menu from './components/menu'

import './Map.css'
import { ArrowLeft } from 'react-bootstrap-icons';
import { useMenu } from './hooks/useMenu';


export const MapComponent = (props) => {

    const {
        accessToken, hydrants, solution, routes, layers, sources, hydrantDraft
    } = useSelector(state => state.mapbox)

    useHydrants()

    const mapContainer = useRef(null);
    const map = useRef(null);
    const { mapLoaded, setLayerVisibility, getLayerVisibility } = useMapbox(map, mapContainer)

    const [showMenu, setShowMenu] = useMenu()

    const menuProps = {
        setLayerVisibility,
        getLayerVisibility,
        routes,
        layers: layers.current
    }

    return (
        <>
            {hydrantDraft.lat && <Popup map={map.current} />}
            <div className='no-print map-wrapper'>
                {!mapLoaded && <div className="loading-spinner-overlay"><Spinner className="loading-spinner" /></div>}
                <Button onClick={() => setShowMenu(!showMenu)} id='menu-toggle-button' size="lg"><ArrowLeft /></Button>
                <div ref={mapContainer} className="map-container" />
                <Offcanvas show={showMenu} placement='end' onHide={() => setShowMenu(false)} id="menu-offcanvas">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Menu</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Menu {...menuProps}/* setLayerVisibility={setLayerVisibility} routes={routes} */ />
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
            <div className='print'>
                <PrintRoute solution={solution} />
            </div>
        </>
    )
}

export default MapComponent;

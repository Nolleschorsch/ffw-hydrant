import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import { addHydrant, editHydrant, deleteHydrant, setHydrantDraft } from './mapSlice'
import { isNewOrModified } from './utils';
import HydrantPopup from './HydrantPopup';

export const Popup = (props) => {

    console.log(props.map)

    const { map } = props
    const dispatch = useDispatch()
    const popupRef = useRef()
    const hydrantDraftState = useSelector(state => state.mapbox.hydrantDraft)
    const hydrants = useSelector(state => state.mapbox.hydrants)

    const { index, ...modifiedHydrant } = hydrantDraftState
    const { lng, lat, name, active } = modifiedHydrant
    const lngLat = [lng, lat]


    const meh = isNewOrModified(hydrants, modifiedHydrant)

    useEffect(() => {

        if(!map) return;

        const popup = new mapboxgl.Popup({ closeButton: false })
            .setLngLat(lngLat)
            .setDOMContent(popupRef.current)

        const marker = new mapboxgl.Marker({ draggable: true })
            .setLngLat(lngLat)
            .setPopup(popup)
            .addTo(map)
            .on('dragend', (e) => {
                const { target: { _lngLat: { lat, lng } } } = e
                const hydrantDraft = Object.assign(
                    {}, { ...hydrantDraftState }, { lat, lng }
                )
                dispatch(setHydrantDraft(hydrantDraft))
            })
            .togglePopup()

        return () => {
            // ???
            popup.remove(),
                marker.remove();
        }
    }, [lngLat]);

    const handleChangeName = value => {
        const hydrantDraft = Object.assign(
            {}, { ...hydrantDraftState }, { name: value }
        )
        dispatch(setHydrantDraft(hydrantDraft))
    }

    const handleConfirm = () => {
        const { index, ...modifiedHydrant } = hydrantDraftState
        hydrantDraftState.index !== undefined
            ? dispatch(editHydrant({ modifiedHydrant, index }))
            : dispatch(addHydrant(modifiedHydrant))
        dispatch(setHydrantDraft({}))
    }

    const handleAbort = () => {
        dispatch(setHydrantDraft({}))
    }

    const handleDelete = (index) => {
        dispatch(deleteHydrant(index))
        dispatch(setHydrantDraft({}))
    }

    return (
        <div style={{ display: "none" }}>
            <div ref={popupRef}>
                <HydrantPopup {...hydrantDraftState} deleteHydrant={handleDelete}
                    changeName={handleChangeName} confirm={handleConfirm}
                    abort={handleAbort}/>
            </div>
        </div>
    )

}

export default Popup
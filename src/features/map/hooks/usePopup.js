import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import mapboxgl from 'mapbox-gl';
import { addHydrant, editHydrant, deleteHydrant, setHydrantDraft } from "../mapSlice"

const autoPan = (map, popup) => {
    // fixes popup not shown in full on small devices, mapbox doenst support autoPan
    const pan = [0, 0];
    const point = map.project(popup._lngLat);
    const popupSize = {
        width: popup._container.clientWidth,
        height: popup._container.clientHeight,
    };
    const popupRect = popup._container.getBoundingClientRect();
    const mapRect = map._container.getBoundingClientRect();

    // Center point horizontally to make the popup visible, if needed
    const popupRelativeLeft = popupRect.x - mapRect.x;
    const popupClippedHorizontally = popupRelativeLeft < 0 || (mapRect.width - popupRelativeLeft - popupSize.width) < 0;
    if (popupClippedHorizontally) {
        pan[0] = point.x - (mapRect.width / 2);
    }

    // Move point to the top to make the popup visible, if needed
    const popupRelativeTop = popupRect.y - mapRect.y;

    const popupClippedVertically = popupRelativeTop < 0 || (mapRect.height - popupRelativeTop - popupSize.height) < 0;
    if (popupClippedVertically) {
        //pan[1] = point.y - ((mapRect.height - popupRect.height) / 2);
        pan[1] = point.y - mapRect.height
    }

    /* if (pan != [0, 0]) {
        alert(pan)
        map.panBy(pan);
    } */
    map.panBy(pan)
}


export const usePopup = (map, popupRef) => {

    const dispatch = useDispatch()
    const { hydrantDraft, hydrants } = useSelector(state => state.mapbox)

    const { index, ...modifiedHydrant } = hydrantDraft
    const { lng, lat, name, active } = modifiedHydrant
    const lngLat = [lng, lat]

    const changeName = value => {
        const _hydrantDraft = Object.assign(
            {}, { ...hydrantDraft }, { name: value }
        )
        dispatch(setHydrantDraft(_hydrantDraft))
    }

    const confirm = () => {
        const { index, ...modifiedHydrant } = hydrantDraft
        hydrantDraft.index !== undefined
            ? dispatch(editHydrant({ modifiedHydrant, index }))
            : dispatch(addHydrant(modifiedHydrant))
        dispatch(setHydrantDraft({}))
    }

    const abort = () => {
        dispatch(setHydrantDraft({}))
    }

    const remove = (index) => {
        dispatch(deleteHydrant(index))
        dispatch(setHydrantDraft({}))
    }

    useEffect(() => {

        if (!map) return;

        const popup = new mapboxgl.Popup({
            closeButton: false,
            maxWidth: 'none',
            anchor: 'bottom'

        })
            .setLngLat(lngLat)
            .setDOMContent(popupRef.current)

        popup.on('open', () => autoPan(map, popup))

        const marker = new mapboxgl.Marker({ draggable: true })
            .setLngLat(lngLat)
            .setPopup(popup)
            .addTo(map)
            .on('dragend', (e) => {
                const { target: { _lngLat: { lat, lng } } } = e
                const _hydrantDraft = Object.assign(
                    {}, { ...hydrantDraft }, { lat, lng }
                )
                dispatch(setHydrantDraft(_hydrantDraft))
            })
            .togglePopup()

        //map.setCenter(lngLat)

        return () => {
            // ???
            popup.remove(),
                marker.remove();
        }
    }, [lngLat]);

    return {
        changeName, confirm, abort, remove, index, lng, lat, name, active
    }

}
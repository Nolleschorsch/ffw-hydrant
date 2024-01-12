import React from 'react'
import { useDispatch } from 'react-redux'
import { setHydrantDraft } from './index'

// TODO: remove the active attribute from hydrant

export const RouteStop = (props) => {

    const dispatch = useDispatch()

    const {index, stop} = props

    const { location: name, location_metadata: { supplied_coordinate: lngLat } } = stop
    const [lng, lat] = lngLat

    const handleClick = event => {

        const draft = {lng, lat, name, active: true}

        dispatch(setHydrantDraft(draft))
    }

    return <div onClick={handleClick}>{`${index+1}. ${stop.location}`}</div>

}


export default RouteStop
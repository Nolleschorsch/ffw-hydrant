import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import Hydrant from './Hydrant'
import { isNewOrModified, getUnsavedItems, roundDecimal } from './utils'
import { useGetHydrantsQuery, useSetHydrantsMutation } from './api'
import { setHydrants } from './mapSlice'
import { setToast } from './toastSlice'


export const getFilteredHydrants = (hydrants, filter) => {
    const filterArr = filter.split()
    return hydrants.filter(hydrant =>
        filterArr.some((filter =>
            //hydrant.id.toString().includes(filter) ||
            hydrant.lat.toString().includes(filter) ||
            hydrant.lng.toString().includes(filter) ||
            hydrant.name.includes(filter)
        ))
    )
}


export const HydranList = (props) => {

    const { markers } = props

    const dispatch = useDispatch()
    const { data, error, isLoading } = useGetHydrantsQuery()
    const [saveHydrants, { data: dataSave, error: errSave }] = useSetHydrantsMutation()
    const hydrants = useSelector(state => state.mapbox.hydrants)
    const [filter, setFilter] = useState('')

    useEffect(() => {
        if (!data) return;
        console.log('aight')
        dispatch(setHydrants(data))
    }, [isLoading, data])

    const handleFilterChange = event => {
        setFilter(event.target.value)
    }

    const handleSave = async event => {
        event.preventDefault()
        // attempt to prevent 500 Internal server error mapbox api
        const fooHydrants = hydrants.map(
            h => Object.assign({}, { ...h }, {
                lat: roundDecimal(h.lat),
                lng: roundDecimal(h.lng)
            })
        )
        /* const foo = getUnsavedItems(data, fooHydrants)
        console.log({foo}) */
        const unsavedHydrants = getUnsavedItems(data, fooHydrants) // hydrants

        try {
            const result = await saveHydrants(unsavedHydrants).unwrap()
            dispatch(setToast({
                toastTitle: 'HydrantList',
                toastTxt: result.message,
                bg: 'success',
                show: true
            }))

        } catch (error) {
            dispatch(setToast({
                toastTitle: 'HydrantList',
                toastTxt: error.error,
                bg: 'danger',
                show: true
            }))
        }

    }

    const filteredHydrants = getFilteredHydrants(hydrants, filter)
    const unsavedCount = getUnsavedItems(data, hydrants).length
    const statusText =
        `${hydrants.length} Hydranten | ${unsavedCount} ungespeicherte Änderungen`

    return (
        <>
            <span>{statusText}</span>
            <Button onClick={handleSave}>Speichern</Button>
            <Button onClick={() => dispatch(setHydrants([]))}>Reset Hydrants</Button>
            <Form.Control onChange={handleFilterChange} value={filter} placeholder='Suche' />
            <Stack gap={1} className="hydrant-stack" data-testid='hydrant-stack'>
                {filteredHydrants.map((hydrant, i) => {
                    const unsaved = isNewOrModified(data, hydrant)
                    const realIndex = hydrants.indexOf(hydrant)
                    const hydrantProps = Object.assign({}, { hydrant }, { unsaved, index: realIndex, /* marker: markers[realIndex] */ })
                    return <Hydrant key={i} {...hydrantProps} />
                })}
            </Stack>
        </>
    )

}


export default HydranList
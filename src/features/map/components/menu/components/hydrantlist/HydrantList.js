import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Stack from 'react-bootstrap/Stack'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import { Download, Search, Trash, Upload } from 'react-bootstrap-icons'
import { useImport } from '../../../../hooks/useImport'
import { useExport } from '../../../../hooks/useExport'
import Hydrant from './components/hydrant'
import { setHydrants } from '../../../../mapSlice'
import { setToast } from '../../../../toastSlice'



export const getFilteredHydrants = (hydrants, filter) => {
    const filterArr = filter.split()
    return hydrants.filter(hydrant =>
        filterArr.some((filter =>
            hydrant.lat.toString().includes(filter) ||
            hydrant.lng.toString().includes(filter) ||
            hydrant.name.includes(filter)
        ))
    )
}


export const HydranList = () => {

    const importFileInput = useRef(null)

    const dispatch = useDispatch()
    const { importHydrants } = useImport()
    const { downloadJSON } = useExport()
    const hydrants = useSelector(state => state.mapbox.hydrants)
    const [filter, setFilter] = useState('')

    const handleFilterChange = event => {
        setFilter(event.target.value)
    }

    const handleDownload = event => {
        downloadJSON(hydrants)
        dispatch(setToast({
            toastTitle: 'Download',
            toastTxt: 'Download gestartet',
            bg: 'info',
            show: true
        }))
    }

    const handleImport = event => {
        const file = event.target.files[0]
        importHydrants(file)
    }

    const handleImport2 = event => {
        importFileInput.current.click()
    }

    const filteredHydrants = getFilteredHydrants(hydrants, filter)
    const statusText =
        `${hydrants.length} Hydranten`

    return (
        <div id="hydrant-list">
            <h5 className="d-flex justify-content-center">Hydrantenliste</h5>
            <h6 className="d-flex justify-content-center">{statusText}</h6>
            <ButtonGroup>
                <Button onClick={handleDownload}><Download className="me-3"/>Export</Button>
                <Button onClick={handleImport2}><Upload className="me-3"/>Import</Button>
                <Button onClick={() => dispatch(setHydrants([]))}><Trash className="me-3"/>Löschen</Button>
            </ButtonGroup>
            <Form.Control type="file" onChange={handleImport} ref={importFileInput} style={{display: 'none'}}/>
            <hr/>            
            <InputGroup>
                <InputGroup.Text><Search /></InputGroup.Text>
                <Form.Control onChange={handleFilterChange} value={filter} placeholder='Suchbegriff z.B. Am Dorfplatz 1' />
            </InputGroup>



            <Stack gap={1} className="hydrant-stack" data-testid='hydrant-stack'>
                {filteredHydrants.map((hydrant, i) => {
                    const unsaved = false
                    const realIndex = hydrants.indexOf(hydrant)
                    const hydrantProps = Object.assign({}, { hydrant }, { unsaved, index: realIndex })
                    return <Hydrant key={i} {...hydrantProps} />
                })}
            </Stack>
        </div>
    )

}


export default HydranList
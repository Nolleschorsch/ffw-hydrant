import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Form from 'react-bootstrap/Form'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import { Download, Upload, Trash } from 'react-bootstrap-icons'

import {
    useGetSolutionsQuery,
    useLazyGetSolutionDetailQuery,
    useExport,
    useImport,
    createSourcesAndLayers,
    setToast,
    setSolution, setSolutionName, setRoutes, setSources, setLayers
} from './index'

export const SolutionSelect = (props) => {

    const dispatch = useDispatch()
    const importFileInput = useRef(null)

    const { solution, routes } = useSelector(state => state.mapbox)
    const { downloadSolution } = useExport()
    const { importSolution } = useImport()

    const handleExport = event => {
        downloadSolution(solution, routes)
    }

    const handleImport = event => {
        const file = event.target.files[0]
        importSolution(file)
    }

    const handleImport2 = event => {
        importFileInput.current.click()
    }

    return (
        <>
            <ButtonGroup>
                <Button onClick={handleExport}><Download className="me-3"/>Export</Button>
                <Button onClick={handleImport2}><Upload className="me-3"/>Import</Button>
                {/* <Button onClick={() => dispatch(setHydrants([]))}><Trash className="me-3"/>Löschen</Button> */}
            </ButtonGroup>
            <Form.Control type="file" onChange={handleImport} ref={importFileInput} style={{display: 'none'}}/>
            {/* <Form.Select onChange={handleSolutionSelect} value={selectedSolution} disabled={isLoading}>
                <option disabled value="">Vorhandene Lösung auswählen</option>
                {data?.map((x, i) =>
                    <option key={i} value={x.id}>{x.name}</option>) || null}
            </Form.Select> */}
        </>
    )

}


export default SolutionSelect
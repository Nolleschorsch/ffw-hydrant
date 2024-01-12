import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import {
    usePostRoutingProblemMutation,
    useLazyGetSolutionStatusQuery,
    useLazyGetSolutionQuery,
    useLazyGetDirectionsQuery,
    usePostSolutionMutation,
    setToast,
    setLayers,
    setRoutes,
    setSolution,
    setSolutionName,
    setSources,
    createSourcesAndLayers,
    encodePolyline,
    timeout
} from './index'
import './Problem.css'

import { generateRoutingProblemDocumentWithReturnHome } from './routingProblem'
import { Clock, ClockFill, PencilFill, Person, PersonFill } from 'react-bootstrap-icons'
/* import { createSourcesAndLayers } from './utilsGeoJSON'
import { encodePolyline, timeout } from './utils' */
/* import {
    setLayers,
    setRoutes,
    setSolution,
    setSolutionName,
    setSources
} from './mapSlice' */
//import { useAccessToken } from '../../app/AccessTokenProvider'

export const Problem = (props) => {

    //const { accessToken } = useAccessToken()

    //console.log({ accessToken })

    const dispatch = useDispatch()
    const { hydrants, accessToken, home } = useSelector(state => state.mapbox)
    const locations = hydrants.map(x => ({ name: x.name, coordinates: [x.lng, x.lat] }))

    const [show, setShow] = useState(false)
    const [vehicleCount, setVehicleCount] = useState(0)
    const [newSolutionName, setNewSolutionName] = useState('')
    const [duration, setDuration] = useState(300)

    // TODO: rename stuff
    const [postRoutingProblem, { data, error, isUninitialized, isLoading, isError, isSuccess, reset }] = usePostRoutingProblemMutation()
    const [getSolutionStatus, { data: statusData, error: statusError, isLoading: statusIsLoading, refetch: resetStatus }] = useLazyGetSolutionStatusQuery()
    const [getSolution, { data: solutionData, error: solutionError, isLoading: solutionIsLoading, refetch: resetSolution }] = useLazyGetSolutionQuery()
    const [getDirections, { data: routeData, error: routeError, isLoading: routeIsLoading }] = useLazyGetDirectionsQuery()
    const [postSolution] = usePostSolutionMutation()

    const handleVehicleCountChange = event => {
        setVehicleCount(parseInt(event.target.value))
    }

    const handleNewSolutionNameChange = event => {
        setNewSolutionName(event.target.value)
    }

    const handleDurationChange = event => {
        const duration = parseInt(event.target.value) || 0
        setDuration(duration)
    }

    const handleCloseAndSubmit = event => {
        setShow(false)
        handleSubmit()
    }

    const handleSubmit = async () => {
        let invalid = true

        //const home = { name: 'home', coordinates: [8.382894, 48.928595] }
        const { name, lng, lat } = home
        const _home = { name, coordinates: [lng, lat] }

        while (invalid) {
            try {
                // why JSON.stringify if next step is JSON.parse?
                const problem = JSON.parse(
                    /* generateRoutingProblemDocumentWithReturnHome({
                        locations, vehicleCount, home: 'home', duration
                    } */
                    generateRoutingProblemDocumentWithReturnHome({
                        locations, vehicleCount, home: _home, duration
                    }
                    )
                )
                //setIsPending(true)
                const fuck = await postRoutingProblem({ ...problem, accessToken }).unwrap()
                const id = fuck.id
                //setId(id)
                let pending = true
                while (pending) {

                    const solutionStatus = await getSolutionStatus({ id, accessToken }).unwrap()
                    const item = solutionStatus.filter(x => x.id === id)[0]
                    if (item.status === 'complete') {
                        pending = false
                        //setIsPending(false)
                        break
                    }
                    dispatch(setToast({
                        bg: 'warning',
                        toastTitle: 'getSolutionStatus',
                        toastTxt: `solution for ${id} pending...`,
                        show: true
                    }))
                    await timeout(5000)

                }

                const solution = await getSolution({ id, accessToken }).unwrap()

                if (!solution.routes) {
                    continue
                } else {
                    invalid = false
                }

                dispatch(setToast({
                    bg: 'success',
                    toastTitle: 'handleSubmit',
                    toastTxt: `solution for ${id} complete`,
                    show: true
                }))

                dispatch(setSolution(solution))
                const routes = await getRoutes(solution)
                dispatch(setRoutes(routes))

                const [_sources, _layers] = createSourcesAndLayers(routes, solution.routes)

                dispatch(setSources(_sources))
                dispatch(setLayers(_layers))


                const solutionCoordinates = solution.routes.map(r => {
                    return r.stops.map(s => s.location_metadata.supplied_coordinate)
                }).flat()
                const routesCoordinates = routes.map(r => [...r.coordinates]).flat()
                const solution_polyline = encodePolyline(solutionCoordinates)
                const routes_polyline = encodePolyline(routesCoordinates)

                const fooName = `${newSolutionName} Vehicles ${vehicleCount} Duration ${duration}`

                await postSolution({ solution, routes, solution_polyline, routes_polyline, name: fooName })

            } catch (error) {

                dispatch(setToast({
                    bg: 'danger',
                    toastTitle: 'handleSubmit',
                    toastTxt: error.error,
                    show: true
                }))
            }
        }
    }

    // Problem ?
    const getRoutes = async (solution) => {

        let routes = []
        for await (const [i, route] of solution.routes.entries()) {

            const chunkSize = 24;
            let coordinates = []
            let chunks = []

            for (let i = 0; i < route.stops.length; i += chunkSize) {
                const chunk = i + 1 === route.stops.length
                    ? route.stops.slice(i - 1)
                    : route.stops.slice(i, i + chunkSize)

                chunks.push(chunk.map(stop => stop.location_metadata.snapped_coordinate).join(';'))
            }

            for await (const [j, chunk] of chunks.entries()) {
                try {
                    // TODO: why only use coordinates? there is also waypoints, legs etc
                    const directions = await getDirections({
                        coordinates: chunk, accessToken
                    }).unwrap()
                    coordinates = [
                        ...coordinates,
                        ...directions.routes[0].geometry.coordinates
                    ]
                }
                catch (error) {
                    return Promise.reject(error)
                }
            }

            routes.push({ name: route.vehicle, coordinates })
        }

        return Promise.resolve(routes)

    }

    return (
        <>
            <Button onClick={() => setShow(true)} style={{ display: "block" }}>Neue Lösung</Button>
            <Modal show={show} onHide={() => setShow(false)} data-testid='problem-modal' id='problem-modal'>
                <Modal.Header closeButton >
                    <Modal.Title>Routing Problem</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup>
                        <InputGroup.Text><PersonFill className='me-3' />Gruppenanzahl</InputGroup.Text>
                        <Form.Control type="number" value={vehicleCount} onChange={handleVehicleCountChange}
                            placeholder='Gruppenanzahl eintragen' isInvalid={!vehicleCount} min="1" />
                    </InputGroup>
                    <InputGroup>
                        <InputGroup.Text><PencilFill className='me-3'/>Lösungsname</InputGroup.Text>
                        <Form.Control value={newSolutionName} onChange={handleNewSolutionNameChange}
                            placeholder='Namen eintragen' />
                    </InputGroup>

                    <InputGroup>
                        <InputGroup.Text><ClockFill className='me-3' />Zeit je Hydrant</InputGroup.Text>
                        <Form.Control type="number" value={duration} onChange={handleDurationChange}
                            placeholder='Zeit pro Hydrant in sec' min="1" />
                        <InputGroup.Text>sec</InputGroup.Text>
                    </InputGroup>

                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-evenly'>
                    <Button variant="primary" onClick={handleCloseAndSubmit} disabled={!home.name}>
                        Lösung anfordern
                    </Button>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Abbrechen
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    )

}


export default Problem
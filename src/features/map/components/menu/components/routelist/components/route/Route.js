import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Collapse from 'react-bootstrap/Collapse'
import Stack from 'react-bootstrap/Stack'
import { Eye, EyeSlash, InfoCircle } from 'react-bootstrap-icons'
import { getColor, getTimeDeltaMinutes, getStartEndDates } from './index'
import Summary from '../summary/Summary'
import './Route.css'
import RouteStop from './components/routestop'

export const Route = props => {

    const { index, name, setLayerVisibility, getLayerVisibility, show, toggleRoute, solutionRouteStops = [] } = props
    const [showStops, setShowStops] = useState(false)
    //const [showRoute, setShowRoute] = useState(true)
    //setShowRoute(show)

    const routeLayer = `routeLayer-${name}`
    const hydrantLayer = `hydrantLayer-${name}`
    const symbolLayer = `symbolLayer-${name}`
    const routeColor = getColor(index)

    const lastStop = solutionRouteStops.slice(-1)[0]

    const distance = (lastStop && lastStop.odometer) || 0

    const [start, end] = getStartEndDates(solutionRouteStops)
    const deltaTimeMinutes = getTimeDeltaMinutes({ start, end })


    //const showRouteX = getLayerVisibility(routeLayer) === 'visible'

    const handleToggle = event => {
        console.log(`${name} current: ${show} setting to ${!show}`)
        toggleRoute(index, !show)
    }

    //console.log(`props: ${show} | X: ${showRouteX}`)

    /* const toggleRoute = event => {
        console.log(showRoute, showRouteX)
        setLayerVisibility(routeLayer, !showRoute)
        setLayerVisibility(hydrantLayer, !showRoute)
        setLayerVisibility(symbolLayer, !showRoute)
        setShowRoute(!show)
    } */

    const info = `${distance}m | ${deltaTimeMinutes}min | ${solutionRouteStops.length} Hydranten`

    const summaryProps = { totalTime: deltaTimeMinutes, totalDistance: distance, totalHydrants: solutionRouteStops.length - 2 }

    return (
        <div className='m-3'>
            <h5 style={{ color: routeColor }} className='d-flex justify-content-center'>{name}</h5>
            <Summary {...summaryProps} />
            <Button onClick={handleToggle}>{show ? <Eye /> : <EyeSlash />}</Button>

            <Button onClick={() => setShowStops(!showStops)} data-testid='route-info-btn'>
                <InfoCircle className='me-3' />Hydranten
            </Button>
            <Collapse in={showStops}>
                <Stack className='route-stops'>

                    {solutionRouteStops.filter(x => x.type === 'service').map((stop, i) => <RouteStop key={i} index={i} stop={stop} />)}
                    {/* {solutionRouteStops.filter(x => x.type === 'service').map((stop, i) => <div key={i}>{`${i+1}. ${stop.location}`}</div>)} */}
                </Stack>
            </Collapse>
        </div>
    )
}


export default Route
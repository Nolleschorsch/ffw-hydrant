import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Collapse from 'react-bootstrap/Collapse'
import Stack from 'react-bootstrap/Stack'
import { Eye, EyeSlash } from 'react-bootstrap-icons'
import { getColor, getTimeDeltaMinutes, getStartEndDates } from './utils'


export const Route = props => {

    const { index, name, setLayerVisibility, solutionRouteStops = [] } = props
    const [showStops, setShowStops] = useState(false)

    const routeLayer = `routeLayer-${name}`
    const hydrantLayer = `hydrantLayer-${name}`
    const symbolLayer = `symbolLayer-${name}`
    const routeColor = getColor(index)

    const lastStop = solutionRouteStops.slice(-1)[0]

    const distance = (lastStop && lastStop.odometer) || 0

    const [start, end] = getStartEndDates(solutionRouteStops)
    const deltaTimeMinutes = getTimeDeltaMinutes({ start, end })

    const handleShow = event => {
        setLayerVisibility(routeLayer, true)
        setLayerVisibility(hydrantLayer, true)
        setLayerVisibility(symbolLayer, true)
    }

    const handleHide = event => {
        setLayerVisibility(routeLayer, false)
        setLayerVisibility(hydrantLayer, false)
        setLayerVisibility(symbolLayer, false)
    }

    const info = `${distance}m | ${deltaTimeMinutes}min | ${solutionRouteStops.length} Hydranten`

    return (
        <div>
            <h5 style={{ color: routeColor }}>{name}</h5>
            <h6>{info} | {deltaTimeMinutes - ((solutionRouteStops.length - 2) * 3)}</h6>
            <Button onClick={handleShow}>Anzeigen</Button>
            <Button onClick={handleHide}>Verbergen</Button>
            <Button onClick={() => setShowStops(!showStops)} data-testid='route-info-btn'>
                {showStops
                    ? <EyeSlash data-testid='icon-eye-slash'/>
                    : <Eye data-testid='icon-eye'/>
                }
            </Button>
            <Collapse in={showStops}>
                <Stack>
                    {solutionRouteStops.filter(x => x.type === 'service').map((stop, i) => <div key={i}>{stop.location}</div>)}
                </Stack>
            </Collapse>
        </div>
    )
}


export default Route
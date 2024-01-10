import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Route from './components/route'
import Summary from './components/summary'
import { getTimeDeltaMinutes, getStartEndDates, compareRouteStopsByOdometer } from './index'

export const toggleOne = (route, cb, value) => {
    const routeLayer = `routeLayer-${route.name}`
    const hydrantLayer = `hydrantLayer-${route.name}`
    const symbolLayer = `symbolLayer-${route.name}`
    cb(routeLayer, value)
    cb(hydrantLayer, value)
    cb(symbolLayer, value)
}

export const toggleAll = (routes, cb, value) => {
    routes.forEach(route => {
        /* const routeLayer = `routeLayer-${route.name}`
        const hydrantLayer = `hydrantLayer-${route.name}`
        const symbolLayer = `symbolLayer-${route.name}`
        cb(routeLayer, value)
        cb(hydrantLayer, value)
        cb(symbolLayer, value) */
        toggleOne(route, cb, value)
    })
}


export const createSolutionInfo = (sortedSolutionRoutes) => {
    const totalTime = sortedSolutionRoutes
        .map(x => {
            const [start, end] = getStartEndDates(x.stops)
            const deltaTimeMinutes = getTimeDeltaMinutes({ start, end })
            return deltaTimeMinutes
        })
        .reduce((a, b) => a + b, 0)

    const totalDistance = sortedSolutionRoutes
        .map(x => x.stops.slice(-1)[0].odometer)
        .reduce((a, b) => a + b, 0)


    const totalHydrants = sortedSolutionRoutes.map(x => x.stops.length - 2).reduce((a, b) => a + b, 0)
    return { totalTime, totalDistance, totalHydrants }
}


export const RouteList = props => {

    console.log("rerender routelist")

    const { setLayerVisibility, getLayerVisibility } = props
    const mapState = useSelector(state => state.mapbox)
    const { routes, solutionName, solution } = mapState
    const meh = Array(routes.length).fill(true)
    console.log({ meh })
    const [showRoutes, setShowRoutes] = useState(Array(routes.length).fill(true))
    console.log(showRoutes.length)


    const handleShowAll = event => {
        //event.preventDefault()
        toggleAll(routes, setLayerVisibility, true)
        const allTrue = Array(routes.length).fill(true)
        setShowRoutes(allTrue)
    }

    const handleHideAll = event => {
        toggleAll(routes, setLayerVisibility, false)
        const allFalse = Array(routes.length).fill(false)
        setShowRoutes(allFalse)
    }

    const toggleRoute = (index, show) => {
        const route = routes[index]
        console.log(route, show)
        toggleOne(route, setLayerVisibility, show)
        const _showRoutes = [...showRoutes].splice(index, 1, show)
        console.log(_showRoutes)
        setShowRoutes(_showRoutes)
    }

    const solutionRoutes = solution.routes || []
    const sortedSolutionRoutes = solutionRoutes
        .slice()
        .sort(compareRouteStopsByOdometer)
    //const solutionInfo = createSolutionInfo(sortedSolutionRoutes)

    const summaryProps = createSolutionInfo(sortedSolutionRoutes)

    return (
        <div>
            <h4 className='d-flex justify-content-center m-3'>{solutionName}</h4>
            {/* <h6>{solutionInfo}</h6> */}
            <Summary {...summaryProps} />
            <Button onClick={handleShowAll}>Alle anzeigen</Button>
            <Button onClick={handleHideAll}>Alle verbergen</Button>
            {sortedSolutionRoutes.map((solutionRoute, i) => {
                const routeIndex = routes.findIndex(r => r.name === solutionRoute.vehicle)
                const route = routes[routeIndex]

                return (
                    <Route key={i} {...route} index={routeIndex} show={showRoutes[i]} toggleRoute={toggleRoute}
                        solutionRouteStops={solutionRoute.stops} getLayerVisibility={getLayerVisibility}
                        setLayerVisibility={setLayerVisibility} />)
            })
            }
        </div>
    )

}


export default RouteList
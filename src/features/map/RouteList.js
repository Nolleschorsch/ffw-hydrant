import React from 'react'
import { useSelector } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Route from './Route'
import { getTimeDeltaMinutes, getStartEndDates, compareRouteStopsByOdometer } from './utils'


export const toggleAll = (routes, cb, value) => {
    routes.forEach(route => {
        const routeLayer = `routeLayer-${route.name}`
        const hydrantLayer = `hydrantLayer-${route.name}`
        const symbolLayer = `symbolLayer-${route.name}`
        cb(routeLayer, value)
        cb(hydrantLayer, value)
        cb(symbolLayer, value)
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
    return `${totalTime}min ${totalDistance}m ${totalHydrants} Hydranten`
}


export const RouteList = props => {

    const { setLayerVisibility } = props

    const mapState = useSelector(state => state.mapbox)
    const { routes, solutionName, solution } = mapState

    const handleShowAll = event => {
        //event.preventDefault()
        toggleAll(routes, setLayerVisibility, true)
    }

    const handleHideAll = event => {
        //event.preventDefault()
        toggleAll(routes, setLayerVisibility, false)
    }

    const solutionRoutes = solution.routes || []
    const sortedSolutionRoutes = solutionRoutes
        .slice()
        .sort(compareRouteStopsByOdometer)
    const solutionInfo = createSolutionInfo(sortedSolutionRoutes)

    return (
        <div>
            <h4>{solutionName}</h4>
            <h6>{solutionInfo}</h6>
            <Button onClick={handleShowAll}>Alle anzeigen</Button>
            <Button onClick={handleHideAll}>Alle verbergen</Button>
            {sortedSolutionRoutes.map((solutionRoute, i) => {
                const routeIndex = routes.findIndex(r => r.name === solutionRoute.vehicle)
                const route = routes[routeIndex]
                return (
                    <Route key={i} {...route} index={routeIndex}
                        solutionRouteStops={solutionRoute.stops}
                        setLayerVisibility={setLayerVisibility} />)
            })
            }
        </div>
    )

}


export default RouteList
import * as polyline from '@mapbox/polyline';

export const compareRouteStopsByOdometer = (a, b) => {
    const x = a.stops.slice(-1)[0].odometer
    const y = b.stops.slice(-1)[0].odometer

    return x > y ? 1 : -1
}

export const getTimeDeltaMinutes = ({ start, end }) => {
    const deltaTimeMs = Math.abs(end - start)
    return Math.floor((deltaTimeMs / 1000) / 60)
}

// refactor ugly
export const getStartEndDates = (stops) => {
    const firstStop = stops[0] || {}
    const lastStop = stops.slice(-1)[0] || {}
    const now = new Date()
    const [start, end] = firstStop.eta && lastStop.eta
        ? [new Date(firstStop.eta), new Date(lastStop.eta)]
        : [now, now]
    return [start, end]
}


export const encodePolyline = (lngLatCoordinates) => {
    return polyline.encode(lngLatCoordinates.map(x => [x[1], x[0]]))
}


export const getColor = index => {
    const colors = ['red', 'blue', 'green', 'purple', 'orange', 'brown', 'black']
    return colors[index % colors.length]
}


export const getBadgeVariant = (data, isLoading, isError) => {
    return data ? 'success' : isLoading
        ?  'warning' : isError ? 'danger' : 'secondary'
}


export const roundDecimal = (number, decimalPlaces = 6) => {
    return parseFloat(number.toFixed(decimalPlaces))
}


export const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}


export const isNewOrModified = (arr, obj) => {

    const foo = arr ? arr.filter(x => {
        const { id, lat, lng, name, active } = x
        return id === obj.id && lat === obj.lat && lng === obj.lng && name === obj.name && active === obj.active
    }) : []

    return foo.length === 0
}


export const getUnsavedItems = (originalArr, modifiedArr) => {

    const bar = modifiedArr.filter(x => {
        const baz = isNewOrModified(originalArr, x)
        return baz
    })

    return bar
}
/* import pointToLineDistance from '@turf/point-to-line-distance'
import distance from '@turf/distance'

export const getHydrantDistanceToRoadNetwork = ({ hydrants, roadnetwork }) => {

    hydrants.forEach(hydrant => {
        const pt = point([hydrant.lng, hydrant.lat])
        console.log(pointToLineDistance(pt, roadnetwork))
    })

}


export const getClosestRoadPoint = ({ hydrant, roadnetwork }) => {

    const ptHyd = [hydrant.lng, hydrant.lat]
    let minDistance = 9999
    let coord = ptHyd
    roadnetwork.forEach((x, i) => {
        const pt = x//point(x)
        const dist = distance(ptHyd, pt)
        if (dist < minDistance) {
            minDistance = dist
            coord = x
        }
    })
    console.log(`Min distance ${hydrant.name}: ${minDistance} from ${coord}`)
    return coord
}


export const hydrantsToRoadnetwork = ({ hydrants, roadnetwork }) => {
    // changes the coordinates of the hydrants to the closest point inside roadnetwork
    return hydrants.map((hydrant, i) => {
        const [lng, lat] = getClosestRoadPoint({hydrant, roadnetwork})
        return Object.assign({}, {...hydrant}, {lng, lat})
    })
} */
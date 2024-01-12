/* 
{
    "version": 1,
    "locations": [...],
    "vehicles": [...],
    "services": [...],
    "shipments": [...]
}
*/

export const createVehicles = (count) => {

    const vehicles = Array(count).fill(undefined).map((x, i) => ({
        name: `Gruppe ${i + 1}`,
        routing_profile: 'mapbox/walking'
    }))

    return vehicles
}


export const createVehiclesWithHome = (count, home='home') => {

    const vehicles = Array(count).fill(undefined).map((x, i) => ({
        name: `Gruppe ${i + 1}`,
        routing_profile: 'mapbox/walking',
        start_location: home,
        end_location: home
    }))

    return vehicles
}


export const createServices = (locations, duration=300) => {

    const services = locations.map(x => ({
        name: `${x.coordinates.join('-')}`,
        location: x.name,
        duration
    }))

    return services
}


export const generateRoutingProblemDocument = ({ locations, vehicleCount }) => {

    const vehicles = createVehicles(vehicleCount)
    const durationPerService = 180//300// in seconds
    const services = createServices(locations, durationPerService)

    const root = {
        version: 1,
        locations,
        vehicles,
        services,
        shipments: [],
        options: {
            objectives: ["min-schedule-completion-time"]
        }
    }

    return JSON.stringify(root)

}

export const generateRoutingProblemDocumentWithReturnHome = ({ locations, vehicleCount, home, duration }) => {

    //const locationsWithHome = [{ name: home, coordinates: [8.382894, 48.928595] }, ...locations]
    const locationsWithHome = [home, ...locations]

    const vehicles = createVehiclesWithHome(vehicleCount, home.name)
    const durationPerService = duration || 300//300// in seconds
    const services = createServices(locations, durationPerService)

    const root = {
        version: 1,
        locations: locationsWithHome,
        vehicles,
        services,
        shipments: [],
        options: {
            objectives: ["min-schedule-completion-time"]
        }
    }

    return JSON.stringify(root)

}
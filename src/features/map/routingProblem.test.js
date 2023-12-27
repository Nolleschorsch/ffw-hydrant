import { createVehicles, createServices, generateRoutingProblemDocument, createVehiclesWithHome, generateRoutingProblemDocumentWithReturnHome } from "./routingProblem"


describe('createVehicles', () => {
    it('returns expected value', () => {
        expect(createVehicles(1)).toEqual([
            { name: 'Gruppe 1', routing_profile: 'mapbox/walking' }
        ])
        expect(createVehicles(2)).toEqual([
            { name: 'Gruppe 1', routing_profile: 'mapbox/walking' },
            { name: 'Gruppe 2', routing_profile: 'mapbox/walking' }
        ])
        expect(createVehicles(10)).toHaveLength(10)
    })
})

describe('createVehiclesWithHome', () => {
    it('returns expected value', () => {
        expect(createVehiclesWithHome(1)).toEqual([
            { name: 'Gruppe 1', routing_profile: 'mapbox/walking', start_location: 'home', end_location: 'home' }
        ])
        expect(createVehiclesWithHome(2)).toEqual([
            { name: 'Gruppe 1', routing_profile: 'mapbox/walking', start_location: 'home', end_location: 'home' },
            { name: 'Gruppe 2', routing_profile: 'mapbox/walking', start_location: 'home', end_location: 'home' }
        ])
        expect(createVehiclesWithHome(10)).toHaveLength(10)
        const newHome = 'new home'
        const vehicles = createVehiclesWithHome(1, newHome)
        const { start_location: start, end_location: end } = vehicles[0]
        expect(start).toEqual(end)
        expect(start).toEqual(newHome)
    })
})

describe('createServices', () => {
    it('returns expected value', () => {

        const locations = [
            { name: 'foo', coordinates: [1, 1] },
            { name: 'bar', coordinates: [2, 2] }
        ]

        const expectedServices = [
            { name: '1-1', location: 'foo', duration: 300 },
            { name: '2-2', location: 'bar', duration: 300 }
        ]

        expect(createServices([])).toEqual([])
        expect(createServices([locations[0]])).toEqual([expectedServices[0]])
        expect(createServices(locations)).toEqual(expectedServices)
    })
})

describe('generateRoutingProblemDocument', () => {
    it('returns expected value', () => {

        const locations = []
        const vehicleCount = 0
        const vehicles = createVehicles(vehicleCount)
        const services = createServices(locations)

        const expected = JSON.stringify({
            version: 1,
            locations,
            vehicles,
            services,
            shipments: [],
            options: {
                objectives: ["min-schedule-completion-time"]
            }
        })
        expect(generateRoutingProblemDocument({ locations, vehicleCount }))
            .toEqual(expected)
    })
})

describe('generateRoutingProblemDocumentWithReturnHome', () => {
    it('returns expected value', () => {

        const vehicleCount = 0
        const home = 'foo'
        const vehicles = createVehiclesWithHome(vehicleCount)

        const locations = [{ name: home, coordinates: [8.382894, 48.928595] }]

        const services = createServices([])

        const expected = JSON.stringify({
            version: 1,
            locations,
            vehicles,
            services,
            shipments: [],
            options: {
                objectives: ["min-schedule-completion-time"]
            }
        })
        expect(generateRoutingProblemDocumentWithReturnHome({ locations: [], vehicleCount, home }))
            .toEqual(expected)
    })
})
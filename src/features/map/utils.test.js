import * as polyline from '@mapbox/polyline'
import {
    compareRouteStopsByOdometer,
    encodePolyline,
    getColor,
    getBadgeVariant,
    roundDecimal,
    timeout,
    isNewOrModified,
    getUnsavedItems,
    getTimeDeltaMinutes,
    getStartEndDates,
} from "./utils";

jest.mock('@mapbox/polyline')

describe('utils', () => {
    it('compareRouteStopsByOdometer', () => {
        const route1 = {
            stops: [
                { odometer: 1 },
                { odometer: 100 }
            ]
        }
        const route2 = {
            stops: [
                { odometer: 2 },
                { odometer: 50 },
                { odometer: 200 }
            ]
        }

        expect(compareRouteStopsByOdometer(route1, route2)).toEqual(-1)
        expect(compareRouteStopsByOdometer(route2, route1)).toEqual(1)
        expect(compareRouteStopsByOdometer(route1, route1)).toEqual(-1)
    })
    it.each([
        [0, 0, 0],
        [0, 2 * 60 * 1000, 2],
        [2 * 60 * 1000, 0, 2],
        [0, 2 * 50 * 1000, 1]
    ])('getTimeDeltaMinutes start %d end %d returns %d', (start, end, expected) => {
        expect(getTimeDeltaMinutes({ start, end })).toEqual(expected)
    })
    it('getStartEndDates', () => {
        jest.useFakeTimers().setSystemTime(new Date('2020-01-01'))
        expect(getStartEndDates([])).toEqual([new Date(), new Date()])
        const stops = [
            {eta: '2023-01-01T00:00:00Z'},
            {eta: '2023-02-01T00:00:00Z'}
        ]
        expect(getStartEndDates(stops)).toEqual([
            new Date('2023-01-01T00:00:00Z'),
            new Date('2023-02-01T00:00:00Z')
        ])
        jest.useRealTimers()
    })
    it('encodePolyline', () => {
        const lngLatCoordinates = [[1.1, 1.2], [2.1, 2.2], [3.1, 3.2]]
        encodePolyline(lngLatCoordinates)
        expect(polyline.encode).toHaveBeenCalledWith([
            [1.2, 1.1], [2.2, 2.1], [3.2, 3.1]
        ])
    })
    it.each([
        [0, 'red'],
        [1, 'blue'],
        [2, 'green'],
        [3, 'purple'],
        [4, 'orange'],
        [5, 'brown'],
        [6, 'black']
    ])('getColor index %d returns %s', (index, color) => {
        expect(getColor(index)).toEqual(color)
    })
    it.each([
        { data: undefined, isLoading: false, isError: false, expected: 'secondary' },
        { data: undefined, isLoading: true, isError: false, expected: 'warning' },
        { data: undefined, isLoading: false, isError: true, expected: 'danger' },
        { data: {}, isLoading: false, isError: false, expected: 'success' }
    ])('getBadeVarriant({data: $data, isLoading: $isLoading, isError: $isError}) returns "$expected"',
        ({ data, isLoading, isError, expected }) => {
            expect(getBadgeVariant(data, isLoading, isError)).toEqual(expected)
        }
    )
    it.each([
        [8.392622224274646, 8.392622],
        [48.92569869466155, 48.925699]
    ])('roundDecimal(%d) rounded 6 decimals => %d', (number, expected) => {
        expect(roundDecimal(number)).toEqual(expected)
    })
    it('utils timeout soon', async () => {
        await timeout(1000)
    })
})

/* describe('encodePolyline', () => {
    it('', () => {
        const lngLatCoordinates = [[1.1, 1.2], [2.1, 2.2], [3.1, 3.2]]
        encodePolyline(lngLatCoordinates)
        expect(polyline.encode).toHaveBeenCalledWith([
            [1.2, 1.1], [2.2, 2.1], [3.2, 3.1]
        ])
    })
})

describe('getColor', () => {

    it.each([
        [0, 'red'],
        [1, 'blue'],
        [2, 'green'],
        [3, 'purple'],
        [4, 'orange'],
        [5, 'brown'],
        [6, 'black']
    ])('index %d returns %s', (index, color) => {
        expect(getColor(index)).toEqual(color)
    })
})

describe('getBadeVarriant', () => {
    it.each([
        { data: undefined, isLoading: false, isError: false, expected: 'secondary' },
        { data: undefined, isLoading: true, isError: false, expected: 'warning' },
        { data: undefined, isLoading: false, isError: true, expected: 'danger' },
        { data: {}, isLoading: false, isError: false, expected: 'success' }
    ])('returns expected value', ({ data, isLoading, isError, expected }) => {
        expect(getBadgeVariant(data, isLoading, isError)).toEqual(expected)
    })
})


describe('roundDecimal', () => {
    it.each([
        [8.392622224274646, 8.392622],
        [48.92569869466155, 48.925699]
    ])('%d rounded 6 decimals => %d', (number, expected) => {
        expect(roundDecimal(number)).toEqual(expected)
    })
})

describe('utils timeout', () => {
    it('soon', async () => {
        await timeout(1000)
    })
}) */

describe('utils isNewOrModified', () => {

    let hydrantArr

    beforeAll(() => {
        hydrantArr = [
            { id: 1, lat: 1, lng: 1, name: 'foo', active: true },
            { id: 2, lat: 2, lng: 2, name: 'bar', active: true },
            { id: 3, lat: 3, lng: 3, name: 'baz', active: true }
        ]
    })

    it('returns false if obj in arr', () => {
        const obj = { ...hydrantArr[0] }
        expect(isNewOrModified(hydrantArr, obj)).toBeFalsy()
    })

    it('returns true if arr undefined', () => {
        expect(isNewOrModified(undefined, { ...hydrantArr[0] })).toBeTruthy()
    })

    it('returns true if arr empty', () => {
        expect(isNewOrModified([], { ...hydrantArr[0] })).toBeTruthy()
    })

    it.each([
        ['name', { name: 'oof' }, 0],
        ['lat', { lat: 42 }, 1],
        ['lng', { lng: 69 }, 2],
        ['active', { active: false }, 2]
    ])('changing %s %o at index %d', (_, changed, index) => {
        const obj = Object.assign({}, { ...hydrantArr[index] }, { ...changed })
        expect(isNewOrModified(hydrantArr, obj)).toBeTruthy()
    })

    it('return true if obj not in arr', () => {
        const obj = Object.assign({}, { ...hydrantArr[0] }, { name: 'oof' })
        expect(isNewOrModified(hydrantArr, obj)).toBeTruthy()
    })

})

describe('utils getUnsavedItems', () => {

    let hydrantArr

    beforeAll(() => {
        hydrantArr = [
            { id: 1, lat: 1, lng: 1, name: 'foo', active: true },
            { id: 2, lat: 2, lng: 2, name: 'bar', active: true },
            { id: 3, lat: 3, lng: 3, name: 'baz', active: true }
        ]
    })

    it('returns empty array if Hydrant[] == Hydrant[]', () => {
        const modifiedArr = [...hydrantArr]
        expect(getUnsavedItems(hydrantArr, modifiedArr)).toHaveLength(0)
    })

    it('returns array with changed or new hydrants', () => {
        const newHydrant = { lat: 4, lng: 4, name: 'new', active: true }
        const modHydrant = Object.assign({}, { ...hydrantArr[0] }, { name: 'changed' })
        const modifiedArr = [...hydrantArr]
        modifiedArr.splice(0, 1, modHydrant) // change first item
        modifiedArr.splice(2, 0, newHydrant) // add 4th item
        const result = getUnsavedItems(hydrantArr, modifiedArr)
        expect(result).toHaveLength(2)
        expect(result).toContain(newHydrant)
        expect(result).toContain(modHydrant)
        //expect(result).toContainEqual([modHydrant, newHydrant])
    })
})
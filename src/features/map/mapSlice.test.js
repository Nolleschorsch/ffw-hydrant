import reducer, {
    initialState,
    resetToInitialState,
    setHydrants,
    addHydrant,
    editHydrant,
    setSolution,
    setRoutes,
    setSolutionName,
    setSources,
    setLayers
} from './mapSlice'


describe('mapSlice', () => {
    let stateFilled
    beforeAll(() => {
        stateFilled = {
            hydrants: [
                { name: 'foo', lat: 1, lng: 1, active: true },
                { name: 'bar', lat: 2, lng: 2, active: true },
                { name: 'baz', lat: 3, lng: 2, active: true }
            ],
            solution: []
        }
    })
    it('initialState has expected values', () => {
        expect(initialState).toEqual({
            hydrants: [],
            solution: {},
            routes: [],
            solutionName: '',
            layers: { previous: [], current: [] },
            sources: { previous: [], current: [] }
        })
    })
    it('should return initialState', () => {
        expect(reducer(undefined, {})).toEqual(initialState)
    })
    it('should handle resetToInitialState', () => {
        expect(reducer(initialState, resetToInitialState())).toEqual(initialState)
        expect(reducer(stateFilled, resetToInitialState())).toEqual(initialState)
    })
    it('should handle setHydrants', () => {
        const hydrants = [
            { name: 'foo', lat: 1, lng: 1, active: true },
            { name: 'bar', lat: 2, lng: 2, active: true }
        ]
        expect(reducer(initialState, setHydrants(hydrants))).toEqual({
            ...initialState,
            hydrants
        })
    })
    it('should handle addHydrant', () => {
        const hydrant1 = { name: 'foo', lat: 1, lng: 1, active: true }
        const hydrant2 = { name: 'bar', lat: 2, lng: 2, active: true }
        const state1 = reducer(initialState, addHydrant(hydrant1))
        const state2 = reducer(state1, addHydrant(hydrant2))
        expect(state1.hydrants).toEqual([hydrant1])
        expect(state2.hydrants).toEqual([hydrant1, hydrant2])
    })
    /* it.each([
        {modifiedHydrant: {}, index: 1, expected: }
    ])('', ({modifiedHydrant, index, expected}) => {
        
        expect(reducer(stateFilled, editHydrant({modifiedHydrant, index}))).toEqual(expected)
    }) */
    it('should handle editHydrant', () => {
        const modHyd = { name: 'meh', lat: 4, lng: 4, active: false }
        expect(reducer(stateFilled, editHydrant({ modifiedHydrant: modHyd, index: 1 })).hydrants[1]).toEqual(modHyd)
    })
    it('should handle setSolution', () => {
        const solution = { routes: [], dropped: [] }
        expect(reducer(initialState, setSolution(solution))).toEqual({
            ...initialState,
            solution
        })
    })
    it('should handle setRoutes', () => {
        const routes = [
            { name: 'foo', coordinates: [[1, 1], [2, 2], [3, 3]] },
            { name: 'bar', coordinates: [] }
        ]
        expect(reducer(initialState, setRoutes(routes))).toEqual({
            ...initialState,
            routes
        })
    })
    it('should handle setSolutionName', () => {
        expect(reducer(initialState, setSolutionName('foobar'))).toEqual({
            ...initialState,
            solutionName: 'foobar'
        })
    })
    it('should handle setSources', () => {
        const state1 = reducer(initialState, setSources(['foo', 'bar']))
        expect(state1).toEqual({
            ...initialState,
            sources: { previous: [], current: ['foo', 'bar']}
        })
        const state2 = reducer(state1, setSources(['baz']))
        expect(state2).toEqual({
            ...initialState,
            sources: { previous: ['foo', 'bar'], current: ['baz']}
        })
    })
    it('should handle setLayers', () => {
        const state1 = reducer(initialState, setLayers(['foo', 'bar']))
        expect(state1).toEqual({
            ...initialState,
            layers: { previous: [], current: ['foo', 'bar']}
        })
        const state2 = reducer(state1, setLayers(['baz']))
        expect(state2).toEqual({
            ...initialState,
            layers: { previous: ['foo', 'bar'], current: ['baz']}
        })
    })
})
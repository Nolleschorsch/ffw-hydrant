import * as utils from './utilsGeoJSON'


describe('utils', () => {

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('createSourcesAndLayers returns expected value', () => {
        jest.spyOn(utils, 'createRoutesSourceAndLayer').mockImplementation(
            () => ([['fooSource'], ['fooLayer']]))
        jest.spyOn(utils, 'createHydrantsSourceAndLayer').mockImplementation(
            () => ([['barBazSource'], ['barLayer', 'bazLayer']]))
        utils.createSourcesAndLayers([], [])
        expect(utils.createRoutesSourceAndLayer).toHaveBeenCalledWith([])
        expect(utils.createHydrantsSourceAndLayer).toHaveBeenCalledWith([])
        expect(utils.createHydrantsSourceAndLayer()).toEqual([['barBazSource'], ['barLayer', 'bazLayer']])

    })
    it('createRoutesSourceAndLayer returns expected value', () => {
        jest.spyOn(utils, 'createGeoJSONLineSource').mockImplementation(() => 'routeSourceMock')
        jest.spyOn(utils, 'createLineLayer').mockImplementation(() => 'routeLayerMock')

        const [sources, layers] = utils.createRoutesSourceAndLayer([
            {name: 'foo', coordinates: [[1,1]]},
            {name: 'bar', coordinates: [[2,2]]}
        ])
        expect(sources).toEqual(['routeSourceMock', 'routeSourceMock'])
        expect(layers).toEqual(['routeLayerMock', 'routeLayerMock'])

        expect(utils.createGeoJSONLineSource).toHaveBeenCalledWith(
            {type: 'LineString', coordinates: [[1,1]]}, 'routeSource-foo'
        )
        expect(utils.createLineLayer).toHaveBeenCalledWith({
            routeLayerName: 'routeLayer-foo',
            routeSourceName: 'routeSource-foo',
            routeColor: 'red',
            lineWidth: 4,
            lineGapWidth: 0
        })
        expect(utils.createLineLayer).toHaveBeenCalledWith({
            routeLayerName: 'routeLayer-bar',
            routeSourceName: 'routeSource-bar',
            routeColor: 'red',
            lineWidth: 4,
            lineGapWidth: 0
        })
    })

    it('createHydrantsSourceAndLayer', () => {
        jest.spyOn(utils, 'createPointFeaturesFromStops').mockReturnValue('pointFeaturesMock')
        jest.spyOn(utils, 'createGeoJSONFeatureCollection').mockReturnValue('pointFeatureCollectionMock')
        jest.spyOn(utils, 'createPointLayer').mockReturnValue('pointLayerMock')
        jest.spyOn(utils, 'createSymbolLayer').mockReturnValue('symbolLayerMock')
        const [sources, layers] = utils.createHydrantsSourceAndLayer([
            {vehicle: 'fooVehicle', stops: []}
        ])
        expect(sources).toEqual([
            { type: 'geojson', data: 'pointFeatureCollectionMock', promoteId: 'hydrantSource-fooVehicle' }
        ])
        expect(layers).toEqual(['pointLayerMock', 'symbolLayerMock'])
    })
    it('createPointFeaturesFromStops', () => {
        const coordinates = [1, 1]
        const stops = [
            {
                location: 'FooStop',
                location_metadata: {
                    supplied_coordinate: coordinates
                },
                odometer: 1337
            }
        ]
        const uniqueName = 'Foobar'
        const expected = utils.createGeoJSONPointSource(coordinates, {
            name: 'FooStop',
            distance: 1337,
            group: uniqueName,
            index: 0
        })
        const objs = utils.createPointFeaturesFromStops({ stops, uniqueName })
        expect(objs).toHaveLength(1)
        expect(objs[0]).toEqual(expected)
    })
    it('createGeoJSONPointSource', () => {
        const coordinates = [42, 69]
        const properties = { foo: 'bar', answer: 42 }
        const obj = utils.createGeoJSONPointSource(coordinates, properties)
        expect(obj.type).toEqual('Feature')
        expect(obj.properties).toEqual(properties)
        expect(obj.geometry).toBeDefined()
        expect(obj.geometry.type).toEqual('Point')
        expect(obj.geometry.coordinates).toEqual(coordinates)
    })
    it('createGeoJSONFeatureCollection', () => {
        const features = [
            { foo: 'bar' }, { foo: 'baz' }
        ]
        const obj = utils.createGeoJSONFeatureCollection(features)
        expect(obj.type).toEqual('FeatureCollection')
        expect(obj.features).toEqual(features)
    })
    it('createGeoJSONLineSource', () => {
        const geometry = { foo: 'bar' }
        const name = 'foobar'
        const obj = utils.createGeoJSONLineSource(geometry, name)
        expect(obj.type).toEqual('geojson')
        expect(obj.promoteId).toEqual(name)
        expect(obj.data.type).toEqual('Feature')
        expect(obj.data.properties).toEqual({})
        expect(obj.data.geometry).toEqual(geometry)
    })
    it('createPointLayer', () => {
        const layerName = 'fooLayer'
        const sourceName = 'fooSource'
        const color = 'red'
        const obj = utils.createPointLayer({ layerName, sourceName, color })
        expect(obj.id).toEqual(layerName)
        expect(obj.type).toEqual('circle')
        expect(obj.source).toEqual(sourceName)
        expect(obj.paint['circle-color']).toEqual(color)
        expect(obj.paint['circle-radius']).toEqual(15)
    })
    it('createSymbolLayer', () => {
        const layerName = 'fooLayer'
        const sourceName = 'fooSource'
        const color = 'red'
        const text = 'miau'
        const obj = utils.createSymbolLayer({ layerName, sourceName, color, text })
        expect(obj.id).toEqual(layerName)
        expect(obj.type).toEqual('symbol')
        expect(obj.source).toEqual(sourceName)
        expect(obj.layout['text-field']).toEqual(text)
        expect(obj.paint['text-color']).toEqual('#FFFFFF')
    })
    it('createLineLayer', () => {
        const routeLayerName = 'fooLayer'
        const routeSourceName = 'fooSource'
        const routeColor = 'green'
        const lineWidth = 4
        const lineGapWidth = 0
        const props = {
            routeLayerName, routeSourceName, routeColor, lineWidth, lineGapWidth
        }
        const obj = utils.createLineLayer(props)
        expect(obj.id).toEqual(routeLayerName)
        expect(obj.type).toEqual('line')
        expect(obj.source).toEqual(routeSourceName)
        expect(obj.layout.visibility).toEqual('visible')
        expect(obj.layout['line-join']).toEqual('round')
        expect(obj.layout['line-cap']).toEqual('round')
        expect(obj.paint['line-color']).toEqual(routeColor)
        expect(obj.paint['line-width']).toEqual(lineWidth)
        expect(obj.paint['line-gap-width']).toEqual(lineGapWidth)
    })
})
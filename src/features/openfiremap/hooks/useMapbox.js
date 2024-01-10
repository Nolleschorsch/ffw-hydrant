import mapboxgl from 'mapbox-gl'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'


export const useMapbox = (map, mapContainer) => {

    const { accessToken } = useSelector(state => state.mapbox)
    mapboxgl.accessToken = accessToken

    const [isLoading, setIsLoading] = useState(true)

    const WEIER_LNG = 8.3916033
    const WEIER_LAT = 48.9231337
    const lng = WEIER_LNG
    const lat = WEIER_LAT
    const zoom = 12

    useEffect(() => {
        /* istanbul ignore if */
        if (map.current) return
        /* (async () => { */
            map.current = new mapboxgl.Map({
                accessToken: mapboxgl.accessToken,
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom: zoom,
                testMode: true
            })
            map.current.on('load', () => {
                map.current.addSource('hydrants-bw', {
                    type: 'geojson',
                    data: 'https://nolleschorsch.github.io/ffw-hydrant/hydrants_de.geojson',
                    cluster: true,
                    clusterMaxZoom: 14, // Max zoom to cluster points on
                    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
                })
                map.current.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'hydrants-bw',
                    filter: ['has', 'point_count'],
                    paint: {
                        // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
                        // with three steps to implement three types of circles:
                        //   * Blue, 20px circles when point count is less than 100
                        //   * Yellow, 30px circles when point count is between 100 and 750
                        //   * Pink, 40px circles when point count is greater than or equal to 750
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#51bbd6',
                            100,
                            '#f1f075',
                            750,
                            '#f28cb1'
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            20,
                            100,
                            30,
                            750,
                            40
                        ]
                    }
                });

                map.current.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'hydrants-bw',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': ['get', 'point_count_abbreviated'],
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12
                    }
                });

                map.current.addLayer({
                    id: 'unclustered-point',
                    type: 'circle',
                    source: 'hydrants-bw',
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': '#11b4da',
                        'circle-radius': 4,
                        'circle-stroke-width': 1,
                        'circle-stroke-color': '#fff'
                    }
                });
            })
            map.current.once('idle', () => {
                setIsLoading(false)
            })
            
        /* })() */

    });

    useEffect(() => {
        map.current.resize()
    }, [isLoading])

    return isLoading

}
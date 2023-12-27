import { http, HttpResponse } from 'msw'

import d1 from '../data/directions/response1.json'
import d2 from '../data/directions/response2.json'
import d3 from '../data/directions/response3.json'
import d4 from '../data/directions/response4.json'
import d5 from '../data/directions/response5.json'
import d6 from '../data/directions/response6.json'
import d7 from '../data/directions/response7.json'


export const stringToHash = (string) => {

    let hash = 0;

    if (string.length == 0) return hash;

    for (let i = 0; i < string.length; i++) {
        const char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return hash;
}

export const mapbox_directions_handlers = [
    http.get('https://api.mapbox.com/directions/v5/mapbox/walking/:coordinates', ({ request, params }) => {
        const { coordinates } = params
        const hash = stringToHash(coordinates)
        let directions
        switch(hash) {
            case 346554752:
                directions = d1
                break
            case -136726276:
                directions = d2
                break
            case 692899165:
                directions = d3
                break
            case -1660726514:
                directions = d4
                break
            case 400944114:
                directions = d5
                break
            case 209833289:
                directions = d6
                break
            case -1550100218:
                directions = d7
                break
            default:
                directions = {}
        }

        return HttpResponse.json(directions, { status: 200 })
    })
]
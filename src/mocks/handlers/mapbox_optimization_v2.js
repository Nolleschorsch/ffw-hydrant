import { http, HttpResponse } from 'msw'
import solution from '../data/solution/solutionCompleteWithHome.json'

export const mapbox_optimization_v2_handlers = [
    http.get(
        'https://api.mapbox.com/optimized-trips/v2', ({ request }) => {
            const url = new URL(request.url)
            const access_token = url.searchParams.get('access_token')
            return HttpResponse.json([
                { id: "123e4567-e89b-12d3-a456-426655440000", status: "pending" }
            ], { status: 200 })
        }, { once: true }
    ),
    http.get(
        'https://api.mapbox.com/optimized-trips/v2', ({ request }) => {
            const url = new URL(request.url)
            const access_token = url.searchParams.get('access_token')
            return HttpResponse.json([
                { id: "123e4567-e89b-12d3-a456-426655440000", status: "complete" }
            ], { status: 200 })
        }
    ),
    http.get(
        'https://api.mapbox.com/optimized-trips/v2/:id', ({ request, params }) => {
            const url = new URL(request.url)
            const access_token = url.searchParams.get('access_token')
            const id = { params }
            return HttpResponse.json(solution)
        }
    ),
    http.post('https://api.mapbox.com/optimized-trips/v2/', ({ request }) => {
        const url = new URL(request.url)
        const access_token = url.searchParams.get('access_token')
        return HttpResponse.json({
            id: "123e4567-e89b-12d3-a456-426655440000",
            status: "ok"
        }, { status: 202 })
    })
]
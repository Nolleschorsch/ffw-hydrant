import { http, HttpResponse } from 'msw'
import hydrants from '../data/hydrants/hydrants.json'
import solution from '../data/solution/solutionCompleteWithHome2.json'
import fooHydrants from '../data/hydrants/bw_hydrants_minified.json'
import routes from '../data/routes/routes.json'

// TODO: implement save & load logic for localStorageX
// TODO: change localStorageX to sessionStorageX
// TODO: use prefix for the storage stuff e.g. ffw_hydrant_<KEY>
// TODO: add another solution, delete the old stuff from mocks/data/solution

export const drf_handlers = [
    http.get('http://localhost/api/hydrant', () => {
        const savedHydrants = JSON.parse(sessionStorage.getItem("hydrants")) || hydrants
        sessionStorage.setItem("hydrants", JSON.stringify(savedHydrants))
        return HttpResponse.json(savedHydrants)
        //return HttpResponse.json(fooHydrants.slice(/* 60000 */))
    }),
    http.post('http://localhost/api/hydrant', async ({ request }) => {
        const changedHydrants = await request.json()
        const savedHydrants = JSON.parse(sessionStorage.getItem("hydrants")) || []

        changedHydrants.forEach((hydrant) => {
            if (hydrant.id) {
                const index = savedHydrants.findIndex(x => x.id === hydrant.id)
                savedHydrants.splice(index, 1, hydrant)
            } else {
                savedHydrants.push(Object.assign(
                    {}, { ...hydrant }, { id: savedHydrants.slice(-1)[0].id + 1 }
                ))
            }
        })
        sessionStorage.setItem("hydrants", JSON.stringify(savedHydrants))
        return HttpResponse.json({ message: 'Speichern Erfolgreich!' }, { status: 202 })
    }),
    http.get('http://localhost/api/solution', () => {

        const savedSolutions = JSON.parse(sessionStorage.getItem("solutions")) || [
            { name: 'Foobar', id: 1 }
        ]
        sessionStorage.setItem("solutions", JSON.stringify(savedSolutions))
        return HttpResponse.json(savedSolutions, { status: 200 })
    }),
    http.get('http://localhost/api/solution/:id', ({ params }) => {
        const name = 'Foobar'
        const solution_polyline = 'qwer'
        const routes_polyline = 'asdf'
        const id = 1
        const solutionWithRoutes = [{
            solution, routes, name, solution_polyline, routes_polyline, id
        }]

        const savedSolutionWithRoutes = JSON.parse(
            sessionStorage.getItem("solutionWithRoutes")
        ) || solutionWithRoutes

        sessionStorage.setItem("solutionWithRoutes", JSON.stringify(savedSolutionWithRoutes))

        const foo = savedSolutionWithRoutes.filter(x => x.id === parseInt(params.id))[0]

        return HttpResponse.json(foo, { status: 200 })

    }),
    http.post('http://localhost/api/solution', async ({ request }) => {
        const solutionWithRoutes = await request.json()
        const savedSolutionWithRoutes = JSON.parse(
            sessionStorage.getItem("solutionWithRoutes")
        ) || []
        const savedSolutions = JSON.parse(sessionStorage.getItem("solutions")) || []
        savedSolutions.push(Object.assign(
            {}, { ...solutionWithRoutes }, { id: savedSolutions.length + 1 }
        ))

        sessionStorage.setItem("solutions", JSON.stringify(savedSolutions))
        savedSolutionWithRoutes.push(Object.assign(
            {}, { ...solutionWithRoutes }, { id: savedSolutions.length })
        )
        sessionStorage.setItem("solutionWithRoutes", JSON.stringify(savedSolutionWithRoutes))
        return HttpResponse.json({ message: 'Speichern Erfolgreich!' }, { status: 202 })
    })
]
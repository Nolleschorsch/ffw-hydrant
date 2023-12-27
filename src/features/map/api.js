import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


// Define a service using a base URL and expected endpoints
export const hydrantApi = createApi({
    reducerPath: 'hydrantApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost/api/' }),
    tagTypes: ['Hydrant', 'SolutionWithRoutes'],
    endpoints: (builder) => ({
        getHydrants: builder.query({
            query: () => `hydrant/`,
            //query: () => `testing/`,
            providesTags: ['Hydrant'],
        }),
        setHydrants: builder.mutation({
            query: (body) => ({
                url: 'hydrant/',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Hydrant'],
        }),
        getSolutions: builder.query({
            query: () => 'solution/',
            providesTags: ['SolutionWithRoutes'],
        }),
        getSolutionDetail: builder.query({
            query: (id) => `solution/${id}`
        }),
        postSolution: builder.mutation({
            query: (body) => {
                return {
                    url: 'solution/',
                    method: 'POST',
                    body
                }
            },
            invalidatesTags: ['SolutionWithRoutes']
        })
    }),
})

const HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
}


export const mapboxApi = createApi({
    reducerPath: 'mapboxApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.mapbox.com/optimized-trips',
        prepareHeaders: ({ headers: HEADERS }) => HEADERS
    }),
    //tagTypes: [''],
    endpoints: (builder) => ({
        postRoutingProblem: builder.mutation({
            query: ({accessToken, ...body}) => {
                return {
                    url: `v2/?access_token=${accessToken}`,
                    method: 'POST',
                    body
                }
            }
        }),
        getSolutionStatus: builder.query({
            query: ({id, accessToken}) => {
                return { url: 'v2', params: { access_token: accessToken } }
            },
            //invalidatesTags: ['']
        }),
        getSolution: builder.query({
            query: ({id, accessToken}) => {
                return { url: `v2/${id}`, params: { access_token: accessToken } }
            }

        })
    })
})


export const mapboxDirectionsApi = createApi({
    reducerPath: 'mapboxDirectionsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.mapbox.com/directions/v5/mapbox',
        prepareHeaders: ({ headers: HEADERS }) => HEADERS
    }),
    endpoints: (builder) => ({
        getDirections: builder.query({
            query: ({coordinates, accessToken}) => {
                return {
                    url: `walking/${coordinates}`,
                    params: { access_token: accessToken, geometries: 'geojson' }
                }
            }
        })
    })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetHydrantsQuery,
    useSetHydrantsMutation,
    useGetSolutionsQuery,
    useLazyGetSolutionDetailQuery,
    usePostSolutionMutation
} = hydrantApi
export const { useLazyGetDirectionsQuery } = mapboxDirectionsApi
export const {
    usePostRoutingProblemMutation,
    useGetSolutionStatusQuery,
    useGetSolutionQuery,
    useLazyGetSolutionStatusQuery,
    useLazyGetSolutionQuery
} = mapboxApi
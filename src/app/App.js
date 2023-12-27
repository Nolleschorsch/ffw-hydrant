import React from 'react'
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
    useLocation
} from "react-router-dom"
import { useSelector } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Navigation from './Navigation'
import AccessTokenProvider, { useAccessToken } from './AccessTokenProvider'
import ErrorPage from './ErrorPage'
import Login from './Login'
import Map from '../features/map/Map'
import OpenFireMap from '../features/openfiremap/OpenFireMap'
import './App.css'



export const ProtectedRoute = ({ children }) => {

    //const { accessToken } = useAccessToken()
    const { accessToken } = useSelector(state => state.mapbox)
    const location = useLocation()

    if (!accessToken) {
        return <Navigate to='/login' replace state={{ from: location }} />
    }

    return children

}


// TODO: add Error Page
const router = createBrowserRouter(
    [{
        element: <AccessTokenProvider />,
        children:
            [
                {
                    path: '*',
                    element: <ErrorPage />
                },
                {
                    path: "/",
                    element: <ProtectedRoute><Navigation /></ProtectedRoute>,
                    children: [
                        {
                            path: "/",
                            element: <div>Hello World</div>
                        },
                        {
                            path: "/hydrant",
                            element: <Map />
                        },
                        {
                            path: "/openfiremap",
                            element: <OpenFireMap />
                        }
                    ]
                }, {
                    path: "/login",
                    element: <Login />
                }
            ]
    }]
)


export const App = () => {

    return (
        <Container fluid>
            <RouterProvider router={router} />
        </Container>
    )

}

export default App
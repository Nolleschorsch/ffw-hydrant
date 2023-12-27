import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import { useDispatch } from 'react-redux'
import { useGetSolutionsQuery, useLazyGetSolutionDetailQuery } from './api'
import { createSourcesAndLayers } from './utilsGeoJSON'
import { setToast } from './toastSlice'
import { setSolution, setSolutionName, setRoutes, setSources, setLayers } from './mapSlice'

export const SolutionSelect = (props) => {

    const dispatch = useDispatch()
    const [selectedSolution, setSelectedSolution] = useState('')

    const { data, error, isLoading, isSuccess } = useGetSolutionsQuery()
    const [getSolutionDetail, { data: solutionDetailData, error: solutionDetailError }] = useLazyGetSolutionDetailQuery()

    useEffect(() => {

        const show = true
        const toastTitle = 'getSolutions'
        let bg, toastTxt

        if (isLoading) {
            bg = 'warning'
            toastTxt = 'loading...'
        } else if (isSuccess) {
            bg = 'success'
            toastTxt = 'Success'
        //} else if (error) { 
        } else {
            bg = 'danger'
            toastTxt = error.error
        }
        dispatch(setToast({ bg, toastTxt, toastTitle, show }))

    }, [isLoading])

    const handleSolutionSelect = async event => {
        try {
            setSelectedSolution(event.target.value)
            const solutionWithRoutes = await getSolutionDetail(event.target.value).unwrap()
            const { solution, routes, name } = solutionWithRoutes
            const [sources, layers] = createSourcesAndLayers(routes, solution.routes)

            dispatch(setSolution(solution))
            dispatch(setSolutionName(name))
            dispatch(setRoutes(routes))

            dispatch(setSources(sources))
            dispatch(setLayers(layers))
        }
        catch (error) {
            dispatch(setToast({
                bg: 'danger',
                toastTitle: 'handleSolutionSelect',
                toastTxt: error.error,
                show: true
            }))
        }

    }

    return (
        <Form.Select onChange={handleSolutionSelect} value={selectedSolution} disabled={isLoading}>
            <option disabled value="">Vorhandene Lösung auswählen</option>
            {data?.map((x, i) =>
                <option key={i} value={x.id}>{x.name}</option>) || null}
        </Form.Select>
    )

}


export default SolutionSelect
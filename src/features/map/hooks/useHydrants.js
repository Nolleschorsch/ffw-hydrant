import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useGetHydrantsQuery } from "../api"
import { setHydrants } from "../mapSlice"


export const useHydrants = () => {

    const dispatch = useDispatch()
    const { data, error, isLoading } = useGetHydrantsQuery()

    useEffect(() => {
        if (!data) return;
        dispatch(setHydrants(data))
    }, [isLoading, data])


    return { data, error, isLoading }
}
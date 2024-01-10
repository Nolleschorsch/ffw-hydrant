import { useDispatch } from "react-redux"
import { Validator } from "jsonschema"
import { editHydrant, setHydrants, setLayers, setRoutes, setSolution, setSolutionName, setSources } from "../mapSlice"
import { setToast } from '../toastSlice' 
import { createSourcesAndLayers } from "../utilsGeoJSON"

const hydrantsSchema = {
    "type": "array",
    "items": {
        "properties": {
            "lat": { "type": "number" },
            "lng": { "type": "number" },
            "name": { "type": "string" },
            "active": { "type": "boolean" },
            "id": { "type": "number" }
        },
        "required": ["lat", "lng", "name", "active"]
    }
}

const solutionRouteStopSchema = {
    "id": "/SolutionRouteStop",
    "type": "object",
    "properties": {
        "location": { "type": "string" },
        "location_metadata": {
            "type": "object",
            "properties": {
                "supplied_coordinate": {
                    "type": "array",
                    "minItems": 2,
                    "maxItems": 2,
                    "items": { "type": "number" }
                },
                "snapped_coordinate": {
                    "type": "array",
                    "minItems": 2,
                    "maxItems": 2,
                    "items": { "type": "number" }
                }
            },
            "required": ["supplied_coordinate", "snapped_coordinate"]
        },
        "eta": { "type": "string" },
        "type": { "type": "string" },
        "odometer": { "type": "number" },
        "wait": { "type": "number" }
    },
    "required": ["location", "location_metadata", "eta", "type", "odometer"]
}

const solutionRouteSchema = {
    "id": "/SolutionRoute",
    "type": "object",
    "properties": {
        "vehicle": { "type": "string" },
        "stops": {
            "type": "array",
            "items": { "$ref": "/SolutionRouteStop" }
        }
    },
    "required": ["vehicle", "stops"]
}


const solutionSchema = {
    "id": "/Solution",
    "type": "object",
    "properties": {
        "dropped": {
            "type": "object",
            "properties": {
                "services": {
                    "type": "array",
                    "items": {
                        "type": "object"
                    }
                },
                "shipments": {
                    "type": "array",
                    "items": {
                        "type": "object"
                    }
                }
            },
            "required": ["services", "shipments"]
        },
        "routes": {
            "type": "array",
            "items": { "$ref": "/SolutionRoute" }
        }
    },
    "required": ["dropped", "routes"]
}

const routeSchema = {
    "id": "/Route",
    "type": "object",
    "properties": {
        "name": { "type": "string" },
        "coordinates": {
            "type": "array",
            "items": {
                "type": "array",
                "minItems": 2,
                "maxItems": 2,
                "items": {
                    "type": "number"
                }
            }
        }
    },
    "required": ["name", "coordinates"]
}

const solutionWithRoutesSchema = {
    "id": "SolutionWithRoutes",
    "type": "object",
    "properties": {
        "solutionName": { "type": "string" },
        "solution": { "$ref": "/Solution" },
        "routes": {
            "type": "array",
            "items": { "$ref": "/Route" }
        }
    },
    "required": ["solutionName", "solution", "routes"]
}

const hydrantPropertiesSchema = {
    "id": "/HydrantProperties",
    "type": "object"
}

const hydrantCoordinatesSchema = {
    "id": "/HydrantCoordinates",
    "type": "array",
    "minItems": 2,
    "maxItems": 2,
    "items": { "type": "number" }
}

const hydrantGeometrySchema = {
    "id": "/HydrantGeometry",
    "type": "object",
    "properties": {
        "coordinates": { "$ref": "/HydrantCoordinates" },
        "type": { "type": "string" }
    }
}

const hydrantGeoJsonSchema = {
    "id": "/Hydrant",
    "type": "object",
    "properties": {
        "type": { "type": "string" },
        "geometry": { "$ref": "/HydrantGeometry" },
        "properties": { "$ref": "/HydrantProperties" }
    }
}

const hydrantsGeoJsonSchema = {
    "type": "object",
    "properties": {
        "type": { "type": "string" },
        "features": {
            "type": "array",
            "items": { "$ref": "/Hydrant" }
        }
    },
    "required": ["type", "features"]
}


/* v.addSchema(hydrantPropertiesSchema, "/HydrantProperties")
                v.addSchema(hydrantCoordinatesSchema, "/HydrantCoordinates")
                v.addSchema(hydrantGeometrySchema, "/HydrantGeometry")
                v.addSchema(hydrantGeoJsonSchema, "/Hydrant") */

export const useImport = () => {

    const dispatch = useDispatch()

    const _importFile = (file, onload, onerror) => {
        const reader = new FileReader()
        reader.readAsText(file, 'UTF-8')
        reader.onload = onload
        reader.onerror = onerror
    }

    const importHydrants = (file) => {
        const reader = new FileReader()
        reader.readAsText(file, 'UTF-8')
        const onload = (e) => {
            try {
                const { target: { result } } = e
                const _result = JSON.parse(result)
                const v = new Validator()

                const res = v.validate(_result, hydrantsSchema)

                if (res.valid) {
                    dispatch(setHydrants(_result))
                }

                console.log(res.valid)
            } catch (err) {
                console.log(err)
            }

        }
        const onerror = (err) => {
            console.log(err)
        }
        _importFile(file, onload, onerror)
    }

    const importSolution = (file) => {
        const onload = (e) => {
            try {
                const { target: { result } } = e
                const _result = JSON.parse(result)
                console.log(_result)
                const v = new Validator()
                v.addSchema(solutionRouteStopSchema, "/SolutionRouteStop")
                v.addSchema(solutionRouteSchema, "/SolutionRoute")
                v.addSchema(solutionSchema, "/Solution")
                v.addSchema(routeSchema, "/Route")
                const res = v.validate(_result, solutionWithRoutesSchema)

                console.log({res})

                if (res.valid) {
                    const { solutionName, solution, routes } = _result
                    dispatch(setSolutionName(solutionName))
                    dispatch(setSolution(solution))
                    dispatch(setRoutes(routes))
                    const [sources, layers] = createSourcesAndLayers(routes, solution.routes)
                    dispatch(setSources(sources))
                    dispatch(setLayers(layers))
                    dispatch(setToast({
                        toastTitle: 'Import Solution',
                        toastTxt: 'Import erfolgreich',
                        bg: 'success',
                        show: true
                    }))
                } else {
                    dispatch(setToast({
                        toastTitle: 'Import Solution',
                        toastTxt: 'Inkompatible Datei',
                        bg: 'danger',
                        show: true
                    }))
                }

                console.log(res.valid)
            } catch (err) {
                console.log(err)
                dispatch(setToast({
                    toastTitle: 'Import Solution',
                    toastTxt: 'Etwas ist schief gegangen',
                    bg: 'danger',
                    show: true
                }))
            }

        }
        const onerror = (err) => {
            console.log(err)
        }
        _importFile(file, onload, onerror)
    }

    return { importHydrants, importSolution }


}
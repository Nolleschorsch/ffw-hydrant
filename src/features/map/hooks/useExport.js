import JSZip from 'jszip'
import fileDownload from "js-file-download"
import { createGeoJSONPointSource, createGeoJSONFeatureCollection } from '../utilsGeoJSON'

export const README_TEXT = `Hello World`

export const useExport = () => {

    const downloadJSON = (hydrants) => {
        // TODO: https://mygeodata.cloud/converter/geojson-to-gpx
        // convert geojson to gpx and add to openstreetmap

        const zip = new JSZip()

        // properties? openfiremap?
        const features = hydrants.map(hyd => createGeoJSONPointSource([hyd.lng, hyd.lat], {}))
        const featureCollection = createGeoJSONFeatureCollection(features)

        zip.file("convert_me.geojson", JSON.stringify(featureCollection))
        zip.file("import_me.js", JSON.stringify(hydrants))
        zip.file("README.txt", README_TEXT)

        zip.generateAsync({ type: 'blob' }).then(content => {
            fileDownload(content, "hydrants.zip")
        })

    }

    const downloadSolution = (solution, routes) => {
        const obj = {
            solutionName: 'Miau',
            solution,
            routes,
        }
        const blob = new Blob([JSON.stringify(obj)], {
            type: "application/json",
        })
        fileDownload(blob, 'solution.json')
    }

    return { downloadJSON, downloadSolution }

}
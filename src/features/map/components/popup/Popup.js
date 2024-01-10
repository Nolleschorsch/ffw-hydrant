import React, { useRef } from 'react'
import { usePopup } from './index';
import HydrantPopup from './components/hydrantpopup';

export const Popup = (props) => {

    const { map } = props
    const popupRef = useRef(null)

    const hydrantProps = usePopup(map, popupRef)

    return (
        <div style={{ display: "none" }}>
            <div ref={popupRef}>
                <HydrantPopup {...hydrantProps}/>
            </div>
        </div>
    )

}

export default Popup
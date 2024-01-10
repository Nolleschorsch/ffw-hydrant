import { useState } from "react"

export const useMenu = () => {
    
    const [showMenu, setShowMenu] = useState(true)


    return [showMenu, setShowMenu]

}
import { useState } from "react"

export const useMenu = () => {
    
    const [showMenu, setShowMenu] = useState(false)
    

    return [showMenu, setShowMenu]

}
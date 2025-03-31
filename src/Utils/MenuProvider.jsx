// /utils/MenuContext.jsx
import React, { createContext, useState } from 'react';

// Create the context
const MenuContext = createContext();

// Create the provider component
export const MenuProvider = ({ children }) => {
    const [menuCubeOn, setMenuCubeOn] = useState(true);
    const [menuArrowsOn, setMenuArrowsOn] = useState(true);
    const [menuButtonOn, setMenuButtonOn] = useState(true);

    return (
        <MenuContext.Provider
            value={{
                menuCubeOn,
                setMenuCubeOn,
                menuArrowsOn,
                setMenuArrowsOn,
                menuButtonOn,
                setMenuButtonOn,
            }}
        >
            {children}
        </MenuContext.Provider>
    );
};

export { MenuContext };
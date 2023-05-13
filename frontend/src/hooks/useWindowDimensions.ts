import {useEffect, useState} from "react";

function getWindowDimensions(): Dimensions2d {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
    };
}

export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState<Dimensions2d>(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
}
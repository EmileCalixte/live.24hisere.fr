import { useEffect, useState } from "react";
import { type Dimensions2d } from "../types/Dimensions";

function getWindowDimensions(): Dimensions2d {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
    };
}

export function useWindowDimensions(): Dimensions2d {
    const [windowDimensions, setWindowDimensions] = useState<Dimensions2d>(
        getWindowDimensions(),
    );

    useEffect(() => {
        function handleResize(): void {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return windowDimensions;
}

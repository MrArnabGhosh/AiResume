import { useEffect, useState } from "react";
import type { RefObject } from "react"; // Import RefObject type for clarity

// Change the type of containerRef to accept null
export default function useDimensions(containerRef: RefObject<HTMLElement | null>) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const currentRef = containerRef.current; // This can now correctly be HTMLElement or null

        function getDimensions() {
            return {
                width: currentRef?.offsetWidth || 0,
                height: currentRef?.offsetHeight || 0,
            };
        }

        const resizeObserver = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry) {
                setDimensions(getDimensions());
            }
        });

        if (currentRef) { // Only observe if currentRef is not null
            resizeObserver.observe(currentRef);
            setDimensions(getDimensions()); // Get initial dimensions
        }

        return () => {
            if (currentRef) { // Only unobserve if currentRef was observed
                resizeObserver.unobserve(currentRef);
            }
            resizeObserver.disconnect(); // Always disconnect the observer
        };
    }, [containerRef]); // Dependency array should include containerRef

    return dimensions;
}
import { useState, useCallback } from "react";
import ResizeHandle from "./ResizeHandle";

const ResizablePanel = ({
    side = "left",
    defaultWidth = 250,
    min = 180,
    max = 550,
    className = "",
    children
}) => {
    const [width, setWidth] = useState(defaultWidth);

    const startResize = useCallback((e) => {
        const startX = e.clientX;
        const startWidth = width;

        const onMove = (ev) => {
            const delta = ev.clientX - startX;

            const newWidth =
                side === "left"
                    ? startWidth + delta
                    : startWidth - delta;

            if (newWidth > min && newWidth < max) {
                setWidth(newWidth);
            }
        };

        const stop = () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", stop);
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", stop);
    }, [width, side, min, max]);

    return (
        <section
            style={{ width }}
            className={`relative flex flex-col ${className}`}
        >
            {children}

            {/* Handle */}
            <ResizeHandle side={side === "left" ? "right" : "left"} onResize={startResize} />
        </section>
    );
};

export default ResizablePanel;

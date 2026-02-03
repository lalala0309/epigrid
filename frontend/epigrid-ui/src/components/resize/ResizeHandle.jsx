import { GripVertical } from "lucide-react";

const ResizeHandle = ({ side = "right", onResize }) => {
    const isRight = side === "right";

    return (
        <div
            onMouseDown={onResize}
            className={`
                absolute top-0 ${isRight ? "right-0" : "left-0"}
                w-1 h-full
                cursor-col-resize
                bg-transparent hover:bg-slate-300/40
                transition-all duration-150
                z-30 flex items-center justify-center group
            `}
        >
            <GripVertical
                size={14}
                className="opacity-0 group-hover:opacity-70 text-slate-500 transition"
            />
        </div>
    );
};

export default ResizeHandle;

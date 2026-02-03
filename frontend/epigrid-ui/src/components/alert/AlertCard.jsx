import React from "react";

const AlertCard = ({ title, desc, time, urgent = false }) => {
    return (
        <div
            className={`
                p-2 rounded-md border-2 transition-all cursor-default
                ${urgent
                    ? "bg-red-50/50 border-red-300"
                    : "bg-slate-50 border-slate-300"}
            `}
        >
            <div className="flex flex-col gap-2">

                {/* Title */}
                <h4
                    className={`
                        text-[12.5px] font-bold leading-tight tracking-tight
                        ${urgent ? "text-red-600" : "text-slate-900"}
                    `}
                >
                    {title}
                </h4>

                {/* Description */}
                <p className="text-[11px] text-slate-600 leading-snug font-medium">
                    {desc}
                </p>

                {/* Time */}
                <div className="pt-1 border-t border-slate-200">
                    <span className="text-[9px] font-bold text-slate-800">
                        {time}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AlertCard;

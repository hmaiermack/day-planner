import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface IGradientButtonProps {
    type: "button" | "submit" | "reset" | undefined,
    text: string,
    size: 'md' | 'lg',
    loading: boolean,
}

const GradientButton = ({type, text, size = 'md', loading}: IGradientButtonProps) => {
    let classes = 'flex items-center justify-center w-full py-2 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-400 hover:to-orange-600 rounded-md text-gray-100 font-bold'
    if (size === 'lg') classes += " text-2xl"

    return (
        <button
            type={type}
            className={classes}
            disabled={loading}
        >
            {loading ? (
                <span className="flex items-center">
                    <FontAwesomeIcon icon={faCircleNotch} spin />
                    <span className="ml-2">Loading...</span>
                </span>
            ) : (
                <span>{text}</span>
            )}
        </button>
    )
}

export default GradientButton
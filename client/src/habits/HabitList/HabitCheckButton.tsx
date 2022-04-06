import React from "react";

interface IHabitCheckButtonProps {
    isComplete: boolean
}

function HabitCheckButton({isComplete}: IHabitCheckButtonProps) {
    return (
        <button type="button">
            {
                isComplete ? <span className="text-green-200">{isComplete.toString()}</span> : <span className="text-red-200">{isComplete.toString()}</span>
            }
        </button>
    )
}

export default HabitCheckButton
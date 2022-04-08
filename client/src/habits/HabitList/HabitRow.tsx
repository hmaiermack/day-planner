import React from "react";
import HabitCheckButton from "./HabitCheckButton";

interface IHabitRowProps {
    id: string,
    name: string,
    remindTime?: string,
    isCompleted: boolean
}

function HabitRow({
    id, name, isCompleted, remindTime = undefined
}: IHabitRowProps) {
 return (
    <div key={id} className="flex max-w-full w-64 bg-gray-200 p-2 rounded items-center justify-between">
        <div className="flex items-start justify-start max-w-fit">
            <span>
                {name} 
                {remindTime ?  <span className="text-gray-500 text-sm ml-2">{remindTime}</span> : null }
            </span>
        </div>
        <div className="flex items-center">
            <HabitCheckButton isComplete={isCompleted}/>
            <button type="button" className="ml-1 text-gray-400">
                    <svg className="h-4 w-4 fill-gray-500" viewBox="0 0 20 20"><path d="M10 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" /></svg>
            </button>
        </div>
    </div>
 )
}

export default HabitRow
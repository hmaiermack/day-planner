import React, { useState } from "react";
import HabitRow from "./HabitList/HabitRow";

function HabitList() {
const habits = [
    {
        name: "Wake up",
        id: "58dx7123",
        isCompleted: false,
        remindTime: "8AM"
    },
    {
        name: "Go to sleep",
        id: "532x7123",
        isCompleted: false,
        remindTime: "8AM"
    },
    {
        name: "Ham",
        id: "58dx233223",
        isCompleted: true
    },
]

const [data, setData] = useState(habits)

return (
    <div className="w-full bg-gray-300 rounded py-2 px-4 min-h-80 flex flex-col items-center">
        <h2 className="font-semibold text-lg self-start text-gray-600">Your Habits</h2>
        <div className="flex gap-4 sm:justify-between flex-col self-center items-center w-full sm:flex-row sm:flex-wrap my-2">
            {data.map((data) => ( <HabitRow id={data.id} name={data.name} isCompleted={data.isCompleted} remindTime={data.remindTime} toggleComplete={setData()} /> ))}
        </div>
    </div>
)
}

export default HabitList
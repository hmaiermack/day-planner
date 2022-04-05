import React from "react";
import HabitGrid from "./HabitGrid"
import HabitList from "./HabitList"

function HabitContainer() {
    return (
        <div className="w-full flex flex-col-reverse sm:flex-row gap-4">
            <HabitList />
            <HabitGrid />
        </div>
    )
}

export default HabitContainer
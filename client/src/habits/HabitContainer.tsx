import React from "react";
import HabitGrid from "./HabitGrid"
import HabitList from "./HabitList"

function HabitContainer() {
    return (
        <div className="w-full p-8 flex flex-col flex-col-reverse sm:flex-row">
            <HabitList />
            <HabitGrid />
        </div>
    )
}

export default HabitContainer
import { rest } from 'msw'
import {v4 as uuid } from 'uuid'

let habits = [
    {
        name: "Wake up",
        id: uuid(),
        isCompleted: false,
        remindTime: "8AM",
        habitDays: [true, true, true, true, true, false, false]
    },
    {
        name: "Go to sleep",
        id: uuid(),
        isCompleted: false,
        remindTime: "8AM",
        habitDays: [true, true, true, true, true, false, false]
    },
    {
        name: "Ham",
        id: uuid(),
        isCompleted: true,
        habitDays: [true, true, true, true, true, false, false]
    },
]

export const handlers = [

    //get all habits, assume we pass a userId here
    rest.get('/habits', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                habits
            )
        )
    }),

    //create new habit
    rest.post('/habits', (req, res, ctx) => {
        if (req.body.remindTime) {
            const newHabit = {
                name: req.body.name,
                id: uuid(),
                isCompleted: false,
                habitDays: req.body.habitDays,
                remindTime: req.body.remindTime,
                remindDays: req.body.remindDays
            }

            habits = [
                ...habits, 
                newHabit
                ]

                return res(
                    ctx.status(200),
                    ctx.json(newHabit)
                )
        }

        const newHabit = {
            name: req.body.name,
            id: uuid(),
            isCompleted: false,
            habitDays: req.body.habitDays,
        }

        habits = [
            ...habits,
            newHabit
        ]

        return newHabit

    }),

    //toggle habit completion
    rest.post('habits/do', (req, res, ctx) => {
        for(let habit of habits){
            if(req.body.habitId === habit.id) {
                habit.isCompleted = true
            }
        }
    })
]
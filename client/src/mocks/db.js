import { factory, manyOf, nullable, oneOf, primaryKey } from '@mswjs/data'

export const db = factory({
    // Create a "user" model,
    user: {
      // ...with these properties and value getters.
      id: primaryKey(String),
      tasks: nullable(manyOf('task')),
      habits: nullable(manyOf('habit')),
      user: oneOf('user')
    },
    task: {
        id: primaryKey(String),
        title: String,
        timeStart: Date,
        timeEnd: Date,
        tag: nullable(oneOf('tag')),
        user: oneOf('user')
    },
    tag: {
        id: primaryKey(String),
        name: String,
        colorHexValue: String,
        tasks: nullable(manyOf('task')),
        user: oneOf('user')
    },
    habit: {
        id: primaryKey(String),
        habitDays: Array,
        remindTime: nullable(String),
        remindDays: nullable(Array),
        user: oneOf('user'),
        completedHabits: nullable(manyOf('completedHabit'))
    },
    completedHabit: {
        id: primaryKey(String),
        dateCompleted: Date,
        habit: oneOf('habit')
    }
  })
  
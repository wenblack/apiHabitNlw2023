import {FastifyInstance} from "fastify"
import { prisma } from "../lib/prisma"
import { z} from 'zod'//library that helps  u typing and validating data
import dayjs from "dayjs"// Library that helps u work with data

export async function appRoutes (app : FastifyInstance) {
  //create habit
  app.post('/habits', async (request)=>{
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(
        z.number().min(0).max(6)
      )
    })
    const {title, weekDays} = createHabitBody.parse(request.body) 
    //startOf = wipe minutes and hours for new date
    //toDate() = Convert string value to date
    const today = dayjs().startOf('day').toDate()


    await prisma.habit.create({
      data:{
        title: title,
        created_at: today,
        WeekDays:{
          create: weekDays.map(weekDay=>{
            return {
              week_day:weekDay
            }
          })
        }
      }
    })
  })
 //get habits of a specific date 
  app.get('/day', async (request) => {
    const getDayParams = z.object({
      //coerce = convert variables type
      date: z.coerce.date(),
    })

    const { date } = getDayParams.parse(request.query)

    const parsedDate = dayjs(date).startOf('day')
    const weekDay = parsedDate.get('day')

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          //lte:below or equal 
          lte: date,
        },
        WeekDays: {
          some: {
            week_day:  weekDay,
          }
        }
      },
    })

    const day = await prisma.day.findFirst({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayHabits: true,
      }
    })

    const completedHabits = day?.dayHabits.map(dayHabit => {
      return dayHabit.habit_id
    })

    return {
      possibleHabits,
      completedHabits,
    }
  })
}

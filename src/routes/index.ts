import {FastifyInstance} from "fastify"
import { prisma } from "../lib/prisma"
import {number, z} from 'zod'//library that helps  u typing and validating data
import dayjs from "dayjs"// Library that helps u work with data

export async function appRoutes (app : FastifyInstance) {
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
  
}

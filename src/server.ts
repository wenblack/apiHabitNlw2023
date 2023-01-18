import Fastify from "fastify";//Route module
import cors from  '@fastify/cors'//Access module(Allow third party apps/front end ) 
import {PrismaClient} from'@prisma/client'//ORM

//Starting Modules
const app = Fastify()
const prisma = new PrismaClient()

//Declaring routes
app.register(cors)
app.get('/', async ()=>{
  const habits =  await prisma.habit.findMany()
  return habits
})

app.listen({//Ports settings
  port:3333
}).then(()=>{
  console.log('Server running on port 3333!')
})
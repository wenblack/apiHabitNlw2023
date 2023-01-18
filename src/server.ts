import Fastify from "fastify";//Route module
import cors from  '@fastify/cors'//Access module(Allow third party apps/front end ) 
import { appRoutes } from "./routes"

const app = Fastify()
//Declaring routes
app.register(cors)
app.register(appRoutes)

app.listen({//Ports settings
  port:3333
}).then(()=>{
  console.log('Server running on port 3333!')
})
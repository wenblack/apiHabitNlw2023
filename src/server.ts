import Fastify from 'fastify'
import * as dotenv from 'dotenv'
import cors from '@fastify/cors'
import { appRoutes } from "./routes"

dotenv.config()
const app = Fastify()
const ports = Number(process.env.PORT)
app.register(cors)
app.register(appRoutes)

app.listen({
  port: ports || 3000,
}).then(() => {
  console.log('HTTP Server running on port '+ports)
})

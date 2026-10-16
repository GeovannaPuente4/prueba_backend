import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { env } from './config.js'
import { authRouter, notesRouter } from './router.js'

const app = new Hono()

app.use(logger())
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))

app.get('/health', (c) => c.json({ status: 'ok' }))
app.route('/auth', authRouter)
app.route('/notes', notesRouter)

app.notFound((c) => c.json({ error: 'Not found' }, 404))

app.onError((err, c) => {
  if (err instanceof HTTPException) return c.json({ error: err.message }, err.status)
  console.error(err)
  return c.json({ error: 'Internal server error' }, 500)
})

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`)
})

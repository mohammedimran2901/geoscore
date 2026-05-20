import { Client } from '@upstash/qstash'

const getQstashClient = () => {
  if (!process.env.QSTASH_TOKEN) {
    throw new Error('QSTASH_TOKEN is not set')
  }
  return new Client({
    token: process.env.QSTASH_TOKEN,
  })
}

export { getQstashClient }
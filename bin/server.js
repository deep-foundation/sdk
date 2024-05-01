#!/usr/bin/env node
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next');
const nextConfig = require('../next.config');

const hostname = 'localhost'
const port = process.env.PORT || 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev: false, hostname, port, quiet: true, conf: nextConfig, dir: `${__dirname}/..` })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
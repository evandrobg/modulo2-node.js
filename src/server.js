const express = require('express')
const session = require('express-session')
const LokiStore = require('connect-loki')(session)
const nunjucks = require('nunjucks')
const path = require('path')
const flash = require('connect-flash')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.middlewares()
    this.views()
    this.routes()
  }

  // Configuração do middleware para obter parametros da URL
  middlewares () {
    this.express.use(express.urlencoded({ extended: false }))
    this.express.use(flash())
    this.express.use(
      session({
        store: new LokiStore({
          path: path.resolve(__dirname, '..', 'tmp', 'sessions', 'session.db')
        }),
        secret: 'MyAppSecret',
        resave: false,
        saveUninitialized: true
      })
    )
  }

  // Configuração das views
  views () {
    nunjucks.configure(path.resolve(__dirname, 'app', 'views'), {
      watch: this.isDev,
      express: this.express,
      autoescape: true
    })

    this.express.use(express.static(path.resolve(__dirname, 'public')))
    this.express.set('view engine', 'njk')
  }

  // Configuração das rotas da aplicação
  routes () {
    this.express.use(require('./routes'))
  }
}

module.exports = new App().express

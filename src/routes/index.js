const homeRoute = require('./homeRoute');

const rootRouter = (app) => {
   app.use('/api', homeRoute);
}

module.exports = rootRouter;
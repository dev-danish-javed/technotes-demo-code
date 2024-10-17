const express = require('express');
const logger = require('./logger.js');

/**
 * Controller class to handle API calls
 */
class Controller {
  app = express();
  logger = logger;
  port = 3001;

  constructor() {
    this.port = process.env.PORT || 3000;
  }

  /**
   * @param {number} port
   * @param {number} attemptCount
   */
  startServer(port, attemptCount = 1) {
    const server = this.app.listen(port, () => {
      logger.info(`App is running on http://*:${port}`);
    });

    server.on('error', (err) => {
      logger.info(`Failed to start server !! Error : ${JSON.stringify(err)}`);
    });
  }

  /**
   * Starts the server
   */
  run() {
    this.registerRoutes();
    this.startServer(this.port);
  }

  /**
   * Binds the endpoints with functions
   */
  registerRoutes() {
    // Greeting endpoint
    this.app.get('/greet/:name', this.actionGreet);
    logger.info('greet route registered !!');
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  actionGreet = (req, res) => {
    const name = req.params.name;
    logger.info(`Request received to greet ${name}`);
    res.send('Hello in service base ' + name);
  };
}

module.exports = Controller;

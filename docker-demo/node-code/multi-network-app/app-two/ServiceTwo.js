const Controller = require('./ServiceBase');

class ServiceTwo extends Controller {
  port = 3003;
  registerRoutes() {
    this.logger.info('registering serviceTwo routes');
    super.registerRoutes();
    this.app.get('/fetchKey', this.fetchServiceKey);
    this.logger.info('fetch serviceKey route registered !! ');
  }

  fetchServiceKey = async (req, res) => {
    this.logger.info('fetching service key from app-one');
    try {
      const response = await fetch('http://localhost:3002/serviceKey');
      const data = response.ok ? await response.text() : 'Error in API call';

      res.send('Result of ServiceTwo data fetch : ' + data);
    } catch (err) {
      this.logger.error(
        'Error fetching data from app-one : ' + JSON.stringify(err.cause.code)
      );
      res.send('We got an error : ' + err.cause.code);
    }
  };
}

module.exports = ServiceTwo;

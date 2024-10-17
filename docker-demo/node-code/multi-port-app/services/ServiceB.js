const Controller = require('./ServiceBase');

class ServiceB extends Controller {
  port = 3003;
  registerRoutes() {
    this.logger.info('registering serviceA routes');
    super.registerRoutes();
    this.app.get('/fetchKey', this.fetchServiceKey);
    this.logger.info('serviceKey route registered !! ');
  }

  fetchServiceKey = async (req, res) => {
    this.logger.info('fetching service key from serviceA');
    try {
      const response = await fetch('http://localhost:3002/serviceKey');
      const data = response.ok ? await response.text() : 'Error in API call';

      res.send('Result of ServiceB data fetch : ' + data);
    } catch (err) {
      res.send('We got an error : ' + JSON.stringify(err));
    }
  };
}

module.exports = ServiceB;

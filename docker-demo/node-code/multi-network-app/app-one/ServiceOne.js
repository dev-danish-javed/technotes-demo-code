const Controller = require('./ServiceBase');

class ServiceOne extends Controller {
  port = 3002;
  registerRoutes() {
    this.logger.info('registering serviceA routes');
    super.registerRoutes();
    this.app.get('/serviceKey', this.getServiceKey);
    this.logger.info('serviceKey route registered !! ');
  }

  getServiceKey = (req, res) => {
    this.logger.info('returning key');
    res.send('Encrypted_Service_Key_In_ServiceOne');
  };
}

module.exports = ServiceOne;

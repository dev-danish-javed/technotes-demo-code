const Controller = require('./ServiceBase');

class ServiceTwo extends Controller {
  port = 3003;
  vaultMsUrl;
  registerRoutes() {
    this.logger.info('registering serviceTwo routes');
    super.registerRoutes();
    this.app.get('/fetchKey', this.fetchServiceKey);
    this.logger.info('fetch serviceKey route registered !! ');
  }

  fetchServiceKey = async (req, res) => {
    if (!this.vaultMsUrl) {
      this.logger.error('vault_ms_url is not provided');
      res.send('Unable to communicate to vault-ms!!! please setup the url');
      return;
    }
    this.logger.info('fetching service key from vault');
    try {
      const keyUrl = this.vaultMsUrl + '/serviceKey';
      this.logger.info('fetching key from vault-ms, url : ' + keyUrl);
      const response = await fetch(keyUrl);
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

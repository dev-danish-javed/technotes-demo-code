const ServiceA = require('./services/ServiceA');
const ServiceB = require('./services/ServiceB');

const serviceA = new ServiceA();
serviceA.run();

const serviceB = new ServiceB();
serviceB.run();

import { errorHandler } from './errorHandler';
import { BrokerOptions } from 'moleculer';

const brokerOptions: BrokerOptions = {
  nodeID: 'user-service-node',
  transporter: 'NATS',
  logLevel: 'info',
  requestTimeout: 5000,
  retryPolicy: {
    enabled: true,
    retries: 3,
    delay: 2000,
  },
  cacher: 'Memory',
  errorHandler,
};

export default brokerOptions;

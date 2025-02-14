import { ServiceBroker } from 'moleculer';
import brokerOptions from './moleculer.config';
import { actions } from './actions.config';

const broker: ServiceBroker = new ServiceBroker(brokerOptions);

broker.createService({
  name: 'user',
  actions,
});

export default broker;

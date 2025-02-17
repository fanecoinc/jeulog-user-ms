import broker from './infrasctructure/broker/service-broker';
import executeSeeds from './infrasctructure/database/seeds/executeSeeds';

executeSeeds();
broker.start();

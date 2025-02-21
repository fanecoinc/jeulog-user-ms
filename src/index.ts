import broker from './infrasctructure/broker/service-broker';
import executeSeeds from './infrasctructure/database/seeds/executeSeeds';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env.prod') });
executeSeeds();
broker.start();

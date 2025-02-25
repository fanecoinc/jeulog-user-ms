import broker from './infrastructure/broker/service-broker';
import executeSeeds from './infrastructure/database/seeds/executeSeeds';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env.prod') });
executeSeeds();
broker.start();

import { Yakuna } from './yakuna';
import { config } from 'dotenv';

try {
    config();
    new Yakuna({
        access_token: process.env.ACCESS_TOKEN || '',
        api_url: process.env.API_URL || ''
    }).watch();
} catch (e) {
    console.error(e);
    process.exit(1);
}

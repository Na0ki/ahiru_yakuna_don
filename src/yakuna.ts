import * as fs from 'fs';
import { safeLoad } from 'js-yaml';
import { Config } from './models/config';
import { Dictionary } from './models/dictionary';
import { Response } from './models/response';

// noinspection NonAsciiCharacters
const あひる焼き = /([あアｱ][ひヒﾋ][るルﾙ]|家鴨)[やヤﾔ焼][きキｷ]|ahiruyaki|扒家鸭|3v\.7g/i;
const Mastodon = require('mastodon-api');
const dir_path = './yakuna_dictionary/';

export class Yakuna {

    private mastodon: any;
    private criminals: Map<string, Date>;
    private definedTime: Date;
    private readonly dictionary: Dictionary;

    constructor(config: Config) {
        this.mastodon = new Mastodon(config);
        this.criminals = new Map<string, Date>();
        this.dictionary = this.loadDictionary();
        this.definedTime = new Date();
    }

    watch() {
        const ltl = this.mastodon.stream('streaming/public/local');
        const user = this.mastodon.stream('streaming/user');

        ltl.on('message', (msg: Response) => this.handleMessage(new Response(msg)));
        ltl.on('error', (error: Error) => console.error(error));

        user.on('message', (msg: Response) => this.handleMessage(new Response(msg)));
        user.on('error', (error: Error) => console.error(error));
    }

    private loadDictionary() {
        const dictionaries = new Dictionary({});

        const files = fs.readdirSync(dir_path);
        for (const filename of files) {
            const matched = filename.match(/(.+)\.yml$/) || [];
            if (matched.length < 2) {
                continue;
            }

            dictionaries[matched[1]] = safeLoad(
                fs.readFileSync(`${dir_path}${filename}`, 'utf8')
            );
        }
        return dictionaries;
    }

    private handleMessage(msg: Response) {
        if (msg.isInflammable()) {
            // メッセージ生成時刻が起動前またはブーストならば反応しない
            if (msg.createdAt() < this.definedTime || msg.data.reblogs_count > 0) {
                return;
            }
            if (あひる焼き.test(msg.content()) && !this.criminals.has(msg.id())) {
                this.yakuna(msg);
            }
        }
    }

    private yakuna(msg: Response) {
        this.criminals.set(msg.id(), new Date());
        const status =  {
            status: `${msg.username()} ${this.chooseMessage(msg)}`,
            visibility: msg.visibility(),
            in_reply_to_id: msg.id(),
        };
        this.mastodon
            .post('statuses', status)
            .catch((e: Error) => console.error(e));
        this.gcCriminalCache();
    }

    private chooseMessage(msg: Response) {
        const createAt = msg.createdAt();
        const hour = createAt.getHours();
        if (createAt.getMonth() === 0 && createAt.getDate() <= 3) {
            // 正月
            return this.dictionary.sample('shogatsu');
        } else if (hour >= 17 && hour <= 19 || hour >= 0 && hour < 3) {
            // 飯時
            return this.dictionary.sample('meshitero');
        }

        switch (true) {
            case /ahiruyaki/i.test(msg.content()):
                return this.dictionary.sample('english');
            case /扒家鸭/.test(msg.content()):
                return this.dictionary.sample('chinese');
            default:
                return this.dictionary.sample('japanese');
        }
    }

    private gcCriminalCache() {
        this.criminals.forEach(((value, key) => {
            if (new Date().getTime() - value.getTime() > 300000) {
                console.log(`delete criminal cache: ${key}`);
                this.criminals.delete(key);
                this.definedTime = new Date();
            }
        }));
    }
}

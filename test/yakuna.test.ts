import * as assert from 'power-assert';
import 'mocha';
import { config } from 'dotenv';
import { Yakuna } from '../src/yakuna';
import { Dictionary } from '../src/models/dictionary';

describe('yakuna', () => {

    const message = 'refer README.adoc and set right env';

    afterEach('reset env', () => {
        // https://nodejs.org/api/process.html#process_process_env
        // process.env は string しか持たない
        // そのため undefined を渡しても 'undefined' という文字列が格納されてしまう
        // 削除したい場合は以下のように delete する必要がある
        //  ok: delete process.env.FOO
        //  ng: process.env.FOO = undefined
        delete process.env.ACCESS_TOKEN;
        delete process.env.API_URL;
    });

    it('should fail instantiate', () => {
        assert.throws(
            () => new Yakuna({access_token: '', api_url: ''}),
            (err: Error) => {
                assert.equal(err.name, 'Error');
                assert.equal(err.message, 'Mastodon config must include \'access_token\' when using \'user_auth\'');
                return !!err;
            },
            message
        );
    });

    it('should have access_token', function () {
        config();
        assert.notStrictEqual(process.env.ACCESS_TOKEN, undefined, message);
        assert.notStrictEqual(process.env.ACCESS_TOKEN, '', message);
    });

    it('should have api_url', () => {
        config();
        assert.notStrictEqual(process.env.API_URL, undefined, message);
        assert.notStrictEqual(process.env.API_URL, '', message);
    });

    it('should instantiate', function () {
        config();
        assert.doesNotThrow(
            () => new Yakuna({
                access_token: process.env.ACCESS_TOKEN as string,
                api_url: process.env.API_URL as string
            }),
            message
        );
    });

    it('should have right props`', () => {
        const sampleData = ['sample', 'example'];
        const dictionary = new Dictionary({japanese: sampleData});
        assert.deepEqual(dictionary.japanese, ['sample', 'example']);
    });
});

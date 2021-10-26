import * as assert from 'power-assert';
import 'mocha';
import { config } from 'dotenv';
import { Yakuna, あひる焼き, ReplaceCase } from '../src/yakuna';
import { Dictionary } from '../src/models/dictionary';

describe('env', () => {
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
      () => new Yakuna({ access_token: '', api_url: '' }),
      (err: unknown) => {
        assert.equal((err as Error).name, 'Error');
        assert.equal(
          (err as Error).message,
          "Mastodon config must include 'access_token' when using 'user_auth'"
        );
        return !!err;
      },
      message
    );
  });

  it('should have access_token', function() {
    config();
    assert.notStrictEqual(process.env.ACCESS_TOKEN, undefined, message);
    assert.notStrictEqual(process.env.ACCESS_TOKEN, '', message);
  });

  it('should have api_url', () => {
    config();
    assert.notStrictEqual(process.env.API_URL, undefined, message);
    assert.notStrictEqual(process.env.API_URL, '', message);
  });

  it('should instantiate', function() {
    config();
    assert.doesNotThrow(
      () =>
        new Yakuna({
          access_token: process.env.ACCESS_TOKEN as string,
          api_url: process.env.API_URL as string
        }),
      message
    );
  });
});

describe('dictionary', () => {
  it('should have right props`', () => {
    const sampleData = ['sample', 'example'];
    const dictionary = new Dictionary({ japanese: sampleData });
    assert.deepEqual(dictionary.japanese, ['sample', 'example']);
  });
});

describe('yakuna', () => {
  let yakuna: Yakuna;

  beforeEach('set env', () => {
    config();
    yakuna = new Yakuna({
      access_token: process.env.ACCESS_TOKEN as string,
      api_url: process.env.API_URL as string
    });
  });

  afterEach('reset env', () => {
    delete process.env.ACCESS_TOKEN;
    delete process.env.API_URL;
  });

  it('should have right regex', () => {
    assert.equal(
      String(あひる焼き),
      String(
        /([あアｱ][ひヒﾋ][るルﾙ]|家鴨)[やヤﾔ焼][きキｷ]|ahiruyaki|扒家鸭|3v\.7g/i
      ),
      'unexpected regex'
    );
  });

  it('should remove zero width space', () => {
    // from asyley_
    const testCase = 'あㅤひる焼き';

    const replaced = testCase.replace(ReplaceCase, '');
    assert.equal(replaced, 'あひる焼き');
  });

  it('should remove space', () => {
    // from 2bo
    const testCase = 'A H I R U Y A K I';

    const replaced = testCase.replace(ReplaceCase, '');
    assert.equal(replaced, 'AHIRUYAKI');
  });

  it('should match regex', () => {
    const regex = あひる焼き;
    const testCase = [
      'あひる焼き',
      '家鴨焼き',
      'あひるやき',
      'ahiruyaki',
      '扒家鸭',
      '3v.7g',
      'あひル焼ｷ',
      'アﾋるやキ',
      '家鴨やｷ',
      'AhiRuYaki',
      'あㅤひる焼き'
    ];

    testCase.forEach(text =>
      assert.ok(regex.test(text.replace(ReplaceCase, '')))
    );
  });

  it('should remove new line and match multiline yaki', () => {
    const regex = あひる焼き;
    const testCase = [
      '日直<br> あ<br> ひ<br> る<br> 焼<br>　き',
      '<p>日直</p><p>あ</p><p>ひ</p><p>る</p><p>焼き</p>'
    ];

    testCase.forEach(text => {
      assert.ok(text.replace(ReplaceCase, '') === '日直あひる焼き');
      assert.ok(regex.test(text.replace(ReplaceCase, '')), `not matching: ${text}`)
    });
  });

  it('should not match regex', () => {
    const regex = あひる焼き;
    const testCase = ['ahiru焼き', '焼きあひる'];

    testCase.forEach(text => assert.ok(!regex.test(text)));
  });

  it('should load dictionary', () => {
    const dictionary = (yakuna as any).loadDictionary();

    assert.equal(Object.keys(dictionary).length, 5);
    assert.ok(dictionary['chinese'].length > 0);
    assert.ok(dictionary['english'].length > 0);
    assert.ok(dictionary['japanese'].length > 0);
    assert.ok(dictionary['meshitero'].length > 0);
    assert.ok(dictionary['shogatsu'].length > 0);
  });
});

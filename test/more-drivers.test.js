const test = require('node:test');
const assert = require('node:assert');
const { detectDriver } = require('../src/main/hid/drivers');
const rapoo = require('../src/main/hid/drivers/rapoo');
const gearhub = require('../src/main/hid/drivers/gearhub');
const bytech = require('../src/main/hid/drivers/bytech');

const ch = (usagePage, usage) => ({ usagePage, usage, path: `${usagePage}:${usage}` });

test('Rapoo VT mice report their level in input report 7', () => {
  assert.equal(detectDriver({ vendorId: 0x24ae, productId: 0x1413, channels: [ch(0xff00, 0x0e), ch(0xff00, 0x02)] }).id, 'rapoo');
  assert.deepEqual(rapoo.parseStatus([0x07, 0x21, 1, 0x20, 0x03, 0x20, 0x03, 0x02, 77]), { capacity: 77, charging: true });
  assert.deepEqual(rapoo.parseStatus([0x07, 0x11, 1, 0x20, 0x03, 0x20, 0x03, 0x00, 55]), { capacity: 55, charging: false });
  assert.equal(rapoo.parseStatus([0x07, 0x21, 1, 0, 0, 0, 0, 0, 1]), null);
  assert.equal(rapoo.parseStatus([0x07, 0x31, 1, 0, 0, 0, 0, 0, 50]), null);
  assert.equal(rapoo.UNLOCK.length, 33);
});

test('YICHIP GearHub receivers hold the mouse and keyboard levels', () => {
  const layout = [ch(0xffff, 1), ch(0xffff, 2), ch(1, 2)];
  assert.equal(detectDriver({ vendorId: 0x3151, productId: 0x4026, channels: layout }).id, 'gearhub');
  assert.notEqual((detectDriver({ vendorId: 0x3151, productId: 0x1020, channels: [ch(0xffbc, 0x88)] }) || {}).id, 'gearhub');
  assert.deepEqual(gearhub.parseReply([0, 1, 0, 0x2d, 1, 0, 1], 'mouse'), { capacity: 45 });
  assert.deepEqual(gearhub.parseReply([0, 1, 80, 0x2d, 0, 0, 1], 'keyboard'), { capacity: 80 });
  assert.equal(gearhub.parseReply([0, 1, 80, 0x2d, 0, 1, 1], 'mouse').offline, true);
  assert.equal(gearhub.parseReply([0, 0, 0, 0, 0, 0, 0], 'mouse'), null);
  assert.equal(gearhub.REQUEST.length, 65);
});

test('BY Tech mice answer basic info in feature report 3', () => {
  assert.equal(detectDriver({ vendorId: 0x372e, productId: 0x1014, channels: [ch(0xff00, 1), ch(0xff06, 1)] }).id, 'bytech');
  assert.equal(bytech.REQUEST[1], (0x50 + 0x02 + 0x4f + 0x81) & 0xff);
  assert.deepEqual(bytech.parseReply([0x03, 0, 0, 0, 0x02, 0, 64]), { capacity: 64 });
  assert.deepEqual(bytech.parseReply([0x03, 0, 0, 0, 0x02, 0, 0xe4]), { capacity: 100 });
  assert.equal(bytech.parseReply([0x03, 0, 0, 0, 0x0a, 0, 64]), null);
});

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseReport, hardwareOf, decide, boardBody, isOlder } = require('../.github/scripts/triage');

const form = ({ ids = 'VID_040B / PID_0897', scan = 'Channels: ff00:0001\nScan 1: nothing captured', actual = '_No response_', version = '2.0.3' } = {}) => [
  '### Device', '', 'XiiSound Fuxi-H3', '',
  '### Connection', '', 'USB', '',
  '### Vendor / Product ID', '', ids, '',
  '### Calibration scan output', '', '```text', scan, '```', '',
  '### Actual battery level during the scan', '', actual, '',
  '### Anything else', '', 'Verdict: Everything looks fine', '',
  '### Battery Hub version', '', version,
].join('\n');

test('hardware ids are read in every way people write them', () => {
  assert.equal(hardwareOf('VID_040B / PID_0897'), '040B:0897');
  assert.equal(hardwareOf('HID\VID_046d&PID_c54d&MI_02'), '046D:C54D');
  assert.equal(hardwareOf('VID_04DA/PID_23C7'), '04DA:23C7');
  assert.equal(hardwareOf('Hardware: 1532:00e6'), '1532:00E6');
  assert.equal(hardwareOf('no ids here'), null);
});

test('a report form is read: ids, version, scan data and the real level', () => {
  const empty = parseReport({ title: '[Device] Fuxi-H3', body: form() });
  assert.deepEqual(empty, { hardware: '040B:0897', name: 'XiiSound Fuxi-H3', version: '2.0.3', captured: false, bytes: false, hasLevel: false });
  const good = parseReport({ title: '[Device] x', body: form({ scan: 'Scan 1: 4 messages\nff00:0001 report 5, seen 3x: 05550100', actual: '85' }) });
  assert.equal(good.captured, true);
  assert.equal(good.hasLevel, true);
  assert.equal(good.bytes, true);
  for (const actual of ["dont't know", 'don`t know', 'idk', 'Not sure', '?']) {
    assert.equal(parseReport({ title: '[Device] x', body: form({ actual }) }).hasLevel, false, actual);
  }
});

test('versions compare by number', () => {
  assert.equal(isOlder('2.0.1', 'v2.0.3'), true);
  assert.equal(isOlder('2.0.10', '2.0.9'), false);
  assert.equal(isOlder('2.0.3', '2.0.3'), false);
});

test('a copy of a reported device is closed and sent to the open report, not to a closed copy', () => {
  const report = parseReport({ title: '[Device] x', body: form() });
  const others = [
    { hardware: '040B:0897', number: 41, state: 'closed', duplicate: true },
    { hardware: '040B:0897', number: 18, state: 'open', duplicate: false },
  ];
  const action = decide(report, others, 'v2.0.3');
  assert.equal(action.close, true);
  assert.deepEqual(action.labels, ['duplicate']);
  assert.match(action.comment, /continue in #18/);
});

test('an old version is asked to update; an empty scan gets tips; a full one is marked good', () => {
  const old = decide(parseReport({ title: '[Device] x', body: form({ version: '2.0.1' }) }), [], 'v2.0.3');
  assert.deepEqual([old.labels, old.close], [['old version', 'needs info'], false]);
  const empty = decide(parseReport({ title: '[Device] x', body: form() }), [], 'v2.0.3');
  assert.deepEqual(empty.labels, ['no data', 'needs info']);
  assert.match(empty.comment, /turn it off and on/);
  const good = decide(parseReport({ title: '[Device] x', body: form({ scan: 'Scan 1: 4 messages\nff00:0001 feature report 9, seen 2x: xxxxxxxxxxxx3e', actual: '62%' }) }), [], 'v2.0.3');
  assert.deepEqual([good.labels, good.comment], [['good report'], null]);
  const countsOnly = decide(parseReport({ title: '[Device] x', body: form({ scan: 'Scan 1: 4 messages', actual: '62%' }) }), [], 'v2.0.3');
  assert.deepEqual([countsOnly.labels, countsOnly.close], [[], false]);
});

test('the device list counts people and votes, links one main report, and keeps closed devices apart', () => {
  const body = boardBody([
    { hardware: '3151:1020', name: 'YICHIP 2.4G Receiver', number: 26, state: 'closed', author: 'a', votes: 0, duplicate: true },
    { hardware: '3151:1020', name: 'YICHIP 2.4G Receiver', number: 31, state: 'open', author: 'a', votes: 0 },
    { hardware: '040B:0897', name: 'Fuxi-H3', number: 5, state: 'closed', author: 'd', votes: 0 },
    { hardware: '040B:0897', name: 'Fuxi-H3', number: 18, state: 'open', author: 'b', votes: 2, good: true },
    { hardware: '040B:0897', name: 'Fuxi-H3', number: 41, state: 'closed', author: 'c', votes: 0, duplicate: true },
    { hardware: '04DA:23C7', name: 'Panasonic SC-GNW10', number: 59, state: 'closed', author: 'e', votes: 0 },
    { hardware: '046D:0ACB', name: 'G435', number: 10, state: 'open', author: 'f', votes: 0, cantSupport: true },
    { hardware: '046D:0ACB', name: 'G435', number: 16, state: 'open', author: 'g', votes: 0 },
  ]);
  const [top, closed] = body.split('<details>');
  const rows = (part) => part.split('\n').filter((l) => /^\| \d/.test(l));
  assert.deepEqual(rows(top), [
    '| 5 | Fuxi-H3 | `040B:0897` | #18 | ✅ |',
    '| 1 | YICHIP 2.4G Receiver | `3151:1020` | #31 | |',
  ]);
  assert.deepEqual(rows(closed), ['| 2 | G435 | `046D:0ACB` | #10 | |', '| 1 | Panasonic SC-GNW10 | `04DA:23C7` | #59 | |']);
});

test("a new report of a device marked can't support is closed with that answer", () => {
  const report = parseReport({ title: '[Device] x', body: form({ ids: 'VID_046D / PID_0ACB' }) });
  const action = decide(report, [{ hardware: '046D:0ACB', number: 10, state: 'open', cantSupport: true }], 'v2.0.4');
  assert.equal(action.close, true);
  assert.deepEqual(action.labels, ['duplicate', "can't support"]);
  assert.match(action.comment, /can't read it/);
});

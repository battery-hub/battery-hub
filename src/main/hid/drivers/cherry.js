// CHERRY wireless keyboards on the EVision 0xFF1C/0x0092 collection (verified on the CHERRY XTRFY
// K63W Pro UWB dongle, 046A:0144). Uses the same 64-byte report 4 framing as Akko/Telink, with
// 16-bit LE sum of bytes 3..63 at bytes 1..2, but checks link state with command 0xAA and reads
// battery with command 0x9A (falling back to 0x1A for models that use the older command):
//
//   online check:  04 AA 00 AA 00 ...       -> 04 .. .. AA .. .. .. 00 FF (0xFF at byte 8 = online)
//   battery query: 04 A0 00 9A 06 00 ...    -> 04 .. .. 9A .. .. .. 00 <percent> <charging>
//
// Byte 7 is the status code (0x00 = ok, 0xFF/0xFE = unsupported or error).
const { exchange, pad } = require('./exchange');

const CHERRY = 0x046a;
const PRODUCTS = new Set([0x0144]); // CHERRY XTRFY K63W Pro UWB dongle
const ONLINE_REQUEST = pad([0x04, 0xaa, 0x00, 0xaa], 64);
const BATTERY_9A_REQUEST = pad([0x04, 0xa0, 0x00, 0x9a, 0x06], 64);
const BATTERY_1A_REQUEST = pad([0x04, 0x20, 0x00, 0x1a, 0x06], 64);
const channelOf = (d) => d.channels.find((c) => c.usagePage === 0xff1c && c.usage === 0x92);

function matches(logicalDevice) {
  return logicalDevice.vendorId === CHERRY && PRODUCTS.has(logicalDevice.productId) && !!channelOf(logicalDevice);
}

function parseOnline(f) {
  if (f.length < 9 || f[0] !== 0x04 || f[3] !== 0xaa) return null;
  return { online: f[7] === 0x00 && f[8] === 0xff };
}

function parseBattery(cmd) {
  return (f) => {
    if (f.length < 10 || f[0] !== 0x04 || f[3] !== cmd) return null;
    if (f[7] === 0xff || f[7] === 0xfe) return { unsupported: true };
    if (f[7] !== 0x00 || f[8] === 0 || f[8] > 100) return { offline: true };
    return { capacity: f[8], charging: f[9] === 1 };
  };
}

async function readBattery(logicalDevice) {
  const channel = channelOf(logicalDevice);
  if (!channel) throw new Error('no command channel');
  try {
    const link = await exchange(channel, ONLINE_REQUEST, parseOnline, 1500);
    if (!link.online) throw new Error('keyboard is off');
  } catch (e) {
    if (e.message === 'keyboard is off') throw e;
  }
  let reading;
  try {
    reading = await exchange(channel, BATTERY_9A_REQUEST, parseBattery(0x9a), 2000);
    if (reading.unsupported) {
      reading = await exchange(channel, BATTERY_1A_REQUEST, parseBattery(0x1a), 2000);
    }
  } catch (e) {
    if (/^timeout/.test(e.message)) throw new Error('keyboard is not answering');
    throw e;
  }
  if (reading.unsupported || reading.offline) throw new Error('keyboard is off');
  return reading;
}

module.exports = {
  id: 'cherry',
  matches,
  readBattery,
  parseOnline,
  parseBattery,
  ONLINE_REQUEST,
  BATTERY_9A_REQUEST,
  BATTERY_1A_REQUEST,
};

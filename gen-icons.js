// Generates icon-180.png, icon-192.png, icon-512.png — the SphereCam wireframe
// sphere on dark ground. Pure Node (zlib), no dependencies. Run: node gen-icons.js
const zlib = require('zlib');
const fs = require('fs');

const TBL = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = buf => {
  let c = ~0;
  for (const b of buf) c = TBL[(c ^ b) & 0xFF] ^ (c >>> 8);
  return ~c >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};
function png(S, draw) {
  const stride = S * 4 + 1;
  const raw = Buffer.alloc(S * stride);
  for (let y = 0; y < S; y++) {
    raw[y * stride] = 0;
    for (let x = 0; x < S; x++) {
      const [r, g, b] = draw(x, y, S);
      const o = y * stride + 1 + x * 4;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; raw[o + 3] = 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(S, 0); ihdr.writeUInt32BE(S, 4);
  ihdr[8] = 8; ihdr[9] = 6;   // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
const AMBER = [255, 180, 84], DIM = [190, 137, 66], GREEN = [87, 217, 138], BG = [10, 12, 14];
function draw(x, y, S) {
  const cx = S / 2, cy = S / 2, R = S * 0.30, t = S * 0.024;
  const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy);
  let col = BG;
  if (d < R - t) {                                          // wireframe stays inside the circle
    const mer = Math.hypot(dx / (R * 0.40), dy / R);        // vertical ellipse
    if (Math.abs(mer - 1) * R * 0.40 < t * 0.8) col = DIM;
    const eq = Math.hypot(dx / R, dy / (R * 0.40));         // horizontal ellipse
    if (Math.abs(eq - 1) * R * 0.40 < t * 0.8) col = DIM;
  }
  if (Math.abs(d - R) < t) col = AMBER;                     // outer circle
  if (Math.hypot(dx, y - (cy - R * 0.62)) < S * 0.045) col = AMBER;              // top dot
  if (Math.hypot(x - (cx + R * 0.55), y - (cy + R * 0.20)) < S * 0.034) col = GREEN;
  if (Math.hypot(x - (cx - R * 0.60), y - (cy + R * 0.32)) < S * 0.034) col = GREEN;
  return col;
}
for (const s of [180, 192, 512]) {
  fs.writeFileSync(`icon-${s}.png`, png(s, draw));
  console.log(`icon-${s}.png written`);
}

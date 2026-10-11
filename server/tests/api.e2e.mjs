// End-to-end API test: starts server.js against a real MongoDB and exercises every endpoint.
// Usage: npm test   (uses TEST_MONGO_URI, default mongodb://127.0.0.1:27017/durrat_test)
// The database is DROPPED before and after the run, so its name must contain "test".
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';

const serverDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const URI = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/durrat_test';
if (!/test/i.test(new URL(URI).pathname)) {
  console.error(`Refusing to run: database name in TEST_MONGO_URI must contain "test" (got ${URI})`);
  process.exit(1);
}
const PORT = 5077, TOKEN = 'test-admin-token-123';
const B = `http://127.0.0.1:${PORT}/api/v1`;

await mongoose.connect(URI); await mongoose.connection.dropDatabase();
const db = mongoose.connection.db;

const srv = spawn('node', ['server.js'], { cwd: serverDir, env: { ...process.env, PORT, MONGO_URI: URI, ADMIN_TOKEN: TOKEN, NODE_ENV: 'test' }, stdio: ['ignore', 'pipe', 'pipe'] });
let log = ''; srv.stdout.on('data', (d) => (log += d)); srv.stderr.on('data', (d) => (log += d));
for (let i = 0; i < 50 && !log.includes('Server running'); i++) await new Promise((r) => setTimeout(r, 200));
assert.ok(log.includes('Server running'), log);

process.on('uncaughtException', (e) => { srv.kill(); console.error(e); process.exit(1); });
process.on('unhandledRejection', (e) => { srv.kill(); console.error(e); process.exit(1); });

let n = 0; const ok = (msg) => { n++; console.log('  ✓', msg); };
let ip = 1; // fresh X-Forwarded-For per call so the rate limiter does not interfere (trust proxy = 1)
const call = async (method, url, body, headers = {}) => {
  const res = await fetch(B + url, { method, headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.0.0.${ip++ % 250}`, ...headers }, body: body && JSON.stringify(body) });
  return { status: res.status, body: await res.json() };
};
const admin = { 'x-admin-token': TOKEN };
const day = (k) => new Date(Date.now() + 3 * 3600e3 + k * 86400e3).toISOString().slice(0, 10); // Jordan date + k days

// ---------- Bookings (previously untested against a DB) ----------
console.log('bookings');
let r = await call('POST', '/requests', { customerName: 'محمد', phone: '+962 79 584 9835', serviceType: 'نقل مواشي', pickupLocation: 'إربد', destination: 'عمّان', status: 'Completed' });
assert.equal(r.status, 201); assert.equal(r.body.data.phone, '0795849835'); assert.equal(r.body.data.status, 'Pending');
ok('create booking, +962 normalised, client cannot set status');
const bookingId = r.body.data._id;
r = await call('GET', '/requests', null, admin); assert.equal(r.body.meta.total, 1); assert.equal(r.body.meta.stats.Pending, 1); ok('admin lists booking with stats');
r = await call('PATCH', `/requests/${bookingId}`, { status: 'In-Progress' }, admin); assert.equal(r.body.data.status, 'In-Progress'); ok('admin updates booking status');
r = await call('PATCH', '/requests/507f1f77bcf86cd799439011', { status: 'Completed' }, admin); assert.equal(r.status, 404); ok('unknown booking id → 404');

// ---------- Loads ----------
console.log('loads');
const goods = { merchantName: 'تاجر الشمال', phone: '0791234567', cargoType: 'بضائع', cargoDescription: 'مواد بناء', approxWeightTons: '٢٠', fromCity: 'إربد', toCity: 'العقبة', pickupDate: day(2), price: 250, negotiable: true };
r = await call('POST', '/loads', {}); assert.equal(r.status, 400);
for (const k of ['merchantName', 'phone', 'cargoType', 'cargoDescription', 'fromCity', 'toCity', 'pickupDate']) assert.ok(r.body.errors[k], k);
ok('empty load → 400 with Arabic error per field');
r = await call('POST', '/loads', { ...goods, cargoType: 'مواشي' }); assert.equal(r.status, 400); assert.ok(r.body.errors.animalType && r.body.errors.animalCount); ok('livestock requires animal type and count');
r = await call('POST', '/loads', { ...goods, cargoType: 'مواشي', animalType: 'أغنام', animalCount: 2.5 }); assert.ok(r.body.errors.animalCount); ok('animal count must be an integer');
r = await call('POST', '/loads', { ...goods, phone: '0661234567' }); assert.equal(r.body.errors.phone, 'رقم الهاتف غير صحيح — مثال: 0795849835'); ok('non-mobile Jordanian phone rejected');
r = await call('POST', '/loads', { ...goods, fromCity: 'دبي' }); assert.ok(r.body.errors.fromCity); ok('city outside list rejected');
r = await call('POST', '/loads', { ...goods, pickupDate: day(-1) }); assert.match(r.body.errors.pickupDate, /الماضي/); ok('past pickup date rejected');
r = await call('POST', '/loads', { ...goods, pickupDate: day(15) }); assert.match(r.body.errors.pickupDate, /14/); ok('pickup date > 14 days rejected');
r = await call('POST', '/loads', { ...goods, pickupDate: '2026-02-30' }); assert.ok(r.body.errors.pickupDate); ok('impossible date rejected');
r = await call('POST', '/loads', { ...goods, price: -5 }); assert.ok(r.body.errors.price); ok('negative price rejected');
r = await call('POST', '/loads', { ...goods, merchantName: { $gt: '' } }); assert.ok(r.body.errors.merchantName); ok('object injection in body rejected');

r = await call('POST', '/loads', { ...goods, status: 'Approved' });
assert.equal(r.status, 201); assert.deepEqual(Object.keys(r.body.data).sort(), ['_id', 'expiresAt', 'status']); assert.equal(r.body.data.status, 'Pending');
ok('create load → Pending, response does not echo phone, client cannot self-approve');
const goodsId = r.body.data._id;
let doc = await db.collection('loads').findOne({ _id: new mongoose.Types.ObjectId(goodsId) });
assert.equal(doc.approxWeightTons, 20); assert.equal(doc.animalType, undefined);
assert.equal(doc.expiresAt.getTime(), new Date(`${day(3)}T00:00:00+03:00`).getTime()); ok('Arabic digits parsed; expiry = end of pickup day (Jordan time)');

r = await call('POST', '/loads', { ...goods, merchantName: 'مزرعة الخير', phone: '00962781112233', cargoType: 'مواشي', animalType: 'أغنام', animalCount: '120', fromCity: 'المفرق', toCity: 'السعودية', pickupDate: day(14), price: '', negotiable: false });
assert.equal(r.status, 201); const sheepId = r.body.data._id;
doc = await db.collection('loads').findOne({ _id: new mongoose.Types.ObjectId(sheepId) });
assert.equal(doc.phone, '0781112233'); assert.equal(doc.animalCount, 120); assert.equal(doc.price, undefined);
assert.ok(Math.abs(doc.expiresAt - (doc.createdAt.getTime() + 14 * 86400e3)) < 5000); ok('far pickup date → expiry capped at 14 days after creation');
r = await call('POST', '/loads', { ...goods, merchantName: 'سبام' }); const spamId = r.body.data._id;

r = await call('GET', '/loads'); assert.equal(r.status, 200); assert.equal(r.body.data.length, 0); ok('pending loads are not public');
r = await call('GET', '/loads/admin'); assert.equal(r.status, 401); ok('admin list without token → 401');
r = await call('GET', '/loads/admin', null, { 'x-admin-token': 'nope' }); assert.equal(r.status, 401); ok('admin list with wrong token → 401');
r = await call('PATCH', `/loads/${goodsId}`, { status: 'Approved' }); assert.equal(r.status, 401); ok('approve without token → 401');
r = await call('DELETE', `/loads/${goodsId}`); assert.equal(r.status, 401); ok('delete without token → 401');
r = await call('GET', '/loads/admin', null, admin); assert.equal(r.body.meta.total, 3); assert.equal(r.body.meta.stats.Pending, 3); assert.ok(r.body.data[0].phone); ok('admin sees all loads incl. phone + per-status counts');

r = await call('PATCH', `/loads/${goodsId}`, { status: 'Approved' }, admin); assert.equal(r.body.data.status, 'Approved');
r = await call('PATCH', `/loads/${sheepId}`, { status: 'Approved' }, { authorization: `Bearer ${TOKEN}` }); assert.equal(r.body.data.status, 'Approved');
r = await call('PATCH', `/loads/${spamId}`, { status: 'Rejected' }, admin); assert.equal(r.body.data.status, 'Rejected');
r = await call('PATCH', `/loads/${spamId}`, { status: 'Live' }, admin); assert.equal(r.status, 400);
r = await call('PATCH', '/loads/not-an-id', { status: 'Approved' }, admin); assert.equal(r.status, 400);
ok('approve / reject; bad status and bad id → 400');

r = await call('GET', '/loads');
assert.equal(r.body.data.length, 2); assert.ok(r.body.data.every((d) => d.phone && d.status === undefined));
assert.ok(!r.body.data.some((d) => d._id === spamId)); assert.equal(r.body.data[0]._id, goodsId); ok('public sees only approved (with phone), sorted by pickup date');
r = await call('GET', '/loads?cargoType=مواشي'); assert.deepEqual(r.body.data.map((d) => d._id), [sheepId]);
r = await call('GET', `/loads?from=${encodeURIComponent('إربد')}&to=${encodeURIComponent('العقبة')}`); assert.deepEqual(r.body.data.map((d) => d._id), [goodsId]);
r = await call('GET', `/loads?to=${encodeURIComponent('عمّان')}`); assert.equal(r.body.data.length, 0); ok('filters cargoType / from / to');
r = await call('GET', '/loads?from[$ne]=x'); assert.equal(r.status, 400); r = await call('GET', '/loads?cargoType=xyz'); assert.equal(r.status, 400); ok('operator injection / bad enum in query → 400');
r = await call('GET', '/loads/admin?status=Rejected', null, admin); assert.deepEqual(r.body.data.map((d) => d._id), [spamId]); ok('admin status filter');

// Expiry: push the goods load into the past
await db.collection('loads').updateOne({ _id: new mongoose.Types.ObjectId(goodsId) }, { $set: { expiresAt: new Date(Date.now() - 1000) } });
r = await call('GET', '/loads'); assert.deepEqual(r.body.data.map((d) => d._id), [sheepId]); ok('expired approved load disappears from public list immediately');
r = await call('GET', '/loads/admin', null, admin); assert.equal(r.body.meta.stats.Expired, 1); assert.equal(r.body.data.find((d) => d._id === goodsId).status, 'Expired'); ok('admin list marks it Expired');
r = await call('PATCH', `/loads/${goodsId}`, { status: 'Approved' }, admin); assert.equal(r.status, 400); ok('cannot re-approve an expired load');
r = await call('DELETE', `/loads/${spamId}`, null, admin); assert.equal(r.status, 200); r = await call('DELETE', `/loads/${spamId}`, null, admin); assert.equal(r.status, 404); ok('delete, then 404');

// ---------- Drivers ----------
console.log('drivers');
const drv = { driverName: 'أبو أحمد', phone: '0779998877', truckType: 'براد', trailerLengthM: '13.6', maxLoadTons: 25, currentCity: 'إربد', availableFrom: day(0), preferredRoutes: 'إربد ↔ عمّان', price: 180, negotiable: 'true' };
r = await call('POST', '/drivers', {}); assert.equal(r.status, 400);
for (const k of ['driverName', 'phone', 'truckType', 'trailerLengthM', 'maxLoadTons', 'currentCity', 'availableFrom']) assert.ok(r.body.errors[k], k);
ok('empty driver → 400 with Arabic error per field');
r = await call('POST', '/drivers', { ...drv, truckType: 'أخرى' }); assert.ok(r.body.errors.truckTypeOther); ok('"أخرى" requires a description');
r = await call('POST', '/drivers', { ...drv, trailerLengthM: 40 }); assert.ok(r.body.errors.trailerLengthM); ok('trailer length out of range rejected');
r = await call('POST', '/drivers', drv); assert.equal(r.status, 201); const d1 = r.body.data._id; assert.equal(r.body.data.phone, undefined);
r = await call('POST', '/drivers', { ...drv, driverName: 'سائق قلاب', phone: '0795849835', truckType: 'قلاب', trailerLengthM: 8, currentCity: 'الزرقاء', availableFrom: day(3) }); const d2 = r.body.data._id;
r = await call('POST', '/drivers', { ...drv, driverName: 'مرفوض', truckType: 'أخرى', truckTypeOther: 'لوري صغير' }); const d3 = r.body.data._id;
doc = await db.collection('drivers').findOne({ _id: new mongoose.Types.ObjectId(d1) });
assert.equal(doc.trailerLengthM, 13.6); assert.equal(doc.negotiable, true); ok('create drivers → Pending, numeric strings parsed');
r = await call('GET', '/drivers'); assert.equal(r.body.data.length, 0); ok('pending drivers are not public');
await call('PATCH', `/drivers/${d1}`, { status: 'Approved' }, admin); await call('PATCH', `/drivers/${d2}`, { status: 'Approved' }, admin); await call('PATCH', `/drivers/${d3}`, { status: 'Rejected' }, admin);
r = await call('GET', '/drivers'); assert.deepEqual(r.body.data.map((d) => d._id), [d1, d2]); assert.ok(r.body.data.every((d) => d.phone)); ok('public sees approved drivers only, soonest available first');
r = await call('GET', '/drivers?minLength=10'); assert.deepEqual(r.body.data.map((d) => d._id), [d1]);
r = await call('GET', `/drivers?truckType=${encodeURIComponent('قلاب')}`); assert.deepEqual(r.body.data.map((d) => d._id), [d2]);
r = await call('GET', `/drivers?city=${encodeURIComponent('إربد')}`); assert.deepEqual(r.body.data.map((d) => d._id), [d1]);
r = await call('GET', '/drivers?minLength=abc'); assert.equal(r.status, 400); ok('filters truckType / city / minLength');
r = await call('GET', '/drivers/admin', null, admin); assert.deepEqual(r.body.meta.stats, { Pending: 0, Approved: 2, Rejected: 1, Expired: 0 }); ok('driver admin stats');
r = await call('GET', `/drivers/admin?truckType=${encodeURIComponent('أخرى')}`, null, admin); assert.deepEqual(r.body.data.map((d) => d._id), [d3]); ok('driver admin type filter');
r = await call('GET', '/drivers/admin'); assert.equal(r.status, 401); ok('driver admin without token → 401');

// No public route leaks rejected/pending phones
const pub = JSON.stringify([(await call('GET', '/loads?limit=50')).body, (await call('GET', '/drivers?limit=50')).body]);
assert.ok(pub.includes('0781112233')); // approved & live
assert.ok(!pub.includes('0791234567')); // approved but expired
const rejectedDriver = await db.collection('drivers').findOne({ _id: new mongoose.Types.ObjectId(d3) });
const expiredLoad = await db.collection('loads').findOne({ _id: new mongoose.Types.ObjectId(goodsId) });
assert.ok(!pub.includes(rejectedDriver._id.toString()) && !pub.includes(expiredLoad._id.toString())); ok('rejected / expired listings absent from every public response');

// Rate limit on public POST (same IP)
let last; for (let i = 0; i < 11; i++) last = await fetch(B + '/drivers', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': '10.9.9.9' }, body: '{}' });
assert.equal(last.status, 429); ok('public POST rate-limited after 10 requests');

console.log(`\nALL ${n} CHECKS PASSED`);
srv.kill(); await mongoose.connection.dropDatabase(); await mongoose.disconnect();
process.exit(0);

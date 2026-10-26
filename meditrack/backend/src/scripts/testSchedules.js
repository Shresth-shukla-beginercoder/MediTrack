import http from 'http';
import app from '../app.js';
import { pool, query } from '../config/db.js';

const TEST_PORT = 5003;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const headers = {
      'Content-Type': 'application/json'
    };
    if (payload) headers['Content-Length'] = Buffer.byteLength(payload);
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: 'localhost',
      port: TEST_PORT,
      path,
      method,
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runScheduleTests() {
  const server = app.listen(TEST_PORT);
  console.log(`Starting Schedule & Privacy Test Suite on port ${TEST_PORT}...`);

  const userAEmail = `patient_a_${Date.now()}@test.local`;
  const userBEmail = `patient_b_${Date.now()}@test.local`;
  const testPassword = 'Password123!';

  let tokenA = null;
  let tokenB = null;
  let schedule1Id = null;

  try {
    // 1. Register User A
    const regA = await request('POST', '/api/auth/register/user', {
      full_name: 'Patient Alice',
      email: userAEmail,
      password: testPassword
    });
    tokenA = regA.data.token;

    // 2. Register User B
    const regB = await request('POST', '/api/auth/register/user', {
      full_name: 'Patient Bob',
      email: userBEmail,
      password: testPassword
    });
    tokenB = regB.data.token;

    console.log('Registered User A and User B successfully.');

    // 3. User A creates Schedule 1
    console.log('\n--- 1. User A creates a schedule ---');
    const createRes = await request('POST', '/api/schedules', {
      medicine_name: 'Amoxicillin',
      dosage_instructions: 'Take 500mg three times daily with water after meals',
      reminder_times: ['08:00', '14:00', '20:00'],
      start_date: '2026-11-01',
      end_date: '2026-11-10'
    }, tokenA);

    console.log('Status:', createRes.status, 'Schedule ID:', createRes.data.schedule?.schedule_id);
    if (createRes.status !== 201 || !createRes.data.schedule?.schedule_id) {
      throw new Error('Failed to create schedule for User A');
    }
    schedule1Id = createRes.data.schedule.schedule_id;
    console.log(' Schedule created for User A.');

    // 4. User A gets their schedules
    console.log('\n--- 2. User A retrieves own schedules ---');
    const getARes = await request('GET', '/api/schedules', null, tokenA);
    console.log('Status:', getARes.status, 'Count:', getARes.data.count);
    if (getARes.status !== 200 || getARes.data.count !== 1) {
      throw new Error('User A could not retrieve own schedule');
    }
    console.log(' User A successfully sees their own schedule.');

    // 5. User B gets their schedules (Must be 0)
    console.log('\n--- 3. User B retrieves own schedules ---');
    const getBRes = await request('GET', '/api/schedules', null, tokenB);
    console.log('Status:', getBRes.status, 'Count:', getBRes.data.count);
    if (getBRes.status !== 200 || getBRes.data.count !== 0) {
      throw new Error('Privacy breach: User B saw schedules they do not own!');
    }
    console.log(' User B sees 0 schedules (Privacy preserved).');

    // 6. User B attempts to read User A's schedule by ID
    console.log(`\n--- 4. Cross-user Attack: User B attempts GET /api/schedules/${schedule1Id} ---`);
    const attackRead = await request('GET', `/api/schedules/${schedule1Id}`, null, tokenB);
    console.log('Status:', attackRead.status, 'Message:', attackRead.data.message);
    if (attackRead.status !== 404) {
      throw new Error(`Privacy breach: User B was able to access User A's schedule (status ${attackRead.status})!`);
    }
    console.log(' Cross-user read blocked with 404.');

    // 7. User B attempts to modify User A's schedule by ID
    console.log(`\n--- 5. Cross-user Attack: User B attempts PUT /api/schedules/${schedule1Id} ---`);
    const attackUpdate = await request('PUT', `/api/schedules/${schedule1Id}`, {
      medicine_name: 'Hacked Medicine',
      dosage_instructions: 'Malicious instructions',
      reminder_times: ['12:00'],
      start_date: '2026-11-01',
      end_date: '2026-11-10'
    }, tokenB);
    console.log('Status:', attackUpdate.status, 'Message:', attackUpdate.data.message);
    if (attackUpdate.status !== 404) {
      throw new Error(`Privacy breach: User B was able to modify User A's schedule (status ${attackUpdate.status})!`);
    }
    console.log(' Cross-user update blocked with 404.');

    // 8. User B attempts to delete User A's schedule by ID
    console.log(`\n--- 6. Cross-user Attack: User B attempts DELETE /api/schedules/${schedule1Id} ---`);
    const attackDelete = await request('DELETE', `/api/schedules/${schedule1Id}`, null, tokenB);
    console.log('Status:', attackDelete.status, 'Message:', attackDelete.data.message);
    if (attackDelete.status !== 404) {
      throw new Error(`Privacy breach: User B was able to delete User A's schedule (status ${attackDelete.status})!`);
    }
    console.log(' Cross-user delete blocked with 404.');

    // 9. User A updates their schedule
    console.log(`\n--- 7. User A legitimately updates schedule ---`);
    const legitUpdate = await request('PUT', `/api/schedules/${schedule1Id}`, {
      medicine_name: 'Amoxicillin Trihydrate',
      dosage_instructions: 'Take 500mg three times daily with a full glass of water after meals',
      reminder_times: ['08:00', '14:00', '20:00'],
      start_date: '2026-11-01',
      end_date: '2026-11-12'
    }, tokenA);
    console.log('Status:', legitUpdate.status, 'Updated Name:', legitUpdate.data.schedule?.medicine_name);
    if (legitUpdate.status !== 200 || legitUpdate.data.schedule?.medicine_name !== 'Amoxicillin Trihydrate') {
      throw new Error('Legitimate update failed for User A');
    }
    console.log(' User A update PASSED.');

    // 10. User A deletes their schedule
    console.log(`\n--- 8. User A legitimately deletes schedule ---`);
    const legitDelete = await request('DELETE', `/api/schedules/${schedule1Id}`, null, tokenA);
    console.log('Status:', legitDelete.status, 'Deleted ID:', legitDelete.data.deletedScheduleId);
    if (legitDelete.status !== 200) {
      throw new Error('Legitimate delete failed for User A');
    }
    console.log(' User A delete PASSED.');

    console.log('\n ALL SCHEDULE & PRIVACY TESTS PASSED!');
  } catch (err) {
    console.error('\n Test Failure:', err.message);
  } finally {
    // Clean up test users and cascaded schedules
    console.log('\nCleaning up test users and schedules...');
    await query('DELETE FROM users WHERE email IN ($1, $2)', [userAEmail, userBEmail]);
    console.log('Cleanup completed cleanly.');

    server.close();
    await pool.end();
  }
}

runScheduleTests();

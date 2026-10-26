import http from 'http';
import app from '../app.js';
import { pool, query } from '../config/db.js';

const TEST_PORT = 5002;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const headers = {
      'Content-Type': 'application/json'
    };
    if (payload) {
      headers['Content-Length'] = Buffer.byteLength(payload);
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

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

async function runAuthTests() {
  const server = app.listen(TEST_PORT);
  console.log(`Starting Auth Test Suite on port ${TEST_PORT}...`);

  const testUserEmail = `testuser_${Date.now()}@test.local`;
  const testDoctorEmail = `testdoc_${Date.now()}@test.local`;
  const testPassword = 'Password123!';

  let userToken = null;
  let doctorToken = null;

  try {
    // 1. Password complexity rejection test
    console.log('\n--- 1. Testing Password Complexity Rejection ---');
    const weakPassRes = await request('POST', '/api/auth/register/user', {
      full_name: 'Weak Pass User',
      email: 'weak@test.local',
      password: '123'
    });
    console.log('Status:', weakPassRes.status, 'Message:', weakPassRes.data.message);
    if (weakPassRes.status !== 400) throw new Error('Expected 400 for weak password');
    console.log(' Weak password correctly rejected with 400.');

    // 2. Register Ordinary User
    console.log('\n--- 2. Testing Ordinary User Registration ---');
    const userRegRes = await request('POST', '/api/auth/register/user', {
      full_name: 'Jane Patient',
      email: testUserEmail,
      password: testPassword
    });
    console.log('Status:', userRegRes.status, 'User Role:', userRegRes.data.user?.role);
    if (userRegRes.status !== 201 || !userRegRes.data.token || userRegRes.data.user?.role !== 'user') {
      throw new Error('User registration failed');
    }
    userToken = userRegRes.data.token;
    console.log(' User registration PASSED with JWT issued.');

    // 3. Duplicate Email Rejection
    console.log('\n--- 3. Testing Duplicate User Registration ---');
    const dupRes = await request('POST', '/api/auth/register/user', {
      full_name: 'Jane Patient Duplicate',
      email: testUserEmail,
      password: testPassword
    });
    console.log('Status:', dupRes.status, 'Message:', dupRes.data.message);
    if (dupRes.status !== 409) throw new Error('Expected 409 for duplicate user registration');
    console.log(' Duplicate registration correctly rejected with 409.');

    // 4. Register Doctor
    console.log('\n--- 4. Testing Doctor Registration ---');
    const docRegRes = await request('POST', '/api/auth/register/doctor', {
      full_name: 'Dr. Gregory House',
      email: testDoctorEmail,
      password: testPassword,
      degree: 'MD',
      graduation_year: 1995,
      college_name: 'Johns Hopkins University',
      professional_registration_number: `REG_${Date.now()}`,
      registration_authority: 'State Medical Council',
      workplace: 'Princeton-Plainsboro Hospital',
      specialization: 'Diagnostic Medicine'
    });
    console.log('Status:', docRegRes.status, 'Status:', docRegRes.data.user?.verificationStatus);
    if (docRegRes.status !== 201 || docRegRes.data.user?.verificationStatus !== 'pending') {
      throw new Error('Doctor registration failed or did not default to pending');
    }
    doctorToken = docRegRes.data.token;
    console.log(' Doctor registration PASSED with default pending verification status.');

    // 5. Unified Login
    console.log('\n--- 5. Testing Unified Login ---');
    const loginRes = await request('POST', '/api/auth/login', {
      email: testUserEmail,
      password: testPassword
    });
    console.log('Status:', loginRes.status, 'Logged in as:', loginRes.data.user?.role);
    if (loginRes.status !== 200 || !loginRes.data.token) {
      throw new Error('Login failed');
    }
    console.log(' Unified login PASSED.');

    // 6. Invalid Password Test
    console.log('\n--- 6. Testing Wrong Password ---');
    const wrongPassRes = await request('POST', '/api/auth/login', {
      email: testUserEmail,
      password: 'WrongPassword999!'
    });
    console.log('Status:', wrongPassRes.status, 'Message:', wrongPassRes.data.message);
    if (wrongPassRes.status !== 401) throw new Error('Expected 401 for wrong password');
    console.log(' Wrong password correctly rejected with 401.');

    // 7. Protected Route Profile Verification (GET /api/auth/me)
    console.log('\n--- 7. Testing Protected Profile (GET /api/auth/me) ---');
    const meRes = await request('GET', '/api/auth/me', null, userToken);
    console.log('Status:', meRes.status, 'Profile Name:', meRes.data.user?.full_name);
    if (meRes.status !== 200 || meRes.data.user?.email !== testUserEmail) {
      throw new Error('Profile retrieval failed');
    }
    console.log(' Protected profile retrieval PASSED.');

    // 8. Access without token
    console.log('\n--- 8. Testing Access Without Token ---');
    const noTokenRes = await request('GET', '/api/auth/me');
    console.log('Status:', noTokenRes.status, 'Message:', noTokenRes.data.message);
    if (noTokenRes.status !== 401) throw new Error('Expected 401 for unauthenticated request');
    console.log(' Unauthenticated access correctly rejected with 401.');

    console.log('\n ALL AUTHENTICATION TESTS PASSED!');
  } catch (err) {
    console.error('\n Auth Test Failed:', err.message);
  } finally {
    // Clean up test records from database
    console.log('\nCleaning up test records from database...');
    await query('DELETE FROM users WHERE email = $1', [testUserEmail]);
    await query('DELETE FROM doctors WHERE email = $1', [testDoctorEmail]);
    console.log('Test database records cleaned up cleanly.');

    server.close();
    await pool.end();
  }
}

runAuthTests();

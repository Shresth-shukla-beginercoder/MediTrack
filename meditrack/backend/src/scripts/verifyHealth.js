import http from 'http';
import app from '../app.js';
import { pool } from '../config/db.js';

async function verifyServer() {
  const TEST_PORT = 5001;
  const server = app.listen(TEST_PORT);

  const fetchJson = (path) => {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:${TEST_PORT}${path}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }).on('error', reject);
    });
  };

  try {
    console.log(`Starting temporary test server on port ${TEST_PORT}...`);

    // 1. Test /api/health
    const health = await fetchJson('/api/health');
    console.log('\n1. Testing GET /api/health:');
    console.log(`   HTTP Status: ${health.status}`);
    console.log('   Response Body:', health.data);
    if (health.status === 200 && health.data.database === 'connected') {
      console.log('   Health check PASSED.');
    } else {
      throw new Error('Health check did not return expected 200 OK');
    }

    // 2. Test 404 handler
    const notFound = await fetchJson('/api/non-existent-route');
    console.log('\n2. Testing 404 Handler on unknown route:');
    console.log(`   HTTP Status: ${notFound.status}`);
    console.log('   Response Body:', notFound.data);
    if (notFound.status === 404 && notFound.data.success === false) {
      console.log('   404 Handler PASSED.');
    } else {
      throw new Error('404 Handler did not return expected 404 Not Found');
    }

    console.log('\n All server foundation tests PASSED!');
  } catch (err) {
    console.error('\n Server test FAILED:', err.message);
  } finally {
    server.close();
    await pool.end();
    console.log('Test server and DB pool cleanly closed.');
  }
}

verifyServer();

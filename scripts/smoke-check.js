/* global Buffer */
import http from 'http';
import { URL } from 'url';

// 1. Configuration - Use environment variables for flexibility in CI/CD
const BASE_URL = process.env.SMOKE_BASE_URL || 'http://localhost:3000';
const TIMEOUT_MS = 5000; 

const endpoints = [
  { path: '/', expectedStatus: 200 },
  { path: '/health', expectedStatus: 200 },
  { path: '/api', expectedStatus: 200 },
  { path: '/api/auth/sign-in', expectedStatus: 200 }, 
];

/**
 * Perform an HTTP request with timeout and custom headers
 */
function request(endpoint) {
  const url = new URL(endpoint.path, BASE_URL);
  
  const options = {
    method: 'GET',
    timeout: TIMEOUT_MS,
    headers: {
      // Identifies the tool to Arcjet/WAFs
      'User-Agent': 'Acquisitions-Smoke-Checker/1.0 (CI/CD; Node.js)',
      'Accept': 'application/json',
      'X-Smoke-Test': 'true'
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.get(url, options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        resolve({ 
          status: res.statusCode, 
          body, 
          path: endpoint.path,
          expected: endpoint.expectedStatus 
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timed out after ${TIMEOUT_MS}ms`));
    });

    req.on('error', (err) => reject(err));
  });
}

async function run() {
  console.log(`🚀 Starting smoke checks against: ${BASE_URL}`);
  console.log(`🕒 Timestamp: ${new Date().toISOString()}\n`);

  let failureCount = 0;

  for (const endpoint of endpoints) {
    try {
      const result = await request(endpoint);
      const isOk = result.status === result.expected;

      const icon = isOk ? '✅' : '❌';
      console.log(`${icon} GET ${result.path}`);
      console.log(`   Expected: ${result.expected} | Received: ${result.status}`);

      if (!isOk) {
        failureCount++;
        // Log the raw body if it's not JSON (helps catch 404 HTML pages)
        try {
          const json = JSON.parse(result.body);
          console.log('   Response:', JSON.stringify(json, null, 2));
        } catch {
          console.log(`   Raw Response: ${result.body.substring(0, 150)}...`);
        }
      }
    } catch (error) {
      failureCount++;
      console.error(`🚨 [ERROR] GET ${endpoint.path} failed: ${error.message}`);
    }
    console.log('---');
  }

  if (failureCount > 0) {
    console.error(`\n❌ Smoke checks FAILED: ${failureCount} errors found.`);
    process.exit(1); // Non-zero exit code stops CI/CD pipelines
  } else {
    console.log('\n✨ All smoke checks passed successfully!');
    process.exit(0);
  }
}

run();
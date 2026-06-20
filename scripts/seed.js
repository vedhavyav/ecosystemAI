/* eslint-disable @typescript-eslint/no-require-imports */
const http = require('http');

const data = {
  fields: {
    tonsSaved: { integerValue: 2450 },
    treesEquivalent: { integerValue: 86000 },
    activeUsers: { integerValue: 920 }
  }
};

const options = {
  hostname: '127.0.0.1',
  port: 8080,
  path: '/v1/projects/demo-ecosystemai/databases/(default)/documents/community_stats/global',
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  }
};

console.log('Waiting for emulator to start...');
setTimeout(() => {
  const req = http.request(options, (res) => {
    console.log(`\n✅ Seeded Firestore Emulator with Community Stats (Status: ${res.statusCode})`);
  });

  req.on('error', (error) => {
    console.error('Seed script error:', error.message);
  });

  req.write(JSON.stringify(data));
  req.end();
}, 6000); // Wait 6 seconds for emulator to start

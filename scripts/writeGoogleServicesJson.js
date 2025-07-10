// scripts/writeGoogleServicesJson.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'android', 'app', 'google-services.json');

const googleServicesJson = process.env.GOOGLE_SERVICES_JSON;

if (!googleServicesJson) {
  console.error('GOOGLE_SERVICES_JSON environment variable is not set');
  process.exit(1);
}

fs.writeFileSync(filePath, googleServicesJson, { encoding: 'utf8' });
console.log('Wrote google-services.json file successfully');

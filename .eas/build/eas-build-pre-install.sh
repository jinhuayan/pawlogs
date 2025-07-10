#!/bin/bash

echo "📦 Decoding google-services.json from GOOGLE_SERVICES_JSON_BASE64..."

# Ensure the android/app directory exists
mkdir -p android/app

# Decode the env var into the actual file
echo $GOOGLE_SERVICES_JSON_BASE64 | base64 -d > android/app/google-services.json

echo "✅ google-services.json created!"

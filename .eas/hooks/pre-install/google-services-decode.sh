#!/bin/bash

echo "📦 Decoding google-services.json from GOOGLE_SERVICES_JSON_BASE64..."

# Make sure the output directory exists
mkdir -p android/app

# Decode the base64-encoded environment variable into the correct file
echo $GOOGLE_SERVICES_JSON_BASE64 | base64 -d > android/app/google-services.json

echo "✅ google-services.json created successfully."

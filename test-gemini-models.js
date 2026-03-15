// Test script to list available Gemini models via REST API
const https = require('https');

const apiKey = process.env.GEMINI_API_KEY || "your_api_key_here";

async function listModels() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models?key=${apiKey}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function main() {
  try {
    console.log("Fetching available Gemini models...\n");
    const response = await listModels();
    
    if (response.models) {
      console.log(`Found ${response.models.length} models:\n`);
      
      response.models.forEach((model) => {
        console.log("─".repeat(60));
        console.log(`Name: ${model.name}`);
        console.log(`Display Name: ${model.displayName || 'N/A'}`);
        console.log(`Description: ${model.description || 'N/A'}`);
        console.log(`Supported Methods: ${model.supportedGenerationMethods?.join(", ") || "N/A"}`);
        console.log();
      });
      
      console.log("─".repeat(60));
      console.log("\nModels that support generateContent:");
      response.models
        .filter(m => m.supportedGenerationMethods?.includes("generateContent"))
        .forEach(m => console.log(`  - ${m.name}`));
    }
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();

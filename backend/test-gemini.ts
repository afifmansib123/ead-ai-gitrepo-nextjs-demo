import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function testGemini() {
  console.log('🧪 Testing Gemini API connection...\n');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY is not set in .env file');
    process.exit(1);
  }

  console.log('✅ API Key found:', apiKey.substring(0, 10) + '...\n');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // Try gemini-1.5-flash first (more widely available)
    console.log('📡 Trying gemini-1.5-flash model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    console.log('📡 Sending test request to Gemini...');
    const result = await model.generateContent('Say "Hello, Gemini is working!" and nothing else.');
    const response = await result.response;
    const text = response.text();

    console.log('\n✅ SUCCESS! Gemini API is working!');
    console.log('📝 Response:', text);
    console.log('\n🎉 Your Gemini API integration is ready!\n');
  } catch (error) {
    console.error('\n❌ ERROR: Failed to connect to Gemini API');
    console.error('Details:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

testGemini();

import * as geminiVision from './src/services/ai/gemini-vision.service';

async function testGemini() {
  console.log('🧪 Testing Gemini API connection...\n');

  try {
    console.log('📡 Sending test request to Gemini...');
    const isConnected = await geminiVision.testConnection();

    if (isConnected) {
      console.log('\n✅ SUCCESS! Gemini API is working!');
      console.log('🎉 Your Gemini API integration is ready!\n');
    } else {
      console.log('\n❌ Connection test failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ ERROR: Failed to connect to Gemini API');
    console.error('Details:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

testGemini();

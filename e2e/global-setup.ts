import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for the application to be ready
    console.log('⏳ Waiting for application to start...');
    await page.goto(config.projects[0].use.baseURL || 'http://localhost:3000');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Check if the application is responding
    const title = await page.title();
    console.log(`✅ Application loaded with title: ${title}`);
    
    // Optional: Set up test data or authentication state
    await setupTestData(page);
    
    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function setupTestData(page: any) {
  try {
    // Check if we need to set up any initial data
    // This could include creating test users, seeding data, etc.
    console.log('📊 Setting up test data...');
    
    // Example: Check if the app is in a clean state
    const isAppReady = await page.evaluate(() => {
      return document.readyState === 'complete';
    });
    
    if (!isAppReady) {
      throw new Error('Application not ready');
    }
    
    console.log('✅ Test data setup completed');
  } catch (error) {
    console.warn('⚠️ Test data setup failed:', error);
    // Don't fail the entire setup for test data issues
  }
}

export default globalSetup;

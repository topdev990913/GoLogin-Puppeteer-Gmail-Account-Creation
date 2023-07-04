const puppeteer = require('puppeteer');
const GoLogin = require('@gologin/puppeteer');

async function main() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGEyYTdiYzBmZDBlODQwOWY5NDA3MjYiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2NGEyYTdjZmM4MTA2NzNkNTI5YTFlOWEifQ.pmY21qnfDengTNnYGV2ysuILmwUOxPj-7JGY9JqrqtA'; // Replace with your actual token

  const gologin = new GoLogin({
    token,
    browserParams: {
      browser: 'chrome',
      profile: 'default',
      viewport: '1920x1080',
    },
  });

  const browser = await gologin.launch();
  const page = await browser.newPage();

  await page.goto(' https://accounts.google.com/EmbeddedSetup/createaccount?flowName=EmbeddedSetupAndroid');

  await browser.close();
}

main();
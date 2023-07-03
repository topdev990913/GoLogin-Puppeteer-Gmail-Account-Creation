// const puppeteer = require('puppeteer');
// const { GoLogin } = require('gologin');///////////////////////////

import puppeteer from 'puppeteer';
import { GoLogin } from 'gologin';

const axios = require('axios');

async function getURL() {
    const gologin = new GoLogin({               /////////////////
        username: 'your_gologin_username',      /////////////////
        password: 'your_gologin_password',      /////////////////
    });
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', `--proxy-server=${gologin.proxyURL}`],////////////////
    });
    const session = await gologin.createSession();////////////////////
    await gologin.setProfile(session.token);///////////////////////
    await browser.defaultBrowserContext().overridePermissions('https://accounts.google.com/EmbeddedSetup/createaccount?flowName=EmbeddedSetupAndroid', ['geolocation']);///////////
    const page = await browser.newPage();
    // await page.setViewport({
    //     width: 1920, // Adjust the width as per your requirement
    //     height: 1080, // Adjust the height as per your requirement
    // });
    // Navigate to a website
    await page.goto(' https://accounts.google.com/EmbeddedSetup/createaccount?flowName=EmbeddedSetupAndroid');

    // Get the current URL
    const url = page.url();

    console.log(url);  // Output the URL

    // await page.click('#elementId');
    const elementXPath = '//*[@id="view_container"]/div/div/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div/button/span'; // Replace with the appropriate XPath expression
    const element = await page.$x(elementXPath);

    if (element.length > 0) {
        await element[0].click();
    } else {
        console.log('Element not found');
    }
    await page.waitForTimeout(3000)

    await page.keyboard.press('ArrowDown');

    await page.keyboard.press('Enter');

    const response = await axios.get('https://yoxygames.com/app/api.php?method=register_info');
    // console.log("FirstName", response.data.firstName);
    console.log(response.data)

    // await page.waitForSelector('#firstName')
    await page.waitForSelector('#lastName')
    await page.type('#firstName', response.data.firstName)
    await page.type('#lastName', response.data.lastName)
    await page.keyboard.press('Enter')
    await page.waitForSelector('#gender')
    //await page.waitForNavigation()
    await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
    await page.click('#day')
    await page.type('#day', response.data.day)
    await page.click('#month')
    for (let i = 0; i < response.data.month; i++) {
        await page.keyboard.press('ArrowDown');
    }
    await page.keyboard.press('Enter')
    await page.click('#year')
    await page.type('#year', response.data.year)
    await page.click('#gender')
    for (let i = 0; i < 2; i++) {
        await page.keyboard.press('ArrowDown');
    }
    await page.keyboard.press('Enter')
    const elementXPath1 = '//*[@id="birthdaygenderNext"]/div/button/span'; // Replace with the appropriate XPath expression
    const element1 = await page.$x(elementXPath1);

    if (element1.length > 0) {
        await element1[0].click();
    } else {
        console.log('Element not found');
    }
    //////////////////////////////

    // }

    ///////////////////////////////////////////////
    // const response_phone = await axios.get(`https://yoxygames.com/app/api.php?method=get_number&dataID=${response.data.id}`);
    // console.log(response_phone.data)
    // await browser.close();
    // await gologin.logout();

}
getURL();


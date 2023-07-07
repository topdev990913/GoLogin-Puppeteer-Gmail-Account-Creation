console.log("------------Automation Started---------------")

import puppeteer from 'puppeteer-core';
import GoLogin from 'gologin';
import axios from 'axios';

const { connect } = puppeteer;

////Open Target URL////

////Defining Function////
async function getURL() {
    let browser = null;
    let response_phone = null;
    try {
        const GL = new GoLogin({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGEyYTdiYzBmZDBlODQwOWY5NDA3MjYiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2NGEyYTdjZmM4MTA2NzNkNTI5YTFlOWEifQ.pmY21qnfDengTNnYGV2ysuILmwUOxPj-7JGY9JqrqtA',
            profile_id: '64a2b7b4b42a8c1e7a05d293',
        });

        const { status, wsUrl } = await GL.start().catch((e) => {
            console.trace(e);

            return { status: 'failure' };
        });

        if (status !== 'success') {
            console.log('Invalid status');
            return;
        }
        browser = await connect({
            browserWSEndpoint: wsUrl.toString(),
            ignoreHTTPSErrors: true,
        });
        const page = await browser.newPage();
        await page.goto(' https://accounts.google.com/EmbeddedSetup/createaccount?flowName=EmbeddedSetupAndroid');
        const url = page.url();
        console.log(url);
        ////Click Create myself Element////    
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
        ////Getting register info from API////
        const response = await axios.get('https://yoxygames.com/app/api.php?method=register_info');
        console.log("response", response.data)
        ////Inserting the First Name and Last Name ////
        await page.waitForSelector('#lastName')
        await page.type('#firstName', response.data.firstName)
        await page.type('#lastName', response.data.lastName)
        await page.keyboard.press('Enter')
        ////Inserting Birthday and Gender////
        await page.waitForSelector('#gender')
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 5000));
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
        const elementXPath1 = '//*[@id="birthdaygenderNext"]/div/button/span';
        const element1 = await page.$x(elementXPath1);
        if (element1.length > 0) {
            await element1[0].click();
        } else {
            console.log('Element not found');
        }
        ////Selecting the third Option and type the username////
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 3000));
        const options = await page.$$('.enBDyd');
        const lastOption = options[2];
        await lastOption.click();
        await page.type('input[name="Username"]', response.data.username)
        await page.click('#next');
        ////Inserting Password////
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
        await page.type('input[name="Passwd"]', response.data.password)
        await page.click('#createpasswordNext')
        ////Getting the Phone Number////
        response_phone = await axios.get(`https://yoxygames.com/app/api.php?method=get_number&dataID=${response.data.id}`);
        console.log("response_phone", response_phone.data)
        ////Inserting Phone number////
        await page.waitForSelector('button')
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 4000));
        await page.type('#phoneNumberId', response_phone.data.phoneNumber)
        await page.click('button')
        //// Getting the SMS code////
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 10000));
        const response_sms_old = await axios.get(`https://yoxygames.com/app/api.php?method=get_sms&phoneID=${response_phone.data.phoneID}`)
        console.log(response_sms_old.data)
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 30000));
        const response_sms_new = await axios.get(`https://yoxygames.com/app/api.php?method=get_sms&phoneID=${response_phone.data.phoneID}`)
        console.log(response_sms_new.data)
        ////Inserting the SMS code////
        await page.type('#code', response_sms_new.data.SMS)
        await page.click('button')

        await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
        await page.waitForSelector('button')
        await page.click('#next')

        await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
        await page.waitForSelector('button')
        await page.click('#next')
        ////Click I Agree button ////
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 10000));
        await page.waitForSelector('button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b"]')
        await page.click('button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b"]')
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 5000));
        const confirmButtons = await page.$$('div[class="U26fgb O0WRkf oG5Srb C0oVfc kHssdc lw1w4b M9Bg4d"]');
        const confirmButton = confirmButtons[2];
        await confirmButton.click();
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 10000));
        // await browser.close()
        console.log("-----------Gmail is successfully created--------------")
        ////Two-Step Verification Process////
        console.log("-----------Two-Step Verification Process Started----------")
        ////Login Created Gamil////
        const page_twostep = await browser.newPage();
        await page_twostep.goto('https://myaccount.google.com/two-step-verification/authenticator');
        await page_twostep.waitForSelector('#identifierNext')
        await page_twostep.click('#identifierId')
        await page_twostep.type('#identifierId', response.data.username)
        await page_twostep.click('#identifierNext')
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 5000));
        await page_twostep.waitForSelector('#passwordNext')
        await page_twostep.type('input[name="Passwd"]', response.data.password)
        console.log("twosteppass", response.data.password)
        await page_twostep.click('#passwordNext')
        ////Getting username and password data from get2fa API////
        const response_get2fa = await axios.get('https://yoxygames.com/app/api.php?method=get2fa')
        console.log(response_get2fa.data)
        ////Verification the new SMS////
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 10000));
        // await browser.close()
        const page_twostepverification = await browser.newPage();
        await page_twostepverification.goto('https://myaccount.google.com/signinoptions/two-step-verification/enroll?pli=1');
        await page_twostepverification.waitForSelector('div[data-id="OCpkoe"]')
        await page_twostepverification.click('div[data-id="OCpkoe"]')
        ////Getting new SMS from API////
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 10000));
        const response_new_sms_first = await axios.get(`https://yoxygames.com/app/api.php?method=get_sms&phoneID=${response_phone.data.phoneID}`)
        console.log(response_new_sms_first.data)
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 40000));
        const response_new_sms_second = await axios.get(`https://yoxygames.com/app/api.php?method=get_sms&phoneID=${response_phone.data.phoneID}`)
        console.log(response_new_sms_second.data)
        await page_twostepverification.waitForSelector('div[data-id="OCpkoe"]')
        await page_twostepverification.type('input[type="text"]', response_new_sms_second.data.SMS)
        await page_twostepverification.click('div[data-id="OCpkoe"]')
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 5000));
        await page_twostepverification.waitForSelector('div[data-id="AHldd"]')
        await page_twostepverification.click('div[data-id="AHldd"]')
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 10000));
        // await browser.close()
        ////Google Authenticator////
        const page_twostepverificationafter = await browser.newPage();
        await page_twostepverificationafter.goto('https://myaccount.google.com/two-step-verification/authenticator');
        await page_twostepverificationafter.waitForSelector('button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc VfPpkd-LgbsSe-OWXEXe-Bz112c-M1Soyc VfPpkd-LgbsSe-OWXEXe-dgl2Hf Rj2Mlf OLiIxf PDpWxe LQeN7 wMI9H"]')
        await page_twostepverificationafter.click('button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc VfPpkd-LgbsSe-OWXEXe-Bz112c-M1Soyc VfPpkd-LgbsSe-OWXEXe-dgl2Hf Rj2Mlf OLiIxf PDpWxe LQeN7 wMI9H"]')
        await page_twostepverificationafter.waitForSelector('button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-dgl2Hf ksBjEc lKxP2d LQeN7 wMI9H"]')
        await page_twostepverificationafter.click('button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-dgl2Hf ksBjEc lKxP2d LQeN7 wMI9H"]');
        ////Getting text from scan////
        const text = await page_twostepverificationafter.evaluate(() => {
            const strongElements = document.querySelectorAll('strong');
            if (strongElements.length >= 4) {
                return strongElements[2].textContent;
            }
            return null;
        });
        console.log("code", text)
        ////Getting code from APIs////
        const response_message = await axios.get(`https://yoxygames.com/app/api.php?method=bosluksil&code=${text}`)
        console.log("response_message", response_message.data)
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 5000));
        const response_id_saved = await axios.get(`https://yoxygames.com/app/api.php?method=google_authenticator&dataID=${response_phone.data.dataID}&secretKey=${response_message.data.message}`)
        console.log("response_id_saved", response_id_saved.data)
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 5000));
        const response_getcode = await axios.get(`https://yoxygames.com/app/api.php?method=google_authenticator&dataID=${response_phone.data.dataID}&get_code=1`)
        console.log("response_getcode", response_getcode.data)
        ////setup authentiator app next////
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 5000));
        const buttons = await page_twostepverificationafter.$$('button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-dgl2Hf ksBjEc lKxP2d LQeN7 Zseo7d"]');
        const nextButton = buttons[6];
        await nextButton.click();
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
        // await page_twostepverificationafter.waitForSelector('#c4')
        await page_twostepverificationafter.click('input[type="text"]')
        await page_twostepverificationafter.type('input[type="text"]', response_getcode.data.code)
        ////Verify Button Click////
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 5000));
        await page_twostepverificationafter.waitForSelector('button[data-id="dtOep"]');
        const verifyButtons = await page_twostepverificationafter.$$('button[data-id="dtOep"]');
        const verifyButton = verifyButtons[1];
        await verifyButton.click();
        ////GoBackButton//// 
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 5000));
        const BackButtons = await page_twostepverificationafter.$$('span[class="DPvwYc sm8sCf ew338c"]');
        const backButton = BackButtons[0];
        await backButton.click();
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 5000));
        const goButtons = await page_twostepverificationafter.$$('span[class="DPvwYc"]');
        const goButton = goButtons[1];
        await goButton.click();
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 5000));
        await page_twostepverificationafter.click('button[class="VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ mN1ivc wMI9H"]')
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 5000));
        await page_twostepverificationafter.waitForSelector('button[data-mdc-dialog-action="ok"]')
        await page_twostepverificationafter.click('button[data-mdc-dialog-action="ok"]')
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 5000));
        await browser.close();
    } catch (error) {
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 5000));
        try {
            const response_phone_cancel = await axios.get(`https://yoxygames.com/app/api.php?method=cancel_number&phoneID=${response_phone.data.phoneID}`)
            console.log("response_phone_cancel", response_phone_cancel.data)
        } catch (error) {

        }
        await browser.close();
    }
}

function start() {
    setTimeout(async () => {
        await getURL()
        start()
    }, 1000)
}
start()


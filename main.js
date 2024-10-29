import puppeteer from 'puppeteer';
import { hfs } from "@humanfs/node";


(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: 'new',
    });
    const page = await browser.newPage();

    // Navigate the page to a URL

    // await page.emulateMediaType('print');

    await page.setViewport({
        width: 794,
        height: 1123,
        deviceScaleFactor: 3
    });

    await page.goto('https://picsum.photos/images', {
        timeout: 0,
        waitUntil: ['domcontentloaded', 'networkidle0', 'load']
    });


    const fullTitle = await page.evaluate(() => {
        return window.document.title
    })


    const pdfBuff = await page.pdf({
        format: 'A4',
        height: '1123px',
        width: '768px',
        timeout: 0,
        displayHeaderFooter: true,
        headerTemplate: `<h1>${fullTitle}</h1> <br/>[pdf-test]`,
        margin: {
            top: '80px',
            bottom: '70px'
        },
    })

    await hfs.write(`./output/${fullTitle}.pdf`, pdfBuff)

    console.log('Saved "%s" to pdf.', fullTitle);

    await browser.close();
})();
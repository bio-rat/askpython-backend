const puppeteer = require('puppeteer');

const getAnswer = async(question) => {
  console.log('==>' + question)
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://stackoverflow.com/search?q=%5Bpython%5D+${question}`);
  await page.$eval('a.question-hyperlink', e => e.click());
  await page.waitForSelector('div.answercell.post-layout--right>div.s-prose.js-post-body');

  const answer = await page.$eval('div.answercell.post-layout--right>div.s-prose.js-post-body', e => e.innerHTML);

  await browser.close();

  return answer
}

module.exports = { getAnswer };
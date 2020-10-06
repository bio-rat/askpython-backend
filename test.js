const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // await page.setViewport({width: 1920, height: 1080})
  await page.goto(`https://stackoverflow.com/search?q=%5Bpython%5D+${'import'}`);
  await page.$eval('a.question-hyperlink', e => e.click());
  const answer = await page.$eval('div.s-prose.js-post-body', e => e.innerHTML);

  console.log(answer)
  // const a = await page.evaluate(() => {
  //   // const allTitles = document.querySelectorAll("a.question-hyperlink", {
  //   //   waitUntil: "networkidle2",
  //   // });
  //   // return Array.from(allTitles)
  //   //   .slice(0, 10)
  //   //   .map((title) => {
  //   //     let res = {
  //   //       title: title.textContent,
  //   //       link: title["href"],
  //   //     };

  //   //     return res;
  //   //   });

  //   const link = document.querySelector("a.question-hyperlink", {
  //     waitUntil: "networkidle2",
  //   });
  //   return link['href']
  // });

  // await page.screenshot({path: 'example.png'});

  await browser.close();
  return answer
})();

const {Builder, Browser, By, Key, until} = require('selenium-webdriver');

const NPB_OFFICIAL_URL = 'https://npb.jp/';
const NPB_OFFICIAL_TITLE = 'NPB.jp 日本野球機構';

(async function example() {
  let driver = await new Builder().forBrowser(Browser.SAFARI).build();
  try {
    await driver.get(NPB_OFFICIAL_URL);
    await driver.wait(until.titleIs(NPB_OFFICIAL_TITLE), 3000);
  } finally {
    await driver.quit();
  }
})();

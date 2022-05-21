const {Builder, Browser, By, Key, until} = require('selenium-webdriver');

const NPB_OFFICIAL_URL = 'https://npb.jp/';
const NPB_OFFICIAL_TITLE = 'NPB.jp 日本野球機構';

/**
 * Safari 用の driver をセットアップする
 * @param {*} driver
 * @returns {*}
 */
async function setupDriverForSafari() {
  const driver = await new Builder().forBrowser(Browser.SAFARI).build();
  return driver;
}

/**
 * NPB 公式サイトへアクセスする
 * @param {*} driver
 */
async function accessNPBOfficialSite(driver) {
  await driver.get(NPB_OFFICIAL_URL);
}

/**
 * タイトルがロードされるまで待機
 * @param {*} driver
 */
async function waitUntilTitleLoaded(driver) {
  await driver.wait(until.titleIs(NPB_OFFICIAL_TITLE), 3000);
}

/**
 * スクレイピングの終了
 * @param {*} driver
 */
async function finishScraping(driver) {
  await driver.quit();
}

(async function main() {
  let driver = await setupDriverForSafari();
  try {
    await accessNPBOfficialSite(driver);
    await waitUntilTitleLoaded(driver);
  } finally {
    await finishScraping(driver);
  }
})();

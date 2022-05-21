import { Builder, Browser, By, until, WebDriver, WebElement } from "selenium-webdriver";

const NPB_OFFICIAL_URL = 'https://npb.jp/';
const NPB_OFFICIAL_TITLE = 'NPB.jp 日本野球機構';
const SCORE_WRAPPER_CLASS_NAME = 'score_wrap';
const GAME_ELEMENT_CLASS_NAME = 'score_box';
const LEFT_TEAM_IMG_CLASS_NAME = 'logo_left';
const RIGHT_TEAM_IMG_CLASS_NAME = 'logo_right';

/**
 * Safari 用の driver をセットアップする
 * @returns {Promise<WebDriver>}
 */
async function setupDriverForSafari(): Promise<WebDriver> {
  const driver = await new Builder().forBrowser(Browser.SAFARI).build();
  return driver;
}

/**
 * NPB 公式サイトへアクセスする
 * @param {WebDriver} driver
 * @returns {Promise<void>}
 */
async function accessNPBOfficialSite(driver: WebDriver): Promise<void> {
  await driver.get(NPB_OFFICIAL_URL);
}

/**
 * タイトルがロードされるまで待機
 * @param {WebDriver} driver
 * @returns {Promise<void>}
 */
async function waitUntilTitleLoaded(driver: WebDriver): Promise<void> {
  await driver.wait(until.titleIs(NPB_OFFICIAL_TITLE), 3000);
}

/**
 * 試合一覧のラッパー要素の取得
 * @param {WebDriver} driver
 * @return {Promise<WebElement>}
 */
async function getScoreContainer(driver: WebDriver): Promise<WebElement> {
  const scoreContainer = await driver.findElement(By.className(SCORE_WRAPPER_CLASS_NAME));
  return scoreContainer;
}

/**
 * 試合要素の取得
 * @param {WebElement} scoreContainer
 * @returns {Promise<WebElement[]>}
 */
async function getGameElements(scoreContainer: WebElement): Promise<WebElement[]> {
  const gameElements = await scoreContainer.findElements(By.className(GAME_ELEMENT_CLASS_NAME));
  return gameElements;
}

/**
 * 左側のチーム名取得
 * @param {WebElement} gameElement
 * @returns {Promise<string>}
 */
async function getLeftTeamName(gameElement: WebElement): Promise<string> {
  try {
    const leftTeamLogoImg = await gameElement.findElement(By.className(LEFT_TEAM_IMG_CLASS_NAME));
    const leftTeamName = await leftTeamLogoImg.getAttribute('title');
    return leftTeamName;
  } catch (error) {
    // console.log('unnecessary div');
    // console.log(error);
    return '';
  }
}

/**
 * 右側のチーム名取得
 * @param {WebElement} gameElement
 * @returns {Promise<string>}
 */
async function getRightTeamName(gameElement: WebElement): Promise<string> {
  try {
    const rightTeamLogoImg = await gameElement.findElement(By.className(RIGHT_TEAM_IMG_CLASS_NAME));
    const rightTeamName = await rightTeamLogoImg.getAttribute('title');
    return rightTeamName;
  } catch (error) {
    // console.log('unnecessary div');
    // console.log(error);
    return '';
  }
}

/**
 * 試合内容の出力
 * @param {string} leftTeamName
 * @param {string} rightTeamName
 * @returns {Promise<void>}
 */
async function printGameInfo(leftTeamName: string, rightTeamName: string): Promise<void> {
  if (leftTeamName && rightTeamName) {
    console.log(`${leftTeamName} vs ${rightTeamName}`);
  }
}

/**
 * 結果の出力
 * @param {WebElement[]} gameElements
 * @returns {Promise<void>}
 */
async function printResult(gameElements: WebElement[]): Promise<void> {
  for (let i = 0; i < gameElements.length; i++) {
    const gameElement = gameElements[i];
    const leftTeamName = await getLeftTeamName(gameElement);
    const rightTeamName = await getRightTeamName(gameElement);
    printGameInfo(leftTeamName, rightTeamName);
  }
}

/**
 * スクレイピングの終了
 * @param {WebDriver} driver
 * @returns {Promise<void>}
 */
async function finishScraping(driver: WebDriver): Promise<void> {
  await driver.quit();
}

/**
 * メイン関数
 */
async function main() {
  let driver = await setupDriverForSafari();
  try {
    await accessNPBOfficialSite(driver);
    await waitUntilTitleLoaded(driver);
    const scoreContainer = await getScoreContainer(driver);
    const gameElements = await getGameElements(scoreContainer);
    await printResult(gameElements);
  } catch (error) {
    console.log(error);
  } finally {
    await finishScraping(driver);
  }
}

(async () => {
  await main();
})();

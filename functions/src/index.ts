import * as functions from "firebase-functions";
import * as puppeteer from "puppeteer";
import {Page, ElementHandle} from "puppeteer";

const NPB_OFFICIAL_URL = "https://npb.jp/";
const GAME_ELEMENT_WRAPPER_SELECTOR = ".score_box";

/**
 * NPB 公式サイトへアクセスする
 * @return {Promise<Page>}
 */
async function accessNPBOfficialSite(): Promise<Page> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(NPB_OFFICIAL_URL);
  return page;
}

/**
 * 試合要素のラッパー一覧取得
 * @param {Page} page
 * @return {Promise<ElementHandle<Element>[] | null>}
 */
async function getGameWrapperElements(page: Page): Promise<ElementHandle<Element>[] | null> {
  const gameWrapperElements = await page.$$(GAME_ELEMENT_WRAPPER_SELECTOR);
  if (gameWrapperElements && gameWrapperElements.length > 0) {
    return gameWrapperElements;
  }
  return null;
}

/**
 * 画像のラッパー要素を取得
 * @param {ElementHandle<Element>} gameWrapperElement
 * @return {Promise<ElementHandle<Element> | null>}
 */
async function getImageWrapperElement(
    gameWrapperElement: ElementHandle<Element>
): Promise<ElementHandle<Element> | null> {
  const linkElements = await gameWrapperElement.$$("a");
  if (linkElements && linkElements.length > 0) {
    const linkElement = linkElements[0];
    const divElements = await linkElement.$$("div");
    if (divElements && divElements.length > 0) {
      const targetWrapper = divElements[0];
      return targetWrapper;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

/**
 * 2枚の画像取得
 * @param {ElementHandle<Element>} imageWrapperElement
 * @return {Promise<ElementHandle<Element>[] | null>}
 */
async function getTeamImages(imageWrapperElement: ElementHandle<Element>): Promise<ElementHandle<Element>[] | null> {
  const images = await imageWrapperElement.$$("img");
  if (images && images.length > 0) {
    return images;
  }
  return null;
}

/**
 * 2つのチーム名取得
 * @param {ElementHandle<Element>} imageWrapperElement
 * @return {Promise<string[]>}
 */
async function getTeamNames(imageWrapperElement: ElementHandle<Element>): Promise<string[]> {
  try {
    const images = await getTeamImages(imageWrapperElement);
    if (images) {
      const leftTeamName: string = await (await images[0].getProperty("title")).jsonValue();
      const rightTeamName: string = await (await images[1].getProperty("title")).jsonValue();
      return [leftTeamName, rightTeamName];
    }
  } catch (error) {
    // console.log('unnecessary div');
    // console.log(error);
  }
  return [];
}

/**
 * 試合内容の出力
 * @param {string} leftTeamName
 * @param {string} rightTeamName
 * @return {Promise<string>}
 */
async function printGameInfo(leftTeamName: string, rightTeamName: string): Promise<string> {
  if (leftTeamName && rightTeamName) {
    const gameInfo = `${leftTeamName} vs ${rightTeamName}`;
    console.log(gameInfo);
    return gameInfo;
  }
  return "";
}

/**
 * 結果の出力
 * @param {ElementHandle<Element>} imageWrapperElement
 * @return {Promise<string>}
 */
async function printResult(imageWrapperElement: ElementHandle<Element>): Promise<string> {
  const [leftTeamName, rightTeamName] = await getTeamNames(imageWrapperElement);
  const gameInfo = printGameInfo(leftTeamName, rightTeamName);
  return gameInfo;
}

/**
 * スクレイピングの終了
 * @param {Page} page
 * @return {Promise<void>}
 */
async function finishScraping(page: Page): Promise<void> {
  await page.close();
}

/**
 * メイン関数
 */
async function main() {
  let result = "";
  const page = await accessNPBOfficialSite();
  try {
    const gameWrapperElements = await getGameWrapperElements(page);
    if (gameWrapperElements) {
      for (const wrapperElement of gameWrapperElements) {
        const imageWrapperElement = await getImageWrapperElement(wrapperElement);
        if (imageWrapperElement) {
          const gameInfo = await printResult(imageWrapperElement);
          result += `\n${gameInfo}`;
        }
      }
    }
    return result;
  } catch (error) {
    console.log(error);
    return result;
  } finally {
    await finishScraping(page);
  }
}

export const scrapingNPB = functions.https.onRequest(async (request, response) => {
  const result = await main();
  response.send(result);
});

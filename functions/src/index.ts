import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as puppeteer from "puppeteer";
import {Page, ElementHandle} from "puppeteer";
import {GameInfo, ParsedScoreInfo, ResultType} from "./types";
import { applicationDefault } from "firebase-admin/app";

const NPB_OFFICIAL_URL = "https://npb.jp/";
const DATE_ELEMENT_WRAPPER_SELECTOR = ".date";
const GAME_ELEMENT_WRAPPER_SELECTOR = ".score_box";
const SCORE_ELEMENT_SELECTOR = ".score";
const STATE_ELEMENT_SELECTOR = ".state";
const FUNCTION_REGION = "asia-northeast1";

admin.initializeApp({
  credential: applicationDefault()
});

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
 * 日付要素のラッパー取得
 * @param {Page} page
 * @return {Promise<ElementHandle<Element> | null>}
 */
async function getDateWrapperElement(page: Page): Promise<ElementHandle<Element> | null> {
  const dateWrapperElements = await page.$$(DATE_ELEMENT_WRAPPER_SELECTOR);
  if (dateWrapperElements && dateWrapperElements.length > 0) {
    return dateWrapperElements[0];
  }
  return null;
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
 * 日付情報の取得
 * @param {ElementHandle<Element>} dateWrapperElement
 * @return {Promise<string>}
 */
async function getDateInfo(dateWrapperElement: ElementHandle<Element>): Promise<string> {
  const divElements = await dateWrapperElement.$$("div");
  if (divElements && divElements.length > 0) {
    console.log("found date element");
    const targetElement = await divElements[0].asElement();
    const dateInfo = await (await targetElement?.getProperty("innerText"))?.jsonValue();
    return `${dateInfo}`.replace("\n", " ");
  }
  return "";
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
 * スコア情報の取得
 * @param {ElementHandle<Element>} imageWrapperElement
 * @return {Promise<string>}
 */
async function getScoreInfo(imageWrapperElement: ElementHandle<Element>): Promise<string> {
  const scoreElement = await imageWrapperElement.$(SCORE_ELEMENT_SELECTOR);
  if (scoreElement) {
    const scoreInfo = await (await scoreElement.getProperty("innerText"))?.jsonValue();
    return `${scoreInfo}`;
  }
  return "";
}

/**
 * 詳細情報の取得
 * @param {ElementHandle<Element>} imageWrapperElement
 * @return {Promise<string>}
 */
async function getStateInfo(imageWrapperElement: ElementHandle<Element>): Promise<string> {
  const stateElement = await imageWrapperElement.$(STATE_ELEMENT_SELECTOR);
  if (stateElement) {
    const stateInfo = await (await stateElement.getProperty("innerText"))?.jsonValue();
    return `${stateInfo}`;
  }
  return "";
}

/**
 * スコアの解析
 * @param {string} scoreInfo
 * @return {ParsedScoreInfo}
 */
function parseScoreInfo(scoreInfo: string): ParsedScoreInfo {
  const scoreSplitted = scoreInfo.split("-");
  const leftTeamScore = scoreSplitted[0];
  const rightTeamScore = scoreSplitted[1];
  const parsedScoreInfo: ParsedScoreInfo = {
    leftTeamScore,
    rightTeamScore,
  };
  return parsedScoreInfo;
}

/**
 * 結果の出力
 * @param {ElementHandle<Element>} imageWrapperElement
 * @return {Promise<GameInfo>}
 */
async function getGameInfo(imageWrapperElement: ElementHandle<Element>): Promise<GameInfo> {
  const [leftTeamName, rightTeamName] = await getTeamNames(imageWrapperElement);
  const scoreInfo = await getScoreInfo(imageWrapperElement);
  const {leftTeamScore, rightTeamScore} = await parseScoreInfo(scoreInfo);
  const gameStateInfo = await getStateInfo(imageWrapperElement);
  const gameInfo: GameInfo = {
    leftTeamName,
    rightTeamName,
    leftTeamScore,
    rightTeamScore,
    gameStateInfo,
  };
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
  const result: ResultType = {
    dateInfo: "",
    gameInfoList: [],
  };
  const page = await accessNPBOfficialSite();
  try {
    const dateWrapperElement = await getDateWrapperElement(page);
    if (dateWrapperElement) {
      const dateInfo = await getDateInfo(dateWrapperElement);
      if (dateInfo) {
        result.dateInfo = dateInfo;
      }
    }

    const gameWrapperElements = await getGameWrapperElements(page);
    if (gameWrapperElements) {
      for (const wrapperElement of gameWrapperElements) {
        const imageWrapperElement = await getImageWrapperElement(wrapperElement);
        if (imageWrapperElement) {
          const gameInfo = await getGameInfo(imageWrapperElement);
          result.gameInfoList.push(gameInfo);
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

const verifyFirebaseToken = async (authorizationHeader: string | undefined) => {
  if (!authorizationHeader) {
    console.error("not authorized");
    throw new Error("not authorized");
  }
  try {
    const token = authorizationHeader.split(" ")[1];
    await admin.auth().verifyIdToken(token);
  } catch (e) {
    console.error("not authorized");
    throw new Error("not authorized");
  }
  return;
};

export const scrapingNPB = functions.region(FUNCTION_REGION)
    .runWith({
      // Ensure the function has enough memory and time
      // to process large files
      timeoutSeconds: 60,
      memory: "512MB",
      minInstances: 0,
      maxInstances: 1,
    })
    .https.onRequest(async (req, res) => {
      const headers = req.headers;
      const authorizationHeader = headers.authorization;
      verifyFirebaseToken(authorizationHeader);
      const result = await main();
      res.send(result);
    });

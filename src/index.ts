import puppeteer, {Page, ElementHandle, JSHandle} from "puppeteer";

const NPB_OFFICIAL_URL = 'https://npb.jp/';
const GAME_ELEMENT_WRAPPER_SELECTOR = '.score_box';

/**
 * NPB 公式サイトへアクセスする
 * @returns {Promise<Page>}
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
 * @returns {Promise<ElementHandle<Element>[] | null>}
 */
async function getGameWrapperElements(page: Page): Promise<ElementHandle<Element>[] | null> {
  const gameWrapperElements = await page.$$(GAME_ELEMENT_WRAPPER_SELECTOR);
  if (gameWrapperElements && gameWrapperElements.length > 0) {
    return gameWrapperElements;
  }
  return null;
}

/**
 * 試合要素の取得
 * @param {ElementHandle<Element>} gameWrapperElement
 * @returns {Promise<ElementHandle<Element>>}
 */
async function getGameElement(gameWrapperElement: ElementHandle<Element>): Promise<ElementHandle<Element>> {
  const children = [];
  const properties = await gameWrapperElement.getProperties();
  for (let property of properties.values()) {
    const element = property.asElement();
    if (element) {
      children.push(element);
    }
  }
  return children[0];
}

/**
 * 画像のラッパー要素を取得
 * @param {ElementHandle<Element>} gameWrapperElement
 * @returns {Promise<ElementHandle<Element> | null>}
 */
async function getImageWrapperElement(gameWrapperElement: ElementHandle<Element>): Promise<ElementHandle<Element> | null> {
  const linkElements = await gameWrapperElement.$$('a');
  if (linkElements && linkElements.length > 0) {
    const linkElement = linkElements[0];
    const divElements = await linkElement.$$('div');
    if (divElements && divElements.length > 0) {
      const targetWrapper = divElements[0];
      return targetWrapper
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
 * @returns {Promise<ElementHandle<Element>[] | null>}
 */
async function getTeamImages(imageWrapperElement: ElementHandle<Element>): Promise<ElementHandle<Element>[] | null> {
  const images = await imageWrapperElement.$$('img');
  if (images && images.length > 0) {
    return images;
  }
  return null
}

/**
 * 2つのチーム名取得
 * @param {ElementHandle<Element>} imageWrapperElement
 * @returns {Promise<string[]>}
 */
async function getTeamNames(imageWrapperElement: ElementHandle<Element>): Promise<string[]> {
  try {
    const images = await getTeamImages(imageWrapperElement);
    if (images) {
      const leftTeamName: string = await (await images[0].getProperty('title')).jsonValue();
      const rightTeamName: string = await (await images[1].getProperty('title')).jsonValue();
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
 * @returns {Promise<void>}
 */
async function printGameInfo(leftTeamName: string, rightTeamName: string): Promise<void> {
  if (leftTeamName && rightTeamName) {
    console.log(`${leftTeamName} vs ${rightTeamName}`);
  }
}

/**
 * 結果の出力
 * @param {ElementHandle<Element>} imageWrapperElement
 * @returns {Promise<void>}
 */
async function printResult(imageWrapperElement: ElementHandle<Element>): Promise<void> {
  const [leftTeamName, rightTeamName] = await getTeamNames(imageWrapperElement);
  printGameInfo(leftTeamName, rightTeamName);
}

/**
 * スクレイピングの終了
 * @param {Page} page
 * @returns {Promise<void>}
 */
async function finishScraping(page: Page): Promise<void> {
  await page.close();
}

/**
 * メイン関数
 */
async function main() {
  const page = await accessNPBOfficialSite();
  try {
    const gameWrapperElements = await getGameWrapperElements(page);
    if (gameWrapperElements) {
      for (let wrapperElement of gameWrapperElements) {
        const imageWrapperElement = await getImageWrapperElement(wrapperElement);
        if (imageWrapperElement) {
          await printResult(imageWrapperElement);
        }
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    await finishScraping(page);
  }
}

(async () => {
  await main();
  process.exit(0);
})();

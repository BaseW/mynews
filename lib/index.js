"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const NPB_OFFICIAL_URL = 'https://npb.jp/';
const GAME_ELEMENT_WRAPPER_SELECTOR = '.score_box';
/**
 * NPB 公式サイトへアクセスする
 * @returns {Promise<Page>}
 */
function accessNPBOfficialSite() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        yield page.goto(NPB_OFFICIAL_URL);
        return page;
    });
}
/**
 * 試合要素のラッパー一覧取得
 * @param {Page} page
 * @returns {Promise<ElementHandle<Element>[] | null>}
 */
function getGameWrapperElements(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const gameWrapperElements = yield page.$$(GAME_ELEMENT_WRAPPER_SELECTOR);
        if (gameWrapperElements && gameWrapperElements.length > 0) {
            return gameWrapperElements;
        }
        return null;
    });
}
/**
 * 試合要素の取得
 * @param {ElementHandle<Element>} gameWrapperElement
 * @returns {Promise<ElementHandle<Element>>}
 */
function getGameElement(gameWrapperElement) {
    return __awaiter(this, void 0, void 0, function* () {
        const children = [];
        const properties = yield gameWrapperElement.getProperties();
        for (let property of properties.values()) {
            const element = property.asElement();
            if (element) {
                children.push(element);
            }
        }
        return children[0];
    });
}
/**
 * 画像のラッパー要素を取得
 * @param {ElementHandle<Element>} gameWrapperElement
 * @returns {Promise<ElementHandle<Element> | null>}
 */
function getImageWrapperElement(gameWrapperElement) {
    return __awaiter(this, void 0, void 0, function* () {
        const linkElements = yield gameWrapperElement.$$('a');
        if (linkElements && linkElements.length > 0) {
            const linkElement = linkElements[0];
            const divElements = yield linkElement.$$('div');
            if (divElements && divElements.length > 0) {
                const targetWrapper = divElements[0];
                return targetWrapper;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    });
}
/**
 * 2枚の画像取得
 * @param {ElementHandle<Element>} imageWrapperElement
 * @returns {Promise<ElementHandle<Element>[] | null>}
 */
function getTeamImages(imageWrapperElement) {
    return __awaiter(this, void 0, void 0, function* () {
        const images = yield imageWrapperElement.$$('img');
        if (images && images.length > 0) {
            return images;
        }
        return null;
    });
}
/**
 * 2つのチーム名取得
 * @param {ElementHandle<Element>} imageWrapperElement
 * @returns {Promise<string[]>}
 */
function getTeamNames(imageWrapperElement) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const images = yield getTeamImages(imageWrapperElement);
            if (images) {
                const leftTeamName = yield (yield images[0].getProperty('title')).jsonValue();
                const rightTeamName = yield (yield images[1].getProperty('title')).jsonValue();
                return [leftTeamName, rightTeamName];
            }
        }
        catch (error) {
            // console.log('unnecessary div');
            // console.log(error);
        }
        return [];
    });
}
/**
 * 試合内容の出力
 * @param {string} leftTeamName
 * @param {string} rightTeamName
 * @returns {Promise<void>}
 */
function printGameInfo(leftTeamName, rightTeamName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (leftTeamName && rightTeamName) {
            console.log(`${leftTeamName} vs ${rightTeamName}`);
        }
    });
}
/**
 * 結果の出力
 * @param {ElementHandle<Element>} imageWrapperElement
 * @returns {Promise<void>}
 */
function printResult(imageWrapperElement) {
    return __awaiter(this, void 0, void 0, function* () {
        const [leftTeamName, rightTeamName] = yield getTeamNames(imageWrapperElement);
        printGameInfo(leftTeamName, rightTeamName);
    });
}
/**
 * スクレイピングの終了
 * @param {Page} page
 * @returns {Promise<void>}
 */
function finishScraping(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.close();
    });
}
/**
 * メイン関数
 */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield accessNPBOfficialSite();
        try {
            const gameWrapperElements = yield getGameWrapperElements(page);
            if (gameWrapperElements) {
                for (let wrapperElement of gameWrapperElements) {
                    const imageWrapperElement = yield getImageWrapperElement(wrapperElement);
                    if (imageWrapperElement) {
                        yield printResult(imageWrapperElement);
                    }
                }
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            yield finishScraping(page);
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield main();
    process.exit(0);
}))();

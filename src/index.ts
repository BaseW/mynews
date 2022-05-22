import axios, { AxiosRequestConfig } from "axios";

const FIREBASE_FUNCTIONS_URL = "https://asia-northeast1-quickstart-1587635856027.cloudfunctions.net/scrapingNPB"

/**
 * メイン関数
 */
async function main() {
  try {
    const options: AxiosRequestConfig = {
      url: FIREBASE_FUNCTIONS_URL,
      method: 'GET',
    }
    const result = await axios(options);
    console.log(result.data);
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  await main();
})();

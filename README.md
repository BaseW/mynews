# mynews

最近チェックしたいものを通知してくれるもの
ex. プロ野球の結果など

## プロトタイプ

毎日17時にその日にある試合の一覧を通知する。

## 環境構築

#### Webdriver
Mac で Safari の Webdriver を使えるようにするためには、
以下を実行する必要がある。

```shell
$ safaridriver --enable
```

[参考](https://developer.apple.com/documentation/webkit/testing_with_webdriver_in_safari)

#### clasp

ローカルで GAS の開発を行うためのツールである clasp をインストールするためには以下のコマンド実行が必要。

```shell
$ npm install -g @google/clasp
```

その後、[このリンク](https://script.google.com/home/usersettings)から API を有効化する必要がある。

以下のコマンドを実行して Google アカウントにログインできる。

```shell
$ clasp login
```

ログイン後、以下でプロジェクトを作成した。

```shell
$ clasp create --title "My News" --type standalone
```

プロジェクトの設定は `.clasp.json` に反映される。

以下でコードを GAS に反映できる。

```shell
$ clasp push
```

反映したくないものは `.claspignore` へ追加する。

[参考](https://github.com/google/clasp)

#### gcloud CLI

[ここ](https://cloud.google.com/sdk/docs/install-sdk?hl=ja)から gcloud CLI をダウンロードし、初期化する

```shell
$ gcloud init
```

`.gcloudignore` でデプロイしないファイルを指定

以下でデプロイ

```shell
$ gcloud functions deploy scrapingNPB --runtime=nodejs16 \
  --trigger-http --region=asia-northeast1 \
  --entry-point=lib/index.js
```


#### Firebase CLI

[ここ](https://firebase.google.com/docs/cli)から CLI をインストール

インストール後、以下でログイン

```shell
$ firebase login
```

以下で初期化

```shell
$ firebase init
```

CI で使うためには以下のコマンドでトークンを生成する必要がある

```shell
$ firebase login:ci
```

[CI で CLI を使う](https://firebase.google.com/docs/cli#cli-ci-systems)

一旦このトークンはリポジトリの Secret に設定してある。

## 開発環境

Node.js v16.13.2

## 技術スタック

- Node.js
- Selenium
- TypeScript
- GAS
- clasp
- Cloud Functions

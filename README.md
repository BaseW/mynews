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

## 開発環境

Node.js v16.13.2

## 技術スタック

- Node.js
- Selenium
- TypeScript
- GAS
- clasp

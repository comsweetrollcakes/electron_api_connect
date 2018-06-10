"use strct";

// Electronのモジュール
const electron = require("electron");
const ipcMain = require("electron").ipcMain;
const net = require('electron').net;

// アプリケーションをコントロールするモジュール
const app = electron.app;

// ウィンドウを作成するモジュール
const BrowserWindow = electron.BrowserWindow;

// メインウィンドウはGCされないようにグローバル宣言
let mainWindow = null;

var request;

// 全てのウィンドウが閉じたら終了
app.on("window-all-closed", () => {
  if (process.platform != "darwin") {
    app.quit();
  }
});

// Electronの初期化完了後に実行
app.on("ready", () => {
  //ウィンドウサイズを1280*720（フレームサイズを含まない）に設定する
  mainWindow = new BrowserWindow({ width: 1280, height: 720, useContentSize: true });

  //使用するhtmlファイルを指定する
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // ウィンドウが閉じられたらアプリも終了
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // 非同期
  ipcMain.on('request_message', function (event, arg) {

    console.log(arg);

    // イベント処理ごとに分岐
    if (arg.request_type == 'need_http_request') {

      //var param = 'rosenid=' + arg.params;
      var param = 'zipcode=' + arg.params;
//      request_url = 'http://tutujibus.com/busstopLookup.php?' + param;
      request_url = 'http://zipcloud.ibsnet.co.jp/api/search?' + param;
      request = net.request(request_url);

      request.on('response', (response) => {
        response.on('data', (chunk) => {
          let body = '';
          body += chunk;
          event.sender.send('response_message', body);  // 送信元へレスポンスを返す
        });
        response.on('end', () => {
          console.log('もう応答にデータはないよ。');
        });
      });
      request.end();
    }
  });
});


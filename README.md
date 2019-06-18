# MindMapToToDo

# 前提条件
 golangの開発環境が出来上がっていること
 nodeが入っていること


 # 準備

## gorillaを使用するため、go getしておく  
参考：https://github.com/gorilla/mux
 ```
$ go get -u github.com/gorilla/mux
$ go get -u github.com/gorilla/context
 ```

 ## reactに必要なpackageを入れるため、/clientでnpm installしておく
 ```
cd client
npm install
npm run build
 ```

 # 利用方法
 ルートで次のコマンドを実行
 ```
go run server/main.go
 ```

 ブラウザで次のページにアクセス
 localhost:8000

 画面が表示されれば環境準備OK

 # 更新の反映方法
 サーバーサイドの変更のみならgo runでよい
 フロントを変更したら、必ずnpm run buildしてからサーバーを起動する
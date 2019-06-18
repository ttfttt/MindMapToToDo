package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	// ファイルサーバーのpathを設定
	buildHandler := http.FileServer(http.Dir("client/build"))
	r.Handle("/", buildHandler)
	staticHandler := http.StripPrefix("/static/", http.FileServer(http.Dir("client/build/static")))
	r.PathPrefix("/static/").Handler(staticHandler)

	// エンドポイントの設定
	r.HandleFunc("/api/{user}/todo", todoHandler)

	// サーバ設定
	srv := &http.Server{
		Handler:      r,
		Addr:         "127.0.0.1:8000",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	// 起動
	log.Fatal(srv.ListenAndServe())
}

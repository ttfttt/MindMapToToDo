package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

func sampleHandler1(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "hello sample")
}

func main() {
	// ルーティング設定
	r := mux.NewRouter()
	buildHandler := http.FileServer(http.Dir("client/build"))
	r.PathPrefix("/").Handler(buildHandler)
	staticHandler := http.StripPrefix("/static/", http.FileServer(http.Dir("client/build/static")))
	r.PathPrefix("/static/").Handler(staticHandler)

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

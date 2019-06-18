package main

import (
	"net/http"

	"github.com/gorilla/mux"
)

func authHandler(w http.ResponseWriter, r *http.Request) {
	return
}

func todoHandler(w http.ResponseWriter, r *http.Request) {
	// A very simple health check.
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	vars := mux.Vars(r)
	w.Write([]byte(vars["user"] + "\n"))
	return
}

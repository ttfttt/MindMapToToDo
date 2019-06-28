package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

type ping struct {
	Timestamp string `json:"timestamp"`
	Message   string `json:"message"`
}

func pingHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	pingBody, _ := json.Marshal(ping{Timestamp: time.Now().String(), Message: "pong!!!!"})
	w.Write(pingBody)
	return
}

func todoListHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	switch r.Method {
	case "GET": //取得
		list, err := ReadTodoList()
		if err != nil {
			return
		}
		listByte, err := json.Marshal(list)
		if err != nil {
			return
		}
		w.Write(listByte)
		return
	default:
		// Error
		w.WriteHeader(http.StatusBadRequest)
		return
	}
}

func todoHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET": //取得
		id := mux.Vars(r)["id"]
		todo, err := ReadTodo(id)
		if err != nil {
			return
		}
		todoByte, err := json.Marshal(todo)
		if err != nil {
			return
		}
		w.Write(todoByte)
		return
	case "POST": //作成
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			return
		}
		todo := Todo{}
		err = json.Unmarshal(body, &todo)
		if err != nil {
			return
		}
		count, err := AddTodo(todo.Title, todo.Detail, todo.Priority)
		if err != nil {
			fmt.Println(count)
			return
		}
		w.WriteHeader(http.StatusCreated)
		return
	case "PUT": //更新
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			return
		}
		todo := Todo{}
		err = json.Unmarshal(body, &todo)
		if err != nil {
			return
		}
		count, err := UpdateTodo(todo.ID, todo.Title, todo.Detail, todo.Priority)
		if err != nil {
			fmt.Println(count)
			return
		}
		return
	case "DELETE": //削除
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			return
		}
		todo := Todo{}
		err = json.Unmarshal(body, &todo)
		if err != nil {
			return
		}
		id, err := DeleteTodo(todo.ID)
		if err != nil {
			fmt.Println(id)
			return
		}
		return
	default:
		// Error
		w.WriteHeader(http.StatusBadRequest)
		return
	}
}

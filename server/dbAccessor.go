package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"

	_ "github.com/denisenkom/go-mssqldb"
)

var db *sql.DB

//Todo is typeof todo colum
type Todo struct {
	ID       int64  `json:"id,omitempty"`
	Title    string `json:"title"`
	Detail   string `json:"detail"`
	Priority int64  `json:"priority"`
}

func connectSQL() {
	var server = os.Getenv("SERVER")
	var port = os.Getenv("PORT")
	var user = os.Getenv("USER")
	var password = os.Getenv("PASSWORD")
	var database = os.Getenv("DATABASE")
	// Build connection string
	connString := fmt.Sprintf("server=%s;user id=%s;password=%s;port=%s;database=%s;",
		server, user, password, port, database)

	var err error

	// Create connection pool
	db, err = sql.Open("sqlserver", connString)
	if err != nil {
		log.Fatal("Error creating connection pool: ", err.Error())
	}
	ctx := context.Background()
	err = db.PingContext(ctx)
	if err != nil {
		log.Fatal(err.Error())
	}
	fmt.Printf("Connected!\n")
}

//AddTodo is to add new todo
func AddTodo(title string, detail string, priority int64) (int64, error) {
	connectSQL()
	ctx := context.Background()
	var err error

	if db == nil {
		err = errors.New("CreateEmployee: db is null")
		return -1, err
	}

	// Check if database is alive.
	err = db.PingContext(ctx)
	if err != nil {
		return -1, err
	}

	tsql := "INSERT INTO Remind.Todo (Title, Detail, Priority) VALUES (@Title, @Detail, @Priority); select convert(bigint, SCOPE_IDENTITY());"

	stmt, err := db.Prepare(tsql)
	if err != nil {
		return -1, err
	}
	defer stmt.Close()

	row := stmt.QueryRowContext(
		ctx,
		sql.Named("Title", title),
		sql.Named("Detail", detail),
		sql.Named("Priority", priority),
	)
	var newID int64
	err = row.Scan(&newID)
	if err != nil {
		return -1, err
	}

	return newID, nil
}

//ReadTodoList is to read todolist
func ReadTodoList() ([]Todo, error) {
	connectSQL()
	ctx := context.Background()
	todoList := []Todo{}

	// Check if database is alive.
	err := db.PingContext(ctx)
	if err != nil {
		return todoList, err
	}

	tsql := fmt.Sprintf("SELECT Id, Title, Detail, Priority FROM Remind.Todo;")

	// Execute query
	rows, err := db.QueryContext(ctx, tsql)
	if err != nil {
		return todoList, err
	}

	defer rows.Close()

	// Iterate through the result set.
	for rows.Next() {
		var title, detail string
		var id, priority int64

		// Get values from row.
		err := rows.Scan(&id, &title, &detail, &priority)
		if err != nil {
			return todoList, err
		}
		todoList = append(todoList, Todo{ID: id, Title: title, Detail: detail, Priority: priority})
	}

	return todoList, nil
}

//ReadTodo is to read todo chosen by id
func ReadTodo(id string) (Todo, error) {
	connectSQL()
	ctx := context.Background()
	todo := Todo{}

	// Check if database is alive.
	err := db.PingContext(ctx)
	if err != nil {
		fmt.Println("PingContext error")
		return todo, err
	}

	tsql := fmt.Sprintf("SELECT Id, Title, Detail, Priority FROM Remind.Todo WHERE Id = @Id;")

	// Execute query
	rows, err := db.QueryContext(ctx, tsql, sql.Named("Id", id))
	if err != nil {
		fmt.Println("QueryContext error")
		return todo, err
	}

	defer rows.Close()
	var title, detail string
	var dbID, priority int64

	if rows.Next() {
		// Get values from row.
		err = rows.Scan(&dbID, &title, &detail, &priority)
		if err != nil {
			fmt.Println("Scan error")
			return todo, err
		}
	}
	return Todo{ID: dbID, Title: title, Detail: detail, Priority: priority}, nil
}

// UpdateTodo is to update todo title, detail, or priority
func UpdateTodo(id int64, title string, detail string, priority int64) (int64, error) {
	connectSQL()
	ctx := context.Background()

	// Check if database is alive.
	err := db.PingContext(ctx)
	if err != nil {
		return -1, err
	}

	tsql := fmt.Sprintf("UPDATE Remind.Todo SET Title = @Title, Detail = @Detail, Priority = @Priority WHERE Id = @Id")

	// Execute non-query with named parameters
	result, err := db.ExecContext(
		ctx,
		tsql,
		sql.Named("Id", id),
		sql.Named("Title", title),
		sql.Named("Detail", detail),
		sql.Named("Priority", priority),
	)
	if err != nil {
		return -1, err
	}

	return result.RowsAffected()
}

// DeleteTodo is to delete todo
func DeleteTodo(id int64) (int64, error) {
	connectSQL()
	ctx := context.Background()

	// Check if database is alive.
	err := db.PingContext(ctx)
	if err != nil {
		return -1, err
	}

	tsql := fmt.Sprintf("DELETE FROM Remind.Todo WHERE Id = @Id;")

	// Execute non-query with named parameters
	result, err := db.ExecContext(ctx, tsql, sql.Named("Id", id))
	if err != nil {
		return -1, err
	}

	return result.RowsAffected()
}

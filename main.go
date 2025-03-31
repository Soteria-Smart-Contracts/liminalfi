package main

import (
	"fmt"
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/index.html")
	})

	http.HandleFunc("/myTransactions", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/myTxs.html")
	})

	port := ":8080"
	fmt.Println("Servidor corriendo en http://localhost"+port, "o en htttp://192.168.18.17"+port)
	http.ListenAndServe(port, nil)
}

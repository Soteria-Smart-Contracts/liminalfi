package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/index.html")
	})

	http.HandleFunc("/allTransactions", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/allTxs.html")
	})

	http.HandleFunc("/myTransactions", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/myTxs.html")
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // por si estás corriendo local
	}
	fmt.Println("Servidor corriendo en http://localhost:"+port, "o en htttp://192.168.18.17:"+port)
	http.ListenAndServe(":"+port, nil)
}

package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"os"
)

//go:embed static/*
var staticFiles embed.FS

func main() {
	fsys, err := fs.Sub(staticFiles, "static")
	if err != nil {
		panic(err)
	}

	// Configurar el FileServer con el sub filesystem
	fileServer := http.FileServer(http.FS(fsys))
	http.Handle("/static/", http.StripPrefix("/static/", fileServer))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		data, err := staticFiles.ReadFile("static/index.html")
		if err != nil {
			http.Error(w, "index.html Not found", 500)
			return
		}
		w.Write(data)
	})

	http.HandleFunc("/bridge", func(w http.ResponseWriter, r *http.Request) {
		data, err := staticFiles.ReadFile("static/bridge.html")
		if err != nil {
			http.Error(w, "bridge.html Not found", 500)
			return
		}
		w.Write(data)
	})

	http.HandleFunc("/allTransactions", func(w http.ResponseWriter, r *http.Request) {
		data, err := staticFiles.ReadFile("static/allTxs.html")
		if err != nil {
			http.Error(w, "allTxs.html Not found", 500)
			return
		}
		w.Write(data)
	})

	http.HandleFunc("/myTransactions", func(w http.ResponseWriter, r *http.Request) {
		data, err := staticFiles.ReadFile("static/myTxs.html")
		if err != nil {
			http.Error(w, "myTxs.html Not found", 500)
			return
		}
		w.Write(data)
	})

	port := os.Getenv("PORT")

	if port == "" {
		port = "8080" // por si estás corriendo local
	}
	fmt.Println("Servidor corriendo en http://localhost:"+port, "o en http://192.168.18.17:"+port)
	http.ListenAndServe("0.0.0.0:"+port, nil)
}

package main

import (
	"encoding/json"
	"io/fs"
	"kikoeru"
	"net/http"

	"github.com/sirupsen/logrus"
	"github.com/skratchdot/open-golang/open"
)

var coefontReader kikoeru.NumberToVoiceConverter

func init() {
	coefontReader = kikoeru.NewCoefontReader()
}

func Read(number int) error {
	data, err := coefontReader.Read(number)
	if err != nil {
		return err
	}
	err = kikoeru.AsyncPlay(data)
	if err != nil {
		return err
	}
	return nil
}

type ReadRequest struct {
	Number int `json:"number"`
}

type ReadResponse struct {
	Message string `json:"message"`
}

func main() {

	http.HandleFunc("/api/read", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {

			w.Header().Set("Access-Control-Allow-Headers", "*")
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			return
		}

		req := ReadRequest{}
		err := json.NewDecoder(r.Body).Decode(&req)
		_ = r.Body.Close()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		err = Read(req.Number)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		w.Header().Set("Content-Type", "application/json")
		resp, _ := json.Marshal(ReadResponse{Message: "ok"})
		_, _ = w.Write(resp)
	})
	webapp, _ := fs.Sub(kikoeru.Webapp, "webapp/build")
	http.Handle("/", http.FileServer(http.FS(webapp)))
	go open.Run("http://localhost:1145")
	logrus.Fatal(http.ListenAndServe(":1145", nil))
}

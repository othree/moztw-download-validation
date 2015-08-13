package main

import (
	"fmt"
	"github.com/kardianos/osext"
	"github.com/vaughan0/go-ini"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"time"
)

func send(url string) string {
	response, err := http.Get(url)
	if err != nil {
		fmt.Printf("%s", err)
		return "{}"
	}
	defer response.Body.Close()
	contents, err := ioutil.ReadAll(response.Body)
	if err != nil {
		fmt.Printf("%s", err)
	}
	return string(contents)
}

func send_msg(api_key string, chat_id_str string, msg string) string {
	return send("https://api.telegram.org/bot" + api_key + "/sendMessage?chat_id=" + chat_id_str + "&text=" + url.QueryEscape(msg))
}

func main() {
	pwd, _ := osext.ExecutableFolder()

	config, err := ini.LoadFile(pwd + "/config.ini")
	if err != nil {
		panic("Config file not loaded.")
	}
	api_key, ok := config.Get("telegram", "token")
	if !ok {
		panic("Telegram API token not available.")
	}
	chat_id_str, ok := config.Get("telegram", "chat_id")
	if !ok {
		panic("Telegram Chat ID not available.")
	}

	os.Chdir(pwd)
	c := exec.Command("gulp", "test")
	c.CombinedOutput()
	if _, err := os.Stat(pwd + "/error-msg"); os.IsNotExist(err) {
		msg := time.Now().Format("[2006-01-02 15:04]") + " Installers Check OK"
		send_msg(api_key, chat_id_str, msg)
	} else {
		msg := time.Now().Format("[2006-01-02 15:04]") + " Installers Check Failure \u2757\ufe0f\u2757\ufe0f\u2757\ufe0f"
		send_msg(api_key, chat_id_str, msg)
	}
}

package main

import (
	"fmt"
	"kikoeru"

	"github.com/sirupsen/logrus"
)

func main() {
	fmt.Println("input a number [0, 1000000]")
	var i int
	_, err := fmt.Scanf("%d", &i)
	if err != nil || i < 0 || i > 1000000 {
		return
	}
	c := kikoeru.NewCoefontReader()
	data, err := c.Read(i)
	if err != nil {
		logrus.Fatal(err)
	}
	err = kikoeru.SyncPlay(data)
	if err != nil {
		logrus.Fatal(err)
	}
}

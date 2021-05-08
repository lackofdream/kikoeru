package main

import (
	"fmt"
	"kikoeru"
	"math/rand"

	"github.com/sirupsen/logrus"
)

func main() {
	target := rand.Int() % 1000000
	c := kikoeru.NewCoefontReader()
	data, err := c.Read(target)
	if err != nil {
		logrus.Fatal(err)
	}
	err = kikoeru.SyncPlay(data)
	if err != nil {
		logrus.Fatal(err)
	}
	var guess int
	_, err = fmt.Scanf("%d", &guess)
	if err != nil {
		logrus.Fatal(err)
	}
	if guess != target {
		fmt.Printf("wrong, answer is %d\n", target)
	} else {
		fmt.Println("ok")
	}
}

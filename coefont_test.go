package kikoeru

import (
	"testing"
)

func TestCoefontReader_Read(t *testing.T) {
	c := NewCoefontReader()
	res, err := c.Read(114514)
	if err != nil {
		t.Fatal(err)
	}
	err = SyncPlay(res)
	if err != nil {
		t.Fatal(err)
	}
}

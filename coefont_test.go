package kikoeru

import (
	"testing"
)

func TestCoefontReader_Read(t *testing.T) {
	c := NewCoefontReader()
	res, err := c.GetVoiceBytes(114514)
	if err != nil {
		t.Fatal(err)
	}
	err = AsyncPlay(res)
	if err != nil {
		t.Fatal(err)
	}
}

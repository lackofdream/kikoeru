package kikoeru

import (
	"bytes"
	"time"

	"github.com/faiface/beep"
	"github.com/faiface/beep/speaker"
	"github.com/faiface/beep/wav"
)

func SyncPlay(data []byte) error {
	streamer, format, err := wav.Decode(bytes.NewReader(data))
	if err != nil {
		return err
	}
	defer streamer.Close()
	speaker.Init(format.SampleRate, format.SampleRate.N(time.Second/10))

	done := make(chan bool)

	speaker.Play(beep.Seq(streamer, beep.Callback(func() {
		done <- true
	})))

	<-done
	time.Sleep(time.Millisecond * 200)
	return nil
}

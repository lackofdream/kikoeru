package kikoeru

import (
	"bytes"
	"time"

	"github.com/faiface/beep/speaker"
	"github.com/faiface/beep/wav"
)

func AsyncPlay(data []byte) error {
	streamer, format, err := wav.Decode(bytes.NewReader(data))
	if err != nil {
		return err
	}
	defer streamer.Close()
	speaker.Init(format.SampleRate, format.SampleRate.N(time.Second/10))
	speaker.Play(streamer)
	return nil
}

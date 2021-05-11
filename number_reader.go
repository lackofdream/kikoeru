package kikoeru

type NumberToVoiceConverter interface {
	GetVoiceBytes(number int) ([]byte, error)
}

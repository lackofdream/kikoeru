package kikoeru

type NumberToVoiceConverter interface {
	Read(number int) ([]byte, error)
}

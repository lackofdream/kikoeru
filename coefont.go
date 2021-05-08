// Package kikoeru Voiced by https://CoeFont.studio
package kikoeru

import (
	"errors"
	"strconv"

	"github.com/imroc/req"
	"github.com/sirupsen/logrus"
)

type CoefontTTSKeyResponse struct {
	StatusCode int `json:"statusCode"`
	Headers    struct {
		ContentType              string `json:"Content-Type"`
		AccessControlAllowOrigin string `json:"Access-Control-Allow-Origin"`
	} `json:"headers"`
	Body struct {
		WavKey  string `json:"wav_key"`
		Success bool   `json:"success"`
	} `json:"body"`
}

type CoefontReader struct {
	client *req.Req
}

func NewCoefontReader() *CoefontReader {
	return &CoefontReader{
		client: req.New(),
	}
}

func (c CoefontReader) Read(number int) ([]byte, error) {
	header := req.Header{
		"Content-Type": "application/json",
	}
	body := req.BodyJSON(map[string]string{
		"text": strconv.Itoa(number),
	})
	resp, err := c.client.Post("https://qn0gjz8rw1.execute-api.us-west-2.amazonaws.com/prod/text2speech_trial", header, body)
	if err != nil {
		return nil, err
	}
	key := CoefontTTSKeyResponse{}
	err = resp.ToJSON(&key)
	if err != nil {
		return nil, err
	}
	if key.StatusCode != 200 {
		logrus.Warn(key)
		return nil, errors.New("non-200 response")
	}

	param := req.Param{
		"wav_key":     key.Body.WavKey,
		"master_name": "Allial",
		"yomi_head":   "trial",
	}
	resp, err = c.client.Get("https://qn0gjz8rw1.execute-api.us-west-2.amazonaws.com/prod/chore/get_presigned_url", param)
	if err != nil {
		return nil, err
	}
	if resp.Response().Header.Get("Content-Type") != "audio/wav" {
		logrus.Warn(resp.Response())
		return nil, errors.New("non-wav response")
	}
	return resp.ToBytes()
}

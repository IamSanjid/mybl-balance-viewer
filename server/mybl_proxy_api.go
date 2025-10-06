package main

import (
	"encoding/json"
	"time"

	"github.com/valyala/fasthttp"
)


const (
	BaseURL              = "https://myblapi.banglalink.net"
	clientSecret         = "NUaKDuToZBzAcew2Og5fNxztXDHatrk4u0jQP8wu"
	clientID             = "f8ebe760-0eb3-11ea-8b08-43a82cc9d18c"
	APIGetOTPConfig      = "/api/v1/otp-config"
	APISendOTP           = "/api/v1/send-otp"
	APIVerifyOTP         = "/api/v2/verify-otp"
	APIRefreshToken      = "/api/v1/refresh"
	APIGetUserProfile    = "/api/v1/customers/details"
	APIGetBalanceSummary = "/api/v1/balance/summary"
	APIGetBalanceDetails = "/api/v1/balance/details/all"
	apiGetOTPConfig      = BaseURL + APIGetOTPConfig
	apiSendOTP           = BaseURL + APISendOTP
	apiVerifyOTP         = BaseURL + APIVerifyOTP
	apiRefreshToken      = BaseURL + APIRefreshToken
	apiGetUserProfile    = BaseURL + APIGetUserProfile
	apiGetBalanceSummary = BaseURL + APIGetBalanceSummary
	apiGetBalanceDetails = BaseURL + APIGetBalanceDetails
)

// constant headers as []byte
var (
	headerContentTypeJSON       = []byte("application/json")
	headerContentControlNoCache = []byte("no-cache")
)

var client *fasthttp.Client

func init() {
	client = &fasthttp.Client{
		ReadTimeout:                   30 * time.Second,
		WriteTimeout:                  30 * time.Second,
		NoDefaultUserAgentHeader:      true, // Don't send: User-Agent: fasthttp
		DisableHeaderNamesNormalizing: true, // We've to set the case on our headers correctly
		DisablePathNormalizing:        true,
		// increase DNS cache time to an hour instead of default minute
		Dial: (&fasthttp.TCPDialer{
			Concurrency:      4096,
			DNSCacheDuration: time.Hour,
		}).Dial,
	}
}

// TODO: Directly use string formatting to generate json string and use them as raw body bytes
// TODO: Implement custom Go types for requests and responses.

func GetOTPConfig(resp *fasthttp.Response) error {
	req := fasthttp.AcquireRequest()
	defer fasthttp.ReleaseRequest(req)
	req.SetRequestURI(apiGetOTPConfig)
	req.Header.SetMethod(fasthttp.MethodGet)
	req.Header.SetBytesV(fasthttp.HeaderCacheControl, headerContentControlNoCache)

	return Do(req, resp)
}

func SendOTP(phone string, resp *fasthttp.Response) error {
	body := map[string]interface{}{
		"phone": phone,
	}

	jsonBody, err := json.Marshal(body)
	if err != nil {
		return err
	}

	req := fasthttp.AcquireRequest()
	defer fasthttp.ReleaseRequest(req)
	req.SetRequestURI(apiSendOTP)
	req.Header.SetMethod(fasthttp.MethodPost)
	req.Header.SetContentTypeBytes(headerContentTypeJSON)
	req.SetBodyRaw(jsonBody)

	return Do(req, resp)
}

func VerifyOTP(otpToken string, otp string, username string, resp *fasthttp.Response) error {
	body := map[string]interface{}{
		"client_id":     clientID,
		"client_secret": clientSecret,
		"grant_type":    "otp_grant",
		"otp":           otp,
		"otp_token":     otpToken,
		"provider":      "users",
		"request_type":  "",
		"username":      username,
	}

	jsonBody, err := json.Marshal(body)
	if err != nil {
		return err
	}

	req := fasthttp.AcquireRequest()
	defer fasthttp.ReleaseRequest(req)
	req.SetRequestURI(apiVerifyOTP)
	req.Header.SetMethod(fasthttp.MethodPost)
	req.Header.SetContentTypeBytes(headerContentTypeJSON)
	req.SetBodyRaw(jsonBody)

	return Do(req, resp)
}

func GetTokenUsingRefreshToken(token string, resp *fasthttp.Response) error {
	body := map[string]interface{}{
		"client_id":     clientID,
		"client_secret": clientSecret,
		"grant_type":    "refresh_token",
		"refresh_token": token,
	}

	jsonBody, err := json.Marshal(body)
	if err != nil {
		return err
	}

	req := fasthttp.AcquireRequest()
	defer fasthttp.ReleaseRequest(req)
	req.SetRequestURI(apiRefreshToken)
	req.Header.SetMethod(fasthttp.MethodPost)
	req.Header.SetContentTypeBytes(headerContentTypeJSON)
	req.SetBodyRaw(jsonBody)

	return Do(req, resp)
}

func GetUserProfile(token string, resp *fasthttp.Response) error {
	req := fasthttp.AcquireRequest()
	defer fasthttp.ReleaseRequest(req)
	req.SetRequestURI(apiGetUserProfile)
	req.Header.SetMethod(fasthttp.MethodGet)
	req.Header.SetContentTypeBytes(headerContentTypeJSON)
	req.Header.Set(fasthttp.HeaderAuthorization, token)

	return Do(req, resp)
}

func GetBalanceSummary(token string, resp *fasthttp.Response) error {
	req := fasthttp.AcquireRequest()
	defer fasthttp.ReleaseRequest(req)
	req.SetRequestURI(apiGetBalanceSummary)
	req.Header.SetMethod(fasthttp.MethodGet)
	req.Header.SetContentTypeBytes(headerContentTypeJSON)
	req.Header.Set(fasthttp.HeaderAuthorization, token)

	return Do(req, resp)
}

func GetBalanceDetails(token string, resp *fasthttp.Response) error {
	req := fasthttp.AcquireRequest()
	defer fasthttp.ReleaseRequest(req)
	req.SetRequestURI(apiGetBalanceDetails)
	req.Header.SetMethod(fasthttp.MethodGet)
	req.Header.SetContentTypeBytes(headerContentTypeJSON)
	req.Header.Set(fasthttp.HeaderAuthorization, token)

	return Do(req, resp)
}

func Do(req *fasthttp.Request, resp *fasthttp.Response) error {
	return client.Do(req, resp)
}

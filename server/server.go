package main

import (
	"log"
	"strings"

	"github.com/valyala/fasthttp"
)

func main() {
	if err := fasthttp.ListenAndServe(":8080", requestHandler); err != nil {
		log.Fatalf("Error in ListenAndServe: %v", err)
	}
}

func requestHandler(ctx *fasthttp.RequestCtx) {
	if ctx.Request.Header.IsOptions() {
		/// Making Browser's preflight requests happy.
		/// Some API endpoints used by MyBL App doesn't respect these types of requests
		ctx.Response.Header.Add(fasthttp.HeaderAccessControlAllowMethods, "GET, POST, DELETE")
		ctx.Response.Header.Add(fasthttp.HeaderAccessControlAllowHeaders, "cache-control, authorization, x-base-url, content-type")
		ctx.Response.Header.Set(fasthttp.HeaderAccessControlAllowOrigin, "*")
		ctx.SetStatusCode(fasthttp.StatusNoContent)
		return
	}

	baseUrl := BaseURL
	if xBaseUrl := ctx.Request.Header.Peek("X-Base-Url"); xBaseUrl != nil {
		baseUrl = string(xBaseUrl)
		if !strings.Contains(strings.ToLower(baseUrl), "banglalink") {
			ctx.Error("X-Base-Url doesn't contain `banglalink` url", fasthttp.StatusBadRequest)
			return
		}
	}
	path := string(ctx.Path())
	ctx.Request.SetRequestURI(baseUrl + path)

	if err := Do(&ctx.Request, &ctx.Response); err != nil {
		ctx.Error(err.Error(), fasthttp.StatusInternalServerError)
	}

	/// We're not verifying anyting on this proxy server, we're simply passing the request to official MyBL API.

	// var err error = nil

	// switch string(ctx.Path()) {
	// case APIGetOTPConfig:
	// 	err = onGetOTPConfig(ctx)
	// default:
	// 	ctx.SetStatusCode(fasthttp.StatusNotFound)
	// }

	// if err != nil {
	// 	ctx.Error(err.Error(), fasthttp.StatusInternalServerError)
	// }
}

// func onGetOTPConfig(ctx *fasthttp.RequestCtx) error {
// 	ctx.SetStatusCode(fasthttp.StatusOK)
// 	return GetOTPConfig(&ctx.Response)
// }

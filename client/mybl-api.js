const BASE_URL = "http://0.0.0.0:8080/";
//const BASE_URL = "https://myblapi.banglalink.net/";
const CLIENT_SECRET = "NUaKDuToZBzAcew2Og5fNxztXDHatrk4u0jQP8wu";
const CLIENT_ID = "f8ebe760-0eb3-11ea-8b08-43a82cc9d18c";

const API_GET_OPT_CONFIG = "api/v1/otp-config";
const API_SEND_OTP = "api/v1/send-otp";
const API_VERIFY_OTP = "api/v2/verify-otp";
const API_REFRESH_TOKEN = "api/v1/refresh";
const API_GET_USER_PROFILE = "api/v1/customers/details";
const API_GET_BALANCE_SUMMARY = "api/v1/balance/summary";
const API_GET_BALANCE_DETAILS = "api/v1/balance/details/all";

export async function getOtpConfig() {
  let resp = await fetch(`${BASE_URL}${API_GET_OPT_CONFIG}`, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  return await resp.json();
}

export async function sendOtp(phone) {
  const body = {
    'phone': phone,
  };
  let resp = await fetch(`${BASE_URL}${API_SEND_OTP}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return await resp.json();
}

export function extractOtp(text, otpConfig) {
  const pattern = new RegExp(`(|^)\\d{${otpConfig.token_length}}`);
  const match = text.match(pattern);
  if (match === null) return null;
  if (Array.isArray(match)) return match[0];
  return match;
}

export async function verifyOtp(otpToken, otp, username) {
  const body = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'otp_grant',
    otp: otp,
    otp_token: otpToken,
    provider: 'users',
    request_type: '',
    username: username,
  };

  let resp = await fetch(`${BASE_URL}${API_VERIFY_OTP}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return await resp.json();
}

export async function getTokenUsingRefreshToken(token) {
  const body = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: token,
  };

  let resp = await fetch(`${BASE_URL}${API_REFRESH_TOKEN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return await resp.json();
}

export function getToken(token) {
  return token.token_type + " " + token.access_token;
}

export async function getUserProfile(token) {
  let resp = await fetch(`${BASE_URL}${API_GET_USER_PROFILE}`, {
    method: 'GET',
    headers: {
      'Authorization': token,
      'Accept': 'application/json',
    },
  });
  return await resp.json();
}

export async function getBalanceSummary(token) {
  let resp = await fetch(`${BASE_URL}${API_GET_BALANCE_SUMMARY}`, {
    method: 'GET',
    headers: {
      'Authorization': token,
      'Accept': 'application/json',
    },
  });
  return await resp.json();
}

export async function getBalanceDetails(token) {
  let resp = await fetch(`${BASE_URL}${API_GET_BALANCE_DETAILS}`, {
    method: 'GET',
    headers: {
      'Authorization': token,
      'Accept': 'application/json',
    },
  });
  return await resp.json();
}

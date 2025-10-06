import readlinePromises from 'node:readline/promises';

const BASE_URL = "https://myblapi.banglalink.net/";
const CLIENT_SECRET = "NUaKDuToZBzAcew2Og5fNxztXDHatrk4u0jQP8wu";
const CLIENT_ID = "f8ebe760-0eb3-11ea-8b08-43a82cc9d18c";

const API_GET_OPT_CONFIG = "api/v1/otp-config";
const API_SEND_OTP = "api/v1/send-otp";
const API_VERIFY_OTP = "api/v2/verify-otp";
const API_REFRESH_TOKEN = "api/v1/refresh";
const API_GET_USER_PROFILE = "api/v1/customers/details";
const API_GET_BALANCE_SUMMARY = "api/v1/balance/summary";
const API_GET_BALANCE_DETAILS = "api/v1/balance/details/all";

async function getOtpConfig() {
  let resp = await fetch(`${BASE_URL}${API_GET_OPT_CONFIG}`, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  return await resp.json();
}

async function sendOtp(phone) {
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

function extractOtp(text, otpConfig) {
  const pattern = new RegExp(`(|^)\\d{${otpConfig.token_length}}`);
  const match = text.match(pattern);
  if (match === null) return null;
  if (Array.isArray(match)) return match[0];
  return match;
}

async function verifyOtp(otpToken, otp, username) {
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

async function getTokenUsingRefreshToken(token) {
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

function getToken(token) {
  return token.token_type + " " + token.access_token;
}

async function getUserProfile(token) {
  let resp = await fetch(`${BASE_URL}${API_GET_USER_PROFILE}`, {
    method: 'GET',
    headers: {
      'Authorization': token,
    },
  });
  return await resp.json();
}

async function getBalanceSummary(token) {
  let resp = await fetch(`${BASE_URL}${API_GET_BALANCE_SUMMARY}`, {
    method: 'GET',
    headers: {
      'Authorization': token,
    },
  });
  return await resp.json();
}

async function getBalanceDetails(token) {
  let resp = await fetch(`${BASE_URL}${API_GET_BALANCE_DETAILS}`, {
    method: 'GET',
    headers: {
      'Authorization': token,
    },
  });
  return await resp.json();
}

async function main() {
  const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    const otpConfig = (await getOtpConfig()).data[0];

    const phoneNumber = await rl.question('Phone Number: ');

    const sentOtp = (await sendOtp(phoneNumber)).data;

    const otpInput = await rl.question('OTP: ');
    const otp = extractOtp(otpInput, otpConfig);

    const tokenAndUserInfo = (await verifyOtp(sentOtp.otp_token, otp, phoneNumber)).data;
    console.log(tokenAndUserInfo);

    const token = (await getTokenUsingRefreshToken(tokenAndUserInfo.token.refresh_token)).data;
    console.log(token);

    const authToken = getToken(token);
    const customer = (await getUserProfile(authToken)).data;
    const is_postpaid = customer.is_postpaid !== undefined && customer.is_postpaid === true;
    console.log("Is postpaid: ", is_postpaid);

    const balanceSummary = (await getBalanceSummary(authToken)).data;
    console.log(balanceSummary);

    const balanceDetails = (await getBalanceDetails(authToken)).data;
    console.log(balanceDetails);

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    rl.close();
  }
}

main();

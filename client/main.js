import * as mybl from './mybl-api.js';
import * as prepaid_view from './prepaid-view.js';
import * as postpaid_view from './postpaid-view.js';

const balanceViewHTML = `<main class="flex-1 px-6 md:px-10 py-8" id="view">
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="container">
      <!-- Internet Card -->
      <div class="bg-white dark:bg-background-dark/50 rounded-xl p-6 flex flex-col gap-4 border border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Internet</h3>
          <span class="material-symbols-outlined text-blue-500">public</span>
        </div>
        <div class="text-4xl font-bold text-red-500"><span id="internet_remaining">150</span> <span class="text-2xl font-medium" id="internet_unit">MB</span></div>
        <div class="flex flex-col gap-2">
          <div class="rounded-full bg-gray-200 dark:bg-gray-700">
            <div class="h-2 rounded-full bg-red-500" style="width: 15%;" id="internet_pb"></div>
          </div>
          <div class="flex justify-between items-center">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal" id="internet_total">out of 1 GB</p>
          </div>
        </div>
      </div>
      <!-- Minutes Card -->
      <div class="bg-white dark:bg-background-dark/50 rounded-xl p-6 flex flex-col gap-4 border border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Minutes</h3>
          <span class="material-symbols-outlined text-orange-500">call</span>
        </div>
        <div class="text-4xl font-bold text-slate-900 dark:text-white"><span id="min_remaining">350</span> <span class="text-2xl font-medium" id="min_unit">Mins</span></div>
        <div class="flex flex-col gap-2">
          <div class="rounded-full bg-gray-200 dark:bg-gray-700">
            <div class="h-2 rounded-full bg-orange-500" style="width: 70%;" id="min_pb"></div>
          </div>
          <p class="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal" id="min_total">out of 500 Mins</p>
        </div>
      </div>
      <!-- SMS Card -->
      <div class="bg-white dark:bg-background-dark/50 rounded-xl p-6 flex flex-col gap-4 border border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">SMS</h3>
          <span class="material-symbols-outlined text-green-500">sms</span>
        </div>
        <div class="text-4xl font-bold text-slate-900 dark:text-white" id="sms_remaining">800</div>
        <div class="flex flex-col gap-2">
          <div class="rounded-full bg-gray-200 dark:bg-gray-700">
            <div class="h-2 rounded-full bg-green-500" style="width: 80%;" id="sms_pb"></div>
          </div>
          <p class="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal" id="sms_total">out of 1000</p>
        </div>
      </div>
    </div>
  </div>
</main>`;

// States...
let otpConfig = null;
let sentOTP = null;
let phoneNum = null;
let token = null;

window.sendOTP = async function() {
  sentOTP = null;
  phoneNum = phone_number.value.replace(/[^\d]/g, '');
  if (phoneNum.length != 11 || !phoneNum.startsWith("019")) {
    phoneNum = null;
    phone_number.style = 'border-color: red;';
    return;
  }
  phone_number.style = '';
  otp_section.style = '';
  await showOtpFields();
  sentOTP = (await mybl.sendOtp(phoneNum)).data;
}

async function verifyOTP(otp) {
  if (phoneNum == null) {
    return;
  }
  token = null;
  const response = await mybl.verifyOtp(sentOTP.otp_token, otp, phoneNum);
  if (response.status_code != 200) {
    alert(response.message);
    return;
  }
  token = response.data.token;
  await showBalance();
}

async function showOtpFields() {
  if (otpConfig === null) {
    otpConfig = (await mybl.getOtpConfig()).data[0];
  }
  otp_fields.innerHTML = '';

  const inputs = [];
  const otpValues = [];
  let focusedIndex = 0;

  for (let i = 0; i < otpConfig.token_length; i++) {
    const input = document.createElement('input');
    input.className = 'flex h-14 w-12 text-center text-xl font-bold [appearance:textfield] focus:outline-0 focus:ring-2 focus:ring-primary dark:focus:ring-primary [&amp;::-webkit-inner-spin-button]:appearance-none [&amp;::-webkit-outer-spin-button]:appearance-none rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-background-dark dark:text-white';
    input.maxLength = 1;
    input.inputMode = 'numeric';
    input.pattern = '\\d*';
    input.required = true;

    input.addEventListener('input', async (e) => {
      const v = e.target.value;
      if (!/^\d$/.test(v)) {
        e.target.value = '';
        otpValues[i] = '';
        return;
      }
      otpValues[i] = v;
      if (i < otpConfig.token_length - 1) {
        inputs[i + 1].focus();
        focusedIndex = i + 1;
      } else {
        // verify otp
        console.log(otpValues.join(''));
        inputs[i].blur();
        inputs.forEach(el => {
          el.disabled = true;
          el.style = 'color: rgb(156 163 175)';
        });
        verifyOTP(otpValues.join(''));
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && i > 0) {
        otpValues[focusedIndex] = '';
        inputs[i - 1].focus();
        focusedIndex = i - 1;
      }
    });

    input.addEventListener('focus', (e) => {
      focusedIndex = i;
    });

    otp_fields.appendChild(input);
    inputs.push(input);
  }
  inputs[focusedIndex].focus();
}

window.resendOTP = async function() {
  await showOtpFields();
  sendOTP();
}

async function showBalance() {
  try {
    const authToken = mybl.getToken(token);
    const customer = (await mybl.getUserProfile(authToken)).data;
    const is_postpaid = customer.is_postpaid !== undefined && customer.is_postpaid === true;

    const balanceSummary = (await mybl.getBalanceSummary(authToken)).data;

    view.outerHTML = balanceViewHTML;
    if (is_postpaid) {
      postpaid_view.render(balanceSummary);
    } else {
      prepaid_view.render(balanceSummary);
    }
  } catch (error) {
    console.error('An error occurred:', error);
    alert(error);
  }
}

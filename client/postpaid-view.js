const postpaidBalanceHTML = `<div class="bg-white dark:bg-background-dark/50 rounded-xl p-6 flex flex-col gap-4 border border-gray-200 dark:border-gray-800">
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Balance (Postpaid)</h3>
    <span class="material-symbols-outlined text-purple-500">credit_card</span>
  </div>
  <div class="flex flex-col gap-4 w-full">
    <div>
      <p class="text-sm text-slate-500 dark:text-slate-400">Total Outstanding</p>
      <p class="text-2xl font-bold text-slate-900 dark:text-white" id="postpaid_balance_total">৳850</p>
    </div>
    <div class="flex flex-col gap-2">
      <div class="rounded-full bg-gray-200 dark:bg-gray-700 h-2">
        <div class="h-2 rounded-full bg-purple-500" style="width: 42.5%;" id="postpaid_balance_pb"></div>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-slate-500 dark:text-slate-400">Credit Limit: <span class="font-medium text-slate-800 dark:text-slate-200" id="postpaid_balance_credit">৳2,000</span></span>
      </div>
    </div>
  </div>
</div>`;

const postpaidRoamingHTML = `<div class="bg-white dark:bg-background-dark/50 rounded-xl p-6 flex flex-col gap-4 border border-gray-200 dark:border-gray-800">
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Roaming (Postpaid)</h3>
    <span class="material-symbols-outlined text-teal-500">flight_takeoff</span>
  </div>
  <div class="flex flex-col gap-4 w-full">
    <div>
      <p class="text-sm text-slate-500 dark:text-slate-400">Total Outstanding</p>
      <p class="text-2xl font-bold text-slate-900 dark:text-white" id="postpaid_roaming_total">$75.00</p>
    </div>
    <div class="flex flex-col gap-2">
      <div class="rounded-full bg-gray-200 dark:bg-gray-700 h-2">
        <div class="h-2 rounded-full bg-teal-500" style="width: 25%;" id="postpaid_roaming_pb"></div>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-slate-500 dark:text-slate-400">Credit Limit: <span class="font-medium text-slate-800 dark:text-slate-200" id="postpaid_roaming_credit">$300</span></span>
      </div>
    </div>
  </div>
</div>`;

export function render(balanceSummary) {
  const range = document.createRange();
  range.selectNode(container);

  const balanceFrag = range.createContextualFragment(postpaidBalanceHTML);
  const roamingFrag = range.createContextualFragment(postpaidRoamingHTML);

  const postpaid_balance_total = balanceFrag.querySelector("#postpaid_balance_total");
  const postpaid_balance_pb = balanceFrag.querySelector("#postpaid_balance_pb");
  const postpaid_balance_credit = balanceFrag.querySelector("#postpaid_balance_credit");
  postpaid_balance_total.textContent = `${balanceSummary.balance.total_outstanding}`
  postpaid_balance_pb.style = 'width: ' + (balanceSummary.balance.total_outstanding / balanceSummary.balance.credit_limit) * 100 + '%';
  postpaid_balance_credit.textContent = `${balanceSummary.balance.credit_limit}`;

  internet_remaining.textContent = `${balanceSummary.internet.remaining}`;
  internet_unit.textContent = `${balanceSummary.internet.unit}`;
  internet_total.textContent = `out of ${balanceSummary.internet.total} ${balanceSummary.internet.unit}`;
  internet_pb.style = 'width: ' + (balanceSummary.internet.remaining / balanceSummary.internet.total) * 100 + '%';

  min_remaining.textContent = `${balanceSummary.minutes.remaining}`;
  min_unit.textContent = `${balanceSummary.minutes.unit}`;
  min_total.textContent = `out of ${balanceSummary.minutes.total} ${balanceSummary.minutes.unit}`;
  min_pb.style = 'width: ' + (balanceSummary.minutes.remaining / balanceSummary.minutes.total) * 100 + '%';

  sms_remaining.textContent = `${balanceSummary.sms.remaining}`;
  sms_total.textContent = `out of ${balanceSummary.sms.total}`;
  sms_pb.style = 'width: ' + (balanceSummary.sms.remaining / balanceSummary.sms.total) * 100 + '%';

  const postpaid_roaming_total = roamingFrag.querySelector("#postpaid_roaming_total");
  const postpaid_roaming_pb = roamingFrag.querySelector("#postpaid_roaming_pb");
  const postpaid_roaming_credit = roamingFrag.querySelector("#postpaid_roaming_credit");
  postpaid_roaming_total.textContent = `${balanceSummary.roaming_balance.currency} ${balanceSummary.roaming_balance.total_outstanding}`
  postpaid_roaming_pb.style = 'width: ' + (balanceSummary.roaming_balance.total_outstanding / balanceSummary.roaming_balance.credit_limit) * 100 + '%';
  postpaid_roaming_credit.textContent = `${balanceSummary.roaming_balance.currency} ${balanceSummary.roaming_balance.credit_limit}`;

  container.prepend(balanceFrag);
  container.append(roamingFrag);
  container.style = "";
}

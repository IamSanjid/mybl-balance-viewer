const prepaidBalanceHTML = `<div class="bg-white dark:bg-background-dark/50 rounded-xl p-6 flex flex-col justify-center items-center gap-4 border border-gray-200 dark:border-gray-800">
  <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Balance (Prepaid)</h3>
  <div class="text-6xl font-bold text-slate-900 dark:text-white" id="prepaid_balance_amount">৳1,250</div>
</div>`;

const prepaidRoamingHTML = `<div class="bg-white dark:bg-background-dark/50 rounded-xl p-6 flex flex-col justify-center items-center gap-4 border border-gray-200 dark:border-gray-800">
  <div class="flex justify-between items-center w-full">
    <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Roaming (Prepaid)</h3>
    <span class="material-symbols-outlined text-teal-500">flight_takeoff</span>
  </div>
  <div class="text-6xl font-bold text-slate-900 dark:text-white" id="prepaid_roaming_amount">৳1,250</div>
</div>`;

export function render(balanceSummary) {
  const range = document.createRange();
  range.selectNode(container);

  const balanceFrag = range.createContextualFragment(prepaidBalanceHTML);
  const roamingFrag = range.createContextualFragment(prepaidRoamingHTML);

  const prepaid_balance_amount = balanceFrag.querySelector('#prepaid_balance_amount');
  prepaid_balance_amount.textContent = `${balanceSummary.balance.unit} ${balanceSummary.balance.amount}`;

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

  const prepaid_roaming_amount = roamingFrag.querySelector('#prepaid_roaming_amount');
  prepaid_roaming_amount.textContent = `${balanceSummary.roaming_balance.currency} ${balanceSummary.roaming_balance.amount}`;

  container.prepend(balanceFrag);
  container.append(roamingFrag);
  container.style = "";
}

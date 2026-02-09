function ceil(v) {
  return Math.ceil(v);
}

/* ===== 計算 ===== */
function calculate() {
  const rows = document.querySelectorAll("#foodTable tbody tr");

  let totalP = 0;
  let totalF = 0;
  let totalK = 0;

  rows.forEach(row => {
    const amount = Number(row.children[1].querySelector("input").value) || 0;

    // 100gあたりの基準値（初回だけ保存）
    if (!row.dataset.baseP) {
      row.dataset.baseP = row.children[2].textContent || 0;
      row.dataset.baseF = row.children[3].textContent || 0;
      row.dataset.baseK = row.children[4].textContent || 0;
    }

    const baseP = Number(row.dataset.baseP);
    const baseF = Number(row.dataset.baseF);
    const baseK = Number(row.dataset.baseK);

    const ratio = amount / 100;

    const calcP = baseP * ratio;
    const calcF = baseF * ratio;
    const calcK = baseK * ratio;

    // 行に表示（← これが今まで無かった）
    row.children[2].textContent = ceil(calcP);
    row.children[3].textContent = ceil(calcF);
    row.children[4].textContent = ceil(calcK);

    totalP += calcP;
    totalF += calcF;
    totalK += calcK;
  });

  document.getElementById("totalArea").innerHTML =
    `P:${ceil(totalP)}g / F:${ceil(totalF)}g / ${ceil(totalK)}kcal`;

  const targetP = Number(document.getElementById("targetProtein").value);
  const targetF = Number(document.getElementById("targetFat").value);

  let lackP = targetP - ceil(totalP);
  let lackF = targetF - ceil(totalF);

  if (lackP < 0) lackP = 0;
  if (lackF < 0) lackF = 0;

  document.getElementById("lackArea").innerHTML =
    `<span class="${lackP === 0 ? 'ok':'ng'}">不足P:${lackP}g</span> /
     <span class="${lackF === 0 ? 'ok':'ng'}">不足F:${lackF}g</span>`;

  document.getElementById("replaceArea").innerHTML =
    `プロテイン:${ceil(lackP / 0.7)}g / オリーブオイル:${ceil(lackF)}g`;
}

/* ===== 行追加 ===== */
function addRow() {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input placeholder="鶏むね肉など"></td>
    <td><input type="number" value="0"></td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>
      <button onclick="this.closest('tr').remove();calculate();saveState()">×</button>
    </td>
  `;
  document.querySelector("#foodTable tbody").appendChild(tr);
  saveState();
}

/* ===== 保存 ===== */
function saveState() {
  const rows = [...document.querySelectorAll("#foodTable tbody tr")].map(tr => ({
    name: tr.children[0].textContent || tr.children[0].querySelector("input")?.value || "",
    amount: tr.children[1].querySelector("input").value,
    baseP: tr.dataset.baseP || 0,
    baseF: tr.dataset.baseF || 0,
    baseK: tr.dataset.baseK || 0,
    fixed: tr.dataset.fixed === "true"
  }));

  const state = {
    targetProtein: targetProtein.value,
    targetFat: targetFat.value,
    rows
  };

  localStorage.setItem("nutritionAppState", JSON.stringify(state));
}

/* ===== 復元 ===== */
function loadState() {
  const saved = localStorage.getItem("nutritionAppState");
  if (!saved) return;

  const state = JSON.parse(saved);
  targetProtein.value = state.targetProtein;
  targetFat.value = state.targetFat;

  const tbody = document.querySelector("#foodTable tbody");
  tbody.innerHTML = "";

  state.rows.forEach(r => {
    const tr = document.createElement("tr");
    if (r.fixed) tr.dataset.fixed = "true";

    tr.dataset.baseP = r.baseP;
    tr.dataset.baseF = r.baseF;
    tr.dataset.baseK = r.baseK;

    tr.innerHTML = `
      <td>${r.fixed ? r.name : `<input value="${r.name}">`}</td>
      <td><input type="number" value="${r.amount}"></td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>${r.fixed ? "" : `<button onclick="this.closest('tr').remove();calculate();saveState()">×</button>`}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ===== イベント ===== */
document.addEventListener("input", () => {
  calculate();
  saveState();
});

/* ===== 初期化 ===== */
loadState();
calculate();

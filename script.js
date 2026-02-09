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
    const amount = Number(row.children[1].querySelector("input").value);
    const p = Number(row.children[2].textContent);
    const f = Number(row.children[3].textContent);
    const k = Number(row.children[4].textContent);

    totalP += p;
    totalF += f;
    totalK += k;
  });

  totalP = ceil(totalP);
  totalF = ceil(totalF);
  totalK = ceil(totalK);

  document.getElementById("totalArea").innerHTML =
    `P:${totalP}g / F:${totalF}g / ${totalK}kcal`;

  const targetP = Number(document.getElementById("targetProtein").value);
  const targetF = Number(document.getElementById("targetFat").value);

  let lackP = targetP - totalP;
  let lackF = targetF - totalF;

  if (lackP < 0) lackP = 0;
  if (lackF < 0) lackF = 0;

  document.getElementById("lackArea").innerHTML =
    `<span class="${lackP === 0 ? 'ok':'ng'}">不足P:${lackP}g</span> /
     <span class="${lackF === 0 ? 'ok':'ng'}">不足F:${lackF}g</span>`;

  const proteinPowder = ceil(lackP / 0.7);
  const oliveOil = ceil(lackF);

  document.getElementById("replaceArea").innerHTML =
    `プロテイン:${proteinPowder}g（P${ceil(proteinPowder*0.7)}g） /
     オリーブオイル:${oliveOil}g（F${oliveOil}g）`;
}

/* ===== 行追加 ===== */
function addRow() {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input></td>
    <td><input type="number" value="0"></td>
    <td><input type="number" value="0"></td>
    <td><input type="number" value="0"></td>
    <td><input type="number" value="0"></td>
    <td><button onclick="this.closest('tr').remove();calculate();saveState()">×</button></td>
  `;
  document.querySelector("#foodTable tbody").appendChild(tr);
  saveState();
}

/* ===== 保存 ===== */
function saveState() {
  const rows = [...document.querySelectorAll("#foodTable tbody tr")].map(tr => ({
    name: tr.children[0].textContent || tr.children[0].querySelector("input")?.value || "",
    amount: tr.children[1].querySelector("input").value,
    p: tr.children[2].textContent,
    f: tr.children[3].textContent,
    k: tr.children[4].textContent,
    fixed: tr.dataset.fixed === "true"
  }));

  const state = {
    targetProtein: document.getElementById("targetProtein").value,
    targetFat: document.getElementById("targetFat").value,
    rows
  };

  localStorage.setItem("nutritionAppState", JSON.stringify(state));
}

/* ===== 復元 ===== */
function loadState() {
  const saved = localStorage.getItem("nutritionAppState");
  if (!saved) return;

  const state = JSON.parse(saved);

  document.getElementById("targetProtein").value = state.targetProtein;
  document.getElementById("targetFat").value = state.targetFat;

  const tbody = document.querySelector("#foodTable tbody");
  tbody.innerHTML = "";

  state.rows.forEach(r => {
    const tr = document.createElement("tr");
    if (r.fixed) tr.dataset.fixed = "true";

    tr.innerHTML = `
      <td>${r.fixed ? r.name : `<input value="${r.name}">`}</td>
      <td><input type="number" value="${r.amount}"></td>
      <td>${r.p}</td>
      <td>${r.f}</td>
      <td>${r.k}</td>
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

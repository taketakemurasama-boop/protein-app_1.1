const CHICKEN_P = 22 / 100; // gあたり
const CHICKEN_F = 2 / 100;
const CHICKEN_K = 120 / 100; // 目安カロリー

function ceil(v) {
  return Math.ceil(v);
}

function calculateChicken() {
  const row = document.querySelector('tr[data-chicken="true"]');
  if (!row) return;

  const g = Number(row.children[1].querySelector("input").value);

  const p = ceil(g * CHICKEN_P);
  const f = ceil(g * CHICKEN_F);
  const k = ceil(g * CHICKEN_K);

  row.querySelector(".p").textContent = p;
  row.querySelector(".f").textContent = f;
  row.querySelector(".k").textContent = k;
}

function calculate() {
  calculateChicken();

  const rows = document.querySelectorAll("#foodTable tbody tr");

  let totalP = 0, totalF = 0, totalK = 0;

  rows.forEach(row => {
    const p = Number(row.children[2].textContent) || 0;
    const f = Number(row.children[3].textContent) || 0;
    const k = Number(row.children[4].textContent) || 0;

    totalP += p;
    totalF += f;
    totalK += k;
  });

  totalP = ceil(totalP);
  totalF = ceil(totalF);
  totalK = ceil(totalK);

  document.getElementById("totalArea").textContent =
    `P:${totalP}g / F:${totalF}g / ${totalK}kcal`;

  const targetP = Number(document.getElementById("targetProtein").value);
  const targetF = Number(document.getElementById("targetFat").value);

  let lackP = Math.max(0, targetP - totalP);
  let lackF = Math.max(0, targetF - totalF);

  document.getElementById("lackArea").innerHTML =
    `<span class="${lackP === 0 ? 'ok':'ng'}">不足P:${lackP}g</span> /
     <span class="${lackF === 0 ? 'ok':'ng'}">不足F:${lackF}g</span>`;

  const proteinPowder = ceil(lackP / 0.7);
  const oliveOil = ceil(lackF);

  document.getElementById("replaceArea").textContent =
    `プロテイン:${proteinPowder}g / オリーブオイル:${oliveOil}g`;
}

function addRow() {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input></td>
    <td><input type="number"></td>
    <td><input type="number"></td>
    <td><input type="number"></td>
    <td><input type="number"></td>
    <td><button onclick="this.closest('tr').remove();calculate()">×</button></td>
  `;
  document.querySelector("#foodTable tbody").appendChild(tr);
}

document.addEventListener("input", calculate);
calculate();

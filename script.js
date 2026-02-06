function ceil(v) {
  return Math.ceil(v);
}

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

function addRow() {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input></td>
    <td><input type="number" value="0"></td>
    <td><input type="number" value="0"></td>
    <td><input type="number" value="0"></td>
    <td><input type="number" value="0"></td>
    <td><button onclick="this.closest('tr').remove();calculate()">×</button></td>
  `;
  document.querySelector("#foodTable tbody").appendChild(tr);
}

document.addEventListener("input", calculate);
calculate();
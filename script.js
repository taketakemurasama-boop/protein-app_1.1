function ceil(v) {
  return Math.ceil(v);
}

function calculate() {
  const rows = document.querySelectorAll("#foodTable tbody tr");

  let totalP = 0;
  let totalF = 0;
  let totalK = 0;

  rows.forEach(row => {

    /* ===== 鶏むね肉 ===== */
    if (row.dataset.chicken === "true") {
      const amount = Number(row.querySelector("input").value) || 0;

      // 皮なし・100gあたり
      const baseP = 23;
      const baseF = 1.5;
      const baseK = 120;

      const ratio = amount / 100;

      const p = baseP * ratio;
      const f = baseF * ratio;
      const k = baseK * ratio;

      row.querySelector(".p").textContent = ceil(p);
      row.querySelector(".f").textContent = ceil(f);
      row.querySelector(".k").textContent = ceil(k);

      totalP += p;
      totalF += f;
      totalK += k;
      return;
    }

    /* ===== 固定行 ===== */
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

  const targetP = Number(targetProtein.value);
  const targetF = Number(targetFat.value);

  const lackP = Math.max(0, targetP - totalP);
  const lackF = Math.max(0, targetF - totalF);

  document.getElementById("lackArea").innerHTML =
    `<span class="${lackP === 0 ? 'ok' : 'ng'}">不足P:${lackP}g</span> /
     <span class="${lackF === 0 ? 'ok' : 'ng'}">不足F:${lackF}g</span>`;

  document.getElementById("replaceArea").textContent =
    `プロテイン:${ceil(lackP / 0.7)}g / オリーブオイル:${ceil(lackF)}g`;
}

document.addEventListener("input", calculate);
calculate();

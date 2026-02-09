function ceil(v) {
  return Math.ceil(v);
}

/* 食材データ（100gあたり） */
const FOOD_DB = {
  chicken: { p: 23, f: 1.5, k: 120 }
};

function calculate() {
  let totalP = 0;
  let totalF = 0;
  let totalK = 0;

  document.querySelectorAll("#foodTable tbody tr").forEach(row => {
    const food = row.dataset.food;

    // 鶏むね肉（可変）
    if (food === "chicken") {
      const amount = Number(row.querySelector("input").value) || 0;
      const base = FOOD_DB.chicken;
      const ratio = amount / 100;

      const p = base.p * ratio;
      const f = base.f * ratio;
      const k = base.k * ratio;

      row.querySelector(".p").textContent = ceil(p);
      row.querySelector(".f").textContent = ceil(f);
      row.querySelector(".k").textContent = ceil(k);

      totalP += p;
      totalF += f;
      totalK += k;
      return;
    }

    // 固定行
    totalP += Number(row.querySelector(".p").textContent) || 0;
    totalF += Number(row.querySelector(".f").textContent) || 0;
    totalK += Number(row.querySelector(".k").textContent) || 0;
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
}

document.addEventListener("input", calculate);
calculate();

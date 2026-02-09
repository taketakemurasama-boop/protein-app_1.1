const FOOD_DB = {
  chicken: { p: 23, f: 1.5, k: 120 },
  allbran: { p: 13, f: 8.3, k: 350 },
  natto: { p: 11, f: 16, k: 200 },
  yogurt: { p: 3, f: 4, k: 60 },
  milk: { p: 3.3, f: 3.8, k: 67 }
};

function ceil(v) {
  return Math.ceil(v);
}

function calculate() {
  let totalP = 0;
  let totalF = 0;
  let totalK = 0;

  document.querySelectorAll("#foodTable tbody tr").forEach(row => {
    const key = row.dataset.food;
    const amount = Number(row.querySelector("input").value) || 0;
    const base = FOOD_DB[key];

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
  });

  totalP = ceil(totalP);
  totalF = ceil(totalF);
  totalK = ceil(totalK);

  totalArea.textContent =
    `P:${totalP}g / F:${totalF}g / ${totalK}kcal`;

  const targetP = Number(targetProtein.value);
  const targetF = Number(targetFat.value);

  const lackP = Math.max(0, targetP - totalP);
  const lackF = Math.max(0, targetF - totalF);

  lackArea.innerHTML =
    `<span class="${lackP === 0 ? 'ok' : 'ng'}">不足P:${lackP}g</span> /
     <span class="${lackF === 0 ? 'ok' : 'ng'}">不足F:${lackF}g</span>`;

  saveState();
}

/* ===== 前回値保持 ===== */
function saveState() {
  const amounts = {};
  document.querySelectorAll("#foodTable tbody tr").forEach(row => {
    amounts[row.dataset.food] =
      row.querySelector("input").value;
  });

  const state = {
    targetProtein: targetProtein.value,
    targetFat: targetFat.value,
    amounts
  };

  localStorage.setItem("nutritionState", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("nutritionState");
  if (!saved) return;

  const state = JSON.parse(saved);
  targetProtein.value = state.targetProtein;
  targetFat.value = state.targetFat;

  document.querySelectorAll("#foodTable tbody tr").forEach(row => {
    const key = row.dataset.food;
    if (state.amounts[key] !== undefined) {
      row.querySelector("input").value = state.amounts[key];
    }
  });
}

document.addEventListener("input", calculate);
loadState();
calculate();

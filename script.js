const FOOD_DB = {
  rice:    { p: 6.1, f: 0.9, k: 342 }, // 炊飯前100g
  protein: { p: 72.3,  f: 5.7,   k: 392 }, // プロテイン100g想定
  chicken: { p: 22.5,  f: 2.6, k: 120 },
  allbran: { p: 15,  f: 6, k: 350 },
  natto:   { p: 19.4,  f: 11,  k: 212 },
  yogurt:  { p: 3.5,   f: 3.7,   k: 61 },
  milk:    { p: 3.3, f: 3.8, k: 65 }
};

const PROTEIN_RATIO = 0.7; // 不足分換算用

function round1(v) {
  return Math.round(v * 10) / 10;
}

function calculate() {
  let totalP = 0;
  let totalF = 0;
  let totalK = 0;

  document.querySelectorAll("#foodTable tbody tr").forEach(row => {
    const key = row.dataset.food;
    const base = FOOD_DB[key];
    if (!base) return;

    const amount = Number(row.querySelector("input").value) || 0;
    const ratio = amount / 100;

    const p = base.p * ratio;
    const f = base.f * ratio;
    const k = base.k * ratio;

    row.querySelector(".p").textContent = round1(p);
    row.querySelector(".f").textContent = round1(f);
    row.querySelector(".k").textContent = round1(k);

    totalP += p;
    totalF += f;
    totalK += k;
  });

  totalP = round1(totalP);
  totalF = round1(totalF);
  totalK = round1(totalK);

  totalArea.textContent =
    `P ${totalP} g / F ${totalF} g / ${totalK} kcal`;

  const targetP = Number(targetProtein.value) || 0;
  const targetF = Number(targetFat.value) || 0;

  const lackP = Math.max(0, targetP - totalP);
  const lackF = Math.max(0, targetF - totalF);

  lackArea.innerHTML =
    `<span class="${lackP === 0 ? 'ok' : 'ng'}">
      不足タンパク質 ${round1(lackP)} g
     </span><br>
     <span class="${lackF === 0 ? 'ok' : 'ng'}">
      不足脂質 ${round1(lackF)} g
     </span>`;

  const proteinPowder = lackP / PROTEIN_RATIO;
  const oliveOil = lackF;

  replaceArea.textContent =
    `置き換え目安：プロテイン ${round1(proteinPowder)} g / オリーブオイル ${round1(oliveOil)} g`;

  saveState();
}

/* ===== 前回値保持 ===== */
function saveState() {
  const amounts = {};
  document.querySelectorAll("#foodTable tbody tr").forEach(row => {
    amounts[row.dataset.food] =
      row.querySelector("input").value;
  });

  localStorage.setItem("nutritionState", JSON.stringify({
    targetProtein: targetProtein.value,
    targetFat: targetFat.value,
    amounts
  }));
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


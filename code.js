const displayEl = document.getElementById("display");
let display = "0";
let prev = null;
let op = null;
let shouldReset = false;

function updateDisplay() {
  displayEl.textContent = display;
  displayEl.className = "";
  if (display.length > 9) displayEl.classList.add("small");
  else if (display.length > 6) displayEl.classList.add("medium");

  // Update active operator button
  document.querySelectorAll("button.op").forEach((btn) => {
    btn.classList.toggle(
      "active",
      btn.dataset.val === op && shouldReset && btn.dataset.val !== "="
    );
  });
}

function calculate(a, b, operator) {
  if (operator === "+") return a + b;
  if (operator === "−") return a - b;
  if (operator === "×") return a * b;
  if (operator === "÷") return b !== 0 ? a / b : 0;
  return b;
}

function formatNumber(n) {
  if (!isFinite(n)) return "Error";
  const str = String(n);
  return str.length > 12 ? n.toPrecision(8) : str;
}

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.val;

    if (val === "AC") {
      display = "0";
      prev = null;
      op = null;
      shouldReset = false;
      updateDisplay();
      return;
    }

    if (val === "±") {
      display = display.startsWith("-")
        ? display.slice(1)
        : display === "0"
        ? display
        : "-" + display;
      updateDisplay();
      return;
    }

    if (val === "%") {
      display = String(parseFloat(display) / 100);
      updateDisplay();
      return;
    }

    if (["+", "−", "×", "÷"].includes(val)) {
      if (prev !== null && op && !shouldReset) {
        const result = calculate(prev, parseFloat(display), op);
        display = formatNumber(result);
        prev = result;
      } else {
        prev = parseFloat(display);
      }
      op = val;
      shouldReset = true;
      updateDisplay();
      return;
    }

    if (val === "=") {
      if (prev !== null && op) {
        const result = calculate(prev, parseFloat(display), op);
        display = formatNumber(result);
        prev = null;
        op = null;
        shouldReset = true;
      }
      updateDisplay();
      return;
    }

    // Number or dot
    if (shouldReset) {
      display = val === "." ? "0." : val;
      shouldReset = false;
    } else {
      if (val === "." && display.includes(".")) return;
      display = display === "0" && val !== "." ? val : display + val;
    }
    updateDisplay();
  });
});

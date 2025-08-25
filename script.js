(function () {
  const historyEl = document.getElementById('history');
  const currentEl = document.getElementById('current');

  let current = '0';
  let prev = '';
  let op = null; // '+', '-', '*', '/'
  let justEvaluated = false;

  const updateDisplay = () => {
    currentEl.textContent = current;
    const opSymbol = op === '*' ? '×' : op === '/' ? '÷' : op || '';
    historyEl.textContent = prev ? `${prev} ${opSymbol}` : '';
  };

  const appendNumber = (digit) => {
    if (justEvaluated) { current = '0'; justEvaluated = false; }
    if (current === '0') current = digit;
    else current += digit;
    updateDisplay();
  };

  const appendDot = () => {
    if (justEvaluated) { current = '0'; justEvaluated = false; }
    if (!current.includes('.')) current += '.';
    updateDisplay();
  };

  const toggleSign = () => {
    if (current === '0' || current === 'Error') return;
    current = current.startsWith('-') ? current.slice(1) : '-' + current;
    updateDisplay();
  };

  const percent = () => {
    if (current === 'Error') return;
    const v = parseFloat(current.replace(/,/g, ''));
    if (isNaN(v)) return;
    current = String(v / 100);
    updateDisplay();
  };

  const chooseOperation = (nextOp) => {
    if (current === 'Error') return;
    if (op && prev !== '' && !justEvaluated) {
      compute();
    }
    prev = current;
    op = nextOp;
    current = '0';
    justEvaluated = false;
    updateDisplay();
  };

  const compute = () => {
    if (!op || prev === '' || current === '') return;
    const a = parseFloat(prev.replace(/,/g, ''));
    const b = parseFloat(current.replace(/,/g, ''));
    let result;
    switch (op) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = b === 0 ? NaN : a / b; break;
    }
    const shown = Number.isFinite(result) ? result : 'Error';
    current = String(shown);
    prev = '';
    op = null;
    justEvaluated = true;
    updateDisplay();
  };

  const clearAll = () => {
    current = '0'; prev = ''; op = null; justEvaluated = false; updateDisplay();
  };

  const del = () => {
    if (justEvaluated) { current = '0'; justEvaluated = false; updateDisplay(); return; }
    if (current.length <= 1 || (current.length === 2 && current.startsWith('-'))) current = '0';
    else current = current.slice(0, -1);
    updateDisplay();
  };

  // Button clicks
  document.querySelectorAll('[data-num]').forEach(btn =>
    btn.addEventListener('click', () => appendNumber(btn.textContent.trim()))
  );
  document.querySelectorAll('[data-op]').forEach(btn =>
    btn.addEventListener('click', () => chooseOperation(btn.getAttribute('data-op')))
  );
  document.querySelector('[data-action="dot"]').addEventListener('click', appendDot);
  document.querySelector('[data-action="equals"]').addEventListener('click', compute);
  document.querySelector('[data-action="clear"]').addEventListener('click', clearAll);
  document.querySelector('[data-action="del"]').addEventListener('click', del);
  document.querySelector('[data-action="percent"]').addEventListener('click', percent);
  document.querySelector('[data-action="sign"]').addEventListener('click', toggleSign);

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    const key = e.key;
    if (/^[0-9]$/.test(key)) { appendNumber(key); return; }
    if (key === '.') { appendDot(); return; }
    if (key === '+' || key === '-' || key === '*' || key === '/') { chooseOperation(key); return; }
    if (key === 'Enter' || key === '=') { e.preventDefault(); compute(); return; }
    if (key === 'Backspace') { del(); return; }
    if (key === 'Escape' || key === 'Delete') { clearAll(); return; }
    if (key === '%') { percent(); return; }
  });

  // Initialize display
  updateDisplay();
})();

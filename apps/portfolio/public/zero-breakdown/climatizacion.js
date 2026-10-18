(()=>{

  (function() {
    const btnSummer = document.getElementById('btn-summer');
    const btnWinter = document.getElementById('btn-winter');
    const stateLabel = document.getElementById('mode-state-label');
    const tempReadout = document.getElementById('live-temp-readout');
    const airflow = document.getElementById('airflow-overlay');

    if (btnSummer && btnWinter) {
      btnSummer.addEventListener('click', () => {
        btnSummer.className = 'flex items-center gap-2 px-4 py-2 rounded text-label-md font-label-md transition-all bg-surface-container-lowest text-on-surface shadow-sm';
        btnWinter.className = 'flex items-center gap-2 px-4 py-2 rounded text-label-md font-label-md text-on-surface-variant hover:text-on-surface transition-all';
        if (stateLabel) stateLabel.textContent = 'Modo Dinámico: Refrigeración Activa';
        if (tempReadout) tempReadout.textContent = '21.5°C • 620 m³/h';
        if (airflow) airflow.className = 'absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-80 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent flex items-center justify-center';
      });

      btnWinter.addEventListener('click', () => {
        btnWinter.className = 'flex items-center gap-2 px-4 py-2 rounded text-label-md font-label-md transition-all bg-surface-container-lowest text-on-surface shadow-sm';
        btnSummer.className = 'flex items-center gap-2 px-4 py-2 rounded text-label-md font-label-md text-on-surface-variant hover:text-on-surface transition-all';
        if (stateLabel) stateLabel.textContent = 'Modo Dinámico: Confort Térmico & Aerotermia';
        if (tempReadout) tempReadout.textContent = '23.8°C • Radiante Confort';
        if (airflow) airflow.className = 'absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-80 bg-gradient-to-t from-secondary-container/20 via-transparent to-transparent flex items-center justify-center';
      });
    }

    const slider = document.getElementById('slider-area');
    const areaVal = document.getElementById('slider-area-val');
    const currCost = document.getElementById('curr-cost-metric');
    const aeroCost = document.getElementById('aero-cost-metric');
    const annualSave = document.getElementById('annual-save-metric');
    const co2Val = document.getElementById('co2-metric');
    const kwhOld = document.getElementById('kwh-old');
    const kwhNew = document.getElementById('kwh-new');
    const barOld = document.getElementById('bar-old');
    const barNew = document.getElementById('bar-new');
    const fuelBtns = document.querySelectorAll('.fuel-btn');

    let currentMultiplier = 16.1;

    function updateCalculations() {
      if (!slider) return;
      const m2 = parseInt(slider.value, 10);
      if (areaVal) areaVal.textContent = m2 + ' m²';

      const oldCostNum = Math.round(m2 * currentMultiplier);
      const aeroCostNum = Math.round(m2 * 4.5);
      const saveNum = Math.max(0, oldCostNum - aeroCostNum);
      const co2Num = Math.round(m2 * 18.9);
      const oldKwhNum = Math.round(m2 * 94.6);
      const newKwhNum = Math.round(m2 * 21.6);

      if (currCost) currCost.textContent = oldCostNum.toLocaleString('es-ES') + ' €';
      if (aeroCost) aeroCost.textContent = aeroCostNum.toLocaleString('es-ES') + ' €';
      if (annualSave) annualSave.textContent = saveNum.toLocaleString('es-ES') + ' €';
      if (co2Val) co2Val.textContent = co2Num.toLocaleString('es-ES') + ' kg CO₂';
      if (kwhOld) kwhOld.textContent = oldKwhNum.toLocaleString('es-ES') + ' kWh';
      if (kwhNew) kwhNew.textContent = newKwhNum.toLocaleString('es-ES') + ' kWh';

      if (barOld) barOld.style.width = Math.min(100, Math.round((oldKwhNum / (450 * 94.6)) * 100)) + '%';
      if (barNew) barNew.style.width = Math.min(100, Math.round((newKwhNum / (450 * 94.6)) * 100)) + '%';
    }

    if (slider) {
      slider.addEventListener('input', updateCalculations);
    }

    fuelBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        fuelBtns.forEach(b => {
          b.className = 'fuel-btn p-3 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm text-center';
        });
        btn.className = 'fuel-btn p-3 rounded bg-surface-container-lowest text-on-surface font-label-sm text-label-sm text-center shadow-sm';
        const fuel = btn.getAttribute('data-fuel');
        if (fuel === 'gas') currentMultiplier = 16.1;
        if (fuel === 'diesel') currentMultiplier = 21.4;
        if (fuel === 'electric') currentMultiplier = 26.8;
        updateCalculations();
      });
    });

    updateCalculations();
  })();

// Form submissions are handled by the portfolio demo shell and are never sent.
})();

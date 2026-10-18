(()=>{

    (function initCalculadoraElectrica() {
      const tipoBtns = document.querySelectorAll('.calc-tipo-btn');
      const checkboxes = document.querySelectorAll('.calc-item');
      const slider = document.getElementById('superficie-slider');
      const supVal = document.getElementById('superficie-val');
      const resKw = document.getElementById('res-kw');
      const resTipoToma = document.getElementById('res-tipo-toma');
      const resSeccion = document.getElementById('res-seccion');
      const resAmperios = document.getElementById('res-amperios');

      let tipoActual = 'vivienda';
      if (tipoBtns.length > 0) {
        tipoBtns[0].classList.add('ring-2', 'ring-secondary', 'bg-surface-container-high');
      }

      tipoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          tipoBtns.forEach(b => b.classList.remove('ring-2', 'ring-secondary', 'bg-surface-container-high'));
          btn.classList.add('ring-2', 'ring-secondary', 'bg-surface-container-high');
          tipoActual = btn.getAttribute('data-tipo');
          actualizarCalculo();
        });
      });

      checkboxes.forEach(chk => {
        chk.addEventListener('change', actualizarCalculo);
      });

      if (slider) {
        slider.addEventListener('input', (e) => {
          if (supVal) supVal.textContent = e.target.value + ' m²';
          actualizarCalculo();
        });
      }

      function actualizarCalculo() {
        const m2 = slider ? parseFloat(slider.value) : 100;
        let baseKw = 3.0;

        if (tipoActual === 'vivienda') {
          baseKw = m2 > 150 ? 9.2 : 5.75;
        } else if (tipoActual === 'comercio') {
          baseKw = Math.max(10.0, m2 * 0.08);
        } else if (tipoActual === 'industrial') {
          baseKw = Math.max(25.0, m2 * 0.15);
        }

        let cargasExtra = 0;
        checkboxes.forEach(chk => {
          if (chk.checked) {
            cargasExtra += parseFloat(chk.getAttribute('data-kw') || 0);
          }
        });

        const totalKw = (baseKw + cargasExtra * 0.75).toFixed(1);
        if (resKw) resKw.textContent = totalKw;

        const kwNum = parseFloat(totalKw);
        if (kwNum > 15 || tipoActual === 'industrial') {
          if (resTipoToma) resTipoToma.textContent = 'Suministro Trifásico 400V · Acometida Industrial';
          const amp = (kwNum * 1000 / (1.732 * 400 * 0.9)).toFixed(1);
          if (resAmperios) resAmperios.textContent = amp + ' A';
          if (resSeccion) resSeccion.textContent = kwNum > 35 ? '35 mm² Cu' : '16 mm² Cu';
        } else {
          if (resTipoToma) resTipoToma.textContent = 'Suministro Monofásico 230V · Uso General';
          const amp = (kwNum * 1000 / (230 * 0.9)).toFixed(1);
          if (resAmperios) resAmperios.textContent = amp + ' A';
          if (resSeccion) resSeccion.textContent = kwNum > 7 ? '10 mm² Cu' : '6 mm² Cu';
        }
      }

      // Form submissions are handled by the portfolio demo shell and are never sent.
    })();
  
})();

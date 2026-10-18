(()=>{

    (function() {
      // Service buttons toggle logic
      const buttons = document.querySelectorAll('#service-selector .service-opt');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => {
            b.classList.remove('bg-on-tertiary-fixed', 'text-on-primary', 'shadow-sm');
            b.classList.add('bg-surface-container', 'text-on-surface');
          });
          btn.classList.remove('bg-surface-container', 'text-on-surface');
          btn.classList.add('bg-on-tertiary-fixed', 'text-on-primary', 'shadow-sm');
        });
      });

      // Simple animated counters
      const counters = document.querySelectorAll('.metric-counter');
      let triggered = false;
      
      const animateMetrics = () => {
        if (triggered) return;
        const rect = document.querySelector('.metric-counter')?.getBoundingClientRect();
        if (rect && rect.top < window.innerHeight - 50) {
          triggered = true;
          counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let current = 0;
            const step = Math.max(1, Math.floor(target / 40));
            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
              } else {
                counter.textContent = current;
              }
            }, 30);
          });
        }
      };

      window.addEventListener('scroll', animateMetrics, { signal: window.__zeroBreakdownLifecycle?.signal });
      animateMetrics();
    })();
  
// Form submissions are handled by the portfolio demo shell and are never sent.
})();

// Content remains readable with JavaScript or animation disabled.
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('reveal');
      reveal.unobserve(entry.target);
    }
  }, {threshold: 0.12});
  document.querySelectorAll('.brief, .story li, .stack-grid article, .terminal').forEach(element => reveal.observe(element));
}

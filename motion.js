// Project a torus knot into a rotating field of fine contours.
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const rotate = document.querySelector('#rotate');
function draw(time) {
  const size = canvas.clientWidth, height = canvas.clientHeight;
  const scale = Math.min(devicePixelRatio, 2);
  if (canvas.width !== Math.round(size*scale) || canvas.height !== Math.round(height*scale)) {
    canvas.width = Math.round(size*scale); canvas.height = Math.round(height*scale);
  }
  ctx.setTransform(scale,0,0,scale,0,0); ctx.clearRect(0,0,size,height);
  const angle = .42 + Number(rotate.value)*Math.PI/180 + (motion.matches ? 0 : Math.min(time,4900)*.00012);
  for (let ring=0; ring<190; ring++) {
    const t = ring*Math.PI/95, r = 1.1+.48*Math.cos(3*t);
    const x = r*Math.cos(2*t), y = r*Math.sin(2*t), z = .54*Math.sin(3*t);
    ctx.beginPath();
    for(let k=0;k<=40;k++){
      const u = k*Math.PI/20, dx = x+.23*Math.cos(u)*Math.cos(2*t), dy = y+.23*Math.cos(u)*Math.sin(2*t), dz=z+.23*Math.sin(u);
      const px=dx*Math.cos(angle)-dz*Math.sin(angle), depth=dx*Math.sin(angle)+dz*Math.cos(angle);
      const py=dy*.79-depth*.56, unit=Math.min(size,height)*.267;
      const sx=size/2+px*unit, sy=height/2+py*unit;
      if(k===0)ctx.moveTo(sx,sy);else ctx.lineTo(sx,sy);
    }
    ctx.strokeStyle='rgba(208,244,152,'+(.4+.22*Math.cos(2*t))+')';ctx.lineWidth=.9;ctx.stroke();
  }
  if(!motion.matches && time<4900)requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
new ResizeObserver(()=>draw(5000)).observe(canvas);
rotate.addEventListener('input',()=>draw(5000));
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add('entered');
    observer.unobserve(entry.target);
  }
});
document.querySelectorAll('.heading, .services article').forEach(el => observer.observe(el));
for (const flow of document.querySelectorAll('.flow')) {
  const buttons = flow.querySelectorAll('button');
  const output = flow.querySelector('.explain');
  for (const button of buttons) {
    button.addEventListener('click', () => {
      for (const option of buttons) option.setAttribute('aria-pressed', String(option === button));
      output.textContent = button.dataset.copy;
      if (!motion.matches) output.animate([{opacity:.25,transform:'translateY(4px)'},{opacity:1,transform:'none'}], {duration:220});
    });
  }
}

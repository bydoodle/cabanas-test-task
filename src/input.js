let start = null;
const path = document.querySelector('path');
const bump = 0;
path.setAttribute('d', `m 0,30 c 16.920055,0 8.8823519,-${bump} 30,-${bump} 21.117648,0 13.001352,${bump} 30,${bump} h 260`);
const duration = 600;
const easing = BezierEasing(0.4, 0.0, 0.2, 1);
const ph = document.querySelector('.placeholder');
const input = document.querySelector('input');
input.addEventListener('focus', () => {
  if (input.value.length === 0) {
    ph.classList.remove('return');
    ph.classList.add('expand');
    window.requestAnimationFrame(step);
  }
})
input.addEventListener('blur', () => {
  if (input.value.length === 0) {
    ph.classList.remove('expand');
    ph.classList.add('return');
  }
})

const animate = (inPct) => {
  const pct = easing(inPct);
  const newPct = 1 - 2 * Math.abs(0.5 - pct);
  const newBump = newPct * 25;
  path.setAttribute('d', `m 0,30 c 16.920055,0 8.8823519,-${newBump} 30,-${newBump} 21.117648,0 13.001352,${newBump} 30,${newBump} h 260`);
};

function step(timestamp) {
  if (!start) start = timestamp;
  const progress = (timestamp - start);
  let pct = progress / duration;
  if (pct > 1) pct = 1;
  animate(pct);
  if (progress < duration) {
    window.requestAnimationFrame(step);
  } else {
    start = null;
  }
}

console.log('hello aaaa')
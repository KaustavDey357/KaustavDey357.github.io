/* fx.js: effects and interactive components */

/* Variable-weight text: letters swell near the cursor and ripple on their own (works on touch too) */
function VarText(props) {
  var ref = useRef(null);
  useEffect(function () {
    if (reduce) return;
    var el = ref.current, spans = el.children, px = -1e4, py = -1e4, raf = 0, t0 = performance.now();
    function frame(now) {
      var t = (now - t0) / 1000, ks = [], i, r, d;
      for (i = 0; i < spans.length; i++) {
        r = spans[i].getBoundingClientRect();
        d = Math.sqrt(Math.pow(px - (r.left + r.width / 2), 2) + Math.pow(py - (r.top + r.height / 2), 2));
        ks.push(Math.max(Math.max(0, 1 - d / 170), (Math.sin(t * 2.2 - i * 0.8) + 1) / 2 * 0.55));
      }
      for (i = 0; i < spans.length; i++) {
        spans[i].style.fontVariationSettings = "'wght' " + Math.round(500 + 300 * ks[i]) + ", 'opsz' " + Math.round(20 + 76 * ks[i]);
      }
      raf = requestAnimationFrame(frame);
    }
    function onMove(e) { px = e.clientX; py = e.clientY; }
    window.addEventListener('pointermove', onMove, { passive: true });
    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { if (!raf) raf = requestAnimationFrame(frame); }
        else { cancelAnimationFrame(raf); raf = 0; }
      });
      io.observe(el);
    } else raf = requestAnimationFrame(frame);
    return function () {
      cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); if (io) io.disconnect();
    };
  }, []);
  return h('span', { ref: ref, className: 'vp', 'aria-label': props.text },
    props.text.split('').map(function (c, i) { return h('span', { key: i, className: 'vp-l', 'aria-hidden': true }, c); }));
}

/* Hero hook: "Works on my machine." glitches, gets struck out, then "Works on AWS." lands */
function Hook() {
  var s = useState(reduce ? 2 : 0), phase = s[0], setPhase = s[1];
  useEffect(function () {
    if (reduce) return;
    var a = setTimeout(function () { setPhase(1); }, 1700);
    var b = setTimeout(function () { setPhase(2); }, 2400);
    return function () { clearTimeout(a); clearTimeout(b); };
  }, []);
  return h('h1', { className: 'hero-title', 'aria-label': 'Works on my machine. Works on AWS.' },
    h('span', { className: 'hook-old' + (phase >= 1 ? ' struck' : ''), 'aria-hidden': true },
      h('span', { className: 'glitch' + (phase >= 1 ? ' calm' : ''), 'data-text': 'Works on my machine.' }, 'Works on my machine.')),
    h('span', { className: 'hook-new', 'aria-hidden': true },
      h(BlurText, { text: 'Works on AWS.', active: phase >= 2, segClass: 'gradient' })));
}

/* Animated deployment pipeline */
var STEPS = [['git push', 'git'], ['Build', 'layers'], ['Test', 'code'], ['Terraform apply', 'cloud'], ['Live on AWS', 'bolt']];
function Pipeline() {
  var s = useState(reduce ? STEPS.length : 0), n = s[0], setN = s[1];
  useEffect(function () {
    if (reduce) return;
    var i = 0, id = 0;
    var start = setTimeout(function () {
      id = setInterval(function () { i = (i + 1) % (STEPS.length + 3); setN(Math.min(i, STEPS.length)); }, 750);
    }, 2800);
    return function () { clearTimeout(start); clearInterval(id); };
  }, []);
  return h('ol', { className: 'pipe rise', style: { animationDelay: '2.4s' }, 'aria-label': 'Pipeline: push, build, test, Terraform apply, live on AWS' },
    STEPS.map(function (st, i) {
      return h('li', { key: st[0], className: 'pipe-step' + (i < n ? ' done' : '') + (i === n - 1 ? ' now' : '') },
        h(Icon, { d: ICONS[st[1]] }), st[0]);
    }));
}

/* Marquee */
function Marquee(props) {
  var track = useRef(null);
  var list = props.items.concat(props.items);
  function group(hidden, key) {
    return h('div', { className: 'mq-group', key: key, 'aria-hidden': hidden || undefined },
      list.map(function (t, i) { return h('span', { className: 'mq-item', key: i }, t); }));
  }
  useEffect(function () {
    if (reduce) return;
    var el = track.current, x = 0, vel = 0, raf = 0;
    var last = performance.now(), lastY = window.scrollY;
    function tick(now) {
      var dt = Math.min((now - last) / 1000, 0.05); last = now;
      var y = window.scrollY, sv = dt ? Math.abs(y - lastY) / dt : 0; lastY = y;
      vel += (Math.min(sv, 2500) / 2500 * 220 - vel) * 0.1;
      var w = el.firstChild ? el.firstChild.offsetWidth : 0;
      x -= (45 + vel) * dt;
      if (w && -x >= w) x += w;
      el.style.transform = 'translate3d(' + x + 'px,0,0)';
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return function () { cancelAnimationFrame(raf); };
  }, []);
  return h('div', { className: 'marquee' + (reduce ? ' static' : ''), role: 'presentation' },
    h('div', { className: 'track', ref: track }, reduce ? group(false, 'a') : [group(false, 'a'), group(true, 'b')]));
}

/* Magic card: cursor spotlight, glowing border, tilt and sparkle particles */
function Spot(props) {
  var ref = useRef(null);
  function move(e) {
    var el = ref.current; if (!el) return;
    var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
    if (props.tilt && finePointer && !reduce) {
      var px = x / r.width - 0.5, py = y / r.height - 0.5;
      el.style.transform = 'perspective(800px) rotateX(' + (-py * 6).toFixed(2) + 'deg) rotateY(' + (px * 6).toFixed(2) + 'deg)';
    }
  }
  function enter() {
    var el = ref.current; if (!el || !finePointer || reduce) return;
    for (var i = 0; i < 7; i++) {
      var p = document.createElement('span');
      p.className = 'pt';
      p.style.left = (Math.random() * 100) + '%';
      p.style.top = (45 + Math.random() * 55) + '%';
      p.style.setProperty('--dx', (Math.random() * 44 - 22) + 'px');
      p.style.animationDelay = (Math.random() * 0.5) + 's';
      p.addEventListener('animationend', function (e) { if (e.target.parentNode) e.target.parentNode.removeChild(e.target); });
      el.appendChild(p);
    }
  }
  function leave() { if (ref.current) ref.current.style.transform = ''; }
  var p = {
    ref: ref, onMouseMove: move, onMouseEnter: enter, onMouseLeave: leave,
    className: 'spot ' + (props.tilt ? 'tilt ' : '') + (props.className || '')
  };
  if (props.id) p.id = props.id;
  if (props.href) { p.href = props.href; p.target = '_blank'; p.rel = 'noopener noreferrer'; }
  return h(props.href ? 'a' : 'div', p, props.children);
}

/* Dock with magnification */
function Dock(props) {
  var items = useRef([]);
  var size = 44, max = 70, range = 120;
  function onMove(e) {
    if (!finePointer || reduce) return;
    items.current.forEach(function (el) {
      if (!el) return;
      var r = el.getBoundingClientRect(), d = Math.abs(e.clientX - (r.left + r.width / 2));
      var s = size + (max - size) * Math.max(0, 1 - d / range);
      el.style.width = s + 'px'; el.style.height = s + 'px';
    });
  }
  function onLeave() {
    items.current.forEach(function (el) { if (el) { el.style.width = ''; el.style.height = ''; } });
  }
  return h('nav', { className: 'dock', 'aria-label': 'Quick navigation' },
    h('div', { className: 'dock-panel', onMouseMove: onMove, onMouseLeave: onLeave },
      props.items.map(function (it, i) {
        var a = { key: it.label, className: 'dock-item', 'aria-label': it.label, href: it.href, ref: function (el) { items.current[i] = el; } };
        if (it.external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        return h('a', a, h(Icon, { d: ICONS[it.icon] }), h('span', { className: 'dock-label' }, it.label));
      })));
}

/* Cursor reveal: a lens follows the pointer (or your finger) and shows the Terraform behind the hero */
var HCL = [
  'resource "aws_instance" "app" {',
  '  ami           = var.ami',
  '  instance_type = "t3.micro"',
  '  user_data     = file("deploy.sh")',
  '}',
  '',
  'resource "aws_lb" "web" {',
  '  load_balancer_type = "application"',
  '}',
  '',
  '$ terraform apply -auto-approve',
  'Apply complete! Resources: 5 added.',
  ''
];
function Reveal() {
  var ref = useRef(null);
  useEffect(function () {
    if (reduce) return;
    var hero = ref.current.parentNode;
    var x = -400, y = -400, r = 0, tx = -400, ty = -400, tr = 0, lastMove = 0, raf = 0, visible = true;
    function frame(now) {
      if (!finePointer && now - lastMove > 1400) tr = 0;
      x += (tx - x) * 0.16; y += (ty - y) * 0.16; r += (tr - r) * 0.14;
      hero.style.setProperty('--rx', x.toFixed(1) + 'px');
      hero.style.setProperty('--ry', y.toFixed(1) + 'px');
      hero.style.setProperty('--rr', Math.max(0, r).toFixed(1) + 'px');
      raf = visible ? requestAnimationFrame(frame) : 0;
    }
    function point(e) {
      var b = hero.getBoundingClientRect(), px = e.clientX - b.left, py = e.clientY - b.top;
      if (px < 0 || py < 0 || px > b.width || py > b.height) { if (finePointer) tr = 0; return; }
      if (r < 5) { x = px; y = py; }
      tx = px; ty = py; tr = finePointer ? 120 : 90; lastMove = performance.now();
    }
    function leave() { tr = 0; }
    window.addEventListener('pointermove', point, { passive: true });
    window.addEventListener('pointerdown', point, { passive: true });
    document.addEventListener('mouseleave', leave);
    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(frame);
      });
      io.observe(hero);
    }
    raf = requestAnimationFrame(frame);
    return function () {
      cancelAnimationFrame(raf); if (io) io.disconnect();
      window.removeEventListener('pointermove', point); window.removeEventListener('pointerdown', point);
      document.removeEventListener('mouseleave', leave);
    };
  }, []);
  var code = HCL.concat(HCL, HCL, HCL).join('\n');
  return h('div', { className: 'reveal', ref: ref, 'aria-hidden': true },
    h('div', { className: 'reveal-layer' }, h('pre', { className: 'reveal-code' }, code)),
    h('div', { className: 'reveal-ring' }));
}

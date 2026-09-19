/* base.js: helpers, icons, DotGrid, text effects */

  var FALLBACK_HTML =
    '<div class="fallback"><h1>Kaustav Dey – DevOps &amp; Cloud Specialist</h1>' +
    '<p>Something went wrong loading this page. Contact: ' +
    '<a href="mailto:deykaustav357@gmail.com">deykaustav357@gmail.com</a> · ' +
    '<a href="https://github.com/KaustavDey357">GitHub</a></p></div>';
  var rootEl = document.getElementById('root');

  if (!window.React || !window.ReactDOM) { rootEl.innerHTML = FALLBACK_HTML; }

  var h = React.createElement;
  var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Helpers ---------- */
  function useInView(ref, threshold) {
    var s = useState(false), seen = s[0], setSeen = s[1];
    useEffect(function () {
      var el = ref.current;
      if (!el) return;
      if (!('IntersectionObserver' in window)) { setSeen(true); return; }
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { setSeen(true); io.disconnect(); }
      }, { threshold: threshold || 0.2 });
      io.observe(el);
      return function () { io.disconnect(); };
    }, []);
    return seen;
  }

  function Icon(props) {
    return h('svg', {
      viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8,
      strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true
    }, [].concat(props.d).map(function (p, i) { return h('path', { key: i, d: p }); }));
  }
  var ICONS = {
    home: ['M3 11l9-8 9 8', 'M5 10v10h14V10', 'M10 20v-6h4v6'],
    layers: ['M12 3l9 5-9 5-9-5 9-5z', 'M3 13l9 5 9-5'],
    code: ['M8 8l-5 4 5 4', 'M16 8l5 4-5 4', 'M14 5l-4 14'],
    doc: ['M6 3h9l4 4v14H6z', 'M14 3v5h5', 'M9 13h7', 'M9 17h7'],
    mail: ['M3 6h18v12H3z', 'M3 7l9 7 9-7'],
    ext: ['M7 17L17 7', 'M8 7h9v9'],
    git: ['M6 3v12', 'M18 9a3 3 0 100-6 3 3 0 000 6z', 'M6 21a3 3 0 100-6 3 3 0 000 6z', 'M18 9a9 9 0 01-9 9'],
    cloud: ['M7 18a4 4 0 010-8 5 5 0 019.6-1A4.5 4.5 0 0117 18H7z'],
    bolt: ['M13 2L4 14h7l-1 8 9-12h-7l1-8z'],
    moon: ['M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z']
  };

  /* ---------- DotGrid ---------- */
  function hexRgb(hex, fallback) {
    hex = String(hex || '').replace('#', '').trim();
    if (!hex) return fallback;
    if (hex.length === 3) hex = hex.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(hex, 16);
    if (isNaN(n)) return fallback;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function DotGrid(props) {
    var dotSize = props.dotSize || 3, gap = props.gap || 30, proximity = props.proximity || 150;
    var wrap = useRef(null), cv = useRef(null);
    useEffect(function () {
      var canvas = cv.current, ctx = canvas.getContext('2d'), root = document.documentElement;
      var W = 0, H = 0, dots = [], raf = 0, visible = true, lastAct = 0, colorAt = -1e9;
      var base = [188, 217, 198], hot = [21, 128, 61], baseStr = 'rgb(188,217,198)';
      var mouse = { x: -1e4, y: -1e4 }, waves = [];

      function readColors() {
        var cs = getComputedStyle(root);
        base = hexRgb(cs.getPropertyValue('--dot'), base);
        hot = hexRgb(cs.getPropertyValue('--dot-hot'), hot);
        baseStr = 'rgb(' + base[0] + ',' + base[1] + ',' + base[2] + ')';
      }

      function draw(now) {
        if (now - colorAt > 500) { readColors(); colorAt = now; }
        ctx.clearRect(0, 0, W, H);
        waves = waves.filter(function (w) { return now - w.t < 900; });
        for (var i = 0; i < dots.length; i++) {
          var d = dots[i], tx = 0, ty = 0, t = 0;
          var mx = d.x - mouse.x, my = d.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
          if (md < proximity) {
            t = 1 - md / proximity; t = t * t * (3 - 2 * t);
            var k = (t * 10) / (md || 1); tx += mx * k; ty += my * k;
          }
          for (var j = 0; j < waves.length; j++) {
            var w = waves[j], age = now - w.t, r = age * 0.7;
            var wx = d.x - w.x, wy = d.y - w.y, wd = Math.sqrt(wx * wx + wy * wy), off = Math.abs(wd - r);
            if (off < 50) {
              var s0 = (1 - off / 50) * (1 - age / 900), f = (s0 * 18) / (wd || 1);
              tx += wx * f; ty += wy * f; if (s0 > t) t = s0;
            }
          }
          d.dx += (tx - d.dx) * 0.12; d.dy += (ty - d.dy) * 0.12;
          if (t < 0.01) {
            ctx.fillStyle = baseStr;
          } else {
            ctx.fillStyle = 'rgb(' + Math.round(base[0] + (hot[0] - base[0]) * t) + ',' +
              Math.round(base[1] + (hot[1] - base[1]) * t) + ',' +
              Math.round(base[2] + (hot[2] - base[2]) * t) + ')';
          }
          ctx.beginPath();
          ctx.arc(d.x + d.dx, d.y + d.dy, (dotSize * (1 + t * 1.6)) / 2, 0, 6.2832);
          ctx.fill();
        }
      }

      function loop(now) {
        draw(now);
        if (visible && now - lastAct < 1200) raf = requestAnimationFrame(loop); else raf = 0;
      }
      function kick() {
        lastAct = performance.now();
        if (!raf && visible && !reduce) raf = requestAnimationFrame(loop);
      }

      function build() {
        var r = wrap.current.getBoundingClientRect();
        W = r.width; H = r.height;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, Math.round(W * dpr)); canvas.height = Math.max(1, Math.round(H * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        dots = [];
        var cols = Math.floor(W / gap) + 1, rows = Math.floor(H / gap) + 1;
        var ox = (W - (cols - 1) * gap) / 2, oy = (H - (rows - 1) * gap) / 2;
        for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) dots.push({ x: ox + x * gap, y: oy + y * gap, dx: 0, dy: 0 });
        colorAt = -1e9;
        draw(performance.now());
      }

      function refresh() { colorAt = -1e9; draw(performance.now()); }

      function onMove(e) {
        var r = canvas.getBoundingClientRect(), y = e.clientY - r.top;
        if (y < -proximity || y > r.height + proximity) {
          if (mouse.x > -1e3) { mouse.x = mouse.y = -1e4; kick(); }
          return;
        }
        mouse.x = e.clientX - r.left; mouse.y = y; kick();
      }
      function onDown(e) {
        var r = canvas.getBoundingClientRect(), y = e.clientY - r.top;
        if (y < 0 || y > r.height) return;
        waves.push({ x: e.clientX - r.left, y: y, t: performance.now() });
        kick();
      }

      build();

      var ro = null;
      if ('ResizeObserver' in window) { ro = new ResizeObserver(build); ro.observe(wrap.current); }
      else window.addEventListener('resize', build);

      var io = null;
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); });
        io.observe(wrap.current);
      }

      var mo = new MutationObserver(refresh);
      mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', refresh);

      if (!reduce) {
        if (finePointer) window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerdown', onDown, { passive: true });
      }

      return function () {
        if (raf) cancelAnimationFrame(raf);
        if (ro) ro.disconnect(); else window.removeEventListener('resize', build);
        if (io) io.disconnect();
        mo.disconnect();
        if (mq.removeEventListener) mq.removeEventListener('change', refresh);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerdown', onDown);
      };
    }, []);
    return h('div', { className: 'dotgrid', ref: wrap, 'aria-hidden': true }, h('canvas', { ref: cv }));
  }

  /* ---------- Text effects ---------- */
  function BlurText(props) {
    var ref = useRef(null), seen = useInView(ref, 0.1);
    var words = props.text.split(' '), kids = [];
    words.forEach(function (w, i) {
      kids.push(h('span', {
        key: 'w' + i, 'aria-hidden': true,
        className: 'bt-seg' + (props.segClass ? ' ' + props.segClass : '') + ((props.active !== undefined ? props.active : seen) ? ' in' : ''),
        style: { transitionDelay: (reduce ? 0 : i * 70 + (props.delay || 0)) + 'ms' }
      }, w));
      if (i < words.length - 1) kids.push(' ');
    });
    return h('span', { ref: ref, 'aria-label': props.text }, kids);
  }

  function Decrypt(props) {
    var s = useState(props.text), txt = s[0], setTxt = s[1];
    var ref = useRef(null), seen = useInView(ref, 0.1);
    useEffect(function () {
      if (!seen || reduce) return;
      var chars = '!<>-_/[]{}=+*^?#01', n = 0, src = props.text;
      var id = setInterval(function () {
        n++;
        var reveal = Math.floor(n / 2);
        if (reveal >= src.length) { clearInterval(id); setTxt(src); return; }
        setTxt(src.split('').map(function (c, i) {
          return (c === ' ' || i < reveal) ? c : chars.charAt(Math.floor(Math.random() * chars.length));
        }).join(''));
      }, 45);
      return function () { clearInterval(id); };
    }, [seen]);
    return h('span', { className: 'decrypt', ref: ref },
      h('span', { className: 'decrypt-sizer' }, props.text),
      h('span', { className: 'decrypt-live', 'aria-hidden': true }, txt));
  }


/* app.js: marquee, cards, dock, sections, mount */
  /* ---------- Marquee ---------- */
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

  /* ---------- Spotlight / tilt card ---------- */
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
    function leave() { if (ref.current) ref.current.style.transform = ''; }
    var p = {
      ref: ref, onMouseMove: move, onMouseLeave: leave,
      className: 'spot ' + (props.tilt ? 'tilt ' : '') + (props.className || '')
    };
    if (props.href) { p.href = props.href; p.target = '_blank'; p.rel = 'noopener noreferrer'; }
    return h(props.href ? 'a' : 'div', p, props.children);
  }

  /* ---------- Dock ---------- */
  function Dock(props) {
    var panel = useRef(null), items = useRef([]);
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
      h('div', { className: 'dock-panel', ref: panel, onMouseMove: onMove, onMouseLeave: onLeave },
        props.items.map(function (it, i) {
          var common = {
            key: it.label, className: 'dock-item', 'aria-label': it.label,
            ref: function (el) { items.current[i] = el; }
          };
          var kids = [h(Icon, { key: 'i', d: ICONS[it.icon] }), h('span', { key: 'l', className: 'dock-label' }, it.label)];
          if (it.onClick) { common.onClick = it.onClick; common.type = 'button'; return h('button', common, kids); }
          common.href = it.href;
          if (it.external) { common.target = '_blank'; common.rel = 'noopener noreferrer'; }
          return h('a', common, kids);
        })));
  }

  /* ---------- Content ---------- */
  var EMAIL = 'mailto:deykaustav357@gmail.com';
  var GITHUB = 'https://github.com/KaustavDey357';
  var STACK = ['AWS', 'Terraform', 'Docker', 'GitHub Actions', 'CI/CD', 'EC2', 'Linux', 'Bash'];

  var SERVICES = [
    { icon: 'cloud', title: 'AWS infrastructure', text: 'EC2, security groups and load balancers defined as Terraform, so every environment is repeatable and version-controlled.' },
    { icon: 'layers', title: 'Docker packaging', text: 'Your app containerized so it runs the same on your laptop, in CI and in production.' },
    { icon: 'bolt', title: 'CI/CD pipelines', text: 'GitHub Actions that build, test and deploy on every push, so shipping stops being a manual chore.' }
  ];

  var PROJECTS = [
    {
      title: 'ci-cd-aws-docker',
      text: 'A Dockerized app provisioned on AWS with Terraform and deployed automatically through GitHub Actions using SCP and SSH.',
      tags: ['AWS', 'Terraform', 'Docker', 'GitHub Actions'],
      href: GITHUB + '/ci-cd-aws-docker'
    },
    {
      title: 'This portfolio',
      text: 'A single-file React site with an interactive dot grid, scroll-driven marquee and light and dark themes, hosted on GitHub Pages.',
      tags: ['React', 'Canvas', 'GitHub Pages'],
      href: GITHUB + '/KaustavDey357.github.io'
    }
  ];

  var POSTS = [
    {
      title: 'How I deployed a Dockerized app to AWS using Terraform and GitHub Actions',
      src: 'DEV Community',
      href: 'https://dev.to/kaustav_dey_/how-i-deployed-a-dockerized-app-to-aws-using-terraform-and-github-actions-3nhg'
    }
  ];

  /* ---------- Sections ---------- */
  function Hero() {
    return h('header', { className: 'hero', id: 'top' },
      h(DotGrid, null),
      h('div', { className: 'wrap hero-inner' },
        h('div', { className: 'topbar' },
          h('span', { className: 'brand' }, 'Kaustav Dey'),
          h('span', { className: 'role' }, h(Decrypt, { text: 'DevOps & Cloud Specialist' }))),
        h('div', { className: 'hero-main' },
          h('h1', { className: 'hero-title' },
            h(BlurText, { text: 'Ship your app to AWS with' }), ' ',
            h('span', { className: 'gradient' }, 'Terraform, Docker and CI/CD')),
          h('p', { className: 'lead rise' }, 'I help solo developers and early-stage startups get from a working app to a repeatable, automated deployment on AWS.'),
          h('div', { className: 'cta rise' },
            h('a', { className: 'btn btn-primary', href: EMAIL }, h(Icon, { d: ICONS.mail }), 'Email me'),
            h('a', { className: 'btn btn-ghost', href: GITHUB, target: '_blank', rel: 'noopener noreferrer' }, h(Icon, { d: ICONS.git }), 'GitHub')))));
  }

  function Services() {
    return h('section', { className: 'block wrap', id: 'services' },
      h('h2', null, 'What I do'),
      h('div', { className: 'services' },
        SERVICES.map(function (s) {
          return h(Spot, { key: s.title, tilt: true, className: 'service' },
            h('div', { className: 'ico' }, h(Icon, { d: ICONS[s.icon] })),
            h('h3', null, s.title),
            h('p', null, s.text));
        })));
  }

  function Featured() {
    return h('section', { className: 'block lead-block wrap', 'aria-labelledby': 'lx' },
      h(Spot, { className: 'feature' },
        h('div', { className: 'feature-main' },
          h('span', { className: 'badge' }, 'Founder'),
          h('h2', { className: 'feature-title', id: 'lx' }, h('span', { className: 'shiny' }, 'LeadsExpo')),
          h('p', { className: 'feature-tagline' }, 'A product I am building and running solo.'),
          h('p', { className: 'feature-note' }, 'It is where I apply everything I offer clients: infrastructure as code, containers and automated releases.'),
          h('div', { className: 'tags' }, ['AWS', 'Terraform', 'Docker', 'CI/CD'].map(function (t) { return h('span', { className: 'tag', key: t }, t); }))),
        h('div', { className: 'feature-points' },
          [
            ['Repeatable infrastructure', 'Every resource is described in code, so rebuilding an environment takes minutes.'],
            ['Automated releases', 'A push to main builds, tests and deploys without manual steps.'],
            ['Built by one person', 'Simple, low-maintenance choices that a small team can actually run.']
          ].map(function (p) {
            return h('div', { className: 'point', key: p[0] }, h('h3', null, p[0]), h('p', null, p[1]));
          }))));
  }

  function Work() {
    return h('section', { className: 'block wrap', id: 'work' },
      h('h2', null, 'Projects'),
      h('div', { className: 'projects' },
        PROJECTS.map(function (p) {
          return h(Spot, { key: p.title, tilt: true, href: p.href, className: 'project' },
            h('h3', null, p.title),
            h('p', null, p.text),
            h('span', { className: 'repo' }, h(Icon, { d: ICONS.git }), 'View repository'),
            h('div', { className: 'tags' }, p.tags.map(function (t) { return h('span', { className: 'tag', key: t }, t); })));
        })));
  }

  function Writing() {
    return h('section', { className: 'block wrap', id: 'writing' },
      h('h2', null, 'Writing'),
      h('div', { className: 'posts' },
        POSTS.map(function (p) {
          return h('a', { className: 'post', key: p.href, href: p.href, target: '_blank', rel: 'noopener noreferrer' },
            h('span', { className: 'post-title' }, p.title),
            h('span', { className: 'post-src' }, p.src, h(Icon, { d: ICONS.ext })));
        })));
  }

  function Contact() {
    return h('section', { className: 'block wrap contact', id: 'contact' },
      h('h2', null, 'Have an app to deploy? Let us talk.'),
      h('a', { className: 'btn btn-primary btn-lg', href: EMAIL }, h(Icon, { d: ICONS.mail }), 'deykaustav357@gmail.com'),
      h('div', { className: 'links' },
        h('a', { href: GITHUB, target: '_blank', rel: 'noopener noreferrer' }, 'GitHub'),
        h('a', { href: 'https://www.linkedin.com/in/KaustavDey357', target: '_blank', rel: 'noopener noreferrer' }, 'LinkedIn'),
        h('a', { href: 'https://dev.to/kaustav_dey_', target: '_blank', rel: 'noopener noreferrer' }, 'DEV Community')));
  }

  function App() {
    function toggleTheme() {
      var root = document.documentElement;
      var cur = root.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      root.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
    }
    var dock = [
      { label: 'Home', icon: 'home', href: '#top' },
      { label: 'What I do', icon: 'layers', href: '#services' },
      { label: 'Projects', icon: 'code', href: '#work' },
      { label: 'Writing', icon: 'doc', href: '#writing' },
      { label: 'Contact', icon: 'mail', href: '#contact' },
      { label: 'Toggle theme', icon: 'moon', onClick: toggleTheme }
    ];
    return h(React.Fragment, null,
      h(Hero),
      h(Marquee, { items: STACK }),
      h('main', null, h(Featured), h(Services), h(Work), h(Writing), h(Contact)),
      h('footer', null, h('div', { className: 'wrap' }, h('div', { className: 'divider' }, '© 2026 Kaustav Dey'))),
      h(Dock, { items: dock }));
  }

  /* ---------- Error boundary + mount ---------- */
  function Boundary(props) { React.Component.call(this, props); this.state = { failed: false }; }
  Boundary.prototype = Object.create(React.Component.prototype);
  Boundary.prototype.constructor = Boundary;
  Boundary.getDerivedStateFromError = function () { return { failed: true }; };
  Boundary.prototype.componentDidCatch = function (err) { console.error('Render error:', err); };
  Boundary.prototype.render = function () {
    if (this.state.failed) {
      return h('div', { className: 'fallback' },
        h('h1', null, 'Kaustav Dey – DevOps & Cloud Specialist'),
        h('p', null, 'Something went wrong loading this page. Contact: ',
          h('a', { href: EMAIL }, 'deykaustav357@gmail.com'), ' · ',
          h('a', { href: GITHUB }, 'GitHub')));
    }
    return this.props.children;
  };

  try {
    ReactDOM.createRoot(rootEl).render(h(Boundary, null, h(App)));
  } catch (err) {
    console.error(err);
    rootEl.innerHTML = FALLBACK_HTML;
  }

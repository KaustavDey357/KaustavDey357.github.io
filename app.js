/* app.js: content, sections, mount */
var EMAIL = 'mailto:deykaustav357@gmail.com';
var GITHUB = 'https://github.com/KaustavDey357';
var DEVTO = 'https://dev.to/kaustav_dey_';
var STACK = ['AWS', 'Terraform', 'Docker', 'GitHub Actions', 'CI/CD', 'EC2', 'S3', 'CloudFront', 'Lambda', 'Linux'];
function ext(url) { return /^https?:/.test(url); }

var SERVICES = [
  { icon: 'cloud', title: 'Infrastructure as Code', text: 'I use Terraform to provision scalable infrastructure on AWS. From EC2 and load balancers to security groups, I build reusable modules for startups and solo developers.' },
  { icon: 'bolt', title: 'CI/CD pipelines', text: 'Automated GitHub Actions pipelines that build, test and deploy Dockerized apps to AWS EC2, so releases are fast, reliable and secure.' },
  { icon: 'layers', title: 'Cloud hosting and deployment', text: 'Static sites on S3 and CloudFront with custom domains, HTTPS and caching, plus full-stack apps deployed and monitored on AWS.' }
];

var PROJECTS = [
  { title: 'AWS static website hosting', text: 'A frontend hosted on S3 and delivered through CloudFront over HTTPS, with custom domain support and cache control.', tags: ['S3', 'CloudFront', 'Terraform'], href: GITHUB + '/aws-static-hosting-terraform' },
  { title: 'Terraform: EC2 and load balancer', text: 'EC2, security groups and an application load balancer provisioned with reusable, modular Terraform.', tags: ['Terraform', 'EC2', 'ALB'], href: GITHUB + '/Terraform-AWS-EC2-Load-Balancer-Deployment' },
  { title: 'CI/CD to EC2 with GitHub Actions', text: 'A Dockerized app built and deployed to EC2 by a GitHub Actions pipeline. An end-to-end DevOps demo.', tags: ['Docker', 'GitHub Actions', 'EC2'], href: GITHUB + '/ci-cd-aws-docker' },
  { title: 'Serverless image optimizer', text: 'A cost-efficient image optimization pipeline built with AWS Lambda, S3 and API Gateway, and kept within the free tier.', tags: ['Lambda', 'S3', 'API Gateway'], href: GITHUB + '/serverless-image-optimizer' },
  { title: 'Chroma 2.0', text: 'A voice chatbot that uses Wikipedia to answer questions about Indian history.', tags: ['Python', 'Voice', 'Wikipedia'], href: GITHUB + '/Chroma-2.0' },
  { title: 'This portfolio', text: 'A React site with an interactive dot grid, a deployment pipeline animation and a scroll-driven marquee, hosted on GitHub Pages.', tags: ['React', 'Canvas', 'GitHub Pages'], href: GITHUB + '/KaustavDey357.github.io' }
];

var POSTS = [
  { title: 'How I deployed a Dockerized app to AWS using Terraform and GitHub Actions', src: 'DEV Community', date: '2025-05-15', href: 'https://dev.to/kaustav_dey_/how-i-deployed-a-dockerized-app-to-aws-using-terraform-and-github-actions-3nhg' },
  { title: 'How I provisioned scalable AWS infrastructure with Terraform and a load balancer', src: 'DEV Community', date: '2025-05-15', href: 'https://dev.to/kaustav_dey_/how-i-provisioned-scalable-aws-infrastructure-with-terraform-and-load-balancer-4n5g' }
];
MEDIUM_POSTS.forEach(function (m) { POSTS.push({ title: m.title, src: 'Medium', date: m.date, href: m.href }); });
POSTS.sort(function (x, y) { return x.date < y.date ? 1 : x.date > y.date ? -1 : 0; });
function fmtDate(d) { try { return new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }); } catch (e) { return ''; } }

function Tags(props) { return h('div', { className: 'tags' }, props.list.map(function (t) { return h('span', { className: 'tag', key: t }, t); })); }

function Hero() {
  return h('header', { className: 'hero', id: 'top' },
    h(DotGrid, null),
    h('div', { className: 'wrap hero-inner' },
      h('div', { className: 'topbar' },
        h('span', { className: 'brand' }, 'Kaustav Dey'),
        h('span', { className: 'role' }, h(Decrypt, { text: 'DevOps & Cloud Specialist' }))),
      h('div', { className: 'hero-main' },
        h(Hook),
        h('p', { className: 'lead rise' }, 'I take apps from your laptop to AWS with Terraform, Docker and CI/CD, so every push deploys itself.'),
        h('div', { className: 'cta rise' },
          h('a', { className: 'btn btn-primary', href: EMAIL }, h(Icon, { d: ICONS.mail }), 'Email me'),
          h('a', { className: 'btn btn-ghost', href: GITHUB, target: '_blank', rel: 'noopener noreferrer' }, h(Icon, { d: ICONS.git }), 'GitHub')),
        h(Pipeline))),
    h(Reveal));
}

function Featured() {
  return h('section', { className: 'block lead-block wrap', 'aria-labelledby': 'lx' },
    h(Spot, { className: 'feature', id: 'leadsexpo' },
      h('div', { className: 'feature-main' },
        h('span', { className: 'badge' }, 'Founder'),
        h('h2', { className: 'feature-title', id: 'lx' }, h(VarText, { text: 'LeadsExpo' })),
        h('p', { className: 'feature-tagline' }, 'A product I am building and running solo.'),
        h('p', { className: 'feature-note' }, 'It is where I use everything I offer clients: infrastructure as code, containers and automated releases.'),
        Tags({ list: ['AWS', 'Terraform', 'Docker', 'CI/CD'] }),
        LEADSEXPO_URL ? h('a', { className: 'btn btn-primary', href: LEADSEXPO_URL, target: '_blank', rel: 'noopener noreferrer' }, h(Icon, { d: ICONS.ext }), 'Visit LeadsExpo') : null),
      h('div', { className: 'feature-points' },
        [
          ['Repeatable infrastructure', 'Every resource is described in code, so rebuilding an environment takes minutes.'],
          ['Automated releases', 'A push to main builds, tests and deploys without manual steps.'],
          ['Built by one person', 'Simple, low-maintenance choices that a small team can actually run.']
        ].map(function (p) { return h('div', { className: 'point', key: p[0] }, h('h3', null, p[0]), h('p', null, p[1])); }))));
}

function Services() {
  return h('section', { className: 'block wrap', id: 'services' },
    h('h2', null, 'What I do'),
    h('p', { className: 'section-lead' }, 'I help solo developers and early-stage startups deploy apps to AWS using DevOps best practices.'),
    h('div', { className: 'services' },
      SERVICES.map(function (s) {
        return h(Spot, { key: s.title, tilt: true, className: 'service' },
          h('div', { className: 'ico' }, h(Icon, { d: ICONS[s.icon] })),
          h('h3', null, s.title), h('p', null, s.text));
      })));
}

function Work() {
  return h('section', { className: 'block wrap', id: 'work' },
    h('h2', null, 'Projects'),
    h('div', { className: 'projects' },
      PROJECTS.map(function (p) {
        return h(Spot, { key: p.title, tilt: true, href: p.href, className: 'project' },
          h('h3', null, p.title), h('p', null, p.text),
          h('span', { className: 'repo' }, h(Icon, { d: ICONS.git }), 'View repository'),
          Tags({ list: p.tags }));
      })));
}

function Writing() {
  var s = useState(false), all = s[0], setAll = s[1];
  var shown = all ? POSTS : POSTS.slice(0, 6);
  return h('section', { className: 'block wrap', id: 'writing' },
    h('h2', null, 'Writing'),
    h('div', { className: 'posts' },
      shown.map(function (p) {
        return h('a', { className: 'post', key: p.href, href: p.href, target: '_blank', rel: 'noopener noreferrer' },
          h('span', { className: 'post-title' }, p.title),
          h('span', { className: 'post-src' }, p.src + (p.date ? ' \u00b7 ' + fmtDate(p.date) : ''), h(Icon, { d: ICONS.ext })));
      })),
    POSTS.length > 6 ? h('button', { type: 'button', className: 'btn btn-ghost more', onClick: function () { setAll(!all); }, 'aria-expanded': all },
      all ? 'Show fewer posts' : 'Show all ' + POSTS.length + ' posts') : null);
}

function Contact() {
  function lnk(label, href) { return h('a', { key: label, href: href, target: '_blank', rel: 'noopener noreferrer' }, label); }
  var links = [lnk('GitHub', GITHUB), lnk('LinkedIn', LINKEDIN_URL), lnk('DEV Community', DEVTO)];
  if (MEDIUM_URL) links.push(lnk('Medium', MEDIUM_URL));
  if (LEADSEXPO_URL) links.push(lnk('LeadsExpo', LEADSEXPO_URL));
  return h('section', { className: 'block wrap contact', id: 'contact' },
    h('h2', null, 'Have an app to deploy? Let us talk.'),
    h('a', { className: 'btn btn-primary btn-lg', href: EMAIL }, h(Icon, { d: ICONS.mail }), 'deykaustav357@gmail.com'),
    h('div', { className: 'links' }, links));
}

function App() {
  var dock = [
    { label: 'Home', icon: 'home', href: '#top' },
    { label: 'LeadsExpo', icon: 'bolt', href: LEADSEXPO_URL || '#leadsexpo', external: !!LEADSEXPO_URL },
    { label: 'What I do', icon: 'layers', href: '#services' },
    { label: 'Projects', icon: 'code', href: '#work' },
    { label: 'Writing', icon: 'doc', href: '#writing' },
    { label: 'Contact', icon: 'mail', href: '#contact' }
  ];
  return h(React.Fragment, null,
    h(Hero),
    h(Marquee, { items: STACK }),
    h('main', null, h(Featured), h(Services), h(Work), h(Writing), h(Contact)),
    h('footer', null, h('div', { className: 'wrap' }, h('div', { className: 'divider' }, '\u00a9 2026 Kaustav Dey'))),
    h(Dock, { items: dock }));
}

/* Error boundary + mount */
function Boundary(props) { React.Component.call(this, props); this.state = { failed: false }; }
Boundary.prototype = Object.create(React.Component.prototype);
Boundary.prototype.constructor = Boundary;
Boundary.getDerivedStateFromError = function () { return { failed: true }; };
Boundary.prototype.componentDidCatch = function (err) { console.error('Render error:', err); };
Boundary.prototype.render = function () {
  if (this.state.failed) {
    return h('div', { className: 'fallback' },
      h('h1', null, 'Kaustav Dey \u2013 DevOps & Cloud Specialist'),
      h('p', null, 'Something went wrong loading this page. Contact: ',
        h('a', { href: EMAIL }, 'deykaustav357@gmail.com'), ' \u00b7 ', h('a', { href: GITHUB }, 'GitHub')));
  }
  return this.props.children;
};

try {
  ReactDOM.createRoot(rootEl).render(h(Boundary, null, h(App)));
} catch (err) {
  console.error(err);
  rootEl.innerHTML = FALLBACK_HTML;
           }

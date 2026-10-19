// Espaço Baobá — WhatsApp links, class finder, visit form, photo strip, menu and motion.

// Número do WhatsApp da escola: só dígitos, com 55 + DDD.
const WHATSAPP = '5511916000518';

const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

// Every link marked data-wa gets the number and its own message.
document.querySelectorAll('[data-wa]').forEach((a) => {
  a.href = waLink(a.dataset.wa);
});

// Bar: a soft edge once the page moves
const bar = document.querySelector('.bar');
const onScroll = () => bar?.classList.toggle('is-scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menu (phone)
const toggle = document.querySelector('.bar__toggle');
const menu = document.getElementById('menu');
if (toggle && menu) {
  const close = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// Class finder: birth month + year -> turma
const CLASSES = [
  { id: 't-sementinha', name: 'Sementinha', ages: '4 meses a 1 ano', from: 4, to: 12, group: 'Berçário' },
  { id: 't-brotinho', name: 'Brotinho', ages: '1 a 2 anos', from: 12, to: 24, group: 'Berçário' },
  { id: 't-tronquinho', name: 'Tronquinho', ages: '2 a 3 anos', from: 24, to: 36, group: 'Maternal' },
  { id: 't-galhos', name: 'Galhos', ages: '3 a 4 anos', from: 36, to: 48, group: 'Maternal' },
  { id: 't-flores', name: 'Flores', ages: '4 a 5 anos', from: 48, to: 60, group: 'Pré-escola' },
  { id: 't-frutos', name: 'Frutos', ages: '5 a 6 anos', from: 60, to: 72, group: 'Pré-escola' },
];
const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long' });
const MONTHS = Array.from({ length: 12 }, (_, m) => monthName.format(new Date(2000, m, 1)));

const finder = document.getElementById('finder');
if (finder) {
  const mes = document.getElementById('finder-mes');
  const ano = document.getElementById('finder-ano');
  const out = document.getElementById('finder-out');
  const cta = document.getElementById('finder-cta');
  const now = new Date();

  for (let y = now.getFullYear(); y >= now.getFullYear() - 7; y--) {
    const o = document.createElement('option');
    o.value = String(y);
    o.textContent = String(y);
    ano.append(o);
  }
  // Start on a toddler so the page shows a real answer.
  ano.value = String(now.getFullYear() - 3);
  mes.value = String(now.getMonth());

  const update = (scroll) => {
    const months = (now.getFullYear() - Number(ano.value)) * 12 + (now.getMonth() - Number(mes.value));
    const born = `${MONTHS[Number(mes.value)]} de ${ano.value}`;
    const hit = CLASSES.find((c) => months >= c.from && months < c.to);
    document.querySelectorAll('.grow__item.is-match').forEach((el) => el.classList.remove('is-match'));

    let msg;
    if (months < 0) {
      out.textContent = 'Essa data ainda não chegou. Confira o mês e o ano.';
      msg = 'Olá! Gostaria de saber sobre vagas no Espaço Baobá.';
    } else if (months < 4) {
      out.innerHTML = 'Recebemos bebês a partir de <strong>4 meses</strong>, na turma Sementinha. Vale garantir a vaga desde já.';
      msg = `Olá! Meu bebê nasceu em ${born} e gostaria de saber sobre vaga na turma Sementinha.`;
    } else if (!hit) {
      out.textContent = 'O Baobá atende crianças até 6 anos. Fale com a gente para tirar suas dúvidas.';
      msg = `Olá! Meu filho nasceu em ${born}. Gostaria de conversar com a escola.`;
    } else {
      out.innerHTML = `Hoje, a turma é <strong>${hit.name}</strong> (${hit.group}, ${hit.ages}). A turma é confirmada na matrícula.`;
      msg = `Olá! Meu filho nasceu em ${born} e gostaria de saber sobre vaga na turma ${hit.name}.`;
      const card = document.getElementById(hit.id);
      card?.classList.add('is-match');
      // On a phone the classes scroll sideways: bring the match into view.
      if (scroll && card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
    cta.href = waLink(msg);
    cta.textContent = hit ? `Perguntar sobre vaga na ${hit.name}` : 'Perguntar sobre vagas';
  };
  mes.addEventListener('change', () => update(true));
  ano.addEventListener('change', () => update(true));
  finder.addEventListener('submit', (e) => e.preventDefault());
  update(false);
}

// Visit form -> WhatsApp message
const coupon = document.getElementById('coupon');
if (coupon) {
  const birth = coupon.elements.nascimento;
  birth.addEventListener('input', () => {
    const d = birth.value.replace(/\D/g, '').slice(0, 8);
    birth.value = [d.slice(0, 2), d.slice(2, 4), d.slice(4)].filter(Boolean).join('/');
  });
  coupon.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = coupon.elements;
    const nome = f.responsavel.value.trim();
    if (!nome) {
      f.responsavel.setCustomValidity('Escreva seu nome para a escola saber com quem fala.');
      f.responsavel.reportValidity();
      f.responsavel.focus();
      return;
    }
    const lines = [`Olá! Meu nome é ${nome} e gostaria de agendar uma visita ao Espaço Baobá.`];
    if (f.crianca.value.trim()) lines.push(`Criança: ${f.crianca.value.trim()}`);
    if (f.nascimento.value.trim()) lines.push(`Nascimento: ${f.nascimento.value.trim()}`);
    if (f.periodo.value) lines.push(`Período de interesse: ${f.periodo.value}`);
    const url = waLink(lines.join('\n'));
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url; // pop-up blocked: open in this tab
  });
  coupon.elements.responsavel.addEventListener('input', (e) => e.target.setCustomValidity(''));
}

// Photo strip arrows
const strip = document.getElementById('strip');
document.querySelectorAll('[data-strip]').forEach((b) => {
  b.addEventListener('click', () => {
    const step = strip.querySelector('li')?.getBoundingClientRect().width || 300;
    strip.scrollBy({ left: Number(b.dataset.strip) * (step + 16) * 2, behavior: 'smooth' });
  });
});

const ano = document.getElementById('ano');
if (ano) ano.textContent = String(new Date().getFullYear());

// Motion: staggered entrances, once per element
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const targets = [...document.querySelectorAll('[data-reveal], .vine, .grow')];

document.querySelectorAll('.bento, .pillars__list, .hours__plans, .kitchen__grid, .team__list').forEach((g) => {
  [...g.querySelectorAll('[data-reveal]')].forEach((el, i) => el.style.setProperty('--d', `${(i % 4) * 90}ms`));
});
document.querySelectorAll('.grow__photo img').forEach((el, i) => el.style.setProperty('--d', `${i * 110}ms`));

if (reduce || !('IntersectionObserver' in window)) {
  targets.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
  targets.forEach((el) => io.observe(el));
}

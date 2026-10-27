// ГосЩит — интерактивные элементы памятки

(function () {
  'use strict';

  // --- Мобильное меню ---
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('open');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') nav.classList.remove('open');
    });
  }

  // --- Форма записи на консультацию ---
  var form = document.getElementById('form');
  var ok = document.getElementById('form-ok');

  if (form && ok) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('f-name');
      var phone = document.getElementById('f-phone');

      if (!name.value.trim()) {
        name.focus();
        name.style.borderColor = '#b0433c';
        return;
      }
      if (phone.value.trim().length < 6) {
        phone.focus();
        phone.style.borderColor = '#b0433c';
        return;
      }

      name.style.borderColor = '';
      phone.style.borderColor = '';

      form.querySelector('button[type="submit"]').style.display = 'none';
      form.querySelector('.form__hint').style.display = 'none';
      ok.classList.add('show');
      ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // --- Проверка крепости пароля (всё локально, ничего не отправляется) ---
  var pwInput = document.getElementById('pw-input');
  var pwBar = document.getElementById('pw-bar');
  var pwVerdict = document.getElementById('pw-verdict');
  var pwRules = document.getElementById('pw-rules');

  if (pwInput && pwBar && pwVerdict && pwRules) {
    var checks = [
      function (v) { return v.length >= 12; },
      function (v) { return /[a-zа-яё]/.test(v) && /[A-ZА-ЯЁ]/.test(v); },
      function (v) { return /\d/.test(v); },
      function (v) { return /[^A-Za-zА-Яа-яЁё0-9]/.test(v); },
      function (v) {
        var low = v.toLowerCase();
        var bad = ['123', 'qwer', 'йцук', 'пароль', 'password', 'admin', 'админ', 'любовь', 'love', 'gosuslug'];
        if (/(19|20)\d{2}/.test(low)) return false; // похож на год
        for (var i = 0; i < bad.length; i++) {
          if (low.indexOf(bad[i]) !== -1) return false;
        }
        return true;
      }
    ];

    var levels = [
      { text: 'Слабый пароль — так аккаунты и взламывают', color: '#b0433c' },
      { text: 'Средний пароль — добавьте длину и спецсимволы', color: '#c9a13b' },
      { text: 'Хороший пароль — такой подойдёт для Госуслуг', color: '#2e7d5b' }
    ];

    pwInput.addEventListener('input', function () {
      var v = pwInput.value;
      var passed = 0;

      for (var i = 0; i < checks.length; i++) {
        var isOk = v.length > 0 && checks[i](v);
        pwRules.children[i].setAttribute('data-ok', isOk ? '1' : '0');
        if (isOk) passed++;
      }

      if (v.length === 0) {
        pwBar.style.width = '0';
        pwVerdict.textContent = 'Начните вводить пароль';
        pwVerdict.style.color = '';
        return;
      }

      var level = passed <= 2 ? 0 : (passed <= 4 ? 1 : 2);
      pwBar.style.width = Math.round((passed / checks.length) * 100) + '%';
      pwBar.style.background = levels[level].color;
      pwVerdict.textContent = levels[level].text;
      pwVerdict.style.color = levels[level].color;
    });
  }

  // --- FAQ-аккордеон ---
  var faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(function (item) {
    var q = item.querySelector('.faq__q');
    if (!q) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      faqItems.forEach(function (other) { other.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });

  // --- Подсветка активного раздела в шапке ---
  var sections = ['about', 'risks', 'protect', 'incident', 'checklist', 'consult'];
  var links = nav ? nav.querySelectorAll('a') : [];

  if ('IntersectionObserver' in window && links.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.style.color = a.getAttribute('href') === '#' + entry.target.id ? '#1e3a5f' : '';
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }
})();

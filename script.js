document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  const serviceSelect = document.querySelector('select[name="service"]');
  document.querySelectorAll('[data-service]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-service');
      if (serviceSelect && val) {
        serviceSelect.value = val;
      }
    });
  });

  const form = document.getElementById('booking-form');
  const status = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').trim();
      const phone = (data.get('phone') || '').trim();
      const car = (data.get('car') || 'Не указан').trim();
      const service = (data.get('service') || '').trim();
      const time = (data.get('time') || 'Не указано').trim();
      const message = (data.get('message') || 'Без комментариев').trim();

      const text = [
        '🔧 Новая заявка с сайта LEVELUP:',
        `👤 Имя: ${name}`,
        `📞 Телефон: ${phone}`,
        `🚗 Авто: ${car}`,
        `🛠 Услуга: ${service}`,
        `🕒 Желаемое время: ${time}`,
        `💬 Задача: ${message}`
      ].join('\n');

      const encoded = encodeURIComponent(text);
      const tgAppUrl = `tg://resolve?domain=ali_zod_aliev&text=${encoded}`;
      const tgWebUrl = 'https://t.me' + encoded;

      if (status) {
        status.innerHTML = `Заявка готова! <a href="${tgAppUrl}" style="color:#e5b869;text-decoration:underline;">Открыть в приложении Telegram</a> или <a href="${tgWebUrl}" target="_blank" rel="noopener" style="color:#e5b869;text-decoration:underline;">через браузер</a>.`;
      }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
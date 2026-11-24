const CAR_PRICES = {
  "Chevrolet": {
    "Cobalt / Nexia 3 / Spark / Lacetti-Gentra": [
      { service: "Компьютерная диагностика (ошибки, параметры)", price: "100 000 сум", time: "~15 мин" },
      { service: "Чистка дроссельной заслонки с адаптацией, для автомобилей с электронным дросселем, компьютерная диагностика в подарок 🎁", price: "100 000 сум", time: "~20 мин" },
      { service: "Замена масла в ДВС и фильтров - стоимость масла и фильтров рассчитывается отдельно", price: "100 000 сум", time: "~30 мин" },
      { service: "Замена масла в АКПП и фильтров - стоимость масла и фильтров рассчитывается отдельно", price: "от 400 000 сум", time: "~90 мин" },
      { service: "Замена свеч зажигания (затяжка строго динамометрическим ключом, чистка посадочных мест) - стоимость свеч зажигания рассчитывается отдельно", price: "100 000 сум", time: "~30 мин" },
      { service: "Замена ламп ближнего и дальнего света (на штатные галогеновые лампы) с регулировкой света - стоимость лампочек рассчитывается отдельно", price: "100 000 сум", time: "~30 мин" },
      { service: "Замена ламп задних фонарей - стоимость лампочек рассчитывается отдельно", price: "от 50 000 сум", time: "~15 мин" },
      { service: "Отключение ошибок от LED ламп ближнего света (габаритных огней и ДХО) с сохранением всех остальных ошибок по фарам", price: "100 000 сум", time: "~10 мин" },
      { service: "Установка сигнализации (охранных комплексов от StarLine) - стоимость сигнализации рассчитывается отдельно", price: "от 800 000 сум", time: "~240 мин" },
      { service: "Установка парковочной камеры на Cobalt MCM - стоимость камеры заднего вида рассчитывается отдельно", price: "500 000 сум", time: "~60 мин" },
      { service: "Установка видеорегистраторов и антирадаров - стоимость устройств рассчитывается отдельно", price: "от 150 000 сум", time: "~20 мин" },
      { service: "Установка Bi-Led модулей - стоимость модулей, дополнительных аксессуаров рассчитывается отдельно", price: "от 1 200 000 сум", time: "~300 мин" },
      { service: "Установка круиз-контроля, управления мультимедиа (с сохранением штатной безапасности, подключение pin to pin/штекер в штекер)", price: "от 2 000 000 сум", time: "~300 мин" },
      { service: "Прошивка двигателя и АКПП - Stage 1", price: "400 000 сум", time: "~45 мин" },
      { service: "Прошивка двигателя - Stage 2, прошивка АКПП в подарок", price: "от 800 000 сум", time: "~80 мин" },
      { service: "Прошивка двигателя под ГБО (Пропан - метан) двух режимная прошивка", price: "от 400 000 сум", time: "~50 мин" },
      { service: "Чистка топливной системы - химия входит в стоимость услуг (Сольвентная чистка - профилактическая чистка - инжекторов, впускных клапанов и камеры сгорания) рекомендуемая процедура каждые 10-15 тыс км", price: "500 000 сум", time: "~120 мин" },
    ]
  },
   "BYD": {
    "Song Plus / Chazor / Yuan Plus": [
      { service: "Компьютерная диагностика гибридной / EV системы", price: "200 000 сум", time: "~30 мин" }
    ]
  },
  "Kia / Hyundai": {
    "K5 / Sonata / Elantra / Cerato": [
      { service: "Компьютерная диагностика", price: "100 000 сум", time: "~15 мин" }
    ]
  },
  "Другая марка": {
    "Любая модель (базовый прайс)": [
      { service: "Компьютерная диагностика (чтение ошибок, кодирование)", price: "от 100 000 сум", time: "~30–40 мин" }
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Мобильное меню
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

  // 2. Калькулятор цен с чекбоксами и суммированием
  const brandSelect = document.getElementById('calc-brand');
  const modelSelect = document.getElementById('calc-model');
  const resultsBox = document.getElementById('calc-results');
  const totalBar = document.getElementById('calc-total-bar');
  const countEl = document.getElementById('calc-count');
  const timeEl = document.getElementById('calc-total-time');
  const sumEl = document.getElementById('calc-sum');
  const calcBookBtn = document.getElementById('calc-book-btn');

  const carInput = document.querySelector('input[name="car"]');
  const serviceSelect = document.querySelector('select[name="service"]');
  const selectedBox = document.getElementById('selected-services-box');

  let chosenServices = [];
  let chosenSummaryText = '';

  function parseNumber(str) {
    const digits = String(str).replace(/\D/g, '');
    return digits ? parseInt(digits, 10) : 0;
  }

  function formatSum(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' сум';
  }

  function recalculateTotal() {
    if (!resultsBox || !totalBar) return;
    const checkboxes = resultsBox.querySelectorAll('.price-checkbox:checked');
    chosenServices = [];
    let totalSum = 0;
    let totalMins = 0;
    let hasPrefixFrom = false;
    let hasCustomOther = false;

    checkboxes.forEach(cb => {
      const title = cb.dataset.service;
      const priceStr = cb.dataset.price;
      const timeStr = cb.dataset.time;

      chosenServices.push(`${title} (${priceStr})`);

      if (priceStr.toLowerCase().includes('от')) hasPrefixFrom = true;
      if (cb.dataset.other === '1') hasCustomOther = true;

      totalSum += parseNumber(priceStr);
      totalMins += parseNumber(timeStr);
    });

    if (chosenServices.length === 0) {
      totalBar.style.display = 'none';
      chosenSummaryText = '';
      return;
    }

    totalBar.style.display = 'flex';
    if (countEl) countEl.textContent = chosenServices.length;

    let sumLabel = formatSum(totalSum);
    if (totalSum === 0 && hasCustomOther) {
      sumLabel = 'По согласованию';
    } else if (hasPrefixFrom || hasCustomOther) {
      sumLabel = 'от ' + sumLabel;
    }

    if (sumEl) sumEl.textContent = sumLabel;
    if (timeEl) {
      timeEl.textContent = totalMins > 0 ? `Ориентировочное время: ~${totalMins} мин` : '';
    }

    chosenSummaryText = `${chosenServices.join('; ')} | Итого: ${sumLabel}`;
  }

  function showEmptyState(text) {
    if (!resultsBox) return;
    resultsBox.innerHTML = `<div style="color:#a0a6b2;font-size:14px;padding:24px 8px;">${text}</div>`;
    if (totalBar) totalBar.style.display = 'none';
    chosenServices = [];
    chosenSummaryText = '';
  }

  function renderPrices(brand, model) {
    if (!brand || !model || !CAR_PRICES[brand] || !CAR_PRICES[brand][model]) {
      showEmptyState('Выберите марку и модель автомобиля выше, чтобы увидеть стоимость и время работ.');
      return;
    }

    const list = [
      ...CAR_PRICES[brand][model],
      { service: "Другое (услуга не из списка — опишу в задаче)", price: "После осмотра", time: "Уточняется", isOther: true }
    ];

    resultsBox.innerHTML = list.map(item => `
      <label class="price-item">
        <div class="price-item-left">
          <input type="checkbox" class="price-checkbox"
            data-service="${item.service.replace(/"/g, '&quot;')}"
            data-price="${item.price}"
            data-time="${item.time}"
            data-other="${item.isOther ? '1' : '0'}">
          <span>${item.service}</span>
        </div>
        <div class="price-row-meta">
          <span class="price-time">⏱ ${item.time}</span>
          <b>${item.price}</b>
        </div>
      </label>
    `).join('');

    resultsBox.querySelectorAll('.price-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        cb.closest('.price-item').classList.toggle('checked', cb.checked);
        recalculateTotal();
      });
    });

    recalculateTotal();
  }

  function updateModels(brand) {
    if (!modelSelect) return;
    if (!brand || !CAR_PRICES[brand]) {
      modelSelect.innerHTML = '<option value="">— Сначала выберите марку —</option>';
      modelSelect.disabled = true;
      showEmptyState('Выберите марку и модель автомобиля выше, чтобы увидеть стоимость и время работ.');
      return;
    }
    const models = Object.keys(CAR_PRICES[brand]);
    modelSelect.disabled = false;
    modelSelect.innerHTML = '<option value="">— Выберите модель —</option>' +
      models.map(m => `<option value="${m}">${m}</option>`).join('');
    showEmptyState('Теперь выберите модель автомобиля, чтобы отметить нужные услуги.');
  }

  if (brandSelect && modelSelect) {
    const brands = Object.keys(CAR_PRICES);
    brandSelect.innerHTML = '<option value="">— Выберите марку —</option>' +
      brands.map(b => `<option value="${b}">${b}</option>`).join('');
    updateModels('');

    brandSelect.addEventListener('change', () => updateModels(brandSelect.value));
    modelSelect.addEventListener('change', () => renderPrices(brandSelect.value, modelSelect.value));

    if (calcBookBtn) {
      calcBookBtn.addEventListener('click', () => {
        if (carInput && brandSelect.value && modelSelect.value) {
          carInput.value = `${brandSelect.value} ${modelSelect.value}`;
        }
        if (selectedBox) {
          if (chosenServices.length > 0) {
            selectedBox.style.display = 'block';
            selectedBox.innerHTML = `<strong>Выбранные услуги из прайса:</strong>${chosenSummaryText}`;
            if (serviceSelect) serviceSelect.value = 'Другое / Консультация';
          } else {
            selectedBox.style.display = 'none';
          }
        }
      });
    }
  }

  // 3. Автовыбор услуги при клике на карточку услуг (верхний блок)
  document.querySelectorAll('[data-service]').forEach(btn => {
    if (btn.classList.contains('price-checkbox')) return;
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-service');
      if (serviceSelect && val) {
        serviceSelect.value = val;
      }
      if (selectedBox) selectedBox.style.display = 'none';
      chosenServices = [];
      chosenSummaryText = '';
    });
  });

  // 4. Отправка заявки в Telegram
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
      const message = (data.get('message') || '').trim();

      const servicesLine = chosenServices.length > 0
        ? `🛠 Выбранные услуги:\n• ${chosenServices.join('\n• ')}\n💰 Предварительный расчёт: ${sumEl ? sumEl.textContent : ''}`
        : `🛠 Услуга: ${service}`;

      const textLines = [
        '🔧 Новая заявка с сайта LEVELUP:',
        `👤 Имя: ${name}`,
        `📞 Телефон: ${phone}`,
        `🚗 Авто: ${car}`,
        servicesLine,
        `🕒 Желаемое время: ${time}`
      ];

      if (message) {
        textLines.push(`💬 Комментарий / задача: ${message}`);
      }

      const encoded = encodeURIComponent(textLines.join('\n'));
      const tgAppUrl = `tg://resolve?domain=ali_zod_aliev&text=${encoded}`;
      const tgWebUrl = 'https://t.me' + encoded;

      if (status) {
        status.innerHTML = `Заявка готова! <a href="${tgAppUrl}" style="color:#e5b869;text-decoration:underline;">Открыть в приложении Telegram</a> или <a href="${tgWebUrl}" target="_blank" rel="noopener" style="color:#e5b869;text-decoration:underline;">через браузер</a>.`;
      }

      window.location.href = tgAppUrl;
    });
  }

  // 5. Актуальный год в футере
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
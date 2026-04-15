// converter.js — unit converter with real and completely made up units

const categories = {
  length: {
    label: "Length",
    icon: "📏",
    baseUnit: "meter",
    units: {
      // Real ones
      kilometer:    { label: "Kilometers",     factor: 1000,       real: true },
      meter:        { label: "Meters",          factor: 1,          real: true },
      centimeter:   { label: "Centimeters",     factor: 0.01,       real: true },
      millimeter:   { label: "Millimeters",     factor: 0.001,      real: true },
      mile:         { label: "Miles",           factor: 1609.344,   real: true },
      yard:         { label: "Yards",           factor: 0.9144,     real: true },
      foot:         { label: "Feet",            factor: 0.3048,     real: true },
      inch:         { label: "Inches",          factor: 0.0254,     real: true },
      // Nonsense ones
      banana:       { label: "Bananas",         factor: 0.2,        real: false, note: "avg. banana is ~20cm" },
      footballfield:{ label: "Football Fields", factor: 91.44,      real: false, note: "standard NFL field" },
      tallestman:   { label: "Robert Wadlows",  factor: 2.72,       real: false, note: "tallest human ever recorded" },
      smoot:        { label: "Smoots",          factor: 1.7018,     real: false, note: "Oliver Smoot's height, used to measure Harvard Bridge" },
      giraffeneck:  { label: "Giraffe Necks",   factor: 1.8,        real: false, note: "avg. giraffe neck length" },
      doubleDecker: { label: "Double Deckers",  factor: 4.4,        real: false, note: "height of a London double decker bus" },
    }
  },
  weight: {
    label: "Weight",
    icon: "⚖️",
    baseUnit: "kilogram",
    units: {
      // Real ones
      tonne:        { label: "Tonnes",          factor: 1000,       real: true },
      kilogram:     { label: "Kilograms",       factor: 1,          real: true },
      gram:         { label: "Grams",           factor: 0.001,      real: true },
      milligram:    { label: "Milligrams",      factor: 0.000001,   real: true },
      pound:        { label: "Pounds",          factor: 0.453592,   real: true },
      ounce:        { label: "Ounces",          factor: 0.0283495,  real: true },
      // Nonsense ones
      cat:          { label: "Average Cats",    factor: 4.5,        real: false, note: "avg. domestic cat is ~4.5kg" },
      disappointment:{ label: "Disappointed Dads", factor: 85,     real: false, note: "avg. weight of a disappointed dad (estimated)" },
      goldbar:      { label: "Gold Bars",       factor: 12.4,       real: false, note: "standard London Good Delivery bar" },
      elephant:     { label: "Elephants",       factor: 5000,       real: false, note: "avg. African elephant" },
      corgis:       { label: "Corgis",          factor: 12.5,       real: false, note: "avg. Pembroke Welsh Corgi" },
      paperclip:    { label: "Paperclips",      factor: 0.001,      real: false, note: "standard metal paperclip ≈ 1g" },
    }
  },
  temperature: {
    label: "Temperature",
    icon: "🌡️",
    baseUnit: "celsius",
    special: true,
    units: {
      celsius:      { label: "Celsius",         real: true },
      fahrenheit:   { label: "Fahrenheit",      real: true },
      kelvin:       { label: "Kelvin",          real: true },
      rankine:      { label: "Rankine",         real: true },
      // Nonsense ones
      spicy:        { label: "Spicy (1–10)",    real: false, note: "1 = ice cream weather, 10 = surface of the sun" },
      british:      { label: "British Opinions",real: false, note: "0 = 'a bit nippy', 10 = 'absolute scorcher'" },
    }
  },
  speed: {
    label: "Speed",
    icon: "🚀",
    baseUnit: "mps",
    units: {
      // Real ones
      mps:          { label: "Meters/sec",      factor: 1,          real: true },
      kph:          { label: "km/h",            factor: 0.277778,   real: true },
      mph:          { label: "mph",             factor: 0.44704,    real: true },
      knot:         { label: "Knots",           factor: 0.514444,   real: true },
      mach:         { label: "Mach",            factor: 343,        real: true },
      // Nonsense ones
      snail:        { label: "Snail Speeds",    factor: 0.00138889, real: false, note: "avg. garden snail ≈ 0.05 km/h" },
      usain:        { label: "Usain Bolts",     factor: 10.44,      real: false, note: "Bolt's 100m world record pace" },
      grandma:      { label: "Grandmas",        factor: 0.9,        real: false, note: "avg. walking speed of someone's nan" },
      lightspeed:   { label: "% Speed of Light",factor: 2997924.58, real: false, note: "1% of the speed of light" },
    }
  }
};

// Temperature conversions (special case — not simple multiplication)
function convertTemp(value, from, to) {
  // First convert to Celsius
  let celsius;
  switch(from) {
    case 'celsius':    celsius = value; break;
    case 'fahrenheit': celsius = (value - 32) * 5/9; break;
    case 'kelvin':     celsius = value - 273.15; break;
    case 'rankine':    celsius = (value - 491.67) * 5/9; break;
    case 'spicy':      celsius = (value - 1) * (100/9) - 10; break;
    case 'british':    celsius = value * 4; break;
    default:           celsius = value;
  }
  // Then convert from Celsius to target
  switch(to) {
    case 'celsius':    return celsius;
    case 'fahrenheit': return celsius * 9/5 + 32;
    case 'kelvin':     return celsius + 273.15;
    case 'rankine':    return (celsius + 273.15) * 9/5;
    case 'spicy':      return Math.min(10, Math.max(1, (celsius + 10) * (9/100) + 1));
    case 'british':    return celsius / 4;
    default:           return celsius;
  }
}

function convert(value, from, to, category) {
  if (isNaN(value)) return '';
  if (from === to) return value;

  if (category === 'temperature') {
    return convertTemp(value, from, to);
  }

  const units = categories[category].units;
  const fromFactor = units[from].factor;
  const toFactor = units[to].factor;
  return (value * fromFactor) / toFactor;
}

function formatResult(num) {
  if (num === '' || isNaN(num)) return '—';
  if (Math.abs(num) >= 1e9) return num.toExponential(4);
  if (Math.abs(num) >= 1000) return parseFloat(num.toFixed(4)).toLocaleString();
  if (Math.abs(num) < 0.0001 && num !== 0) return num.toExponential(4);
  return parseFloat(num.toFixed(6)).toString();
}

// Build the UI
function buildConverter() {
  const container = document.getElementById('converter');

  // Category tabs
  const tabsHtml = Object.entries(categories).map(([key, cat]) => `
    <button class="conv-tab" data-cat="${key}">${cat.icon} ${cat.label}</button>
  `).join('');

  container.innerHTML = `
    <div class="conv-tabs">${tabsHtml}</div>
    <div class="conv-body">
      <div class="conv-row">
        <div class="conv-field">
          <input type="number" id="conv-input" placeholder="Enter value..." />
          <select id="conv-from"></select>
        </div>
        <div class="conv-equals">=</div>
        <div class="conv-field">
          <div id="conv-result" class="conv-result">—</div>
          <select id="conv-to"></select>
        </div>
      </div>
      <div id="conv-note" class="conv-note"></div>
    </div>
  `;

  let currentCat = 'length';

  function populateSelects(catKey) {
    const cat = categories[catKey];
    const fromSel = document.getElementById('conv-from');
    const toSel = document.getElementById('conv-to');

    const makeOptions = (selectedKey) => Object.entries(cat.units).map(([key, unit]) => {
    const tag = unit.real ? '' : '';
      return `<option value="${key}" ${key === selectedKey ? 'selected' : ''}>${unit.label}${tag}</option>`;
    }).join('');

    // Pick sensible defaults per category
    const defaults = {
      length:      ['meter', 'foot'],
      weight:      ['kilogram', 'pound'],
      temperature: ['celsius', 'fahrenheit'],
      speed:       ['kph', 'mph'],
    };

    fromSel.innerHTML = makeOptions(defaults[catKey][0]);
    toSel.innerHTML   = makeOptions(defaults[catKey][1]);
  }

  function updateResult() {
    const input = parseFloat(document.getElementById('conv-input').value);
    const from  = document.getElementById('conv-from').value;
    const to    = document.getElementById('conv-to').value;
    const note  = document.getElementById('conv-note');

    const result = convert(input, from, to, currentCat);
    document.getElementById('conv-result').textContent = formatResult(result);

    // Show note if the selected to-unit is a nonsense one
    const toUnit = categories[currentCat].units[to];
    const fromUnit = categories[currentCat].units[from];
    if (toUnit && !toUnit.real && toUnit.note) {
      note.textContent = `ℹ️ ${toUnit.label}: ${toUnit.note}`;
      note.style.display = 'block';
    } else if (fromUnit && !fromUnit.real && fromUnit.note) {
      note.textContent = `ℹ️ ${fromUnit.label}: ${fromUnit.note}`;
      note.style.display = 'block';
    } else {
      note.style.display = 'none';
    }
  }

  function switchCategory(catKey) {
    currentCat = catKey;
    document.querySelectorAll('.conv-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.cat === catKey);
    });
    populateSelects(catKey);
    document.getElementById('conv-input').value = '';
    document.getElementById('conv-result').textContent = '—';
    document.getElementById('conv-note').style.display = 'none';
  }

  // Event listeners
  container.addEventListener('click', e => {
    if (e.target.classList.contains('conv-tab')) {
      switchCategory(e.target.dataset.cat);
    }
  });

  container.addEventListener('input', updateResult);
  container.addEventListener('change', updateResult);

  // Init
  switchCategory('length');
}

document.addEventListener('DOMContentLoaded', buildConverter);
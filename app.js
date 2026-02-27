import products from './products.js';

// Global state
let currentQuestionIndex = 0;
let userAnswers = {};
let selectedCategory = null;
let filteredProducts = [];

// Define questions: First is category, then branch to category-specific + common
const questions = {
  initial: [
    {
      text: '您想找哪種家具類別？',
      options: ['裝飾櫃', '餐邊櫃', '地櫃', '電視櫃', '茶幾', '桶櫃', '鞋櫃', '床頭櫃', '妝臺', '書桌', '書櫃', '床', '衣櫃'],
      key: 'category'
    }
  ],
  common: [
    {
      text: '您的預算是多少？',
      options: ['低於1000', '1000-2000', '2000-3000', '3000以上'],
      key: 'budget'
    },
    {
      text: '您喜歡哪種顏色？',
      options: ['ORI胡桃', '親橡', '白木紋', '橡木', '其他/無偏好'],
      key: 'color'
    },
    {
      text: '您需要多大的尺寸（寬度mm）？',
      options: ['小於800', '800-1200', '1200-1500', '1500以上'],
      key: 'width'
    }
  ],
  // Category-specific questions (Akinator-style: yes/no/maybe to narrow)
  '桶櫃': [
    {
      text: '您需要四桶還是五桶？',
      options: ['四桶櫃', '五桶櫃', '無偏好'],
      key: 'bucket_count'
    }
  ],
  '鞋櫃': [
    {
      text: '您需要高身還是矮身鞋櫃？',
      options: ['高身', '矮身', '無偏好'],
      key: 'height_type'
    }
  ],
  '書桌': [
    {
      text: '您需要連書架的書桌嗎？',
      options: ['是 (連書架)', '否 (無書架)', '無偏好'],
      key: 'with_bookshelf'
    }
  ],
  '床': [
    {
      text: '您需要哪種床款？',
      options: ['碌架床', '無底床', '油壓床', '三櫃桶床', '無偏好'],
      key: 'bed_type'
    },
    {
      text: '床頭需要有皮墊嗎？',
      options: ['是', '否', '無偏好'],
      key: 'headboard_leather'
    },
    {
      text: '需要連床尾櫃嗎？',
      options: ['是', '否', '無偏好'],
      key: 'with_tail_cabinet'
    },
    {
      text: '床墊尺寸需要多大？',
      options: ['三尺', '四尺', '四尺半', '五尺', '無偏好'],
      key: 'mattress_size_mm'
    }
  ],
  '衣櫃': [
    {
      text: '您需要拉門還是趟門？',
      options: ['拉門', '趟門', '無偏好'],
      key: 'door_type'
    }
  ]
  // For other categories without specifics, just use common questions
};

// Function to start questionnaire
function startQuestionnaire() {
  filteredProducts = products;
  currentQuestionIndex = 0;
  userAnswers = {};
  askNextQuestion();
}

// Function to ask next question
function askNextQuestion() {
  let currentQuestions;
  if (currentQuestionIndex === 0) {
    currentQuestions = questions.initial;
  } else if (selectedCategory) {
    currentQuestions = (questions[selectedCategory] || []).concat(questions.common);
    currentQuestionIndex -= 1; // Adjust index for branch
  }

  if (currentQuestionIndex >= currentQuestions.length) {
    showResults();
    return;
  }

  const question = currentQuestions[currentQuestionIndex];
  // Render question in HTML (e.g., update <div id="question">)
  document.getElementById('question').innerText = question.text;
  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';
  question.options.forEach(option => {
    const btn = document.createElement('button');
    btn.innerText = option;
    btn.onclick = () => handleAnswer(question.key, option);
    optionsContainer.appendChild(btn);
  });
}

// Handle user answer and filter
function handleAnswer(key, value) {
  if (key === 'category') {
    selectedCategory = value;
    filteredProducts = filteredProducts.filter(p => p.category === value);
  } else {
    userAnswers[key] = value;
    // Filter based on answer (customize logic per key)
    if (key === 'budget') {
      filteredProducts = filteredProducts.filter(p => {
        if (value === '低於1000') return p.salePrice < 1000;
        if (value === '1000-2000') return p.salePrice >= 1000 && p.salePrice <= 2000;
        if (value === '2000-3000') return p.salePrice >= 2000 && p.salePrice <= 3000;
        if (value === '3000以上') return p.salePrice > 3000;
        return true;
      });
    } else if (key === 'color') {
      filteredProducts = filteredProducts.filter(p => p.color.includes(value) || value === '無偏好');
    } else if (key === 'width') {
      filteredProducts = filteredProducts.filter(p => {
        const width = parseInt(p.size.split('*')[0]);
        if (value === '小於800') return width < 800;
        if (value === '800-1200') return width >= 800 && width <= 1200;
        if (value === '1200-1500') return width >= 1200 && width <= 1500;
        if (value === '1500以上') return width > 1500;
        return true;
      });
    } else {
      // For specific keys like bed_type, exact match or contains
      filteredProducts = filteredProducts.filter(p => p[key] === value || value === '無偏好');
    }
  }

  currentQuestionIndex++;
  if (filteredProducts.length <= 5) {
    showResults(); // Early stop if narrowed enough
  } else {
    askNextQuestion();
  }
}

// Show filtered results as cards
function showResults() {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';
  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <h3>${product.code} - ${product.category}</h3>
      <p>尺寸: ${product.size}</p>
      <p>顏色: ${product.color}</p>
      <p>售價: HK$${product.salePrice} (原價: HK$${product.original_price_hkd})</p>
      <p>備注: ${product.note || '無'}</p>
    `;
    resultsContainer.appendChild(card);
  });
}

// Init (call on page load)
document.addEventListener('DOMContentLoaded', startQuestionnaire);

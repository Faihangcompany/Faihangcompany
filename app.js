import products from './products.js';

// Global state
let currentQuestionIndex = 0;
let userAnswers = {};
let selectedCategory = null;
let filteredProducts = [];
let activeQuestions = [];

const questions = {
    initial: [
        {
            text: '您想找哪種家具類別？',
            options: ['裝飾櫃', '餐邊櫃', '地櫃', '電視櫃', '茶幾', '桶櫃', '鞋櫃', '床頭櫃', '妝臺', '書桌', '書櫃', '床', '衣櫃'],
            key: 'category'
        }
    ],
    common: [
        { text: '您的預算大約是多少？', options: ['低於1000', '1000-2000', '2000-3000', '3000以上'], key: 'budget' },
        { text: '您喜歡哪種顏色？', options: ['ORI胡桃', '親橡', '白木紋', '橡木', '其他/無偏好'], key: 'color' },
        { text: '您需要多大的尺寸（寬度mm）？', options: ['小於800', '800-1200', '1200-1500', '1500以上'], key: 'width' }
    ],
    '桶櫃': [{ text: '您需要幾桶？', options: ['四桶櫃', '五桶櫃', '無偏好'], key: 'bucket_count' }],
    '鞋櫃': [{ text: '您需要什麼款式？', options: ['高身', '矮身', '無偏好'], key: 'height_type' }],
    '書桌': [{ text: '需要連書架嗎？', options: ['是 (連書架)', '否 (無書架)', '無偏好'], key: 'with_bookshelf' }],
    '床': [
        { text: '您需要哪種床款？', options: ['碌架床', '無底床', '油壓床', '三櫃桶床', '無偏好'], key: 'bed_type' },
        { text: '床墊尺寸需要多大？', options: ['三尺', '四尺', '四尺半', '五尺', '無偏好'], key: 'mattress_size_mm' }
    ],
    '衣櫃': [{ text: '您需要哪種門？', options: ['拉門', '趟門', '無偏好'], key: 'door_type' }]
};

// Expose functions to window so HTML buttons can click them
window.startQuestionnaire = function() {
    // 1. Hide the loading status immediately
    const status = document.getElementById('status');
    if(status) status.style.display = 'none';
    
    console.log("Quiz Engine Started");
    filteredProducts = [...products];
    currentQuestionIndex = 0;
    userAnswers = {};
    activeQuestions = [...questions.initial];
    
    document.getElementById('results').innerHTML = '';
    document.getElementById('whatsapp-reminder').style.display = 'none';
    document.getElementById('restart').style.display = 'none';
    
    askNextQuestion();
}

function askNextQuestion() {
    if (currentQuestionIndex >= activeQuestions.length || (currentQuestionIndex > 0 && filteredProducts.length <= 1)) {
        showResults();
        return;
    }

    const question = activeQuestions[currentQuestionIndex];
    document.getElementById('question').innerText = question.text;
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    question.options.forEach(option => {
        const btn = document.createElement('button');
        btn.innerText = option;
        btn.className = 'btn'; // Use your existing CSS class
        btn.style.margin = "5px";
        btn.onclick = () => window.handleAnswer(question.key, option);
        optionsContainer.appendChild(btn);
    });
}

window.handleAnswer = function(key, value) {
    console.log(`Answered ${key}: ${value}`);
    
    if (key === 'category') {
        selectedCategory = value;
        filteredProducts = filteredProducts.filter(p => p.category === value);
        // Add specific questions then common questions
        activeQuestions = activeQuestions.concat(questions[selectedCategory] || [], questions.common);
    } else {
        userAnswers[key] = value;
        applyFilters(key, value);
    }

    currentQuestionIndex++;
    askNextQuestion();
}

function applyFilters(key, value) {
    if (value === '無偏好' || value === '其他/無偏好') return;

    if (key === 'budget') {
        filteredProducts = filteredProducts.filter(p => {
            const price = parseFloat(p.salePrice);
            if (value === '低於1000') return price < 1000;
            if (value === '1000-2000') return price >= 1000 && price <= 2000;
            if (value === '2000-3000') return price >= 2000 && price <= 3000;
            if (value === '3000以上') return price > 3000;
            return true;
        });
    } else if (key === 'width') {
        filteredProducts = filteredProducts.filter(p => {
            if (!p.size) return true;
            const width = parseInt(p.size.split('*')[0]);
            if (value === '小於800') return width < 800;
            if (value === '800-1200') return width >= 800 && width <= 1200;
            if (value === '1200-1500') return width >= 1200 && width <= 1500;
            if (value === '1500以上') return width > 1500;
            return true;
        });
    } else {
        filteredProducts = filteredProducts.filter(p => 
            (p[key] && String(p[key]).includes(value)) || p[key] === value
        );
    }
}

function showResults() {
    document.getElementById('question').innerText = "為您推薦的家具：";
    document.getElementById('options').innerHTML = '';
    const resultsContainer = document.getElementById('results');
    
    if (filteredProducts.length === 0) {
        resultsContainer.innerHTML = "<p>抱歉，沒有找到完全符合的產品。請嘗試重新選擇或直接聯絡我們！</p>";
    } else {
        filteredProducts.slice(0, 5).forEach(product => {
            const card = document.createElement('div');
            card.style.border = "1px solid #ddd";
            card.style.padding = "15px";
            card.style.margin = "10px 0";
            card.style.borderRadius = "8px";
            card.innerHTML = `
                <h3>${product.code}</h3>
                <p>類別: ${product.category} | 尺寸: ${product.size}</p>
                <p>顏色: ${product.color}</p>
                <p style="color:red; font-weight:bold;">特價: HK$${product.salePrice}</p>
                <button class="btn" onclick="window.sendWhatsApp('${product.code}')">詢問此型號</button>
            `;
            resultsContainer.appendChild(card);
        });
    }

    document.getElementById('restart').style.display = 'inline-block';
    document.getElementById('restart').onclick = () => location.reload();
    document.getElementById('whatsapp-reminder').style.display = 'block';
}

window.sendWhatsApp = function(productCode) {
    const msg = `您好！我在暉恒智能助手看到感興趣的家具：\n編號: ${productCode}\n請提供更多資訊。`;
    window.open(`https://wa.me/85253908976?text=${encodeURIComponent(msg)}`);
}

// Start everything
document.addEventListener('DOMContentLoaded', window.startQuestionnaire);

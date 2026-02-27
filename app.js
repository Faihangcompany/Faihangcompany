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
        { text: '您的預算大約是多少？', options: ['低於1500', '1500-3000', '3000-4500', '4500以上'], key: 'budget' },
        { text: '您喜歡哪種顏色？', options: ['ORI胡桃', '親橡', '白木紋', '橡木', '無偏好'], key: 'color' },
        { text: '您需要多大的尺寸（寬度mm）？', options: ['小於800', '800-1200', '1200-1500', '1500以上'], key: 'width' }
    ],
    '桶櫃': [{ text: '您需要幾桶？', options: ['四桶櫃', '五桶櫃', '無偏好'], key: 'bucket_count' }],
    '鞋櫃': [{ text: '您需要什麼款式？', options: ['高身', '矮身', '無偏好'], key: 'height_type' }],
    '書桌': [{ text: '需要連書架嗎？', options: ['連書架', '無書架', '無偏好'], key: 'with_bookshelf' }],
    '床': [
        { text: '您需要哪種床款？', options: ['碌架床', '無底床', '油壓床', '三櫃桶床', '無偏好'], key: 'bed_type' },
        { text: '床頭需要皮墊嗎？', options: ['有', '無', '無偏好'], key: 'headboard_leather' },
        { text: '床墊尺寸需要多大？', options: ['三尺', '四尺', '四尺半', '五尺', '無偏好'], key: 'mattress_size_mm' }
    ],
    '衣櫃': [{ text: '您需要哪種門？', options: ['拉門', '趟門', '無偏好'], key: 'door_type' }]
};

// 1. Initialize Questionnaire
window.initQuiz = function() {
    console.log("Quiz initializing...");
    // Hide loading text
    const statusEl = document.getElementById('status');
    if (statusEl) statusEl.style.display = 'none';

    filteredProducts = [...products];
    currentQuestionIndex = 0;
    userAnswers = {};
    activeQuestions = [...questions.initial];
    
    document.getElementById('results').innerHTML = '';
    document.getElementById('whatsapp-reminder').style.display = 'none';
    document.getElementById('restart').style.display = 'none';
    
    askNextQuestion();
};

// 2. Ask Next Question
function askNextQuestion() {
    const questionContainer = document.getElementById('question');
    const optionsContainer = document.getElementById('options');

    // If no more questions or filtered down to a few products, show results
    if (currentQuestionIndex >= activeQuestions.length || (currentQuestionIndex > 0 && filteredProducts.length <= 2)) {
        showResults();
        return;
    }

    const question = activeQuestions[currentQuestionIndex];
    questionContainer.innerText = question.text;
    optionsContainer.innerHTML = '';

    question.options.forEach(option => {
        const btn = document.createElement('button');
        btn.innerText = option;
        btn.className = 'btn'; 
        btn.style.margin = "5px";
        // CRITICAL: Attach to window so onclick finds it
        btn.onclick = () => window.handleAnswer(question.key, option);
        optionsContainer.appendChild(btn);
    });
}

// 3. Handle Answers
window.handleAnswer = function(key, value) {
    console.log(`Filtering by ${key}: ${value}`);
    
    if (key === 'category') {
        selectedCategory = value;
        filteredProducts = products.filter(p => p.category === value);
        // Build the rest of the question path
        activeQuestions = [...questions.initial, ...(questions[selectedCategory] || []), ...questions.common];
    } else {
        userAnswers[key] = value;
        applyFilters(key, value);
    }

    currentQuestionIndex++;
    askNextQuestion();
};

// 4. Filter Logic
function applyFilters(key, value) {
    if (value === '無偏好' || value === '其他/無偏好') return;

    if (key === 'budget') {
        filteredProducts = filteredProducts.filter(p => {
            const price = p.salePrice;
            if (value === '低於1500') return price < 1500;
            if (value === '1500-3000') return price >= 1500 && price <= 3000;
            if (value === '3000-4500') return price >= 3000 && price <= 4500;
            if (value === '4500以上') return price > 4500;
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
        // Matches color, bed_type, headboard_leather, door_type, etc.
        filteredProducts = filteredProducts.filter(p => {
            if (!p[key]) return false; 
            return String(p[key]).includes(value);
        });
    }
}

// 5. Show Final Results
function showResults() {
    document.getElementById('question').innerText = filteredProducts.length > 0 ? "為您挑選的建議產品：" : "沒有找到完全符合的產品";
    document.getElementById('options').innerHTML = '';
    const resultsContainer = document.getElementById('results');
    
    filteredProducts.slice(0, 6).forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.border = "1px solid #d4a373";
        card.style.padding = "15px";
        card.style.margin = "10px 0";
        card.style.borderRadius = "10px";
        card.style.textAlign = "left";
        
        card.innerHTML = `
            <h3 style="margin-top:0;">型號: ${product.code}</h3>
            <p><strong>尺寸:</strong> ${product.size}</p>
            <p><strong>顏色:</strong> ${product.color}</p>
            <p style="color:#b00; font-size:1.1em;"><strong>優惠價: HK$${product.salePrice}</strong></p>
            <button class="btn" style="background:#25D366; color:white; border:none;" onclick="window.sendWhatsApp('${product.code}')">WhatsApp 查詢報價</button>
        `;
        resultsContainer.appendChild(card);
    });

    document.getElementById('restart').style.display = 'inline-block';
    document.getElementById('whatsapp-reminder').style.display = 'block';
}

window.sendWhatsApp = function(code) {
    const msg = `您好！我在暉恒智能助手看中這款家具：\n型號: ${code}\n請提供更多資訊，謝謝！`;
    window.open(`https://wa.me/85253908976?text=${encodeURIComponent(msg)}`);
};

// Auto-start on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initQuiz);
} else {
    window.initQuiz();
}

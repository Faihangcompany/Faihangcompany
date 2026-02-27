import products from './products.js';

let currentQuestionIndex = 0;
let userAnswers = {};
let selectedCategory = null;
let filteredProducts = [];
let activeQuestions = []; // To hold the merged list of questions

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

function startQuestionnaire() {
    console.log("Quiz Started");
    filteredProducts = [...products];
    currentQuestionIndex = 0;
    userAnswers = {};
    activeQuestions = [...questions.initial];
    
    document.getElementById('results').innerHTML = '';
    document.getElementById('whatsapp-reminder').style.display = 'none';
    document.getElementById('restart').style.display = 'none';
    document.getElementById('status').style.display = 'none';
    
    askNextQuestion();
}

function askNextQuestion() {
    if (currentQuestionIndex >= activeQuestions.length || filteredProducts.length <= 1) {
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
        btn.className = 'btn-option'; // Add a class for styling
        btn.onclick = () => handleAnswer(question.key, option);
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(key, value) {
    if (key === 'category') {
        selectedCategory = value;
        filteredProducts = filteredProducts.filter(p => p.category === value);
        // MERGE: Category Specific + Common questions
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
            if (value === '低於1000') return p.salePrice < 1000;
            if (value === '1000-2000') return p.salePrice >= 1000 && p.salePrice <= 2000;
            if (value === '2000-3000') return p.salePrice >= 2000 && p.salePrice <= 3000;
            if (value === '3000以上') return p.salePrice > 3000;
            return true;
        });
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
        // Matches color, bed_type, etc.
        filteredProducts = filteredProducts.filter(p => 
            (p[key] && p[key].includes(value)) || p[key] === value
        );
    }
}

function showResults() {
    document.getElementById('question').innerText = "為您推薦的最佳家具：";
    document.getElementById('options').innerHTML = '';
    const resultsContainer = document.getElementById('results');
    
    if (filteredProducts.length === 0) {
        resultsContainer.innerHTML = "<p>抱歉，沒有找到完全符合的產品。請嘗試重新選擇或直接聯絡我們！</p>";
    } else {
        // Show Top 3 results
        filteredProducts.slice(0, 3).forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <h3>${product.code} - ${product.category}</h3>
                <p><strong>尺寸:</strong> ${product.size}</p>
                <p><strong>顏色:</strong> ${product.color}</p>
                <p><strong>特價:</strong> <span style="color:red; font-size:1.2em;">HK$${product.salePrice}</span></p>
                <button class="btn-whatsapp" onclick="sendWhatsApp('${product.code}')">詢問此型號報價</button>
            `;
            resultsContainer.appendChild(card);
        });
    }

    document.getElementById('restart').style.display = 'block';
    document.getElementById('restart').onclick = () => location.reload();
    document.getElementById('whatsapp-reminder').style.display = 'block';
}

// Global function for the buttons
window.sendWhatsApp = function(productCode) {
    const msg = `您好！我在智能助手找到喜歡的家具：\n編號: ${productCode}\n請提供更多資訊或報價。`;
    window.open(`https://wa.me/85253908976?text=${encodeURIComponent(msg)}`);
}

document.addEventListener('DOMContentLoaded', startQuestionnaire);

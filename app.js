import products from './products.js';

console.log("Faihang App: Script loaded");
console.log("Faihang App: Products loaded count:", products ? products.length : "ERROR");

// Global state
let currentQuestionIndex = 0;
let filteredProducts = [];
let activeQuestions = [];
let selectedCategory = null;

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

// --- CORE FUNCTIONS ---

window.renderQuestion = function() {
    const questionContainer = document.getElementById('question');
    const optionsContainer = document.getElementById('options');
    const statusEl = document.getElementById('status');

    if (statusEl) statusEl.style.display = 'none';

    if (currentQuestionIndex >= activeQuestions.length || (currentQuestionIndex > 0 && filteredProducts.length <= 2)) {
        showResults();
        return;
    }

    const currentQ = activeQuestions[currentQuestionIndex];
    questionContainer.innerText = currentQ.text;
    optionsContainer.innerHTML = '';

    currentQ.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'btn';
        btn.style.margin = "8px";
        btn.style.padding = "12px 20px";
        btn.onclick = () => window.handleSelection(currentQ.key, opt);
        optionsContainer.appendChild(btn);
    });
};

window.handleSelection = function(key, value) {
    console.log("Selected:", key, "->", value);
    
    if (key === 'category') {
        selectedCategory = value;
        filteredProducts = products.filter(p => p.category === value);
        activeQuestions = [...questions.initial, ...(questions[selectedCategory] || []), ...questions.common];
    } else {
        applyFilters(key, value);
    }

    currentQuestionIndex++;
    window.renderQuestion();
};

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
            const w = parseInt(p.size.split('*')[0]);
            if (value === '小於800') return w < 800;
            if (value === '800-1200') return w >= 800 && w <= 1200;
            if (value === '1200-1500') return w >= 1200 && w <= 1500;
            if (value === '1500以上') return w > 1500;
            return true;
        });
    } else {
        filteredProducts = filteredProducts.filter(p => {
            if (!p[key]) return false;
            return String(p[key]).includes(value);
        });
    }
}

function showResults() {
    document.getElementById('question').innerText = "為您推薦：";
    document.getElementById('options').innerHTML = '';
    const resultsContainer = document.getElementById('results');
    
    if (filteredProducts.length === 0) {
        resultsContainer.innerHTML = "<p>抱歉，暫時沒有符合您的選擇。請點擊重新開始或聯絡我們。</p>";
    } else {
        filteredProducts.slice(0, 4).forEach(p => {
            const card = document.createElement('div');
            card.style.border = "2px solid #d4a373";
            card.style.padding = "15px";
            card.style.margin = "10px 0";
            card.style.borderRadius = "10px";
            card.innerHTML = `
                <h3 style="margin:0">型號: ${p.code}</h3>
                <p>尺寸: ${p.size} | 顏色: ${p.color}</p>
                <p style="color:#b00; font-size:1.2em;"><b>特價: HK$${p.salePrice}</b></p>
                <button class="btn" style="background:#25D366; color:white; border:none;" onclick="window.sendWhatsApp('${p.code}')">詢問詳情</button>
            `;
            resultsContainer.appendChild(card);
        });
    }
    document.getElementById('restart').style.display = 'inline-block';
    document.getElementById('whatsapp-reminder').style.display = 'block';
}

window.sendWhatsApp = function(code) {
    const msg = encodeURIComponent(`您好！我在暉恒助手看中這款家具：\n型號: ${code}\n請提供更多資訊。`);
    window.open(`https://wa.me/85253908976?text=${msg}`);
};

// START ON LOAD
window.onload = function() {
    filteredProducts = [...products];
    activeQuestions = [...questions.initial];
    window.renderQuestion();
};

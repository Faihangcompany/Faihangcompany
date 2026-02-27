import products from './products.js';

let currentQuestionIndex = 0;
let userAnswers = {};
let selectedCategory = null;
let filteredProducts = [];
let activeQuestions = [];

const questions = {
    initial: [{ text: '您想找哪種家具類別？', options: ['裝飾櫃', '餐邊櫃', '地櫃', '電視櫃', '茶幾', '桶櫃', '鞋櫃', '床頭櫃', '妝臺', '書桌', '書櫃', '床', '衣櫃'], key: 'category' }],
    common: [
        // REMOVED BUDGET QUESTION AS REQUESTED
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

// --- CORE LOGIC ---

window.initQuiz = function() {
    console.log("Restarting Quiz...");
    
    // UI Resets
    const statusEl = document.getElementById('status');
    if (statusEl) statusEl.style.display = 'none';

    const resEl = document.getElementById('results');
    if (resEl) resEl.innerHTML = '';
    
    const reminderEl = document.getElementById('whatsapp-reminder');
    if (reminderEl) reminderEl.style.display = 'none';
    
    const restartBtn = document.getElementById('restart');
    if (restartBtn) restartBtn.style.display = 'none';

    // Logic Resets
    filteredProducts = [...products];
    currentQuestionIndex = 0;
    userAnswers = {};
    activeQuestions = [...questions.initial];
    
    askNextQuestion();
};

function askNextQuestion() {
    const questionEl = document.getElementById('question');
    const optionsEl = document.getElementById('options');

    if (!questionEl || !optionsEl) return;

    if (currentQuestionIndex >= activeQuestions.length || (currentQuestionIndex > 0 && filteredProducts.length <= 1)) {
        showResults();
        return;
    }

    const q = activeQuestions[currentQuestionIndex];
    questionEl.innerText = q.text;
    optionsEl.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'btn';
        btn.style.margin = "5px";
        btn.onclick = () => window.handleAnswer(q.key, opt);
        optionsEl.appendChild(btn);
    });
}

window.handleAnswer = function(key, value) {
    if (key === 'category') {
        selectedCategory = value;
        filteredProducts = products.filter(p => p.category === value);
        activeQuestions = [...questions.initial, ...(questions[selectedCategory] || []), ...questions.common];
    } else {
        userAnswers[key] = value;
        applyFilters(key, value);
    }
    currentQuestionIndex++;
    askNextQuestion();
};

function applyFilters(key, value) {
    if (value === '無偏好' || value === '其他/無偏好') return;
    
    if (key === 'width') {
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
        // Handle color, bed_type, etc.
        filteredProducts = filteredProducts.filter(p => p[key] && String(p[key]).includes(value));
    }
}

function showResults() {
    const qEl = document.getElementById('question');
    const oEl = document.getElementById('options');
    const rEl = document.getElementById('results');
    
    if (qEl) qEl.innerText = "為您挑選的建議產品：";
    if (oEl) oEl.innerHTML = '';
    if (!rEl) return;

    if (filteredProducts.length === 0) {
        rEl.innerHTML = "<p>沒有找到完全符合的產品，請嘗試重新開始或直接WhatsApp查詢。</p>";
    } else {
        filteredProducts.slice(0, 5).forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.border = "1px solid #d4a373";
            card.style.padding = "15px";
            card.style.margin = "15px 0";
            card.style.borderRadius = "10px";
            card.style.backgroundColor = "#fff";
            
            // Apply your requested changes here:
            card.innerHTML = `
                <h4 style="margin-top:0; color:#d4a373;">型號: ${p.code}</h4>
                <p><strong>尺寸:</strong> ${p.size}</p>
                <p><strong>顏色:</strong> ${p.color}</p>
                <p style="color:#666; font-size:0.9em; background:#f9f9f9; padding:5px;">💡 溫馨提示：可加 HK$500 改選其他顏色</p>
                <p><strong>備註:</strong> ${p.note || '無'}</p>
                <button class="btn" style="background-color:#25D366; color:white; width:100%;" onclick="window.sendWhatsApp('${p.code}')">查詢價錢</button>
            `;
            rEl.appendChild(card);
        });
    }

    const rBtn = document.getElementById('restart');
    if (rBtn) {
        rBtn.style.display = 'inline-block';
        rBtn.onclick = () => window.initQuiz(); // Fix for restart logic
    }
    
    const wRem = document.getElementById('whatsapp-reminder');
    if (wRem) wRem.style.display = 'block';
}

window.sendWhatsApp = function(code) {
    const msg = `您好！我在暉恒智能助手看中這款家具：\n型號: ${code}\n想查詢具體價錢及詳情。`;
    window.open(`https://wa.me/85253908976?text=${encodeURIComponent(msg)}`);
};

// Start logic
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initQuiz);
} else {
    window.initQuiz();
}

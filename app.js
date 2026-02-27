import products from './products.js';

let currentQuestionIndex = 0;
let userAnswers = {};
let selectedCategory = null;
let filteredProducts = [];
let activeQuestions = [];

const questions = {
    initial: [{ 
        text: '您想找哪種家具類別？', 
        options: ['裝飾櫃', '餐邊櫃', '地櫃', '電視櫃', '茶幾', '桶櫃', '鞋櫃', '床頭櫃', '妝臺', '書桌', '書櫃', '床', '衣櫃'], 
        key: 'category' 
    }],
    
    // Category Specific Questions
    '餐邊櫃': [{ text: '您需要高身還是矮身？', options: ['高身', '矮身', '無偏好'], key: 'height_type' }],
    '桶櫃': [{ text: '您需要幾桶？', options: ['四桶櫃', '五桶櫃', '無偏好'], key: 'bucket_count' }],
    '鞋櫃': [{ text: '您需要高身還是矮身？', options: ['高身', '矮身', '無偏好'], key: 'height_type' }],
    '書桌': [{ text: '需要連書架嗎？', options: ['連書架', '無書架', '無偏好'], key: 'with_bookshelf' }],
    '床': [
        { text: '您需要哪種床款？', options: ['碌架床', '無底床', '油壓床', '高身油壓床', '三櫃桶床', '無偏好'], key: 'bed_type' },
        { text: '床墊尺寸需要多大？', options: ['三尺', '四尺', '四尺半', '五尺', '無偏好'], key: 'mattress_size_mm' }
    ],
    '衣櫃': [{ text: '您需要哪種門？', options: ['拉門', '趟門', '無偏好'], key: 'door_type' }],

    // Common Questions (only asked if not skipped)
    sizeWidth: { text: '您需要多大的尺寸（寬度mm）？', options: ['小於800', '800-1200', '1200-1500', '1500以上', '無偏好'], key: 'width' }
};

window.initQuiz = function() {
    const statusEl = document.getElementById('status');
    if (statusEl) statusEl.style.display = 'none';
    const resEl = document.getElementById('results');
    if (resEl) resEl.innerHTML = '';
    const reminderEl = document.getElementById('whatsapp-reminder');
    if (reminderEl) reminderEl.style.display = 'none';
    const restartBtn = document.getElementById('restart');
    if (restartBtn) restartBtn.style.display = 'none';

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
        
        // --- CATEGORY BRANCHING LOGIC ---
        let branch = [];
        if (questions[selectedCategory]) {
            branch = [...questions[selectedCategory]];
        }

        // 5. 床頭櫃: Directly show results (don't add any questions)
        if (selectedCategory === '床頭櫃') { branch = []; }

        // Logic for adding the Size question at the end
        const categoriesToSkipSize = ['床', '床頭櫃', '桶櫃']; 
        if (!categoriesToSkipSize.includes(selectedCategory)) {
            branch.push(questions.sizeWidth);
        }

        activeQuestions = [...questions.initial, ...branch];
    } else {
        userAnswers[key] = value;
        applyFilters(key, value);
        
        // 4. 鞋櫃 Logic: If High body selected, skip remaining (size)
        if (selectedCategory === '鞋櫃' && key === 'height_type' && value === '高身') {
            showResults(); return;
        }

        // 6. 床 Logic: Dynamic additions
        if (selectedCategory === '床') {
            // If 油壓床 or 三櫃桶床, add leather/tail cabinet questions
            if (key === 'bed_type' && (value === '油壓床' || value === '高身油壓床' || value === '三櫃桶床')) {
                activeQuestions.push({ text: '床頭需要皮墊嗎？', options: ['有', '無', '無偏好'], key: 'headboard_leather' });
                if (value === '三櫃桶床') {
                    activeQuestions.push({ text: '需要連床尾櫃嗎？', options: ['有', '無', '無偏好'], key: 'with_tail_cabinet' });
                }
            }
        }
    }

    currentQuestionIndex++;
    askNextQuestion();
};

function applyFilters(key, value) {
    if (value === '無偏好' || value === '其他/無偏好') return;
    
    if (key === 'width') {
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
            if (p[key] === null || p[key] === undefined) return false;
            return String(p[key]).includes(value);
        });
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
        filteredProducts.slice(0, 10).forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.border = "1px solid #d4a373";
            card.style.padding = "15px";
            card.style.margin = "15px 0";
            card.style.borderRadius = "10px";
            
            card.innerHTML = `
                <h4 style="margin-top:0; color:#d4a373;">型號: ${p.code}</h4>
                <p><strong>類別:</strong> ${p.category}</p>
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
        rBtn.onclick = () => window.initQuiz();
    }
    const wRem = document.getElementById('whatsapp-reminder');
    if (wRem) wRem.style.display = 'block';
}

window.sendWhatsApp = function(code) {
    const msg = `您好！我在暉恒智能助手看中這款家具：\n型號: ${code}\n想查詢具體價錢及詳情。`;
    window.open(`https://wa.me/85253908976?text=${encodeURIComponent(msg)}`);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initQuiz);
} else {
    window.initQuiz();
}

import products from './products.js';
import mattresses from './mattresses.js';

let currentQuestionIndex = 0;
let selectedMode = null; // 'furniture' 或 'mattress'
let selectedCategory = null;
let filteredProducts = [];
let activeQuestions = [];

const furnitureQuestions = {
    initial: [{ text: '您想找哪種家具類別？', options: ['裝飾櫃', '餐邊櫃', '地櫃', '電視櫃', '茶幾', '桶櫃', '鞋櫃', '床頭櫃', '妝臺', '書桌', '書櫃', '床', '衣櫃'], key: 'category' }],
    '餐邊櫃': [{ text: '您需要高身還是矮身？', options: ['高身', '矮身', '無偏好'], key: 'height_type' }],
    '桶櫃': [{ text: '您需要幾桶？', options: ['四桶櫃', '五桶櫃', '無偏好'], key: 'bucket_count' }],
    '鞋櫃': [{ text: '您需要高身還是矮身？', options: ['高身', '矮身', '無偏好'], key: 'height_type' }],
    '書桌': [{ text: '需要連書架嗎？', options: ['連書架', '無書架', '無偏好'], key: 'with_bookshelf' }],
    '床': [{ text: '您需要哪種床款？', options: ['碌架床', '無底床', '油壓床', '三櫃桶床', '無偏好'], key: 'bed_type' }, { text: '床墊尺寸需要多大？', options: ['三尺', '四尺', '四尺半', '五尺', '無偏好'], key: 'mattress_size_mm' }],
    '衣櫃': [{ text: '您需要哪種門？', options: ['拉門', '趟門', '無偏好'], key: 'door_type' }],
    sizeWidth: { text: '您需要多大的尺寸（寬度mm）？', options: ['小於800', '800-1200', '1200-1500', '1500以上', '無偏好'], key: 'width' }
};

const mattressQuestions = [
    { text: '您偏好的床褥軟硬度？', options: ['硬', '偏硬', '適中', '無偏好'], key: 'hardness_desc' },
    { text: '您對床褥厚度有要求嗎？', options: ['薄裝 (5.5吋或以下)', '標準 (6吋-9吋)', '厚裝 (9.5吋或以上)', '無偏好'], key: 'thickness_range' }
];

window.initQuiz = function() {
    // UI Reset
    document.getElementById('status').style.display = 'none';
    document.getElementById('results').innerHTML = '';
    document.getElementById('whatsapp-reminder').style.display = 'none';
    document.getElementById('restart').style.display = 'none';

    // 初始模式選擇
    selectedMode = null;
    const qEl = document.getElementById('question');
    const oEl = document.getElementById('options');
    qEl.innerText = "歡迎來到暉恒助手，請問您今天想找什麼？";
    oEl.innerHTML = '';

    const btn1 = document.createElement('button');
    btn1.innerText = "🏢 找優質家具";
    btn1.className = 'btn';
    btn1.style.margin = "10px";
    btn1.onclick = () => startMode('furniture');

    const btn2 = document.createElement('button');
    btn2.innerText = "🛏️ 找歐化寶床褥";
    btn2.className = 'btn';
    btn2.style.margin = "10px";
    btn2.onclick = () => startMode('mattress');

    oEl.appendChild(btn1);
    oEl.appendChild(btn2);
};

function startMode(mode) {
    selectedMode = mode;
    currentQuestionIndex = 0;
    if (mode === 'furniture') {
        filteredProducts = [...products];
        activeQuestions = [...furnitureQuestions.initial];
    } else {
        filteredProducts = [...mattresses];
        activeQuestions = [...mattressQuestions];
    }
    askNextQuestion();
}

function askNextQuestion() {
    const qEl = document.getElementById('question');
    const oEl = document.getElementById('options');
    
    if (currentQuestionIndex >= activeQuestions.length || (currentQuestionIndex > 0 && filteredProducts.length <= 1)) {
        selectedMode === 'furniture' ? showFurnitureResults() : showMattressResults();
        return;
    }

    const q = activeQuestions[currentQuestionIndex];
    qEl.innerText = q.text;
    oEl.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'btn';
        btn.style.margin = "5px";
        btn.onclick = () => handleAnswer(q.key, opt);
        oEl.appendChild(btn);
    });
}

function handleAnswer(key, value) {
    if (selectedMode === 'furniture') {
        handleFurnitureAnswer(key, value);
    } else {
        handleMattressAnswer(key, value);
    }
    currentQuestionIndex++;
    askNextQuestion();
}

// --- 家具邏輯 (保留你原本的所有規則) ---
function handleFurnitureAnswer(key, value) {
    if (key === 'category') {
        selectedCategory = value;
        filteredProducts = products.filter(p => p.category === value);
        let branch = furnitureQuestions[selectedCategory] || [];
        if (selectedCategory === '床頭櫃') branch = [];
        if (!['床', '床頭櫃', '桶櫃'].includes(selectedCategory)) branch.push(furnitureQuestions.sizeWidth);
        activeQuestions = [...furnitureQuestions.initial, ...branch];
    } else {
        if (key === 'hydraulic_height') {
            filteredProducts = products.filter(p => p.category === '床' && p.bed_type === (value === '高身' ? '高身油壓床' : '油壓床'));
            activeQuestions.splice(currentQuestionIndex + 1, 0, { text: '床頭需要皮墊嗎？', options: ['有', '無', '無偏好'], key: 'headboard_leather' });
        } else {
            applyFurnitureFilters(key, value);
        }
        // 家具的分支邏輯
        if (selectedCategory === '鞋櫃' && key === 'height_type' && value === '高身') { showFurnitureResults(); return; }
        if (selectedCategory === '床' && key === 'bed_type' && value === '油壓床') {
            activeQuestions.splice(currentQuestionIndex + 1, 0, { text: '您需要普通高度還是高身油壓床？', options: ['普通高度', '高身', '無偏好'], key: 'hydraulic_height' });
        }
        if (selectedCategory === '床' && key === 'bed_type' && value === '三櫃桶床') {
            activeQuestions.push({ text: '床頭需要皮墊嗎？', options: ['有', '無', '無偏好'], key: 'headboard_leather' }, { text: '需要連床尾櫃嗎？', options: ['有', '無', '無偏好'], key: 'with_tail_cabinet' });
        }
    }
}

function applyFurnitureFilters(key, value) {
    if (value === '無偏好' || key === 'hydraulic_height') return;
    if (key === 'width') {
        filteredProducts = filteredProducts.filter(p => {
            if (!p.size) return true;
            const w = parseInt(p.size.split('*')[0]);
            if (value === '小於800') return w < 800;
            if (value === '800-1200') return w >= 800 && w <= 1200;
            if (value === '1200-1500') return w >= 1200 && w <= 1500;
            return w > 1500;
        });
    } else {
        filteredProducts = filteredProducts.filter(p => (key === 'mattress_size_mm' || key === 'bed_type') ? String(p[key]) === value : String(p[key]).includes(value));
    }
}

// --- 床褥邏輯 (新增) ---
function handleMattressAnswer(key, value) {
    if (value === '無偏好') return;
    if (key === 'thickness_range') {
        filteredProducts = filteredProducts.filter(p => {
            if (value.includes('薄裝')) return p.thickness <= 5.5;
            if (value.includes('標準')) return p.thickness > 5.5 && p.thickness < 9.5;
            if (value.includes('厚裝')) return p.thickness >= 9.5;
            return true;
        });
    } else {
        filteredProducts = filteredProducts.filter(p => p[key] === value);
    }
}

function showFurnitureResults() {
    const rEl = document.getElementById('results');
    document.getElementById('question').innerText = "為您挑選的建議家具：";
    document.getElementById('options').innerHTML = '';
    
    if (filteredProducts.length === 0) {
        rEl.innerHTML = "<p>沒有符合家具，請嘗試重新開始。</p>";
    } else {
        filteredProducts.slice(0, 10).forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style = "border:1px solid #d4a373; padding:15px; margin:15px 0; border-radius:10px;";
            card.innerHTML = `
                <h4>型號: ${p.code}</h4>
                <p><strong>尺寸:</strong> ${p.size} | <strong>顏色:</strong> ${p.color}</p>
                <p><strong>備註:</strong> ${p.note || '無'}</p>
                <button class="btn" style="background:#25D366; color:white; width:100%;" onclick="sendWA('家具', '${p.code}')">查詢價錢</button>
            `;
            rEl.appendChild(card);
        });
    }
    finishQuiz();
}

function showMattressResults() {
    const rEl = document.getElementById('results');
    document.getElementById('question').innerText = "為您挑選的歐化寶床褥：";
    document.getElementById('options').innerHTML = '';

    if (filteredProducts.length === 0) {
        rEl.innerHTML = "<p>沒有符合床褥，請嘗試放寬篩選條件。</p>";
    } else {
        filteredProducts.forEach(m => {
            const card = document.createElement('div');
            card.style = "border:1px solid #004a99; padding:15px; margin:15px 0; border-radius:10px; background:#f0f7ff;";
            card.innerHTML = `
                <h4 style="color:#004a99;">${m.name}</h4>
                <p><strong>軟硬度:</strong> ${m.hardness_desc} (約${m.hardness_value})</p>
                <p><strong>厚度:</strong> 約 ${m.thickness} 吋</p>
                <p><strong>🎁 贈品:</strong> ${m.gift}</p>
                <p><strong>💡 備註:</strong> ${m.note}</p>
                <a href="${m.link}" target="_blank" style="display:block; margin-bottom:10px; color:#004a99;">🌐 查看官方詳細介紹</a>
                <button class="btn" style="background:#25D366; color:white; width:100%;" onclick="sendWA('床褥', '${m.name}')">詢問尺寸及價錢</button>
            `;
            rEl.appendChild(card);
        });
    }
    finishQuiz();
}

function finishQuiz() {
    document.getElementById('restart').style.display = 'inline-block';
    document.getElementById('restart').onclick = () => window.initQuiz();
    document.getElementById('whatsapp-reminder').style.display = 'block';
}

window.sendWA = function(type, name) {
    const msg = `您好！我在暉恒助手看中這款${type}：\n名稱/型號: ${name}\n想查詢具體價錢及詳情。`;
    window.open(`https://wa.me/85253908976?text=${encodeURIComponent(msg)}`);
};

window.onload = window.initQuiz;

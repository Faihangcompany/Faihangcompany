// app.js - 完美問題順序 + 真實類別（替換整個檔案）
const questions = [
    {key: "category", text: "想要哪種家具？", options: ["裝飾櫃", "餐邊櫃", "地櫃", "電視櫃", "茶幾", "四桶櫃", "五桶櫃", "鞋櫃", "床頭櫃", "妝臺", "書桌", "書桌連書架", "書櫃", "上下床", "無櫃桶床", "油壓床(普通)", "油壓床(有皮)", "油壓床(高身)", "三櫃桶床(普通)", "三櫃桶床(普通有皮)", "衣櫃"]},
    {key: "priceRange", text: "預算範圍？", options: ["$1,000以下", "$1,000-$3,000", "$3,000-$5,000", "$5,000以上"]},
    {key: "color", text: "喜歡什麼顏色？", options: ["ORI胡桃", "白木紋", "親橡", "橡木"]}
];

let answers = {};
let currentQuestionIndex = 0;

function showQuestion() {
    const qArea = document.getElementById("question-area");
    const aArea = document.getElementById("answers-area");
    const rArea = document.getElementById("results-area");
    const restartBtn = document.getElementById("restart");
    const whatsappReminder = document.getElementById("whatsapp-reminder");
    
    rArea.innerHTML = ""; restartBtn.style.display = "none"; whatsappReminder.style.display = "none";

    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const q = questions[currentQuestionIndex];
    qArea.textContent = q.text;
    aArea.innerHTML = "";

    q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = opt;
        btn.onclick = () => {
            answers[q.key] = opt;
            currentQuestionIndex++;
            showQuestion();
        };
        aArea.appendChild(btn);
    });
}

function showResults() {
    const rArea = document.getElementById("results-area");
    const qArea = document.getElementById("question-area");
    const aArea = document.getElementById("answers-area");
    const restartBtn = document.getElementById("restart");
    const whatsappReminder = document.getElementById("whatsapp-reminder");
    
    qArea.textContent = "💎 推薦產品（請截圖保存）：";
    aArea.innerHTML = "";
    restartBtn.style.display = "block";

    let matched = products.filter(p => {
        let match = true;
        if (answers.category && p.category !== answers.category) match = false;
        if (answers.priceRange) {
            const price = p.salePrice;
            if (answers.priceRange === "$1,000以下" && price > 1000) match = false;
            if (answers.priceRange === "$1,000-$3,000" && (price < 1000 || price > 3000)) match = false;
            if (answers.priceRange === "$3,000-$5,000" && (price < 3000 || price > 5000)) match = false;
            if (answers.priceRange === "$5,000以上" && price < 5000) match = false;
        }
        return match;
    });

    if (matched.length === 0) {
        rArea.innerHTML = `
            <div style="text-align:center; padding:30px; color:#666;">
                <h3>😊 我們有相似產品推薦</h3>
                <p>請截圖您的選擇並WhatsApp，我們專業顧問即時為您服務！</p>
            </div>
        `;
        whatsappReminder.style.display = "block";
        return;
    }

    const colorInfo = checkColorAvailability(matched, answers.color);

    matched.slice(0, 8).forEach(p => {  // 只顯示前8款避免太長
        const div = document.createElement("div");
        div.className = "product-card";
        const colorStatus = p.color.includes(answers.color) ? "✅ 原色免費" : "💰 +$500可改色";
        div.innerHTML = `
            <div class="category-tag">${p.category}</div>
            <div class="product-code">${p.code}</div>
            <div>尺寸: ${p.size}mm</div>
            <div>顏色: ${p.color}</div>
            <div style="font-size:0.9em; color:#666; line-height:1.4;">${p.note}</div>
            <div style="margin-top:10px; padding:8px; background:#e8f5e8; border-radius:8px;">
                ${colorStatus}
            </div>
        `;
        rArea.appendChild(div);
    });

    if (matched.length > 8) {
        const moreDiv = document.createElement("div");
        moreDiv.style.cssText = "text-align:center; padding:20px; background:#f0f8ff; border-radius:10px; margin-top:15px;";
        moreDiv.innerHTML = `... 還有${matched.length-8}款相似產品，<strong>請截圖聯絡我們獲取完整清單！</strong>`;
        rArea.appendChild(moreDiv);
    }

    whatsappReminder.style.display = "block";
}

function checkColorAvailability(products, selectedColor) {
    const allColors = ["ORI胡桃", "白木紋", "親橡", "橡木"];
    const productColors = products.map(p => p.color.split(/[、，配]/)).flat().filter(c => allColors.includes(c.trim()));
    const uniqueColors = [...new Set(productColors)];
    
    return {
        freeColors: uniqueColors,
        extraCostColors: selectedColor && !uniqueColors.includes(selectedColor) ? [selectedColor] : []
    };
}

document.getElementById("restart").onclick = () => {
    answers = {};
    currentQuestionIndex = 0;
    showQuestion();
};

document.addEventListener("DOMContentLoaded", () => {
    showQuestion();
// Add to END of your existing script.js
const FURNITURE_TREE = {
    "裝飾櫃": "單款裝飾櫃", "地櫃": "TR083-48 & TR083-60", 
    "電視櫃": "單款電視櫃", "茶幾": "單款茶幾", 
    "床頭櫃": "單款床頭櫃", "妝臺": "單款妝臺",
    "餐邊櫃": ["倭身", "高身"], "桶櫃": ["四桶櫃", "五桶櫃"],
    "鞋櫃": ["倭身", "高身"], "書桌": ["書桌", "書桌連書架"],
    "書櫃": ["有玻璃", "無玻璃"], "衣櫃": ["趟門", "拉門"],
    "床": ["碌架床", "無櫃桶床", "油壓床", "三櫃桶床"]
};

let gameState = "start";

function startAkinator() {
    document.getElementById('akinator-game').style.display = 'block';
    updateGame();
}

function updateGame() {
    const q = document.getElementById('question');
    const opts = document.getElementById('options');
    const result = document.getElementById('result');
    
    opts.innerHTML = ''; result.style.display = 'none';
    
    if (gameState === 'start') {
        q.textContent = '我想猜你想要哪款家具！';
        ['裝飾櫃','餐邊櫃','地櫃','電視櫃','茶幾','桶櫃','鞋櫃','床頭櫃','妝臺','書桌','書櫃','床','衣櫃']
            .forEach(cat => addBtn(cat, opts));
    } else {
        const node = FURNITURE_TREE[gameState] || FURNITURE_TREE[gameState.split('+')[0]];
        if (typeof node === 'string') {
            q.textContent = '✅ 找到啦！';
            result.innerHTML = `<b>${node}</b> 詳細資料請看產品頁`;
            result.style.display = 'block';
        } else {
            q.textContent = `關於${gameState}: 請選擇`;
            node.forEach(opt => addBtn(opt, opts));
        }
    }
}

function addBtn(text, container) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.onclick = () => {
        gameState = gameState === 'start' ? text : gameState + '+' + text;
        updateGame();
    };
    container.appendChild(btn);
}

});


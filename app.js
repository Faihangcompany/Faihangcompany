// app.js - 正確順序 + 4個顏色選項（替換整個檔案）
const questions = [
    {key: "category", text: "想要哪種家具？", options: ["裝飾櫃", "餐邊櫃", "地櫃", "地櫃連上座"]},
    {key: "priceRange", text: "預算範圍？", options: ["$1,000以下", "$1,000-$2,500", "$2,500以上"]},
    {key: "color", text: "喜歡什麼顏色？", options: ["ORI胡桃", "白木紋", "親橡", "橡木"]}
];

const availableColors = ["ORI胡桃", "白木紋", "親橡", "橡木"];

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
    
    qArea.textContent = "💎 根據您的選擇，推薦以下產品：";
    aArea.innerHTML = "";
    restartBtn.style.display = "block";

    let matched = products.filter(p => {
        let match = true;
        if (answers.category && p.category !== answers.category) match = false;
        if (answers.priceRange) {
            if (answers.priceRange === "$1,000以下" && p.salePrice > 1000) match = false;
            if (answers.priceRange === "$1,000-$2,500" && (p.salePrice < 1000 || p.salePrice > 2500)) match = false;
            if (answers.priceRange === "$2,500以上" && p.salePrice < 2500) match = false;
        }
        return match;
    });

    if (matched.length === 0) {
        rArea.innerHTML = `
            <div style="text-align:center; padding:30px; color:#666;">
                <h3>😊 我們有類似產品可供選擇</h3>
                <p>請截圖並WhatsApp我們，我們會為您推薦最適合的款式！</p>
            </div>
        `;
        whatsappReminder.style.display = "block";
        return;
    }

    // 顏色匹配檢查
    const colorInfo = checkColorAvailability(matched, answers.color);

    matched.forEach(p => {
        const div = document.createElement("div");
        div.className = "product-card";
        const colorStatus = p.color.includes(answers.color) ? "✅ 原色" : "💰 +$500可改";
        div.innerHTML = `
            <div class="category-tag">${p.category}</div>
            <div class="product-code">${p.code}</div>
            <div>尺寸: ${p.size}mm</div>
            <div>顏色: ${p.color}</div>
            <div style="font-size:0.9em; color:#666;">${p.note}</div>
            <div style="margin-top:10px; padding:8px; background:#e8f5e8; border-radius:8px; font-size:0.95em;">
                ${colorStatus}
            </div>
        `;
        rArea.appendChild(div);
    });

    // 顏色資訊
    const infoDiv = document.createElement("div");
    infoDiv.style.cssText = "margin-top:20px; padding:15px; background:#e3f2fd; border-radius:10px; border-left:4px solid #4ecdc4;";
    infoDiv.innerHTML = `
        <strong>顏色資訊：</strong><br>
        ✅ 免費顏色：${colorInfo.freeColors.join('、')}<br>
        💰 加$500可改：${colorInfo.extraCostColors.join('、')}
    `;
    rArea.appendChild(infoDiv);

    whatsappReminder.style.display = "block";
}

function checkColorAvailability(products, selectedColor) {
    const productColors = products.map(p => p.color.split(/[、，]/)).flat();
    const uniqueColors = [...new Set(productColors)].filter(c => availableColors.includes(c.trim()));
    
    const freeColors = uniqueColors.filter(c => c !== selectedColor);
    const extraCostColors = selectedColor && !uniqueColors.includes(selectedColor) ? [selectedColor] : [];
    
    return {
        freeColors: freeColors.length > 0 ? freeColors : availableColors.slice(0,2), // 預設顯示常見顏色
        extraCostColors: extraCostColors.length > 0 ? extraCostColors : availableColors.slice(2)
    };
}

document.getElementById("restart").onclick = () => {
    answers = {};
    currentQuestionIndex = 0;
    showQuestion();
};

document.addEventListener("DOMContentLoaded", () => {
    showQuestion();
});

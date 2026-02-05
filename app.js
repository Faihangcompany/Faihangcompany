// app.js - 智能選購邏輯
const questions = [
    {
        key: "category",
        text: "想要哪種家具？",
        options: ["裝飾櫃", "餐邊櫃", "地櫃", "地櫃連上座"]
    },
    {
        key: "color",
        text: "喜歡什麼顏色/木紋？",
        options: ["ORI胡桃、親橡、橡木", "白木紋", "白木紋、橡木"]
    },
    {
        key: "priceRange",
        text: "預算範圍？",
        options: ["$1,000以下", "$1,000-$2,500", "$2,500以上"]
    }
];

let answers = {};
let currentQuestionIndex = 0;

function showQuestion() {
    const qArea = document.getElementById("question-area");
    const aArea = document.getElementById("answers-area");
    const rArea = document.getElementById("results-area");
    const restartBtn = document.getElementById("restart");
    
    rArea.innerHTML = "";
    restartBtn.style.display = "none";

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
    
    qArea.textContent = "💎 根據您的選擇，推薦以下產品：";
    aArea.innerHTML = "";
    restartBtn.style.display = "block";

    let matched = products.filter(p => {
        let match = true;
        if (answers.category && p.category !== answers.category) match = false;
        if (answers.color && !p.color.includes(answers.color.split("、")[0])) match = false;
        if (answers.priceRange) {
            if (answers.priceRange === "$1,000以下" && p.salePrice >= 1000) match = false;
            if (answers.priceRange === "$1,000-$2,500" && (p.salePrice < 1000 || p.salePrice > 2500)) match = false;
            if (answers.priceRange === "$2,500以上" && p.salePrice <= 2500) match = false;
        }
        return match;
    });

    if (matched.length === 0) {
        rArea.innerHTML = `
            <div style="text-align:center; padding:30px; color:#666;">
                <h3>😊 暫時沒有完全符合的產品</h3>
                <p>請WhatsApp我們，我們會為您特別推薦！</p>
            </div>
        `;
        return;
    }

    matched.forEach(p => {
        const div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
            <div class="category-tag">${p.category}</div>
            <div class="product-code">${p.code}</div>
            <div class="product-price">
                <del>原價 HK$${p.originalPrice.toLocaleString()}</del>
                折實 HK$${p.salePrice.toLocaleString()}
            </div>
            <div>尺寸: ${p.size}mm</div>
            <div>顏色: ${p.color}</div>
            <div style="font-size:0.9em; color:#666; margin-top:10px;">${p.note}</div>
        `;
        rArea.appendChild(div);
    });
}

function renderAllProducts() {
    const container = document.getElementById("product-list");
    products.forEach(p => {
        const div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
            <div class="category-tag">${p.category}</div>
            <div class="product-code">${p.code}</div>
            <div class="product-price">
                <del>原價 HK$${p.originalPrice.toLocaleString()}</del>
                折實 HK$${p.salePrice.toLocaleString()}
            </div>
            <div>尺寸: ${p.size}mm | 顏色: ${p.color}</div>
        `;
        container.appendChild(div);
    });
}

document.getElementById("restart").onclick = () => {
    answers = {};
    currentQuestionIndex = 0;
    showQuestion();
};

document.addEventListener("DOMContentLoaded", () => {
    showQuestion();
    renderAllProducts();
});

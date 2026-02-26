// app.js - 動態問題 + 條件分支（繁體中文）
let answers = {};
let currentStep = 0;

const steps = [
    {
        key: "mainCategory",
        text: "想要哪種家具？",
        options: [
            "裝飾櫃", "餐邊櫃", "地櫃", "電視櫃", "茶幾", "桶櫃", "鞋櫃", 
            "床頭櫃", "妝臺", "書桌", "書桌連書架", "書櫃", "床", "衣櫃"
        ]
    },
    // 其他固定問題可加在這裡，例如尺寸偏好、顏色等
];

function getCurrentStep() {
    const main = answers.mainCategory;

    if (currentStep === 1) {
        if (main === "桶櫃") {
            return {
                key: "drawerCount",
                text: "你要4桶還是5桶？",
                options: ["4桶", "5桶"]
            };
        }
        if (main === "床") {
            return {
                key: "bedType",
                text: "你要哪一種床？",
                options: ["三櫃桶", "油壓", "無底", "碌架床"]
            };
        }
        // 其他類別如果需要額外問題，也可在此加
        return null; // 無額外問題 → 直接結束
    }

    if (currentStep === 2 && answers.mainCategory === "床") {
        return {
            key: "hasLeather",
            text: "床頭要不要有皮墊？",
            options: ["有", "沒有"]
        };
    }

    if (currentStep === 3 && answers.mainCategory === "床" && answers.bedType === "三櫃桶") {
        return {
            key: "hasFootCabinet",
            text: "要不要加床尾櫃？",
            options: ["有", "沒有"]
        };
    }

    return null;
}

function showQuestion() {
    const qArea = document.getElementById("question-area");
    const aArea = document.getElementById("answers-area");
    const rArea = document.getElementById("results-area");
    const restartBtn = document.getElementById("restart");
    const whatsapp = document.getElementById("whatsapp-reminder");

    rArea.innerHTML = "";
    restartBtn.style.display = "none";
    whatsapp.style.display = "none";

    const step = steps[currentStep] || getCurrentStep();

    if (!step) {
        showResults();
        return;
    }

    qArea.textContent = step.text;
    aArea.innerHTML = "";

    step.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = opt;
        btn.onclick = () => {
            answers[step.key] = opt;
            currentStep++;
            showQuestion();
        };
        aArea.appendChild(btn);
    });
}

function showResults() {
    const qArea = document.getElementById("question-area");
    const aArea = document.getElementById("answers-area");
    const rArea = document.getElementById("results-area");
    const restartBtn = document.getElementById("restart");
    const whatsapp = document.getElementById("whatsapp-reminder");

    qArea.textContent = "為你推薦的產品如下（請截圖保存）：";
    aArea.innerHTML = "";
    restartBtn.style.display = "block";

    let filtered = products.filter(p => {
        const main = answers.mainCategory;
        if (!main) return false;

        // 單品類別直接比對
        if (["裝飾櫃", "妝臺", "床頭櫃", "茶幾", "電視櫃", "地櫃", "餐邊櫃", "鞋櫃", "書桌", "書桌連書架", "書櫃", "衣櫃"].includes(main)) {
            return p.category === main;
        }

        // 桶櫃
        if (main === "桶櫃") {
            const targetCat = answers.drawerCount === "4桶" ? "四桶櫃" : "五桶櫃";
            return p.category === targetCat;
        }

        // 床類
        if (main === "床") {
            let bedCats = [];
            if (answers.bedType === "三櫃桶") {
                bedCats = answers.hasFootCabinet === "有"
                    ? ["三櫃桶床(普通)連床尾櫃", "三櫃桶床(普通有皮)連床尾櫃"]
                    : ["三櫃桶床(普通)", "三櫃桶床(普通有皮)"];
            } else if (answers.bedType === "油壓") {
                bedCats = ["油壓床(普通)", "油壓床(有皮)", "油壓床(高身)"];
            } else if (answers.bedType === "無底") {
                bedCats = ["無櫃桶床"];
            } else if (answers.bedType === "碌架床") {
                bedCats = ["上下床"];
            }

            let match = bedCats.some(cat => p.category.includes(cat));

            // 皮墊篩選
            if (answers.hasLeather === "有") {
                match = match && (p.category.includes("有皮") || p.note.includes("生態皮"));
            } else if (answers.hasLeather === "沒有") {
                match = match && !p.category.includes("有皮") && !p.note.includes("生態皮");
            }

            return match;
        }

        return false;
    });

    if (filtered.length === 0) {
        rArea.innerHTML = `<p style="color:#e63946; font-size:1.3em; text-align:center;">
            暫時未找到完全符合的款式～<br>請截圖以上選擇，WhatsApp我們即時幫你查！
        </p>`;
        whatsapp.style.display = "block";
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-code">${p.category} ${p.code}</div>
            <div>尺寸：${p.size}</div>
            <div>顏色：${p.color}</div>
            <div class="product-price">
                <del>原價：$${p.originalPrice}</del><br>
                折實價：<span style="color:#e63946; font-size:1.4em; font-weight:bold;">$${p.salePrice}</span>
            </div>
            <div>${p.note || ""}</div>
        `;
        rArea.appendChild(card);
    });

    whatsapp.style.display = "block";
}

document.getElementById("restart").onclick = () => {
    answers = {};
    currentStep = 0;
    showQuestion();
};

document.addEventListener("DOMContentLoaded", showQuestion);

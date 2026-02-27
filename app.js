const questions = {
    initial: [{ 
        text: '您想找哪種家具類別？', 
        options: ['裝飾櫃', '餐邊櫃', '地櫃', '電視櫃', '茶幾', '桶櫃', '鞋櫃', '床頭櫃', '妝臺', '書桌', '書櫃', '床', '衣櫃'], 
        key: 'category' 
    }],
    
    '餐邊櫃': [{ text: '您需要高身還是矮身？', options: ['高身', '矮身', '無偏好'], key: 'height_type' }],
    '桶櫃': [{ text: '您需要幾桶？', options: ['四桶櫃', '五桶櫃', '無偏好'], key: 'bucket_count' }],
    '鞋櫃': [{ text: '您需要高身還是矮身？', options: ['高身', '矮身', '無偏好'], key: 'height_type' }],
    '書桌': [{ text: '需要連書架嗎？', options: ['連書架', '無書架', '無偏好'], key: 'with_bookshelf' }],
    '床': [
        // Updated options to combine or branch
        { text: '您需要哪種床款？', options: ['碌架床', '無底床', '油壓床', '三櫃桶床', '無偏好'], key: 'bed_type' },
        { text: '床墊尺寸需要多大？', options: ['三尺', '四尺', '四尺半', '五尺', '無偏好'], key: 'mattress_size_mm' }
    ],
    '衣櫃': [{ text: '您需要哪種門？', options: ['拉門', '趟門', '無偏好'], key: 'door_type' }],

    sizeWidth: { text: '您需要多大的尺寸（寬度mm）？', options: ['小於800', '800-1200', '1200-1500', '1500以上', '無偏好'], key: 'width' }
};

window.handleAnswer = function(key, value) {
    if (key === 'category') {
        selectedCategory = value;
        filteredProducts = products.filter(p => p.category === value);
        
        let branch = [];
        if (questions[selectedCategory]) {
            branch = [...questions[selectedCategory]];
        }
        if (selectedCategory === '床頭櫃') { branch = []; }

        const categoriesToSkipSize = ['床', '床頭櫃', '桶櫃']; 
        if (!categoriesToSkipSize.includes(selectedCategory)) {
            branch.push(questions.sizeWidth);
        }
        activeQuestions = [...questions.initial, ...branch];

    } else {
        userAnswers[key] = value;
        applyFilters(key, value);
        
        // --- SPECIFIC BRANCHING ---

        // 鞋櫃 Logic
        if (selectedCategory === '鞋櫃' && key === 'height_type' && value === '高身') {
            showResults(); return;
        }

        // 床 Logic
        if (selectedCategory === '床') {
            // 1. If user picks 油壓床, ask about Height
            if (key === 'bed_type' && value === '油壓床') {
                // Add the Height question immediately after the current step
                activeQuestions.splice(currentQuestionIndex + 1, 0, { 
                    text: '您需要普通高度還是高身油壓床？', 
                    options: ['普通高度', '高身', '無偏好'], 
                    key: 'hydraulic_height' 
                });
            }

            // 2. Handle the response to the Height question
            if (key === 'hydraulic_height') {
                if (value === '高身') {
                    // Update the filter to find the "高身油壓床" in data
                    filteredProducts = filteredProducts.filter(p => p.bed_type === '高身油壓床');
                } else if (value === '普通高度') {
                    filteredProducts = filteredProducts.filter(p => p.bed_type === '油壓床');
                }
                
                // After height, ask about leather
                activeQuestions.splice(currentQuestionIndex + 1, 0, { 
                    text: '床頭需要皮墊嗎？', 
                    options: ['有', '無', '無偏好'], 
                    key: 'headboard_leather' 
                });
            }

            // 3. If user picks 三櫃桶床, ask about leather and tail cabinet
            if (key === 'bed_type' && value === '三櫃桶床') {
                activeQuestions.push({ text: '床頭需要皮墊嗎？', options: ['有', '無', '無偏好'], key: 'headboard_leather' });
                activeQuestions.push({ text: '需要連床尾櫃嗎？', options: ['有', '無', '無偏好'], key: 'with_tail_cabinet' });
            }
        }
    }

    currentQuestionIndex++;
    askNextQuestion();
};

function applyFilters(key, value) {
    if (value === '無偏好' || value === '其他/無偏好') return;
    
    // Safety check for bed_type because we handle hydraulic height separately
    if (key === 'hydraulic_height') return;

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

            // EXACT MATCH for Bed sizes and types to prevent "四尺" matching "四尺半"
            if (key === 'mattress_size_mm' || key === 'bed_type' || key === 'bucket_count') {
                return String(p[key]) === value; 
            } else {
                return String(p[key]).includes(value);
            }
        });
    }
}

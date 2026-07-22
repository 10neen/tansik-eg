

// ==========================================
// 1. وظائف الواجهة (الإظهار والإخفاء)
// ==========================================
function showInputFields() {
    var inputArea = document.getElementById('input-area');
    var startBtn = document.getElementById('start-design');

    if (inputArea && startBtn) {
        inputArea.style.display = 'block';
        startBtn.style.display = 'none';
        
        window.scrollTo({ 
            top: inputArea.offsetTop - 20, 
            behavior: 'smooth' 
        });
    }
}

function handleBranchChange() {
    var branchSelect = document.getElementById('student-branch');
    var locWrapper = document.getElementById('location-wrapper');
    
    if (!branchSelect || !locWrapper) return;

    var branch = branchSelect.value;
    var validBranches = ['science', 'math', 'adaby']; 
    
    if (branch && validBranches.includes(branch)) {
        locWrapper.classList.remove('hidden');
        locWrapper.style.opacity = "1";
        
        // 1. لو الطالب اختار علمي علوم أو رياضة والملف لسه متحملش
        if ((branch === 'science' || branch === 'math') && !window.elmyDataJSON) {
            var script = document.createElement('script');
            script.src = 'elmy_data.js';
            document.body.appendChild(script);
            
            script.onload = function() {
                console.log("تم تحميل بيانات العلمي بنجاح وجاهزة للاستخدام! 👨‍⚕️");
            };
        } 
        // 2. لو الطالب اختار أدبي والملف لسه متحملش
        else if (branch === 'adaby' && !window.adabyDataJSON) {
            var script = document.createElement('script');
            script.src = 'adaby_data.js';
            document.body.appendChild(script);
            
            script.onload = function() {
                console.log("تم تحميل بيانات الأدبي بنجاح وجاهزة للاستخدام! 📚");
            };
        }
        
    } else {
        locWrapper.classList.add('hidden');
        var locSelect = document.getElementById('student-location');
        if (locSelect) locSelect.value = ""; 
    }
}

// ==========================================
// 2. دالة تشغيل الأرشيف الذكية (Lazy Loading)
// ==========================================
function viewArchive(type) {
    const resultsArea = document.getElementById('archive-results'); 
    
    // إغلاق/فتح الأرشيف لنفس النوع (Toggle)
    if (resultsArea.innerHTML !== "" && resultsArea.dataset.currentType === type) {
        resultsArea.innerHTML = "";
        resultsArea.dataset.currentType = "";
        return;
    }

    // 🚀 التحقق من تحميل ملف البيانات المطلوب ديناميكياً
    if (type === 'elmy' && !window.elmyDataJSON) {
        var script = document.createElement('script');
        script.src = 'elmy_data.js';
        document.body.appendChild(script);
        script.onload = function() {
            console.log("تم تحميل ملف العلمي للأرشيف ✅");
            renderArchiveHTML(type, window.elmyDataJSON);
        };
        return;
    }
    if (type === 'adaby' && !window.adabyDataJSON) {
        var script = document.createElement('script');
        script.src = 'adaby_data.js';
        document.body.appendChild(script);
        script.onload = function() {
            console.log("تم تحميل ملف الأدبي للأرشيف ✅");
            renderArchiveHTML(type, window.adabyDataJSON);
        };
        return;
    }
    // لو الملفات متوفرة مسبقاً، اعرض الجدول مباشرة
    let archiveData = (type === 'elmy') ? window.elmyDataJSON : window.adabyDataJSON;
    renderArchiveHTML(type, archiveData);
}

// 🛠️ دالة بناء وعرض جدول الأرشيف
function renderArchiveHTML(type, archiveData) {
    const resultsArea = document.getElementById('archive-results');
    if (!archiveData || archiveData.length === 0) {
        alert("⚠️ تأكد من وجود ملفات البيانات في المجلد الخاص بالموقع");
        return;
    }
    const themeColor = (type === 'elmy') ? '#0284c7' : '#0d9488';
    resultsArea.dataset.currentType = type;
    let html = `
        <div class="archive-container" style="border: 2px solid ${themeColor}; margin-top:20px; background:var(--card-bg); border-radius:12px; overflow:hidden;">
            <div style="background:${themeColor}; color:white; padding:15px; text-align:center; font-weight:bold; display:flex; justify-content:space-between; align-items:center;">
                <span></span> <span>📊 أرشيف 2025 - المجموعة ${type === 'elmy' ? 'العلمية' : 'الأدبية'}</span>
                <button onclick="document.getElementById('archive-results').innerHTML=''" style="background:rgba(255,255,255,0.2); border:none; color:white; cursor:pointer; padding:5px 10px; border-radius:5px;">إغلاق X</button>
            </div>
            
            <div style="max-height: 500px; overflow-y: auto;">
                <table style="width:100%; border-collapse:collapse;" dir="rtl">
                    <thead>
                        <tr style="background:var(--card-bg); position: sticky; top: 0; z-index: 10; box-shadow: 0 2px 2px rgba(0,0,0,0.05);">
                            <th style="padding:12px; border:1px solid var(--border-color); color:var(--text-main);">م</th>
                            <th style="padding:12px; border:1px solid var(--border-color); text-align:right; color:var(--text-main);">الكلية</th>
                            <th style="padding:12px; border:1px solid var(--border-color); color:var(--text-main);">الدرجة</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    archiveData.forEach((item, index) => {
        html += `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding:10px; text-align:center; color: var(--text-muted);">${index + 1}</td>
                <td style="padding:10px; font-weight:bold; color: var(--text-main); text-align:right;">${item.name}</td>
                <td style="padding:10px; text-align:center; color: var(--primary); font-weight:900;">${item.score || item.minScore}</td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
            
            <div style="background:var(--card-bg); padding:10px; text-align:center; border-top:1px solid var(--border-color);">
                <button onclick="document.getElementById('archive-results').innerHTML=''; window.scrollTo({top: document.getElementById('archive-results').offsetTop - 100, behavior:'smooth'});" 
                        style="background:${themeColor}; color:white; border:none; padding:8px 25px; border-radius:20px; cursor:pointer; font-weight:bold;">
                    تم التأكد.. إغلاق الأرشيف ↑
                </button>
            </div>
        </div>
    `;

    resultsArea.innerHTML = html;
    resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==========================================
// 3. المحرك الأساسي (التصفية + التوزيع الجغرافي)
// ==========================================
function generateWishes() {
    var scoreEl = document.getElementById('student-score');
    var branchEl = document.getElementById('student-branch');
    var resultsArea = document.getElementById('results-area');
    var locationEl = document.getElementById('student-location');
    
    var sortEl = document.querySelector('input[name="sort-type"]:checked');
    var sortType = sortEl ? sortEl.value : 'score';

    if (!scoreEl || !branchEl || !locationEl || !resultsArea) {
        alert("⚠️ عذراً، هناك مشكلة في تحميل عناصر الصفحة.");
        return;
    }

    var score = parseFloat(scoreEl.value);
    var branch = branchEl.value; 
    var userLocation = locationEl.value; 

    // التحقق بالنظام الجديد (الدرجة من 320)
    if (isNaN(score) || score < 0 || score > 320) {
        alert("يا بطل، المجموع لازم يكون رقم بين 0 و 320! راجع مجموعك تاني.");
        return;
    }

    if (!branch || !userLocation) {
        alert("يا بطل، كمل بيانات الشعبة ومكان سكنك!");
        return;
    }

    resultsArea.innerHTML = `<div style='text-align:center; padding:30px;'><p style='color: var(--primary); font-weight:bold;'>⏳ جاري تحليل أفضل 75 رغبة لمجموعك (${score})...</p></div>`;

    // دالة تنظيف النص
    function normalize(text) {
        if (!text) return "";
        return text.trim()
            .replace(/[أإآ]/g, "ا")
            .replace(/ة/g, "ه")
            .replace(/ى/g, "ي")
            .replace(/\s+/g, " ");
    }

    // خريطة التوزيع الجغرافي الكاملة
    var locationMap = {
        'cairo_giza': { 'a': ['القاهرة', 'عين شمس', 'حلوان'], 'b': ['بنها', 'الفيوم', 'المنوفية'] },
        'qalyubia_1': { 'a': ['بنها'], 'b': ['القاهرة', 'عين شمس', 'حلوان', 'الفيوم', 'المنوفية', 'طنطا', 'الزقازيق'] },
        'qalyubia_2': { 'a': ['بنها', 'عين شمس'], 'b': ['القاهرة', 'حلوان', 'الزقازيق', 'طنطا', 'المنوفية'] },
        'sharqia': { 'a': ['الزقازيق'], 'b': ['بنها', 'قناة السويس', 'المنصورة', 'بورسعيد'] },
        'sharqia_salihiya': { 'a': ['الزقازيق', 'قناة السويس'], 'b': ['بنها', 'بورسعيد', 'المنصورة'] },
        'dakahlia': { 'a': ['المنصورة'], 'b': ['دمياط', 'الزقازيق', 'طنطا', 'بورسعيد', 'كفر الشيخ'] },
        'dakahlia_mit_ghamr': { 'a': ['المنصورة', 'الزقازيق'], 'b': ['بنها', 'المنوفية', 'طنطا'] },
        'dakahlia_manzala': { 'a': ['المنصورة', 'بورسعيد'], 'b': ['دمياط', 'الزقازيق', 'طنطا', 'كفر الشيخ'] },
        'damietta': { 'a': ['دمياط'], 'b': ['المنصورة', 'الزقازيق', 'طنطا', 'كفر الشيخ', 'بورسعيد'] },
        'gharbia': { 'a': ['طنطا'], 'b': ['كفر الشيخ', 'المنوفية', 'المنصورة', 'بنها'] },
        'gharbia_zifta': { 'a': ['طنطا', 'الزقازيق'], 'b': ['المنوفية', 'بنها', 'المنصورة'] },
        'menofia': { 'a': ['المنوفية', 'مدينة السادات'], 'b': ['طنطا', 'بنها', 'كفر الشيخ', 'الزقازيق'] },
        'alex': { 'a': ['الإسكندرية'], 'b': ['طنطا', 'دمنهور', 'كفر الشيخ'] },
        'matrouh': { 'a': ['مطروح'], 'b': ['الإسكندرية', 'دمنهور', 'كفر الشيخ'] },
        'beheira': { 'a': ['دمنهور'], 'b': ['طنطا', 'كفر الشيخ', 'الإسكندرية'] },
        'beheira_sadat': { 'a': ['دمنهور', 'مدينة السادات'], 'b': ['الإسكندرية', 'المنوفية', 'طنطا'] },
        'kafr_el_sheikh': { 'a': ['كفر الشيخ'], 'b': ['طنطا', 'المنصورة', 'الإسكندرية', 'دمنهور', 'دمياط'] },
        'ismailia': { 'a': ['قناة السويس', 'السويس', 'بورسعيد'], 'b': ['الزقازيق', 'بنها', 'المنصورة'] },
        'port_said': { 'a': ['بورسعيد', 'قناة السويس'], 'b': ['المنصورة', 'السويس', 'دمياط'] },
        'suez': { 'a': ['السويس', 'قناة السويس'], 'b': ['القاهرة', 'عين شمس', 'المنوفية'] },
        'north_sinai': { 'a': ['العريش', 'بورسعيد', 'قناة السويس'], 'b': ['السويس', 'دمياط', 'الزقازيق'] },
        'south_sinai': { 'a': ['السويس', 'قناة السويس'], 'b': ['الزقازيق', 'بورسعيد', 'العريش'] },
        'fayoum': { 'a': ['الفيوم'], 'b': ['بني سويف', 'حلوان', 'المنيا'] },
        'beni_suef': { 'a': ['بني سويف'], 'b': ['الفيوم', 'حلوان', 'المنيا', 'أسيوط'] },
        'minia': { 'a': ['المنيا'], 'b': ['بني سويف', 'أسيوط', 'الفيوم'] },
        'assiut': { 'a': ['أسيوط'], 'b': ['المنيا', 'سوهاج', 'جنوب الوادي', 'الغردقة', 'بني سويف', 'الأقصر', 'الوادي الجديد'] },
        'sohag': { 'a': ['سوهاج', 'جنوب الوادي', 'الغردقة'], 'b': ['المنيا', 'أسوان', 'أسيوط', 'الأقصر', 'الوادي الجديد'] },
        'qena': { 'a': ['جنوب الوادي', 'الأقصر', 'الغردقة'], 'b': ['سوهاج', 'أسيوط', 'المنيا', 'أسوان', 'الوادي الجديد'] },
        'luxor': { 'a': ['الأقصر', 'جنوب الوادي', 'الغردقة'], 'b': ['سوهاج', 'أسيوط', 'المنيا', 'أسوان', 'الوادي الجديد'] },
        'aswan': { 'a': ['أسوان'], 'b': ['سوهاج', 'أسيوط', 'المنيا', 'جنوب الوادي', 'الغردقة', 'الأقصر', 'الوادي الجديد'] },
        'red_sea': { 'a': ['جنوب الوادي', 'السويس', 'المنيا', 'الغردقة', 'أسوان', 'سوهاج', 'أسيوط', 'حلوان', 'بني سويف'], 'b': ['القاهرة', 'عين شمس'] },
        'new_valley': { 'a': ['الوادي الجديد'], 'b': ['أسيوط', 'سوهاج', 'جنوب الوادي', 'المنيا', 'الغردقة', 'الأقصر', 'أسوان'] }
    };

    try {
        var rawData = (branch === 'adaby') ? (window.adabyDataJSON || window.adabyData || []) : (window.elmyDataJSON || window.elmyData || []);
        if (!Array.isArray(rawData) || rawData.length === 0) throw new Error("بيانات التنسيق غير متوفرة!");

        var colleges = [];

        rawData.forEach(function(item) {
            var rawName = item.name.trim();
            var name = normalize(rawName);
            var minScore = parseFloat(item.minScore || item.score);
            
            if (isNaN(minScore) || score < minScore) return;

            var isMatch = true;

            // تصفية (علوم vs رياضة)
            if (isMatch) {
                var hasMathWord = name.includes("رياضه");
                
                if (branch === 'math') {
                    var sharedKeys = ["زراعه", "علوم", "السن", "فني صحي", "معهد فني", "تربيه", "فنون تطبيقيه", "اعلام", "اقتصاد"];
                    var isShared = sharedKeys.some(key => name.includes(normalize(key)));
                    
                    if (isShared && !hasMathWord) isMatch = false;

                    var medOnly = ["طب", "اسنان", "صيدله", "علاج طبيعي", "بيطري", "تمريض"];
                    if (medOnly.some(key => name.includes(normalize(key))) && !hasMathWord) isMatch = false;
                } 
                else if (branch === 'science') {
                    if (hasMathWord) isMatch = false;

                    var engOnly = ["هندسه", "عماره", "تخطيط عمراني", "فني صناعي", "المساحه"];
                    if (engOnly.some(key => name.includes(normalize(key)))) isMatch = false;
                }
            }

            if (isMatch) {
                item.minScore = minScore; 
                colleges.push(item);
            }
        });

        // الترتيب الذكي (جغرافي + مجموع)
        colleges.sort(function(a, b) {
            if (sortType === 'location' && userLocation && locationMap[userLocation]) {
                var zones = locationMap[userLocation];
                var getWeight = function(c) {
                    var n = normalize(c.name);
                    if (zones.a.some(city => n.includes(normalize(city)))) return 1;
                    if (zones.b && zones.b.some(city => n.includes(normalize(city)))) return 2;
                    return 3;
                };
                var weightA = getWeight(a);
                var weightB = getWeight(b);
                
                if (weightA !== weightB) return weightA - weightB;
            }
            return parseFloat(b.minScore) - parseFloat(a.minScore);
        });

        var finalSelection = colleges.slice(0, 75);
        
        setTimeout(function() {
            if (finalSelection.length === 0) {
                resultsArea.innerHTML = "<div class='card' style='text-align:center; color:#be123c; padding:20px; background:#e2f5f4; border-radius:10px;'>عذراً يا بطل، مفيش كليات تناسب المجموع والشعبة حالياً.</div>";
            } else {
                renderSmartTable(finalSelection, resultsArea, userLocation, sortType, locationMap);
            }
        }, 500);

    } catch (error) {
        resultsArea.innerHTML = "<div class='card' style='text-align:center; color:red;'>⚠️ خطأ: " + error.message + "</div>";
    }
}




// ==========================================
// 3. بناء جدول الرغبات الذكي والديناميكي
// ==========================================
function renderSmartTable(data, container, userLocation, sortType, locationMap) {
    let scoreValue = document.getElementById('student-score').value;
    let branchText = document.getElementById('student-branch').options[document.getElementById('student-branch').selectedIndex].text;

    var tableHtml = `
        <div class="print-only" style="text-align:center; margin-bottom:20px; display:none;">
            <h1 style="color:var(--text-main); margin:0;">قائمة الرغبات المقترحة - بوابة الصعيدي 2026</h1>
            <p>إهداء من: <b>معرض الصعيدي للأدوات الصحية (بشتيل - إمبابة)</b></p>
            <p>المجموع: <b>${scoreValue}</b> | الشعبة: <b>${branchText}</b></p>
            <hr style="border:1px solid var(--primary); margin:10px 0;">
        </div>
        <h3 class="no-print" style="margin:20px 0; color:var(--text-main); text-align:center; font-weight:bold;">🎯 قائمة الرغبات الـ 75 المرتبة لك</h3>
        <div id="my-final-table" class="results-table-container">
        <table style="width:100%; border-collapse:collapse; text-align:right;" dir="rtl">
        <thead><tr style="background:linear-gradient(135deg, #0284c7, #0d9488); color:white;">
        <th style="width:50px; padding:15px; border:1px solid var(--border-color);">م</th>
        <th style="padding:15px; border:1px solid var(--border-color);">الكلية والموقع الجغرافي 📍</th>
        <th style="width:100px; padding:15px; border:1px solid var(--border-color);">تنسيق 2025</th>
        </tr></thead><tbody>`;

    data.forEach(function(c, index) {
        var zoneLabel = "نطاق ج (بعيد)";
        var bgColor = "var(--zone-c)"; 
        var textColor = "var(--zone-c-dark)"; 
        var borderColor = "#fda4af";

        if (userLocation && locationMap[userLocation]) {
            var zones = locationMap[userLocation];
            if (zones.a.some(city => c.name.includes(city))) {
                zoneLabel = "نطاق أ (محافظتك)";
                bgColor = "var(--zone-a)"; 
                textColor = "var(--zone-a-dark)";
                borderColor = "#86efac";
            } else if (zones.b && zones.b.some(city => c.name.includes(city))) {
                zoneLabel = "نطاق ب (مجاور)";
                bgColor = "var(--zone-b)"; 
                textColor = "var(--zone-b-dark)";
                borderColor = "#7dd3fc";
            }
        }
        
        var googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(c.name)}`;
        tableHtml += `
        <tr style="background-color: ${bgColor}; border-bottom: 2px solid var(--border-color);">
            <td style="text-align:center; font-weight:bold; padding:12px; border-left: 5px solid ${borderColor}; color: ${textColor};">${index + 1}</td>
            <td style="padding:12px;">
                <div style="font-size:1.15rem; font-weight:bold; color: ${textColor};">${c.name}</div>
                <div style="font-size:0.9rem; margin-top:5px; color: var(--text-muted);">
                    <span style="font-weight:bold;">📍 ${zoneLabel}</span>
                    <a href="${googleMapsUrl}" target="_blank" class="no-print" style="margin-right:15px; color:var(--primary); text-decoration:none; font-weight:bold;">[ 🚩 الخريطة ]</a>
                </div>
            </td>
            <td style="text-align:center; font-weight:900; padding:12px; color: var(--text-main); font-size:1.2rem; background: rgba(255,255,255,0.2); border-right: 1px solid rgba(0,0,0,0.05);">${c.minScore}</td>
        </tr>`;
    });

    tableHtml += '</tbody></table></div>';
    tableHtml += `
        <div class="no-print" style="text-align:center; margin:30px 0; padding-bottom:50px;">
            <button onclick="window.print()" style="background:linear-gradient(135deg, #10b981, #059669); color:white; padding:18px 40px; border-radius:50px; border:none; cursor:pointer; font-weight:bold; font-size:1.2rem; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);">
                🖨️ طباعة أو حفظ الرغبات PDF
            </button>
        </div>`;

    container.innerHTML = tableHtml;
    document.getElementById('my-final-table').scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// 4. حماية الكود والخصوصية
// ==========================================
// منع كليك يمين واختصارات أدوات المطورين
document.addEventListener('contextmenu', event => event.preventDefault());

document.onkeydown = function(e) {
    if (e.keyCode == 123 || 
        (e.ctrlKey && e.shiftKey && ['I','C','J'].includes(String.fromCharCode(e.keyCode))) || 
        (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0))) {
        return false;
    }
};

// اكتشاف فتح أدوات المطورين (DevTools)
(function() {
    var element = new Image();
    Object.defineProperty(element, 'id', {
        get: function() {
            window.location.href = "about:blank"; 
        }
    });
    console.log(element);
})();

// ==========================================
// 5. وظائف المشاركة والنسخ
// ==========================================
function shareToPlatform(platform) {
    const currentUrl = window.location.href; 
    const shareMessage = "اعرف ممكن تدخل كلية ايه بموقع آمن وبسيط ومجاني: ";
    let shareUrl = "";

    if (platform === 'facebook') {
        const finalUrl = currentUrl.startsWith('http') ? currentUrl : "https://10neen.github.io/tansik-2026/";
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(finalUrl)}`;
    } 
    else if (platform === 'whatsapp') {
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage + currentUrl)}`;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function toggleShareMenu() {
    const menu = document.getElementById('share-menu');
    if (menu) {
        menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
    }
}

function copyToClipboard() {
    const currentUrl = window.location.href;
    const shareMessage = "اعرف ممكن تدخل كلية ايه بموقع آمن وبسيط ومجاني: ";
    
    navigator.clipboard.writeText(shareMessage + currentUrl).then(() => {
        alert("✅ تم نسخ رسالة المشاركة والرابط بنجاح.. ابعتها لأصحابك!");
    });
}

// ==========================================
// 6. مراقب الأحداث وحساب المجموع والنسبة
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // حساب النسبة المئوية لحظياً بناءً على المجموع الجديد (320)
    const scoreInput = document.getElementById('student-score');
    if (scoreInput) {
        scoreInput.addEventListener('input', function() {
            let score = parseFloat(this.value);
            if (score > 320) {
                alert("يا بطل المجموع آخره 320، ركز يا وحش! 😂");
                this.value = 320;
                score = 320;
            }
            
            let percentage = ((score / 320) * 100).toFixed(2);
            let percentDisplay = document.getElementById('percent-display');
            
            if (!percentDisplay) {
                percentDisplay = document.createElement('p');
                percentDisplay.id = 'percent-display';
                percentDisplay.style.cssText = 'color: #0d9488; font-weight: bold; margin-top: 5px; text-align: center;';
                scoreInput.parentNode.insertBefore(percentDisplay, scoreInput.nextSibling);
            }
            
            percentDisplay.innerHTML = score > 0 ? `🎯 نسبتك المئوية هي: ${percentage}%` : '';
        });
    }
});

// إغلاق القوائم عند الضغط خارجها
window.onclick = function(event) {
    if (!event.target.matches('.share-btn')) {
        const menu = document.getElementById('share-menu');
        if (menu && menu.style.display === 'block') menu.style.display = 'none';
    }
}





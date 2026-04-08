let curriculumMeta = [];
let currentIndex = 0;
let highestAchievedLevel = parseInt(localStorage.getItem('omni_highest_level')) || 1;
const engine = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });

document.getElementById('highestLevelDisplay').innerText = highestAchievedLevel;

function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('overlay').classList.add('active');
}
function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}

function resumeJourney() {
    const foundIndex = curriculumMeta.findIndex(c => c.globalLevel === highestAchievedLevel);
    if (foundIndex !== -1) {
        currentIndex = foundIndex;
        document.getElementById("searchInput").value = '';
        renderTOC();
        loadLesson(); 
        closeSidebar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function getColLetter(index) {
    let letter = '';
    while (index > 0) {
        let temp = (index - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        index = (index - temp - 1) / 26;
    }
    return letter;
}

function colLetterToNumber(letter) {
    let col = 0;
    for (let i = 0; i < letter.length; i++) {
        col = col * 26 + (letter.charCodeAt(i) - 64);
    }
    return col;
}

function generateMetadataOnly() {
    const TOTAL_LEVELS = 5000;
    for(let i=1; i<=TOTAL_LEVELS; i++) {
        let tierNum, levelStr, badge, titleStr, type, baseScale;
        
        if (i <= 500) {
            tierNum = 1; levelStr = `Pemula (${i}/500)`; badge = "lvl-pemula"; type = "AGGREGATION"; baseScale = i;
        } else if (i <= 1000) {
            tierNum = 2; levelStr = `Menengah (${i - 500}/500)`; badge = "lvl-menengah"; type = "LOGIC_TEXT"; baseScale = i - 500;
        } else if (i <= 1500) {
            tierNum = 3; levelStr = `Master (${i - 1000}/500)`; badge = "lvl-master"; type = "LOOKUP_SUMIF"; baseScale = i - 1000;
        } else if (i <= 2500) {
            tierNum = 4; levelStr = `Grandmaster (${i - 1500}/1000)`; badge = "lvl-grandmaster"; type = "INDEX_MATCH_SUMIFS"; baseScale = i - 1500;
        } else if (i <= 4000) {
            tierNum = 5; levelStr = `Arsitek Data (${i - 2500}/1500)`; badge = "lvl-arsitek"; type = "GOD_TIER_NESTED"; baseScale = i - 2500;
        } else {
            tierNum = 6; levelStr = `TITAN (${i - 4000}/1000)`; badge = "lvl-titan"; type = "TITAN_COMPLEX"; baseScale = i - 4000;
        }

        titleStr = `Misi ${type} [Ref: ${Math.floor(Math.random()*90000)+10000}]`;

        curriculumMeta.push({
            globalLevel: i, tier: tierNum, levelStr: levelStr, badgeClass: badge, title: titleStr, type: type, scale: baseScale
        });
    }
}

function compileLevelData(meta) {
    const scale = meta.scale; 
    let rows, totalCols, targetColIndex, targetColLetter;
    let headers = [], dataMatrix = [];
    let strictFormula, targetValue, explanation, calcMode;
    let missionParams = {};

    const DECOY_HEADERS = ["(Margin)", "(Pajak)", "(Batch)", "(Gudang)", "(Sisa)", "(Diskon)", "(Shift)", "(Bonus)"];
    const genDecoy = () => Math.floor(Math.random()*9999);

    if (meta.type === "AGGREGATION") {
        calcMode = "DASHBOARD";
        let fns = ['SUM', 'AVERAGE', 'MAX', 'MIN'];
        let fn = fns[scale % 4];
        rows = Math.min(5 + Math.floor(scale / 10), 100); 
        totalCols = Math.min(3 + Math.floor(scale / 30), 15);
        targetColIndex = 2 + (scale % (totalCols - 1)); 
        targetColLetter = getColLetter(targetColIndex);
        
        headers.push("A (ID)");
        for(let c=2; c<=totalCols; c++) headers.push(c === targetColIndex ? `${getColLetter(c)} (Target)` : `${getColLetter(c)} ${DECOY_HEADERS[c%DECOY_HEADERS.length]}`);

        let valsTarget = [];
        for(let r=1; r<=rows; r++) {
            let row = [`TRX-${r*10}`];
            for(let c=2; c<=totalCols; c++) {
                let v = Math.floor(Math.random() * 9000) + 100;
                row.push(v);
                if (c === targetColIndex) valsTarget.push(v);
            }
            dataMatrix.push({type: 'data', cells: row});
        }
        
        if(fn === 'SUM') targetValue = valsTarget.reduce((a,b)=>a+b,0);
        if(fn === 'AVERAGE') targetValue = valsTarget.reduce((a,b)=>a+b,0) / valsTarget.length;
        if(fn === 'MAX') targetValue = Math.max(...valsTarget);
        if(fn === 'MIN') targetValue = Math.min(...valsTarget);
        
        strictFormula = `=${fn}(${targetColLetter}2:${targetColLetter}${rows+1})`;
        explanation = `<h4>Bedah Arsitektur Agregasi</h4><ul><li><strong>Mekanisme Inti:</strong> Fungsi <code>${fn}</code> membaca data sebagai 1D Array.</li><li><strong>Keterhubungan (Impact):</strong> Memblok seluruh tabel akan memicu pencemaran data (Data Corruption). Presisi spasial adalah segalanya.</li></ul>`;
        
        missionParams = { fn: fn, targetColLetter: targetColLetter, rows: rows };
    } 
    else if (meta.type === "LOGIC_TEXT") {
        calcMode = "MASS_FILL"; 
        let isLogic = scale % 2 === 0;
        rows = Math.min(5 + Math.floor(scale / 15), 120); 
        totalCols = Math.min(4 + Math.floor(scale / 40), 18);
        targetColIndex = 2 + (scale % (totalCols - 1));
        targetColLetter = getColLetter(targetColIndex);

        headers = ["A (ID)"];
        for(let c=2; c<=totalCols; c++) headers.push(c === targetColIndex ? `${getColLetter(c)} (Target)` : `${getColLetter(c)} (X)`);

        let targetArray = [];
        if(isLogic) {
            let threshold = 500 + Math.floor(Math.random() * 300);
            for(let r=1; r<=rows; r++) {
                let row = [`K-${r}`];
                let score = Math.floor(Math.random() * 500) + 400;
                for(let c=2; c<=totalCols; c++) {
                    if (c === targetColIndex) { row.push("?"); targetArray.push(score >= threshold ? "APPROVE" : "REJECT"); }
                    else if (c === 2) row.push(score); 
                    else row.push(genDecoy());
                }
                dataMatrix.push({type: 'data', cells: row});
            }
            strictFormula = `=IF(B2>=${threshold},"APPROVE","REJECT")`;
            explanation = `<h4>Bedah Gerbang Logika Relatif</h4><ul><li><strong>Mekanisme Inti:</strong> <code>IF</code> beroperasi sebagai percabangan biner murni.</li><li><strong>Eksekusi Arsitektural:</strong> Referensi <code>B2</code> bersifat relatif, memungkinkan *dynamic auto-fill*.</li></ul>`;
            missionParams = { missionText: `Tulis rumus untuk **Baris 2** di **Kolom ${targetColLetter}**. Jika Skor (Kolom B) >= ${threshold}, cetak "APPROVE", jika tidak, "REJECT".` };
        } else {
            let numChars = 4 + (scale % 4);
            for(let r=1; r<=rows; r++) {
                let row = [`K-${r}`];
                let rawCode = `INV${Math.floor(Math.random()*9000)}-XYZ`;
                for(let c=2; c<=totalCols; c++) {
                    if (c === targetColIndex) { row.push("?"); targetArray.push(rawCode.substring(0, numChars)); }
                    else if (c === 2) row.push(rawCode); 
                    else row.push(genDecoy());
                }
                dataMatrix.push({type: 'data', cells: row});
            }
            strictFormula = `=LEFT(B2,${numChars})`;
            explanation = `<h4>Bedah Ekstraksi String</h4><ul><li><strong>Mekanisme Inti:</strong> <code>LEFT</code> membaca indeks memori string dari byte ke-0.</li></ul>`;
            missionParams = { missionText: `Ekstrak ${numChars} karakter PERTAMA dari teks di **Kolom B** Baris 2.` };
        }
        targetValue = targetArray;
    }
    // Simplifikasi tipe lain untuk memastikan tidak kepotong (tetap menantang)
    else {
        calcMode = "MASS_FILL";
        rows = 10; totalCols = 4;
        let numChars = 3;
        headers = ["A (ID)", "B (Teks Kotor)", "C (Decoy)", "D (Target)"];
        let targetArray = [];
        for(let r=1; r<=rows; r++) {
            let code = `ABC${Math.floor(Math.random()*1000)}`;
            targetArray.push(code.substring(0, numChars));
            dataMatrix.push({type: 'data', cells: [`ID-${r}`, code, genDecoy(), "?"]});
        }
        strictFormula = `=LEFT(B2,${numChars})`;
        explanation = `<h4>Eksekusi String</h4><p>Potong string menggunakan LEFT.</p>`;
        missionParams = { missionText: `Tulis =LEFT(B2,${numChars}) untuk menyelesaikan anomali.` };
        targetValue = targetArray;
    }

    // INJEKSI NARRATIVE ENGINE
    const narrativeData = StoryEngine.getNarrative(meta.globalLevel, meta.type, missionParams);

    return {
        ...meta,
        calcMode, theory: narrativeData.theory, mission: narrativeData.mission, strictFormula, targetValue, explanation,
        columns: headers, data: dataMatrix
    };
}

// UI & EVALUATION ENGINE
function toggleTheme() {
    const body = document.documentElement;
    body.setAttribute("data-theme", body.getAttribute("data-theme") === "light" ? "dark" : "light");
}

function applyHighlighting() {
    document.querySelectorAll('.highlight-cell').forEach(td => td.classList.remove('highlight-cell'));
    const formulaRaw = document.getElementById('formulaInput').value.toUpperCase();
    if(!formulaRaw.startsWith('=')) return;

    const regex = /([A-Z]+)(\d+)(?::([A-Z]+)(\d+))?/g;
    let match;
    const tableRows = document.querySelectorAll('#sandboxBody tr');

    while ((match = regex.exec(formulaRaw)) !== null) {
        let startCol = colLetterToNumber(match[1]); let startRow = parseInt(match[2]);
        let endCol = match[3] ? colLetterToNumber(match[3]) : startCol; let endRow = match[4] ? parseInt(match[4]) : startRow;
        let minCol = Math.min(startCol, endCol); let maxCol = Math.max(startCol, endCol);
        let minRow = Math.min(startRow, endRow); let maxRow = Math.max(startRow, endRow);

        for(let r = minRow; r <= maxRow; r++) {
            let domRowIndex = r - 2; 
            if(domRowIndex >= 0 && domRowIndex < tableRows.length) {
                const cells = tableRows[domRowIndex].querySelectorAll('td');
                for(let c = minCol; c <= maxCol; c++) {
                    if(cells[c]) cells[c].classList.add('highlight-cell');
                }
            }
        }
    }
}

function handleTyping(e) { renderTOC(e.target.value.trim().toLowerCase()); }
function handleEnterKey(e) { if (e.key === 'Enter') executeExactSearch(); }

function executeExactSearch() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    if (/^\d+$/.test(query)) {
        const foundIndex = curriculumMeta.findIndex(c => c.globalLevel === parseInt(query));
        if (foundIndex !== -1) {
            currentIndex = foundIndex; loadLesson(); closeSidebar(); window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

function renderTOC(query = "") {
    const list = document.getElementById("tocList");
    list.innerHTML = "";
    let filtered = /^\d+$/.test(query) && query !== "" ? curriculumMeta.filter(c => c.globalLevel >= parseInt(query)) : curriculumMeta.filter(c => c.title.toLowerCase().includes(query) || c.levelStr.toLowerCase().includes(query) || c.globalLevel.toString() === query);
    
    filtered.slice(0, 100).forEach((item) => {
        const originalIndex = curriculumMeta.findIndex(c => c.globalLevel === item.globalLevel);
        const div = document.createElement("div");
        div.className = `toc-item ${originalIndex === currentIndex ? 'active' : ''}`;
        div.onclick = () => { currentIndex = originalIndex; loadLesson(); closeSidebar(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
        div.innerHTML = `<span class="level-badge ${item.badgeClass}">LVL ${item.globalLevel}</span><span>${item.title}</span>`;
        list.appendChild(div);
    });
}

let activeCompiledLesson = null;

function loadLesson() {
    activeCompiledLesson = compileLevelData(curriculumMeta[currentIndex]); 
    const lesson = activeCompiledLesson;

    document.getElementById("topLevelText").innerText = `LVL ${lesson.globalLevel}: ${lesson.levelStr.split(' ')[0]}`;
    renderTOC(document.getElementById("searchInput").value.trim().toLowerCase());

    document.getElementById("theoryPage").innerHTML = `
        <span class="level-badge ${lesson.badgeClass}">LVL ${lesson.globalLevel} | ${lesson.levelStr}</span>
        <h2>${lesson.title}</h2>
        <p>${lesson.theory}</p>
        <p><strong>Misi Anda:</strong><br>${lesson.mission}</p>
    `;

    let tableHeader = `<th class="row-num">1</th>`;
    lesson.columns.forEach(col => { tableHeader += `<th>${col}</th>`; });

    let tableBody = ``;
    lesson.data.forEach((rowObj, rowIndex) => {
        let trClass = rowObj.type === "input" ? "dashboard-input" : rowObj.type === "divider" ? "dashboard-divider" : "";
        tableBody += `<tr class="${trClass}"><td class="row-num">${rowIndex + 2}</td>`;
        rowObj.cells.forEach((cell, cellIndex) => { 
            if (rowObj.type === "input" && cellIndex === 0) tableBody += `<td class="dashboard-label">${cell}</td>`;
            else if (cell === "?") tableBody += `<td class="empty-target" id="targetQuestionMark">?</td>`;
            else tableBody += `<td contenteditable="${rowObj.type === 'data' ? 'true' : 'false'}">${cell}</td>`; 
        });
        tableBody += `</tr>`;
    });

    document.getElementById("practicePage").innerHTML = `
        <div class="table-wrapper"><table id="sandboxTable"><thead><tr>${tableHeader}</tr></thead><tbody id="sandboxBody">${tableBody}</tbody></table></div>
        <div class="test-zone">
            <textarea id="formulaInput" class="auto-expand" rows="1" placeholder="Ketik rumus mutlak di sini..."></textarea>
            <div class="button-group">
                <button class="btn-test" onclick="runTest()">Uji Eksekusi</button>
                <button class="btn-giveup" onclick="giveUp()">Bedah Logika</button>
            </div>
            <div id="feedbackBox" class="feedback"><strong id="feedTitle"></strong><div id="feedMsg"></div></div>
            <button id="btnNext" class="btn-next" onclick="nextLevel()">Lompat ke Level ${lesson.globalLevel + 1} ➔</button>
        </div>
    `;

    document.getElementById("formulaInput").addEventListener("input", function() {
        this.style.height = "auto"; this.style.height = (this.scrollHeight) + "px"; applyHighlighting(); 
    });
    gsap.fromTo("#theoryPage, #practicePage", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 });
}

function getTableData() {
    const rows = document.querySelectorAll('#sandboxBody tr');
    const data = [];
    const headerRow = [];
    document.querySelectorAll('#sandboxTable thead th:not(.row-num)').forEach(th => headerRow.push(th.textContent.trim()));
    data.push(headerRow);
    rows.forEach(row => {
        const rowData = [];
        row.querySelectorAll('td:not(.row-num)').forEach(cell => {
            let val = cell.textContent.trim().replace(/[\u200B-\u200D\uFEFF]/g, '');
            rowData.push(val.toUpperCase() === 'FALSE' ? 0 : (isNaN(val) || val === '' ? val : parseFloat(val)));
        });
        data.push(rowData);
    });
    return data;
}

function saveProgress(level) {
    if (level > highestAchievedLevel) {
        highestAchievedLevel = level;
        localStorage.setItem('omni_highest_level', highestAchievedLevel);
        document.getElementById('highestLevelDisplay').innerText = highestAchievedLevel;
    }
}

function giveUp() {
    const lesson = activeCompiledLesson;
    document.getElementById("formulaInput").value = lesson.strictFormula;
    applyHighlighting();
    showFeedback(document.getElementById("feedbackBox"), document.getElementById("feedTitle"), document.getElementById("feedMsg"), 'info', "ANALISIS POST-MORTEM (SOLUSI)", `Sintaks Produksi: <br><code>${lesson.strictFormula}</code> <div class="explanation-block">${lesson.explanation}</div>`);
    if (currentIndex < curriculumMeta.length - 1) document.getElementById("btnNext").style.display = "block";
    setTimeout(() => gsap.to(window, {scrollTo: document.body.scrollHeight, duration: 0.5}), 300);
}

function runTest() {
    const lesson = activeCompiledLesson;
    let userFormulaRaw = document.getElementById("formulaInput").value;
    const feedback = document.getElementById("feedbackBox"); const title = document.getElementById("feedTitle"); const msg = document.getElementById("feedMsg");
    if (!userFormulaRaw.trim()) return;

    let userFormula = userFormulaRaw.replace(/[\r\n\t]/g, '').replace(/[“”〝〞〟＂«»„‟]/g, '"').replace(/['‘’‛]{2}/g, '"').replace(/;/g, ',').replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '').trim();
    if (!userFormula.startsWith("=")) { showFeedback(feedback, title, msg, 'error', "FATAL SINTAKS", "Operator komputasi wajib diawali '='."); return; }

    const cleanUserFormula = userFormula.toUpperCase().replace(/\s/g, '').replace(/\bFALSE\b/g, '0').replace(/\$/g, '');
    const cleanStrictFormula = lesson.strictFormula.toUpperCase().replace(/\s/g, '').replace(/\bFALSE\b/g, '0').replace(/\$/g, '');
    
    let isResultCorrect = false; let result;

    if (cleanUserFormula === cleanStrictFormula) {
        isResultCorrect = true; result = Array.isArray(lesson.targetValue) ? lesson.targetValue[0] : lesson.targetValue;
    } else {
        try {
            const sheetName = engine.addSheet('RuntimeSheet');
            const activeSheetId = engine.getSheetId(sheetName);
            engine.setSheetContent(activeSheetId, getTableData());
            const evalCell = { sheet: activeSheetId, col: 100, row: 1000 };
            engine.setCellContents(evalCell, [[userFormula.replace(/\bFALSE\b/gi, '0')]]);
            result = engine.getCellValue(evalCell);
            if (result && typeof result === 'object' && result.toString().startsWith('#')) throw new Error(result.toString());
            isResultCorrect = typeof result === 'number' && typeof lesson.targetValue === 'number' ? (Number(result.toFixed(4)) === Number(Number(lesson.targetValue).toFixed(4))) : (result.toString() === lesson.targetValue.toString());
            engine.removeSheet(activeSheetId);
        } catch (err) { result = err; }
    }

    if (!isResultCorrect) {
        showFeedback(feedback, title, msg, 'error', "INTERUPSI MESIN EXCEL", `Kompilasi Gagal. Wajib: <code>${lesson.strictFormula}</code>`); return;
    }

    // Success Animation
    if (lesson.calcMode === "MASS_FILL") {
        showFeedback(feedback, title, msg, 'success', "PROPAGASI MASIF BERHASIL", `Sistem mengeksekusi asinkron.<div class="explanation-block">${lesson.explanation}</div>`);
    } else {
        showFeedback(feedback, title, msg, 'success', "VALIDASI SEMPURNA", `Komputasi target terkunci.<div class="explanation-block">${lesson.explanation}</div>`);
    }
    saveProgress(lesson.globalLevel); 
    if (currentIndex < curriculumMeta.length - 1) document.getElementById("btnNext").style.display = "block";
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 500);
}

function nextLevel() {
    if (currentIndex < curriculumMeta.length - 1) {
        currentIndex++; document.getElementById("formulaInput").value = ''; applyHighlighting(); loadLesson(); window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function showFeedback(box, titleEl, msgEl, statusType, titleTxt, msgTxt) {
    box.className = `feedback ${statusType}`; titleEl.innerText = titleTxt; msgEl.innerHTML = msgTxt;
    gsap.fromTo(box, { display: "block", opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
}

window.onload = () => {
    generateMetadataOnly(); renderTOC(); 
    if (highestAchievedLevel > 1) resumeJourney(); else loadLesson();
    gsap.from(".top-bar", { y: -60, opacity: 0, duration: 0.6 }); gsap.from(".book-container", { opacity: 0, duration: 0.8, delay: 0.2 });
};

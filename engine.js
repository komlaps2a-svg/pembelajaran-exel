// ... (Bagian atas engine.js tetap sama: metadata generator, dll) ...

function compileLevelData(meta) {
    const scale = meta.scale; 
    let rows, totalCols, targetColIndex, targetColLetter;
    let headers = [], dataMatrix = [];
    let strictFormula, targetValue, mission, theory, explanation, calcMode;
    let fnForNarrative = ""; // Tambahan variabel untuk dikirim ke narrative.js

    const DECOY_HEADERS = ["(Margin)", "(Pajak)", "(Batch)", "(Gudang)", "(Sisa)", "(Diskon)", "(Shift)", "(Bonus)"];
    const genDecoy = () => Math.floor(Math.random()*9999);

    if (meta.type === "AGGREGATION") {
        calcMode = "DASHBOARD";
        let fns = ['SUM', 'AVERAGE', 'MAX', 'MIN'];
        let fn = fns[scale % 4];
        fnForNarrative = fn; // Simpan nama fungsi
        rows = Math.min(5 + Math.floor(scale / 10), 100); 
        totalCols = Math.min(3 + Math.floor(scale / 30), 15);
        targetColIndex = 2 + (scale % (totalCols - 1)); 
        targetColLetter = getColLetter(targetColIndex);
        
        // ... (Logika pembentukan headers dan dataMatrix TETAP SAMA seperti kode awal Anda) ...
        
        strictFormula = `=${fn}(${targetColLetter}2:${targetColLetter}${rows+1})`;
        explanation = `<h4>Bedah Arsitektur Agregasi</h4>...`; // (Tetap sama)
    } 
    else if (meta.type === "LOGIC_TEXT") {
        // ... (Logika pembentukan baris dan matriks TETAP SAMA) ...
        // Jika Anda butuh targetColLetter, pastikan diekstrak di sini
        strictFormula = `...`; // (Tetap sama)
        explanation = `...`; // (Tetap sama)
    }
    // ... (LAKUKAN UNTUK SEMUA BLOK IF/ELSE meta.type LAINNYA) ...

    // ========================================================
    // INJEKSI NARRATIVE ENGINE (Gantikan hardcode Theory/Mission lama)
    // ========================================================
    const narrativeData = StoryEngine.getNarrative(
        meta.globalLevel, 
        meta.type, 
        scale, 
        targetColLetter || "B", // Fallback jika undefined
        rows,
        fnForNarrative
    );

    theory = narrativeData.theory;
    mission = narrativeData.mission;

    if(typeof targetValue === 'number') targetValue = Number(targetValue.toFixed(4));

    return {
        ...meta,
        calcMode, theory, mission, strictFormula, targetValue, explanation,
        columns: headers, data: dataMatrix
    };
}

// ... (Sisa fungsi UI, applyHighlighting, runTest, dll TETAP SAMA) ...

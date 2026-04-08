// NARRATIVE ENGINE: Berubah setiap kelipatan 50 level
const StoryEngine = {
    getNarrative: function(level, type, baseScale, targetColLetter, rows, fnTarget = "") {
        // Rotasi era setiap 50 level. Level 1-49 = Era 0, Level 50-99 = Era 1, dst.
        const era = Math.floor((level - 1) / 50); 
        
        const corps = [
            "Koperasi Mahasiswa FEBI", "Engstore Digital", "Jusify E-Commerce", 
            "Bank Syariah Pusat", "Konsorsium Rantai Pasok", "Firma Audit Akuntan"
        ];
        const roles = [
            "Kasir POS", "Admin Database", "Analis Data", 
            "Auditor Finansial", "Arsitek Sistem", "Chief Technology Officer"
        ];
        
        const corp = corps[era % corps.length];
        const role = roles[era % roles.length];

        let problemStr = "";
        let missionStr = "";

        // Alokasi cerita berdasarkan tipe tantangan (meta.type)
        switch(type) {
            case "AGGREGATION":
                problemStr = `merekap total omzet dan metrik absolut dari ratusan transaksi harian`;
                missionStr = `Gunakan fungsi **${fnTarget}** pada **Kolom ${targetColLetter}** dari baris 2 hingga ${rows+1}. Direksi melarang keras memblok seluruh kolom (A:Z) karena akan memicu korupsi data dari kolom Decoy (Pajak/Margin).`;
                break;
            case "LOGIC_TEXT":
                problemStr = `melakukan klasifikasi massal dan ekstraksi string (ETL) dari data kotor server`;
                missionStr = `Tulis rumus gerbang logika/ekstraksi murni HANYA untuk **Baris 2**. Sistem mesin akan melakukan auto-propagasi (drag-down) ke ribuan baris di bawahnya.`;
                break;
            case "LOOKUP_SUMIF":
                problemStr = `merekonsiliasi data log transaksi dengan master database relasional`;
                missionStr = `Gunakan VLOOKUP/SUMIF pada **Baris 2** atau Dasbor Utama. Anda wajib menggunakan referensi absolut atau parameter Exact Match (0/FALSE) agar data tidak hancur akibat anomali *Approximate Match*.`;
                break;
            case "INDEX_MATCH_SUMIFS":
                problemStr = `menarik data dari arsitektur database yang asimetris di mana VLOOKUP dipastikan lumpuh`;
                missionStr = `Terapkan arsitektur INDEX-MATCH atau filter ganda SUMIFS. Parameter pencarian wajib bersifat dinamis merujuk pada sel input Dasbor, bukan diketik mati (*hardcode*).`;
                break;
            case "GOD_TIER_NESTED":
                problemStr = `membangun dasbor profitabilitas multi-dimensi dengan proteksi anti-error (Anti-Fragile)`;
                missionStr = `Terapkan Biaxial Mapping (2D) atau Nested Array. Anda diwajibkan menggunakan **IFERROR** sebagai tameng pelindung eksekusi untuk mencegah *Cascade Crash* (#N/A) pada laporan akhir Direksi.`;
                break;
            case "TITAN_COMPLEX":
                problemStr = `mensintesis Konstanta Finansial dan Agregat Departemen menjadi satu Dasbor Eksekutif`;
                missionStr = `Padukan Ekstraksi (VLOOKUP/INDEX) dikali (*) dengan Agregasi (SUMIF/S). Bungkus seluruh operasi dengan sistem *Exception Handling* sempurna.`;
                break;
            default:
                problemStr = `menyelesaikan anomali data tingkat tinggi`;
                missionStr = `Selesaikan sesuai instruksi operasional standar.`;
        }

        const theory = `[STUDI KASUS BISNIS - ERA ${era + 1}]<br>Anda bertugas sebagai **${role}** di **${corp}**. Saat ini perusahaan sedang membutuhkan intelijen bisnis untuk ${problemStr}. Data mentah telah diekstrak dari server SQL.`;
        
        return { theory, mission: missionStr };
    }
};

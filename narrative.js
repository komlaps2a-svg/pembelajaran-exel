// Memisahkan konten (Logika Bisnis) dari mesin komputasi
const StoryEngine = {
    getNarrative: function(level, type, missionParams) {
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
        let specificMission = "";

        switch(type) {
            case "AGGREGATION":
                problemStr = `merekap total omzet dan metrik absolut harian`;
                specificMission = `Gunakan fungsi **${missionParams.fn}** pada **Kolom ${missionParams.targetColLetter}** dari baris 2 hingga ${missionParams.rows + 1}.`;
                break;
            case "LOGIC_TEXT":
                problemStr = `melakukan klasifikasi otomatis dan ekstraksi string (ETL)`;
                specificMission = missionParams.missionText; 
                break;
            case "LOOKUP_SUMIF":
                problemStr = `merekonsiliasi data log dengan master database`;
                specificMission = missionParams.missionText;
                break;
            case "INDEX_MATCH_SUMIFS":
                problemStr = `menarik data dari arsitektur database kompleks yang asimetris`;
                specificMission = missionParams.missionText;
                break;
            case "GOD_TIER_NESTED":
            case "TITAN_COMPLEX":
                problemStr = `membangun dasbor profitabilitas dengan proteksi error (Anti-Fragile)`;
                specificMission = missionParams.missionText;
                break;
            default:
                problemStr = `menyelesaikan anomali data`;
                specificMission = `Selesaikan sesuai instruksi.`;
        }

        const theory = `[STUDI KASUS BISNIS - ERA ${era + 1}]<br>Anda bertugas sebagai **${role}** di **${corp}**. Saat ini perusahaan butuh laporan untuk ${problemStr}. Data mentah telah diekstrak ke dalam matriks di bawah.`;
        const mission = `**Instruksi Direksi:**<br>${specificMission}`;

        return { theory, mission };
    }
};

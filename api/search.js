// Impor library yang dibutuhkan
const YTDlpWrap = require('yt-dlp-wrap').default;

// Ini adalah fungsi utama yang akan dijalankan Vercel
export default async function handler(request, response) {
    // Ambil query dari URL, misalnya: /api/search?query=Dewa 19
    const { query } = request.query;

    if (!query) {
        return response.status(400).json({ error: 'Query pencarian tidak boleh kosong' });
    }
    
    // Inisialisasi yt-dlp-wrap
    const ytDlpWrap = new YTDlpWrap();

    try {
        // Jalankan perintah yt-dlp sama seperti sebelumnya
        const rawJsonOutput = await ytDlpWrap.exec([
            `ytsearch10:${query}`,
            '--dump-json'
        ]);
        
        const results = rawJsonOutput.stdout.split('\n')
            .filter(line => line)
            .map(line => JSON.parse(line));
        
        // Atur header agar bisa diakses dari mana saja (CORS)
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); // Cache hasil selama 1 hari
        
        // Kirim hasilnya sebagai JSON
        return response.status(200).json({ results: results });

    } catch (error) {
        console.error('Error saat menjalankan yt-dlp:', error);
        return response.status(500).json({ error: 'Terjadi kesalahan di server' });
    }
}

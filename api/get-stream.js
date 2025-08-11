import YTDlpWrap from 'yt-dlp-wrap';

export default async function handler(request, response) {
    const { videoId } = request.query;

    if (!videoId) {
        return response.status(400).json({ error: 'Video ID tidak boleh kosong' });
    }

    const ytDlpWrap = new YTDlpWrap();

    try {
        // [PERBAIKAN] Menggunakan URL YouTube yang standar dan variabel videoId dengan benar.
        const streamData = await ytDlpWrap.exec([
            `https://www.youtube.com/watch?v=${videoId}`,
            '-f', 'ba', // bestaudio
            '-g'  // get URL
        ]);

        const audioUrl = streamData.stdout.trim();

        if (!audioUrl.startsWith('http')) {
            // Jika output bukan URL, berarti ada error dari yt-dlp
            throw new Error('Gagal mendapatkan URL yang valid dari yt-dlp.');
        }

        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
        
        return response.status(200).json({ streamUrl: audioUrl });

    } catch (error) {
        console.error('Error di dalam API get-stream:', error);
        // Mengirimkan error yang lebih deskriptif ke frontend jika perlu
        return response.status(500).json({ error: 'Gagal mendapatkan stream URL.', details: error.message });
    }
}

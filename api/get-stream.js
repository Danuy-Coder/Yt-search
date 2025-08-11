import YTDlpWrap from 'yt-dlp-wrap';

export default async function handler(request, response) {
    const { videoId } = request.query;

    if (!videoId) {
        return response.status(400).json({ error: 'Video ID tidak boleh kosong' });
    }

    const ytDlpWrap = new YTDlpWrap();

    try {
        // Perintah yt-dlp untuk mendapatkan URL audio terbaik
        // -f ba: bestaudio
        // -g: get URL
        const streamData = await ytDlpWrap.exec([
            `https://www.youtube.com/watch?v=${videoId}`,
            '-f', 'ba', // bestaudio
            '-g'
        ]);

        const audioUrl = streamData.stdout.trim(); // URL ada di stdout

        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

        return response.status(200).json({ streamUrl: audioUrl });

    } catch (error) {
        console.error('Error saat mengambil stream URL:', error);
        return response.status(500).json({ error: 'Gagal mendapatkan stream URL' });
    }
}

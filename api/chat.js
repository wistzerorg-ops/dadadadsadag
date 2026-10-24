export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { contents, system_instruction } = req.body;
  
  // Lê a chave EXCLUSIVAMENTE das variáveis de ambiente da Vercel
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: 'A chave GEMINI_API_KEY não foi encontrada nas variáveis da Vercel.' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, system_instruction }),
      }
    );
    
    const data = await response.json();
    
    // Se o Google retornar erro, repassa para o jogo
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

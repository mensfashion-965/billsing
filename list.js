// api/list.js : சேமித்த பில்களின் பட்டியலைத் தரும்
const { sbHeaders } = require('./_sb');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { password } = req.body || {};
  if (password !== process.env.APP_PASSWORD) return res.status(401).json({ error: 'unauthorized' });

  try {
    const url = process.env.SUPABASE_URL +
      '/rest/v1/expenses?select=id,shop,bill_date,total,reason,created_at,photo_name,thumb&order=created_at.desc&limit=200';
    const r = await fetch(url, { headers: sbHeaders() });
    if (!r.ok) {
      const t = await r.text();
      return res.status(502).json({ error: 'Supabase: ' + t.slice(0, 200) });
    }
    return res.status(200).json({ rows: await r.json() });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
};

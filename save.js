// api/save.js : செலவு விவரங்களை Supabase-ல் சேமிக்கும்
const { sbHeaders } = require('./_sb');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { password, shop, date, total, reason, photo_name, thumb } = req.body || {};
  if (password !== process.env.APP_PASSWORD) return res.status(401).json({ error: 'unauthorized' });

  const amount = Number(total);
  if (!shop || !date || isNaN(amount) || !reason) {
    return res.status(400).json({ error: 'விவரங்கள் முழுமையாக இல்லை' });
  }

  try {
    const r = await fetch(process.env.SUPABASE_URL + '/rest/v1/expenses', {
      method: 'POST',
      headers: Object.assign({ prefer: 'return=minimal' }, sbHeaders()),
      body: JSON.stringify({
        shop, bill_date: date, total: amount, reason,
        photo_name: photo_name || null,
        thumb: thumb && thumb.length < 60000 ? thumb : null
      })
    });
    if (!r.ok) {
      const t = await r.text();
      return res.status(502).json({ error: 'Supabase: ' + t.slice(0, 200) });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
};

// api/_sb.js : Supabase headers (பகிரப்பட்ட உதவி ஃபைல்)
exports.sbHeaders = () => {
  const k = String(process.env.SUPABASE_KEY || '');
  const h = { 'content-type': 'application/json', apikey: k };
  if (k.startsWith('eyJ')) h.authorization = 'Bearer ' + k; // பழைய வகை key-க்கு மட்டும்
  return h;
};

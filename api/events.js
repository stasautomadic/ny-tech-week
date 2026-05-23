export default async function handler(req, res) {
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE = process.env.AIRTABLE_BASE_ID;
  const TABLE = process.env.AIRTABLE_TABLE_ID;

  let allRecords = [];
  let offset = '';

  do {
    const url = `https://api.airtable.com/v0/${BASE}/${TABLE}?pageSize=100${offset ? '&offset=' + offset : ''}`;
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const data = await r.json();
    allRecords = allRecords.concat(data.records || []);
    offset = data.offset || '';
  } while (offset);

  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');
  res.json(allRecords);
}

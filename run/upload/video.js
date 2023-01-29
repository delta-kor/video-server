function upload(base, key, data) {
  const url = `${base}/video`;

  const lines = data.trim().split('\n');
  for (const line of lines) {
    const chips = line.split('\t');
    const title = chips[0];
    const description = chips[1];
    const category = chips.slice(2, 5);
    const date = new Date(chips[5]);
    const cdnId = chips[6];
    const payload = { cdnId, title, description, category, date: date.getTime(), options: ['category'], type: 'vod', key };
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(res => res.json())
      .then(data => console.log(data));
  }
}

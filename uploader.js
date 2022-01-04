function upload(base, key, data) {
  const url = `${base}/video`;

  const lines = data.trim().split('\n');
  for (const line of lines) {
    const chips = line.split('\t');
    const category = chips.slice(0, 3);
    const numberDate = chips[3];
    const date = new Date(`20${numberDate.slice(0, 2)}. ${numberDate.slice(2, 4)}. ${numberDate.slice(4, 6)}.`);
    const title = chips[4];
    const description = chips[5];
    const cdnId = chips[6];
    const payload = { cdnId, title, description, date: date.getTime(), category, key };
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(res => res.json())
      .then(data => console.log(data));
  }
}

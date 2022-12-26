async function upload(base, key, data) {
  const url = `${base}/playlist`;

  const result = [];

  let index = 0;
  const lines = data.trim().split('\n');
  for (const line of lines) {
    const chips = line.trim().split('\t');
    const type = chips[0];
    const title = chips[1];
    const description = chips[2];
    const label = chips[3];
    const ids = chips.slice(4);
    const payload = {
      key,
      label: title,
      type,
      title,
      description,
      video: ids,
      featured: false,
      order: index,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    result.push(data.id);

    index++;
  }

  console.log(result);
  return result;
}

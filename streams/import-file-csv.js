import fs from 'node:fs';
import { parse } from 'csv-parse';

const csvPath = new URL('./tasks.csv', import.meta.url);

const readParser = 
  fs.createReadStream(csvPath).pipe(
    parse({
      delimiter: ',',
      skipEmptyLines: true,
      from_line: 2
    })
  );

async function processFile() {
  for await (const line of readParser) {
    const [ title, description ] = line;

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description
      })
    });

    await timer(1000);
  }
}

processFile();

function timer(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
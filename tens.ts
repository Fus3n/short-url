function parseTxtFile(file: string): string[] {
  const lines = file.split('\n');
  const result: string[] = [];
  
  for (const line of lines) {
    const match = line.match(/``(.*?)``/);
    if (match && match[1]) {
      result.push(match[1]);
    }
  }
  
  return result;
}

// test with file.txt
console.log(parseTxtFile('file.txt'));
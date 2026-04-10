// Claude Code PostToolUse hook: regenerates data/sets.json when a data/*.json file is written.
process.stdin.setEncoding('utf8');
let data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const fp = (input.tool_input && (input.tool_input.file_path || input.tool_input.new_file_path)) || '';
    const norm = fp.split(String.fromCharCode(92)).join('/');
    if (/\/data\/(?!sets\.json)[^/]+\.json$/.test(norm)) {
      const { execSync } = require('child_process');
      execSync('node generate-sets.js', { cwd: 'C:/Users/efeka/Desktop/PokeBinder', stdio: 'inherit' });
    }
  } catch(e) { process.exit(0); }
});

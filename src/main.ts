const defaultCode = `hear ye hear ye, greetings shall perform thus:
    proclaim "Good morrow, noble visitor!"
so it is written

let it be known that count shall be 3

whilst count > 0 do repeat:
    proclaim "Counting: " + count
    let it be known that count shall be count - 1
until it is done`;

function transpileToJS(code: string): string {
  return code
    .replace(/hear ye hear ye, (\w+) shall perform thus:/g, 'function $1() {')
    .replace(/so it is written/g, '}')
    .replace(/let it be known that (\w+) shall be/g, 'let $1 =')
    .replace(/whilst (.+) do repeat:/g, 'while($1) {')
    .replace(/until it is done/g, '}')
    .replace(/proclaim/g, 'console.log')
    .replace(/if thou must (.+) then:/g, 'if($1) {')
    .replace(/verily/g, '}');
}

function executeCode(code: string) {
  const jsCode = transpileToJS(code);
  const output = document.getElementById('output')!;
  output.innerHTML = '';
  
  const originalLog = console.log;
  console.log = (...args) => {
    output.innerHTML += args.join(' ') + '<br>';
    originalLog.apply(console, args);
  };

  try {
    eval(jsCode);
  } catch (error) {
    output.innerHTML += `<span class="text-red-500">Error: ${error}</span>`;
  }

  console.log = originalLog;
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="max-w-3xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-8 text-gray-900">MedievalSharp</h1>
    <p class="text-lg mb-12 text-gray-600">A modern programming language with medieval flair</p>
    
    <div class="mb-6">
      <div
        id="editor"
        contenteditable="true"
        class="focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
      >${defaultCode}</div>
      
      <button id="runBtn" class="mt-4 bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition">
        Execute thy Code
      </button>
      
      <div id="output" class="output"></div>
    </div>
  </div>
`;

const editor = document.getElementById('editor')!;

editor.addEventListener('input', () => {
  executeCode(editor.innerText);
});

document.getElementById('runBtn')?.addEventListener('click', () => {
  executeCode(editor.innerText);
});
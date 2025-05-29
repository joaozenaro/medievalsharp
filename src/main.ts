import './style.css';
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";

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
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-6xl text-center mb-8 text-amber-900">MedievalSharp</h1>
    <p class="text-2xl text-center mb-12 text-amber-800">A programming language most noble and true</p>
    
    <div class="space-y-12">
      <section class="bg-amber-100 p-8 rounded-lg shadow-lg">
        <h2 class="text-3xl mb-4 text-amber-900">Declarations Most Noble</h2>
        <pre class="bg-amber-50 p-4 rounded">let it be known that message shall be "Hark!"</pre>
      </section>

      <section class="bg-amber-100 p-8 rounded-lg shadow-lg">
        <h2 class="text-3xl mb-4 text-amber-900">Functions of Great Import</h2>
        <pre class="bg-amber-50 p-4 rounded">hear ye hear ye, greetings shall perform thus:
    proclaim "Good morrow!"
so it is written</pre>
      </section>

      <section class="bg-amber-100 p-8 rounded-lg shadow-lg">
        <h2 class="text-3xl mb-4 text-amber-900">Loops of Eternal Return</h2>
        <pre class="bg-amber-50 p-4 rounded">whilst count > 0 do repeat:
    proclaim "Counting: " + count
    let it be known that count shall be count - 1
until it is done</pre>
      </section>

      <section class="bg-amber-100 p-8 rounded-lg shadow-lg">
        <h2 class="text-3xl mb-4 text-amber-900">Try Your Hand at the Craft</h2>
        <div id="editor" class="editor mb-4"></div>
        <button id="runBtn" class="bg-amber-800 text-amber-100 px-6 py-2 rounded hover:bg-amber-900 transition">
          Execute thy Code
        </button>
        <div id="output" class="output mt-4"></div>
      </section>
    </div>
  </div>
`;

const editor = new EditorView({
  doc: defaultCode,
  extensions: [basicSetup, javascript()],
  parent: document.getElementById('editor')!
});

document.getElementById('runBtn')?.addEventListener('click', () => {
  executeCode(editor.state.doc.toString());
});
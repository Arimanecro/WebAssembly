import { readFile } from "node:fs/promises";
import { WASI } from "node:wasi";
import { PerformanceObserver, performance } from "node:perf_hooks";

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries();
  entry.forEach((e) =>
    console.log(`Time for ${e.name} : ${e.duration.toFixed(3)}`)
  );
  performance.clearMarks();
});
obs.observe({ type: "measure" });

// JS
const fibonacci = (num) => {
  if (num <= 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
};

// WA
const wasi = new WASI({});
const importObject = {
  wasi_snapshot_preview1: wasi.wasiImport,
  env: {
    js_fibonacci: fibonacci,
  },
};

const wasm = await readFile("./fib.wasm");
const instance = await WebAssembly.instantiate(wasm, importObject);
const { fibonacci: fib, call_js_fibonacci: js_fib } = instance.instance.exports;

{
  performance.mark("WA start");
  console.log(fib(41)) ;
  performance.mark("WA end");
  performance.measure("WebAssembly Fibonacci", "WA start", "WA end");
} //~ 952.758 ms

{
  performance.mark("JS start");
  console.log(fibonacci(41));
  performance.mark("JS end");
  performance.measure("JS Fibonacci", "JS start", "JS end");
} //~ 2260.230 ms

{
  performance.mark("Hybrid start");
  console.log(js_fib(41));
  performance.mark("Hybrid end");
  performance.measure("Hybrid Fibonacci", "Hybrid start", "Hybrid end");
} //~ 2340.68 ms
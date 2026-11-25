/**
 * Makes the share pictures (public/og/*.png, 1200×630) and the PDFs of the BCS papers (public/downloads/bcs-pdfs/*.pdf)
 * from the pages themselves, with the Chrome on this computer. Run it after questions or page titles change:
 *
 *   node scripts/make-share-files.mjs og  http://localhost:8000
 *   node scripts/make-share-files.mjs pdf http://localhost:8000 [48 47 …]
 *
 * The address is a running copy of the website with the public pages (Laravel with a built frontend).
 * Pictures of single notices are made in the admin panel instead.
 */
import { spawn } from "node:child_process"
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"

const [kind, base, ...only] = process.argv.slice(2)
const PUBLIC = path.resolve(import.meta.dirname, "../public")
const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe"
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function openChrome() {
  const profile = mkdtempSync(path.join(tmpdir(), "bd3-chrome-"))
  const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=9377", `--user-data-dir=${profile}`, "--hide-scrollbars", "about:blank"], { stdio: "ignore" })
  let target
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(200)
    target = await fetch("http://127.0.0.1:9377/json").then((r) => r.json()).then((all) => all.find((t) => t.type === "page")).catch(() => null)
  }
  const socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve) => (socket.onopen = resolve))
  let id = 0
  const waiting = new Map()
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data)
    if (!message.id) return
    waiting.get(message.id)(message.error ? Promise.reject(new Error(message.error.message)) : message.result)
    waiting.delete(message.id)
  }
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      waiting.set(++id, resolve)
      socket.send(JSON.stringify({ id, method, params }))
    })
  const run = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.value
  await send("Page.enable")
  return {
    send,
    run,
    close: async () => {
      socket.close()
      chrome.kill()
      await sleep(500)
      try {
        rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 })
      } catch {
        // Windows may keep a file of the closed Chrome locked; the folder is a temporary one
      }
    },
  }
}

const read = async (address) => (await fetch(base + address)).text()
const addresses = async (sitemap) => [...(await read(sitemap)).matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1] || "/")
const decode = (text) => text.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#0?39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim()
const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;")

/** The page's heading: [main line, second line]. */
async function heading(address) {
  const html = await read(address)
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? ""
  const second = h1.match(/<span[^>]*>([\s\S]*?)<\/span>\s*$/)
  return second ? [decode(h1.slice(0, second.index)), decode(second[1])] : [decode(h1), ""]
}

async function pictures(chrome) {
  const logo = `data:image/png;base64,${readFileSync(path.join(PUBLIC, "icon-192.png")).toString("base64")}`
  mkdirSync(path.join(PUBLIC, "og"), { recursive: true })
  const jobs = [
    ["home", "বিসিএস ও সরকারি চাকরির ফ্রি প্রস্তুতি", "Free BCS & Govt Job Exam Preparation in Bangladesh"],
    ["notices", "সরকারি চাকরির বিজ্ঞপ্তি ও নোটিশ", "Govt Job Circulars, Exam Dates & Results"],
    ["questions", "বিসিএস প্রশ্ন, উত্তর ও ব্যাখ্যা", "BCS Questions with Answers and Explanations"],
    ["blog", "বিসিএস প্রস্তুতি ব্লগ ও গাইড", "BCS Preparation Blog & Guides"],
  ]
  const pages = ["/ntrca", "/primary-teacher", "/bank-jobs", "/model-tests", ...(await addresses("/sitemap-bcs.xml")), ...(await addresses("/sitemap-blog.xml"))]
  for (const address of pages) jobs.push([address.slice(1).replaceAll("/", "-"), ...(await heading(address))])

  await chrome.send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false })
  const { frameTree } = await chrome.send("Page.getFrameTree")
  for (const [name, title, english] of jobs) {
    const size = title.length > 60 ? 52 : title.length > 40 ? 62 : 76
    const html = `<!doctype html><html lang="bn"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@500;700&family=Plus+Jakarta+Sans:wght@600;800&display=block"><style>
      *{box-sizing:border-box;margin:0}body{width:1200px;height:630px;background:#1d6ca8;color:#fff;font-family:"Hind Siliguri",sans-serif;padding:64px 72px;display:flex;flex-direction:column;position:relative;overflow:hidden}
      body:before{content:"";position:absolute;width:560px;height:560px;border-radius:50%;background:rgba(255,255,255,.08);top:-210px;right:-170px}body:after{content:"";position:absolute;width:330px;height:330px;border-radius:50%;background:rgba(255,255,255,.06);bottom:-150px;right:210px}
      .brand{display:flex;align-items:center;gap:20px;font:800 42px "Plus Jakarta Sans";letter-spacing:-.02em}.brand img{width:76px;height:76px;border-radius:18px}
      main{margin:auto 0;position:relative;z-index:1}h1{font-size:${size}px;line-height:1.3;font-weight:700}p{margin-top:22px;font:600 ${english.length > 60 ? 32 : 38}px/1.35 "Plus Jakarta Sans","Hind Siliguri";opacity:.92}
      small{font-size:28px;opacity:.85;position:relative;z-index:1}</style></head><body><div class="brand"><img src="${logo}">bd3schools</div><main><h1>${escape(title)}</h1>${english ? `<p>${escape(english)}</p>` : ""}</main><small>bd3schools.com · সম্পূর্ণ ফ্রি</small></body></html>`
    await chrome.send("Page.setDocumentContent", { frameId: frameTree.frame.id, html })
    await sleep(150)
    await chrome.run("Promise.all([document.fonts.ready,...[...document.images].map(i=>i.decode().catch(()=>{}))]).then(()=>new Promise(r=>setTimeout(r,150)))")
    const { data } = await chrome.send("Page.captureScreenshot", { format: "png" })
    writeFileSync(path.join(PUBLIC, "og", `${name}.png`), Buffer.from(data, "base64"))
  }
  console.log(`${jobs.length} pictures`)
}

async function pdfs(chrome) {
  const folder = path.join(PUBLIC, "downloads/bcs-pdfs")
  mkdirSync(folder, { recursive: true })
  let total = 0
  for (const address of await addresses("/sitemap-bcs.xml")) {
    const number = address.match(/^\/bcs\/(\d+)/)?.[1]
    if (!number || (only.length && !only.includes(number))) continue
    const [title] = await heading(address)
    await chrome.send("Page.navigate", { url: base + address })
    await sleep(2500)
    await chrome.run("document.fonts.ready.then(()=>new Promise(r=>setTimeout(r,400)))")
    const style = 'font-family:"Hind Siliguri",sans-serif;font-size:9px;color:#555;width:100%;padding:0 14mm;display:flex;justify-content:space-between'
    const { data } = await chrome.send("Page.printToPDF", {
      paperWidth: 8.27,
      paperHeight: 11.69,
      marginTop: 0.75,
      marginBottom: 0.7,
      marginLeft: 0.5,
      marginRight: 0.5,
      printBackground: false,
      displayHeaderFooter: true,
      headerTemplate: `<div style='${style}'><span><b style="color:#1d6ca8">bd3schools</b> · ${escape(title)}</span><span>bd3schools.com${address}</span></div>`,
      footerTemplate: `<div style='${style}'><span>bd3schools.com · উত্তর ও ব্যাখ্যা অনলাইনে দেখুন</span><span>পৃষ্ঠা <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    })
    const file = Buffer.from(data, "base64")
    total += file.length
    writeFileSync(path.join(folder, `${number}th-bcs-question-solution-pdf.pdf`), file)
    console.log(`${number}: ${Math.round(file.length / 1024)} KB`)
  }
  console.log(`total ${(total / 1024 / 1024).toFixed(1)} MB`)
}

if (!["og", "pdf"].includes(kind) || !base) {
  console.error("Usage: node scripts/make-share-files.mjs og|pdf http://localhost:8000")
  process.exit(1)
}
const chrome = await openChrome()
try {
  await (kind === "og" ? pictures(chrome) : pdfs(chrome))
} finally {
  await chrome.close()
}

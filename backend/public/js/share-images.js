/* Draws the missing share pictures of notices (1200×630) while the admin panel is open. */
(() => {
  const token = () => document.querySelector('meta[name="csrf-token"]')?.content
  const WIDTH = 1200
  const HEIGHT = 630
  let busy = false

  async function fonts() {
    if (!document.getElementById("share-image-fonts")) {
      const link = document.createElement("link")
      link.id = "share-image-fonts"
      link.rel = "stylesheet"
      link.href = "https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@500;700&display=swap"
      document.head.append(link)
      await new Promise((resolve) => {
        link.onload = resolve
        link.onerror = resolve
      })
    }
    await Promise.all([document.fonts.load('700 60px "Hind Siliguri"', "অB"), document.fonts.load('500 34px "Hind Siliguri"', "অB")])
  }

  function lines(context, text, width, most) {
    const out = []
    let line = ""
    for (const word of text.split(/\s+/)) {
      const longer = line ? `${line} ${word}` : word
      if (context.measureText(longer).width <= width) line = longer
      else {
        if (line) out.push(line)
        line = word
      }
    }
    if (line) out.push(line)
    if (out.length <= most) return out
    const kept = out.slice(0, most)
    kept[most - 1] = `${kept[most - 1].replace(/\s\S*$/, "")}…`
    return kept
  }

  function draw(notice) {
    const canvas = document.createElement("canvas")
    canvas.width = WIDTH
    canvas.height = HEIGHT
    const context = canvas.getContext("2d")
    context.fillStyle = "#1d6ca8"
    context.fillRect(0, 0, WIDTH, HEIGHT)
    context.fillStyle = "rgba(255,255,255,0.08)"
    context.beginPath()
    context.arc(1120, 60, 260, 0, Math.PI * 2)
    context.fill()
    context.textBaseline = "top"

    context.fillStyle = "#ffffff"
    context.font = '700 40px "Hind Siliguri"'
    context.fillText("bd3schools", 72, 64)
    context.font = '500 28px "Hind Siliguri"'
    context.fillStyle = "rgba(255,255,255,0.85)"
    context.fillText(lines(context, `নোটিশ · Notice · ${notice.org}`, WIDTH - 372, 1)[0], 300, 74)

    const main = notice.title_bn || notice.title
    let size = 66
    let rows
    do {
      context.font = `700 ${size}px "Hind Siliguri"`
      rows = lines(context, main, WIDTH - 144, 4)
      size -= 6
    } while (rows.length > 3 && size > 40)
    context.fillStyle = "#ffffff"
    let y = 170
    for (const row of rows) {
      context.fillText(row, 72, y)
      y += (size + 6) * 1.35
    }
    if (notice.title_bn) {
      context.font = '500 34px "Hind Siliguri"'
      context.fillStyle = "rgba(255,255,255,0.9)"
      y += 14
      for (const row of lines(context, notice.title, WIDTH - 144, 2)) {
        if (y > 500) break
        context.fillText(row, 72, y)
        y += 46
      }
    }
    context.font = '500 28px "Hind Siliguri"'
    context.fillStyle = "rgba(255,255,255,0.85)"
    context.fillText("bd3schools.com/notices", 72, 552)
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"))
  }

  async function run() {
    if (busy || !token() || !/\/notices(\/|$)/.test(location.pathname)) return
    busy = true
    try {
      const response = await fetch("/admin/share-images", { headers: { Accept: "application/json" } })
      if (!response.ok) return
      const { data } = await response.json()
      if (!data.length) return
      await fonts()
      for (const notice of data) {
        const body = new FormData()
        body.append("image", await draw(notice), "share.png")
        const saved = await fetch(`/admin/share-images/${notice.id}`, { method: "POST", body, headers: { Accept: "application/json", "X-CSRF-TOKEN": token() } })
        if (!saved.ok) return
      }
      if (data.length === 5) setTimeout(() => ((busy = false), run()), 500)
    } catch {
      /* tried again the next time the notices are opened */
    } finally {
      busy = false
    }
  }

  document.addEventListener("DOMContentLoaded", run)
  document.addEventListener("livewire:navigated", run)
})()

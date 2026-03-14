const SITE = 'rcm-podcast-react.vercel.app'
const ACCENT = '#8b5cf6'

export function tweetQuote(quote: string, postTitle: string) {
  const text = `"${quote}"\n\n— ${postTitle}\nhttps://${SITE}`
  window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
}

export async function shareQuoteImage(quote: string, author: string, postTitle: string) {
  const W = 1080, H = 1080, PAD = 80
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  // Accent bar top
  ctx.fillStyle = ACCENT
  ctx.fillRect(0, 0, W, 6)

  // Quote mark
  ctx.fillStyle = ACCENT + '18'
  ctx.font = 'bold 280px Georgia'
  ctx.fillText('"', PAD - 20, 240)

  // Wrap and draw quote text
  ctx.fillStyle = '#1a1a1a'
  ctx.font = '600 42px Inter, -apple-system, sans-serif'
  const lines = wrapText(ctx, quote, W - PAD * 2)
  const startY = Math.max(280, (H - lines.length * 58) / 2 - 40)
  lines.forEach((line, i) => {
    ctx.fillText(line, PAD, startY + i * 58)
  })

  // Accent line
  const lineY = startY + lines.length * 58 + 40
  ctx.fillStyle = ACCENT
  ctx.fillRect(PAD, lineY, 60, 4)

  // Author
  ctx.fillStyle = '#6b7280'
  ctx.font = '500 28px Inter, -apple-system, sans-serif'
  ctx.fillText(author, PAD, lineY + 44)

  // Post title
  ctx.fillStyle = '#9ca3af'
  ctx.font = '400 24px Inter, -apple-system, sans-serif'
  ctx.fillText(postTitle, PAD, lineY + 82)

  // Bottom branding bar
  ctx.fillStyle = '#faf9ff'
  ctx.fillRect(0, H - 70, W, 70)
  ctx.fillStyle = ACCENT
  ctx.fillRect(0, H - 70, W, 1)

  // Brand
  // Logo circle
  ctx.fillStyle = ACCENT
  ctx.beginPath()
  ctx.roundRect(PAD, H - 55, 36, 36, 8)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 16px Inter'
  ctx.fillText('✝', PAD + 10, H - 32)

  ctx.fillStyle = '#374151'
  ctx.font = 'bold 22px Inter, -apple-system, sans-serif'
  ctx.fillText('Revelation of Christ Ministries', PAD + 48, H - 30)

  ctx.fillStyle = '#9ca3af'
  ctx.font = '400 20px Inter'
  ctx.fillText(SITE, W - PAD - ctx.measureText(SITE).width, H - 30)

  // Convert to blob and share/download
  canvas.toBlob(async (blob) => {
    if (!blob) return
    const file = new File([blob], 'rcm-quote.png', { type: 'image/png' })

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      navigator.share({ files: [file], title: postTitle }).catch(() => {})
    } else {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'rcm-quote.png'
      a.click()
      URL.revokeObjectURL(a.href)
    }
  }, 'image/png')
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

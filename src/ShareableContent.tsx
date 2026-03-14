import { useEffect, useRef } from 'react'
import { tweetQuote, shareQuoteImage } from './quoteShare'

export function ShareableContent({ html, postTitle, author }: { html: string; postTitle: string; author: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.querySelectorAll('blockquote').forEach(bq => {
      if (bq.querySelector('.quote-actions')) return
      if (bq.classList.contains('scripture')) return
      const text = bq.textContent?.trim() || ''
      if (!text) return

      const actions = document.createElement('div')
      actions.className = 'quote-actions flex items-center gap-2 mt-3 pt-2 border-t border-gray-100'

      // Tweet button
      const tweet = document.createElement('button')
      tweet.className = 'inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-[#1DA1F2] transition px-2 py-1 rounded-lg hover:bg-[#1DA1F2]/5'
      tweet.innerHTML = `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>Tweet`
      tweet.onclick = () => tweetQuote(text, postTitle)

      // Share as image button
      const img = document.createElement('button')
      img.className = 'inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-[#25D366] transition px-2 py-1 rounded-lg hover:bg-[#25D366]/5'
      img.innerHTML = `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>Share as Image`
      img.onclick = () => shareQuoteImage(text, author, postTitle)

      actions.appendChild(tweet)
      actions.appendChild(img)
      bq.appendChild(actions)
    })
  }, [html, postTitle, author])

  return (
    <div ref={ref} className="
      [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-gray-900
      [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-2
      [&_p]:text-gray-700 [&_p]:leading-[1.8] [&_p]:mb-5 [&_p]:text-[16px]
      [&_a]:text-accent [&_a]:underline
      [&_strong]:text-gray-900 [&_strong]:font-semibold
      [&_blockquote]:border-l-[3px] [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_blockquote]:py-2 [&_blockquote]:my-8 [&_blockquote]:bg-accent/5 [&_blockquote]:rounded-r-xl [&_blockquote_p]:italic [&_blockquote_p]:text-gray-600 [&_blockquote_p]:mb-0
      [&_.scripture]:border-l-[3px] [&_.scripture]:border-accent [&_.scripture]:pl-5 [&_.scripture]:py-3 [&_.scripture]:my-8 [&_.scripture]:bg-accent/5 [&_.scripture]:rounded-r-xl [&_.scripture]:italic [&_.scripture]:text-gray-600 [&_.scripture]:text-[15px] [&_.scripture]:leading-relaxed
      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul_li]:text-gray-700 [&_ul_li]:mb-2 [&_ul_li]:leading-relaxed
      [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol_li]:text-gray-700 [&_ol_li]:mb-2 [&_ol_li]:leading-relaxed
    " dangerouslySetInnerHTML={{ __html: html }} />
  )
}

import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import hljs from 'highlight.js'

export const useMarkdown = () => {
  // Configure marked options
  const renderer = new marked.Renderer()
  renderer.code = ({ text, lang }: { text: string, lang?: string }) => {
    const validLanguage = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
    const highlighted = hljs.highlight(text, { language: validLanguage }).value
    return `<pre><code class="hljs language-${validLanguage}">${highlighted}</code></pre>`
  }

  marked.setOptions({
    renderer,
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Convert \n to <br>
  })

  // Convert markdown to HTML and sanitize
  const markdownToHtml = (markdown: string) => {
    const html = marked.parse(markdown)
    return DOMPurify.sanitize(html.toString())
  }

  // Extract first paragraph from markdown
  const extractExcerpt = (markdown: string, maxLength = 150) => {
    const html = marked.parse(markdown)
    const text = DOMPurify.sanitize(html.toString()).replace(/<[^>]*>/g, '') // Remove HTML tags
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // Count words in markdown
  const countWords = (markdown: string) => {
    const text = markdown.replace(/[#*`]/g, '') // Remove markdown symbols
    return text.trim().split(/\s+/).length
  }

  // Estimate reading time
  const estimateReadingTime = (markdown: string) => {
    const wordsPerMinute = 200
    const words = countWords(markdown)
    const minutes = Math.ceil(words / wordsPerMinute)
    return minutes
  }

  return {
    markdownToHtml,
    extractExcerpt,
    countWords,
    estimateReadingTime,
  }
} 
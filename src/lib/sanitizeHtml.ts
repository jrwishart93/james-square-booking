export function sanitizeHtml(input: string): string {
  let out = input.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  out = out
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '');

  const allowed = /(p|br|strong|em|b|i|u|ul|ol|li|h[1-6]|a|div|span)/i;
  out = out.replace(/<(?=\/?)([^>\s/]+)([^>]*)>/g, (match, tag) => {
    return allowed.test(tag) ? match : match.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  });

  return out;
}

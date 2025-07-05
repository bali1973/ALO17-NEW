// Input sanitization utilities
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/expression\(/gi, '') // Remove CSS expressions
    .replace(/url\(/gi, '') // Remove CSS url()
    .replace(/eval\(/gi, '') // Remove eval()
    .replace(/document\./gi, '') // Remove document access
    .replace(/window\./gi, '') // Remove window access
    .replace(/localStorage\./gi, '') // Remove localStorage access
    .replace(/sessionStorage\./gi, '') // Remove sessionStorage access
    .replace(/cookie/gi, '') // Remove cookie access
    .replace(/alert\(/gi, '') // Remove alert()
    .replace(/confirm\(/gi, '') // Remove confirm()
    .replace(/prompt\(/gi, ''); // Remove prompt()
}

export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') {
    return '';
  }

  // Allow only safe HTML tags and attributes
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const allowedAttributes = ['class', 'id', 'style'];

  // Remove all HTML tags except allowed ones
  let sanitized = html;
  
  // Remove all tags first
  sanitized = sanitized.replace(/<[^>]*>/g, (match) => {
    const tagName = match.match(/<(\w+)/)?.[1]?.toLowerCase();
    
    if (tagName && allowedTags.includes(tagName)) {
      // Keep allowed tags but remove all attributes
      return `<${tagName}>`;
    }
    
    return ''; // Remove disallowed tags
  });

  return sanitized;
}

export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return '';
  }

  const urlObj = new URL(url, 'http://localhost');
  
  // Only allow http and https protocols
  if (!['http:', 'https:'].includes(urlObj.protocol)) {
    return '';
  }

  return urlObj.toString();
}

export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }

  // Basic email validation and sanitization
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return '';
  }

  return email.toLowerCase().trim();
}

export function sanitizePhone(phone: string): string {
  if (typeof phone !== 'string') {
    return '';
  }

  // Remove all non-digit characters except + at the beginning
  return phone.replace(/[^\d+]/g, '');
}

export function sanitizePrice(price: string | number): number {
  if (typeof price === 'number') {
    return Math.max(0, price);
  }

  if (typeof price === 'string') {
    const num = parseFloat(price.replace(/[^\d.-]/g, ''));
    return isNaN(num) ? 0 : Math.max(0, num);
  }

  return 0;
} 
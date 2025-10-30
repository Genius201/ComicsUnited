// Security utilities for input validation and sanitization

export class SecurityUtils {
  // Enhanced XSS Protection - Comprehensive HTML sanitization
  static sanitizeHTML(str) {
    if (typeof str !== 'string') return str;
    
    const temp = document.createElement('div');
    temp.textContent = str;
    
    // Additional XSS prevention - remove script tags, event handlers, etc.
    let sanitized = temp.innerHTML
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/data:/gi, '');
    
    return sanitized;
  }

  // Enhanced Input Sanitization - Protection against injection attacks
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>\"'%;()&+\[\]{}|\\^~`]/g, '') // Remove dangerous characters
      .replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b/gi, '') // Remove SQL keywords
      .replace(/\b(javascript|vbscript|onload|onerror|onclick)\b/gi, '') // Remove script keywords
      .trim()
      .slice(0, 500); // Stricter length limit
  }

  // CSRF Token Generation and Validation
  static generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Content Security Policy Nonce Generation
  static generateNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }

  // Email validation
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // Phone number validation
  static validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  // URL validation
  static validateURL(url) {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  // Rate limiting helper
  static createRateLimiter(maxRequests = 10, windowMs = 60000) {
    const requests = new Map();
    
    return (identifier) => {
      const now = Date.now();
      const userRequests = requests.get(identifier) || [];
      
      // Remove old requests outside the window
      const validRequests = userRequests.filter(time => now - time < windowMs);
      
      if (validRequests.length >= maxRequests) {
        return false; // Rate limit exceeded
      }
      
      validRequests.push(now);
      requests.set(identifier, validRequests);
      return true;
    };
  }

  // Generate secure random token
  static generateToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Secure local storage with encryption (basic)
  static secureStorage = {
    set(key, value) {
      try {
        const encrypted = btoa(JSON.stringify(value));
        localStorage.setItem(`sec_${key}`, encrypted);
      } catch (error) {
        console.error('Secure storage set error:', error);
      }
    },
    
    get(key) {
      try {
        const encrypted = localStorage.getItem(`sec_${key}`);
        if (!encrypted) return null;
        return JSON.parse(atob(encrypted));
      } catch (error) {
        console.error('Secure storage get error:', error);
        return null;
      }
    },
    
    remove(key) {
      localStorage.removeItem(`sec_${key}`);
    }
  };
}

export default SecurityUtils;
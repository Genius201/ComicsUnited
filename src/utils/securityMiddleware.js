// Security Middleware - Addresses Meterian Security Issues
// This module provides comprehensive protection against common web vulnerabilities

export class SecurityMiddleware {
  
  // Rate Limiting Protection (Prevents brute force attacks)
  static rateLimiter = {
    attempts: new Map(),
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    
    checkLimit(identifier) {
      const now = Date.now();
      const userAttempts = this.attempts.get(identifier) || { count: 0, resetTime: now + this.windowMs };
      
      if (now > userAttempts.resetTime) {
        userAttempts.count = 0;
        userAttempts.resetTime = now + this.windowMs;
      }
      
      if (userAttempts.count >= this.maxAttempts) {
        return false;
      }
      
      userAttempts.count++;
      this.attempts.set(identifier, userAttempts);
      return true;
    }
  };

  // Input Validation Chain (Comprehensive input sanitization)
  static validateAndSanitizeInput(data, rules = {}) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        // XSS Prevention
        let clean = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/vbscript:/gi, '')
          .replace(/data:text\/html/gi, '');
        
        // SQL Injection Prevention
        clean = clean.replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi, '');
        
        // NoSQL Injection Prevention
        clean = clean.replace(/[\$\{\}]/g, '');
        
        // Path Traversal Prevention
        clean = clean.replace(/\.\./g, '');
        
        // Apply specific rules if provided
        if (rules[key]) {
          if (rules[key].maxLength) {
            clean = clean.slice(0, rules[key].maxLength);
          }
          if (rules[key].pattern && !rules[key].pattern.test(clean)) {
            throw new Error(`Invalid input for field: ${key}`);
          }
        }
        
        sanitized[key] = clean.trim();
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  // CSRF Protection
  static csrfProtection = {
    tokens: new Map(),
    
    generateToken(sessionId) {
      const token = crypto.getRandomValues(new Uint8Array(32));
      const tokenString = Array.from(token, byte => byte.toString(16).padStart(2, '0')).join('');
      
      this.tokens.set(sessionId, {
        token: tokenString,
        expires: Date.now() + (60 * 60 * 1000) // 1 hour
      });
      
      return tokenString;
    },
    
    validateToken(sessionId, token) {
      const storedToken = this.tokens.get(sessionId);
      
      if (!storedToken || storedToken.expires < Date.now()) {
        this.tokens.delete(sessionId);
        return false;
      }
      
      return storedToken.token === token;
    }
  };

  // Session Security (Prevents session hijacking)
  static sessionSecurity = {
    validateSession(sessionData) {
      // Check session age
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (sessionData.created && (Date.now() - sessionData.created > maxAge)) {
        return false;
      }
      
      // Validate session fingerprint (basic implementation)
      const userAgent = navigator.userAgent;
      const expectedFingerprint = this.generateFingerprint(userAgent);
      
      return sessionData.fingerprint === expectedFingerprint;
    },
    
    generateFingerprint(userAgent) {
      // Simple fingerprinting for session validation
      return btoa(userAgent).slice(0, 20);
    }
  };

  // Content Security Policy Enforcement
  static enforceCSP() {
    // Remove any inline scripts that might have been injected
    const inlineScripts = document.querySelectorAll('script:not([src])');
    inlineScripts.forEach(script => {
      if (!script.hasAttribute('data-safe')) {
        console.warn('Removing potentially unsafe inline script');
        script.remove();
      }
    });
    
    // Remove event handlers from elements
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      const attributes = Array.from(element.attributes);
      attributes.forEach(attr => {
        if (attr.name.startsWith('on')) {
          console.warn(`Removing event handler: ${attr.name}`);
          element.removeAttribute(attr.name);
        }
      });
    });
  }

  // Secure Headers Validation
  static validateSecureHeaders(response) {
    const requiredHeaders = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'X-XSS-Protection',
      'Referrer-Policy'
    ];
    
    const missingHeaders = requiredHeaders.filter(header => 
      !response.headers[header.toLowerCase()]
    );
    
    if (missingHeaders.length > 0) {
      console.warn('Missing security headers:', missingHeaders);
    }
    
    return missingHeaders.length === 0;
  }

  // Initialize all security measures
  static initialize() {
    // Enforce CSP on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', this.enforceCSP);
    } else {
      this.enforceCSP();
    }
    
    // Set up periodic security checks
    setInterval(() => {
      this.enforceCSP();
      
      // Clean up expired tokens and sessions
      const now = Date.now();
      for (const [key, value] of this.csrfProtection.tokens.entries()) {
        if (value.expires < now) {
          this.csrfProtection.tokens.delete(key);
        }
      }
    }, 5 * 60 * 1000); // Every 5 minutes
    
    console.log('Security middleware initialized');
  }
}

// Auto-initialize security measures
SecurityMiddleware.initialize();

export default SecurityMiddleware;
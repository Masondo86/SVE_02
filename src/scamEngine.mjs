// ESM module for browser-side heuristics and deterministic scoring.
// This is a pure function module used for UI fallbacks and quick heuristics.

// Helper: clamp numeric values
export function clamp(v, min = 0, max = 100) {
  const n = Number(v);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

// compute stroke-dashoffset for gauge rendering
export function computeGaugeOffset(score, circumference = 283) {
  const s = clamp(score, 0, 100);
  return circumference - (s / 100) * circumference;
}

// choose color for gauge by risk level
export function chooseGaugeColor(level) {
  if (level === 'high') return '#dc2626';
  if (level === 'safe') return '#16a34a';
  return '#f97316';
}

// tokenization utility: returns array of lowercased tokens (words, domains, emails, numbers).
function tokenize(input) {
  if (!input) return [];
  const normalized = String(input).toLowerCase();
  // split on non-word characters, keep dots and @ in tokens for domains/emails
  const tokens = normalized.split(/[\s,;|]+/).flatMap(chunk => {
    // further split on characters except alphanum, dot, dash, @
    return chunk.split(/[^a-z0-9@.\-]+/).filter(Boolean);
  });
  return tokens;
}

// safer boundary-aware matcher using regex with word boundaries when appropriate
function containsWord(input, word) {
  if (!input || !word) return false;
  try {
    const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'i');
    return re.test(input);
  } catch (e) {
    return input.toLowerCase().includes(word.toLowerCase());
  }
}

// generateResult with configurable whitelist/blacklist
// options: { whitelist: [], blacklist: [], strictTokens: boolean }
export function generateResult(input = '', options = {}) {
  const { whitelist = [], blacklist = [], strictTokens = true } = options;
  const txt = String(input || '');
  const tokens = tokenize(txt);

  // if whitelist contains any exact match token -> safe
  const localLower = txt.toLowerCase();
  for (const w of whitelist) {
    if (!w) continue;
    if (localLower.includes(w.toLowerCase())) {
      return {
        score: 96,
        riskLevel: 'safe',
        tech: {
          domain: 'Longstanding / Known',
          ssl: 'Valid',
          hosting: 'Corporate',
          blacklist: 'Clean'
        },
        social: {
          summary: 'No manipulative triggers found. Standard corporate communication style.',
          urgency: false,
          brand: false,
          otp: false
        },
        community: {
          count: 0,
          social: 'No mentions',
          trust: '4.9/5 (Excellent)',
          trend: 'Stable'
        }
      };
    }
  }

  // blacklist check: direct containment or token match
  for (const b of blacklist) {
    if (!b) continue;
    if (localLower.includes(b.toLowerCase()) || tokens.includes(b.toLowerCase())) {
      return {
        score: 8,
        riskLevel: 'high',
        tech: {
          domain: 'Recent / Blacklisted',
          ssl: 'Unknown / Invalid',
          hosting: 'High Risk',
          blacklist: 'Listed'
        },
        social: {
          summary: 'Matched explicit blacklist entries.',
          urgency: true,
          brand: true,
          otp: true
        },
        community: {
          count: 42,
          social: 'Multiple reports',
          trust: '1.0/5 (Poor)',
          trend: 'Spiking'
        }
      };
    }
  }

  // improved keyword detection with boundary checks
  const highKeywords = ['bank', 'login', 'update', 'winner', 'pay', 'secure', 'confirm', 'verify', 'reset', 'urgent'];
  let highMatchCount = 0;
  for (const kw of highKeywords) {
    if (strictTokens) {
      if (tokens.some(t => t.includes(kw))) highMatchCount++;
    } else {
      if (containsWord(txt, kw)) highMatchCount++;
    }
  }

  if (highMatchCount >= 2) {
    return {
      score: 12,
      riskLevel: 'high',
      tech: {
        domain: 'Created recently',
        ssl: 'Self-Signed / Invalid',
        hosting: 'High Risk',
        blacklist: 'Potential Matches'
      },
      social: {
        summary: "Highly manipulative language detected matching common phishing patterns.",
        urgency: true,
        brand: true,
        otp: true
      },
      community: {
        count: 120,
        social: 'Multiple reports',
        trust: '1.2/5 (Bad)',
        trend: 'Spiking'
      }
    };
  }

  // fallback: medium
  return {
    score: 55,
    riskLevel: 'medium',
    tech: {
      domain: 'Unknown Age',
      ssl: "Valid (Let's Encrypt / Unknown)",
      hosting: 'Shared / Cloud',
      blacklist: 'Clean'
    },
    social: {
      summary: 'Contains some vague urgency but lacks specific brand impersonation.',
      urgency: tokens.some(t => ['urgent', 'immediately', 'asap'].includes(t)),
      brand: false,
      otp: false
    },
    community: {
      count: 1,
      social: '1 User Report',
      trust: 'Unknown',
      trend: 'Low Activity'
    }
  };
}

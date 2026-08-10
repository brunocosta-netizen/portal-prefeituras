/**
 * Email Spell Checker & Grammar Validator
 *
 * Verifica ortografia e gramática em emails
 * antes de enviar para prefeituras
 */

const EmailSpellChecker = {
  // Dicionário de erros comuns em português
  commonMistakes: {
    'verificar se existe': { correct: 'verificar se há', type: 'grammar' },
    'tenho certeza': { correct: 'tenho certeza', type: 'ok' },
    'nós colocamos': { correct: 'nos colocamos', type: 'accent' },
    'me contactem': { correct: 'entrem em contato', type: 'style' },
    'á pouco': { correct: 'a pouco', type: 'accent' },
    'aonde': { correct: 'onde', type: 'preposition' },
    'em seguida': { correct: 'em seguida', type: 'ok' },
    'no entanto': { correct: 'no entanto', type: 'ok' },
    'afim de': { correct: 'a fim de', type: 'spacing' },
    'por favor': { correct: 'por favor', type: 'ok' },
    'poderia': { correct: 'poderia', type: 'ok' },
    'estará': { correct: 'estará', type: 'ok' },
    'colocarse': { correct: 'colocar-se', type: 'spacing' },
    'informações adicionais': { correct: 'informações adicionais', type: 'ok' },
    'documentação em anexo': { correct: 'documentação em anexo', type: 'ok' },
  },

  // Palavras que devem ser capitalizadas em emails formais
  shouldCapitalize: [
    'Prefeito', 'Prefeitura', 'Órgão', 'Responsável',
    'Cliente', 'CNPJ', 'CPF', 'Email', 'Processo'
  ],

  // Verificar erros de ortografia básicos
  checkSpelling(text) {
    const errors = [];
    const words = text.toLowerCase().split(/\s+/);

    words.forEach((word, idx) => {
      // Remove pontuação para análise
      const cleanWord = word.replace(/[.,!?;:—-]+$/, '');

      // Verifica erros comuns
      Object.entries(this.commonMistakes).forEach(([mistake, data]) => {
        if (cleanWord.includes(mistake.toLowerCase())) {
          errors.push({
            word: word,
            suggestion: data.correct,
            type: data.type,
            position: idx
          });
        }
      });
    });

    return errors;
  },

  // Verificar gramática básica
  checkGrammar(text) {
    const issues = [];

    // 1. Espaço duplo
    if (text.includes('  ')) {
      issues.push({
        issue: 'Espaços duplos encontrados',
        type: 'spacing',
        severity: 'low'
      });
    }

    // 2. Pontuação dupla
    if (text.match(/[.!?]{2,}/)) {
      issues.push({
        issue: 'Pontuação dupla encontrada',
        type: 'punctuation',
        severity: 'low'
      });
    }

    // 3. Vírgula antes de "e"
    if (text.match(/,\s+e\s+/)) {
      issues.push({
        issue: 'Evite vírgula antes de "e"',
        type: 'punctuation',
        severity: 'medium'
      });
    }

    // 4. Verificar parênteses balanceados
    const openParen = (text.match(/\(/g) || []).length;
    const closeParen = (text.match(/\)/g) || []).length;
    if (openParen !== closeParen) {
      issues.push({
        issue: 'Parênteses não balanceados',
        type: 'syntax',
        severity: 'high'
      });
    }

    // 5. Linha muito longa (>100 caracteres)
    text.split('\n').forEach((line, idx) => {
      if (line.length > 100) {
        issues.push({
          issue: `Linha ${idx + 1} muito longa (${line.length} caracteres)`,
          type: 'formatting',
          severity: 'low'
        });
      }
    });

    return issues;
  },

  // Validar tom e vocabulário apropriado
  validateTone(text, expectedTone) {
    const validation = {
      tone: expectedTone,
      issues: [],
      warnings: []
    };

    const text_lower = text.toLowerCase();

    // Verificar palavras inadequadas para cada tom
    const toneChecks = {
      cordial: {
        forbidden: ['imediatamente', 'obrigado exigir', 'vencida'],
        preferred: ['por gentileza', 'poderia', 'gostaria']
      },
      direto: {
        forbidden: ['prezados senhores', 'vimos por este meio'],
        preferred: ['pessoal', 'preciso', 'conseguem']
      },
      urgente: {
        forbidden: ['gostaria', 'poderia'],
        preferred: ['urgente', 'imediatamente', 'necessário']
      }
    };

    const checks = toneChecks[expectedTone] || {};

    // Verificar palavras proibidas
    (checks.forbidden || []).forEach(word => {
      if (text_lower.includes(word.toLowerCase())) {
        validation.issues.push({
          word: word,
          reason: `Evite "${word}" para tom ${expectedTone}`,
          severity: 'medium'
        });
      }
    });

    // Verificar se tem palavras preferidas
    const preferredCount = (checks.preferred || []).filter(word =>
      text_lower.includes(word.toLowerCase())
    ).length;

    if (preferredCount === 0 && expectedTone !== 'direto') {
      validation.warnings.push({
        reason: `Adicione mais palavras características do tom ${expectedTone}`,
        suggestion: checks.preferred
      });
    }

    return validation;
  },

  // Aplicar correções automáticas
  autoCorrect(text) {
    let corrected = text;

    // Correções automáticas básicas
    const autoCorrections = {
      /nós\s+colocamos/gi: 'nos colocamos',
      /a\s+fim\s+de/gi: 'a fim de',
      /afim\s+de/gi: 'a fim de',
      /me\s+contactem/gi: 'entrem em contato',
      /aonde\s+/gi: 'onde ',
      /\s{2,}/g: ' ', // Espaços duplos
      /([.!?])\s*([.!?])/g: '$1', // Pontuação dupla
    };

    Object.entries(autoCorrections).forEach(([pattern, replacement]) => {
      corrected = corrected.replace(new RegExp(pattern), replacement);
    });

    return corrected;
  },

  // Gerar relatório completo de validação
  validateEmail(emailBody, tone = 'cordial') {
    const report = {
      score: 100,
      issues: [],
      warnings: [],
      suggestions: [],
      corrected_text: this.autoCorrect(emailBody)
    };

    // Verificações
    const spelling = this.checkSpelling(emailBody);
    const grammar = this.checkGrammar(emailBody);
    const toneValidation = this.validateTone(emailBody, tone);

    // Agregar resultados
    report.issues.push(...spelling);
    report.issues.push(...grammar);
    report.issues.push(...(toneValidation.issues || []));
    report.warnings.push(...(toneValidation.warnings || []));

    // Calcular score (100 - penalidades)
    report.issues.forEach(issue => {
      if (issue.severity === 'high') report.score -= 15;
      else if (issue.severity === 'medium') report.score -= 8;
      else report.score -= 3;
    });

    report.warnings.forEach(() => {
      report.score -= 2;
    });

    report.score = Math.max(0, report.score);

    return report;
  },

  // Sugerir melhorias gerais
  suggestImprovements(emailBody) {
    const suggestions = [];

    const wordCount = emailBody.split(/\s+/).length;
    const charCount = emailBody.length;

    // Comprimento ideal
    if (wordCount < 50) {
      suggestions.push({
        type: 'length',
        message: 'Email muito curto. Considere adicionar mais contexto.',
        severity: 'low'
      });
    } else if (wordCount > 300) {
      suggestions.push({
        type: 'length',
        message: 'Email muito longo. Tente ser mais conciso.',
        severity: 'medium'
      });
    }

    // Verificar se tem saudação
    if (!emailBody.match(/^[^a-z]*(pessoal|prezado|caro)/i)) {
      suggestions.push({
        type: 'greeting',
        message: 'Adicione uma saudação apropriada no início.',
        severity: 'medium'
      });
    }

    // Verificar se tem fechamento
    if (!emailBody.match(/(obrigada|fico no aguardo|atenciosamente)/i)) {
      suggestions.push({
        type: 'closing',
        message: 'Adicione um fechamento apropriado no final.',
        severity: 'medium'
      });
    }

    // Verificar se tem CTA (call to action)
    if (!emailBody.match(/(poderiam|conseguem|pode|poderia|solicito)/i)) {
      suggestions.push({
        type: 'cta',
        message: 'Adicione um chamado à ação (ex: "poderiam verificar?").',
        severity: 'high'
      });
    }

    // Verificar mudanças de linha
    const paragraphs = emailBody.split('\n\n');
    if (paragraphs.length < 2) {
      suggestions.push({
        type: 'formatting',
        message: 'Divida o email em parágrafos para melhor legibilidade.',
        severity: 'low'
      });
    }

    return suggestions;
  }
};

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmailSpellChecker;
}

// Exportar para navegador
if (typeof window !== 'undefined') {
  window.EmailSpellChecker = EmailSpellChecker;
}

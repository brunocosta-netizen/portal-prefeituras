/**
 * Email Agent Autônomo para Portal de Prefeituras
 *
 * Funcionalidades:
 * - Monitora casos criados em tempo real
 * - Gera emails automáticos formatados
 * - Cria rascunhos no Gmail
 * - Sugere emails de cobrança baseado em tempo decorrido
 * - Usa padrão de comunicação real com prefeituras
 */

// Carrega o guia de comunicação (em browser, será global)
// Em Node.js, isso seria: const CommunicationGuide = require('./email-communication-guide');

class EmailAgent {
  constructor() {
    this.gmailApi = null;
    this.isInitialized = false;
    this.communicationGuide = typeof window !== 'undefined' && window.CommunicationGuide
      ? window.CommunicationGuide
      : null;
  }

  /**
   * Inicializa o agente (depois será autenticado via OAuth)
   */
  async initialize() {
    console.log('🤖 Agente de Emails inicializado');
    console.log('✓ Padrão: Comunicação direta e colaborativa com prefeituras');
    console.log('✓ Pronto para monitorar casos e gerar emails');
    this.isInitialized = true;
  }

  /**
   * Gera email automático para um novo caso
   * Usa o padrão real de comunicação com prefeituras
   * @param {Object} caso - Dados do caso
   * @returns {Object} Email formatado
   */
  generateEmailFromCase(caso) {
    const { nomePessoa, prefeitura, nomeCliente, cnpj, empresa, problema, emailOrgao } = caso;

    const assunto = this.generateSubject(empresa || nomeCliente, problema);
    let corpo = this.generateBody(nomeCliente, cnpj, empresa, problema, prefeitura);

    // Aplicar verificação ortográfica e gramatical
    if (typeof EmailSpellChecker !== 'undefined') {
      const validation = EmailSpellChecker.validateEmail(corpo, 'cordial');
      corpo = validation.corrected_text;

      console.log(`\n✏️  VALIDAÇÃO DE EMAIL:`);
      console.log(`   Score: ${validation.score}/100`);
      if (validation.issues.length > 0) {
        console.log(`   Problemas encontrados: ${validation.issues.length}`);
      }
      if (validation.warnings.length > 0) {
        console.log(`   Avisos: ${validation.warnings.length}`);
      }
    }

    return {
      to: emailOrgao || prefeitura,
      subject: assunto,
      body: corpo,
      htmlBody: `<html><body><pre>${corpo}</pre></body></html>`,
      sourceEmail: typeof oauthConfig !== 'undefined' ? oauthConfig.targetEmail : 'societario@caveo.com.br',
    };
  }

  /**
   * Gera assunto simples e direto
   */
  generateSubject(cliente, problema) {
    // Assunto mais curto e direto, sem [CAVEO]
    const problemaAbreviado = problema.substring(0, 40).trim();
    return `${cliente} - ${problemaAbreviado}`;
  }

  /**
   * Gera corpo do email seguindo o padrão de comunicação real
   * Padrão: Saudação → Contexto → Problema → Pedido → Agradecimento
   */
  generateBody(nomeCliente, cnpj, empresa, problema, prefeitura) {
    // Saudação
    const greetings = [
      "Pessoal, bom dia!",
      "Pessoal, bom dia! Tudo bem?",
      "Pessoal, boa tarde! Tudo bem?"
    ];
    let corpo = greetings[Math.floor(Math.random() * greetings.length)] + "\n\n";

    // Contexto + Problema (explicação direta)
    corpo += this.generateContextAndProblem(nomeCliente, cnpj, empresa, problema) + "\n\n";

    // Pedido de ação
    const requests = [
      "Poderiam verificar, por gentileza?",
      "Conseguem verificar para nós?",
      "Poderiam nos orientar sobre como prosseguir?",
      "Se puderem nos ajudar, agradeço!"
    ];
    corpo += requests[Math.floor(Math.random() * requests.length)] + "\n\n";

    // Fechamento
    corpo += "Obrigada!";

    // Adiciona menção de anexo se necessário
    if (this.shouldMentionAttachment(problema)) {
      corpo += "\n\nObs: Documentação em anexo.";
    }

    return corpo;
  }

  /**
   * Gera a seção de contexto e problema do email
   * Segue o padrão: "O que deveria acontecer, o que está acontecendo"
   */
  generateContextAndProblem(nomeCliente, cnpj, empresa, problema) {
    const contexts = [
      `Preciso de ajuda com a situação desse cliente.`,
      `Gostaria de verificar a situação desse processo.`,
      `Identificamos uma inconsistência que precisa de ajuda.`,
      `Precisamos de uma ajuda com esse processo.`,
      `Passando para verificar se conseguem nos apoiar.`
    ];

    let contextLine = contexts[Math.floor(Math.random() * contexts.length)];
    let content = contextLine + "\n\n";

    // Adiciona informações chave do cliente
    if (nomeCliente) content += `Cliente: ${nomeCliente}\n`;
    if (cnpj) content += `CNPJ: ${cnpj}\n`;
    if (empresa) content += `Empresa: ${empresa}\n`;

    // Adiciona o problema explicado
    content += `\nProblema: ${problema}`;

    return content;
  }

  /**
   * Verifica se deve mencionar anexo
   */
  shouldMentionAttachment(problema) {
    const attachmentKeywords = ['anexo', 'documento', 'arquivo', 'comprovante', 'planilha', 'relatório', 'documentação'];
    return attachmentKeywords.some(keyword => problema.toLowerCase().includes(keyword));
  }

  /**
   * Gera email inteligente de cobrança baseado no tempo decorrido
   * Usa tom progressivo: cortês → urgente → formal
   * @param {Object} caso - Dados do caso
   * @param {number} diasDecorridos - Dias desde a criação
   * @returns {Object} Email de cobrança formatado
   */
  generateFollowUpEmail(caso, diasDecorridos) {
    const { nomeCliente, empresa } = caso;

    let tom = '';
    if (diasDecorridos <= 2) {
      tom = 'cortês';
    } else if (diasDecorridos <= 5) {
      tom = 'urgente';
    } else {
      tom = 'formal';
    }

    const assunto = `Atualização: ${nomeCliente}${empresa ? ` (${empresa})` : ''}`;
    const corpo = this.generateFollowUpBody(nomeCliente, empresa, diasDecorridos, tom);

    return {
      to: caso.emailOrgao,
      subject: assunto,
      body: corpo,
      htmlBody: `<html><body><pre>${corpo}</pre></body></html>`,
      sourceEmail: typeof oauthConfig !== 'undefined' ? oauthConfig.targetEmail : 'societario@caveo.com.br',
      diasDecorridos: diasDecorridos,
      tom: tom,
    };
  }

  /**
   * Gera corpo do email de follow-up com tom apropriado
   * Mantém o padrão de comunicação direta e colaborativa
   */
  generateFollowUpBody(nomeCliente, empresa, diasDecorridos, tom) {
    let corpo = "";

    if (tom === 'cortês') {
      // 1-2 dias: tom consultivo e amigável
      corpo = `Pessoal, bom dia! Tudo bem?\n\n`;
      corpo += `Gostaria de verificar se temos alguma atualização sobre o caso abaixo.\n\n`;
      corpo += `Cliente: ${nomeCliente}${empresa ? ` (${empresa})` : ''}\n`;
      corpo += `Dias decorridos: ${diasDecorridos}\n\n`;
      corpo += `Entramos em contato anteriormente sobre essa solicitação, porém ainda não identificamos a atualização no sistema.\n\n`;
      corpo += `Poderiam verificar, por gentileza, se existe alguma previsão de retorno ou liberação?\n\n`;
      corpo += `Obrigada!`;
    }
    else if (tom === 'urgente') {
      // 3-5 dias: tom mais direto e insistente
      corpo = `Pessoal, bom dia!\n\n`;
      corpo += `Passando para verificar se conseguem nos apoiar com o caso abaixo.\n\n`;
      corpo += `Cliente: ${nomeCliente}${empresa ? ` (${empresa})` : ''}\n`;
      corpo += `Dias decorridos: ${diasDecorridos}\n\n`;
      corpo += `Ainda não identificamos a atualização solicitada e precisamos dessa informação para dar continuidade ao processo do cliente.\n\n`;
      corpo += `Poderiam verificar, por gentileza?\n\n`;
      corpo += `Obrigada!`;
    }
    else {
      // 5+ dias: tom formal mas ainda colaborativo
      corpo = `Pessoal, bom dia!\n\n`;
      corpo += `Preciso de uma ajuda com esse processo, por gentileza.\n\n`;
      corpo += `Cliente: ${nomeCliente}${empresa ? ` (${empresa})` : ''}\n`;
      corpo += `Dias decorridos: ${diasDecorridos}\n\n`;
      corpo += `Identificamos que a solicitação está sem atualização há ${diasDecorridos} dias. Poderiam verificar se o processo está em análise ou se existe alguma pendência que esteja impedindo o andamento?\n\n`;
      corpo += `Fico no aguardo. Obrigada!`;
    }

    // Aplicar verificação ortográfica e gramatical
    if (typeof EmailSpellChecker !== 'undefined') {
      const validation = EmailSpellChecker.validateEmail(corpo, tom);
      corpo = validation.corrected_text;

      console.log(`\n✏️  VALIDAÇÃO DE EMAIL (${tom}):`);
      console.log(`   Score: ${validation.score}/100`);
    }

    return corpo;
  }

  /**
   * Cria rascunho no Gmail (será implementado após autenticação OAuth)
   * @param {Object} email - Objeto com dados do email
   * @returns {Promise<Object>} Resultado da criação
   */
  async createGmailDraft(email) {
    if (!this.gmailApi) {
      console.warn('⚠️ Gmail API não autenticada ainda');
      return {
        status: 'pending',
        message: 'Email será criado após autenticação OAuth',
        draft: email,
      };
    }

    try {
      console.log(`✉️ Criando rascunho no Gmail para: ${email.to}`);
      // Implementação real com Gmail API virá aqui
      return {
        status: 'success',
        message: 'Rascunho criado com sucesso',
        draftId: 'draft_' + Date.now(),
      };
    } catch (error) {
      console.error('❌ Erro ao criar rascunho:', error);
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  /**
   * Processa um caso criado no portal
   * @param {Object} caso - Dados do caso do localStorage
   */
  async processNewCase(caso) {
    console.log(`\n🔔 Novo caso detectado: ${caso.nomeCliente}`);

    // 1. Gera email automaticamente
    const email = this.generateEmailFromCase(caso);
    console.log(`✓ Email gerado:`);
    console.log(`  Destinatário: ${email.to}`);
    console.log(`  Assunto: ${email.subject}`);

    // 2. Cria rascunho no Gmail
    const resultado = await this.createGmailDraft(email);
    console.log(`✓ ${resultado.message}`);

    return {
      caseId: caso.id || Date.now(),
      email: email,
      resultado: resultado,
    };
  }

  /**
   * Processa pedido de cobrança/follow-up
   * @param {Object} caso - Dados do caso
   * @param {number} diasDecorridos - Dias desde a criação
   */
  async processFollowUp(caso, diasDecorridos) {
    console.log(`\n📧 Gerando email de cobrança: ${caso.nomeCliente} (${diasDecorridos} dias)`);

    // 1. Gera email de cobrança inteligente
    const email = this.generateFollowUpEmail(caso, diasDecorridos);
    console.log(`✓ Email de ${email.tom} gerado`);
    console.log(`  Assunto: ${email.subject}`);

    // 2. Cria rascunho no Gmail
    const resultado = await this.createGmailDraft(email);
    console.log(`✓ ${resultado.message}`);

    return {
      caseId: caso.id || Date.now(),
      email: email,
      resultado: resultado,
    };
  }
}

// Exportar para Node.js (se aplicável)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmailAgent;
}

// Exportar para navegador (global)
if (typeof window !== 'undefined') {
  window.EmailAgent = EmailAgent;
}

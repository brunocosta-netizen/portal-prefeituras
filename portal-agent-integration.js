/**
 * Integração do Agente de Emails com o Portal
 *
 * Usa o novo padrão de comunicação:
 * - Conversacional e direto
 * - Saudação + Contexto + Problema + Pedido + Agradecimento
 * - Tons progressivos baseado em tempo decorrido
 */

class PortalAgentIntegration {
  constructor() {
    this.agent = new EmailAgent();
    this.ultimosCasosProcessados = new Set();
    this.monitoringActive = false;
    this.monitoringInterval = null;
  }

  /**
   * Inicializa a integração e o agente
   */
  async init() {
    console.log('🚀 Iniciando integração Portal + Agente de Emails...');

    // Inicializa o agente
    await this.agent.initialize();

    // Inicia monitoramento de casos
    this.startMonitoring();

    console.log('✅ Integração iniciada com sucesso');
  }

  /**
   * Inicia monitoramento em tempo real dos casos no localStorage
   */
  startMonitoring() {
    if (this.monitoringActive) return;
    this.monitoringActive = true;

    // Monitora localStorage a cada 2 segundos
    this.monitoringInterval = setInterval(() => {
      this.checkForNewCases();
    }, 2000);

    // Também escuta eventos de armazenamento local
    window.addEventListener('storage', (e) => {
      if (e.key === 'cases') {
        this.checkForNewCases();
      }
    });

    console.log('👁️  Monitoramento ativado - aguardando novos casos...');
  }

  /**
   * Verifica se há novos casos e os processa
   */
  checkForNewCases() {
    const casesStorage = localStorage.getItem('cases');
    if (!casesStorage) return;

    try {
      const cases = JSON.parse(casesStorage);
      cases.forEach((caso) => {
        const caseKey = `${caso.nomePessoa}_${caso.nomeCliente}_${caso.prefeitura}`;

        // Se é um caso novo
        if (!this.ultimosCasosProcessados.has(caseKey)) {
          this.ultimosCasosProcessados.add(caseKey);
          this.onNewCaseDetected(caso);
        }
      });
    } catch (e) {
      console.error('❌ Erro ao processar casos:', e);
    }
  }

  /**
   * Callback quando um novo caso é detectado
   * Usa o novo padrão de email conversacional
   */
  async onNewCaseDetected(caso) {
    console.log(`\n🔔 NOVO CASO DETECTADO: ${caso.nomeCliente}`);
    console.log(`   Órgão: ${caso.prefeitura}`);
    console.log(`   Email para: ${caso.emailOrgao}`);

    // Gera email com novo padrão (email-agent.js)
    const email = this.agent.generateEmailFromCase(caso);

    console.log(`\n✉️  EMAIL GERADO (NOVO PADRÃO):`);
    console.log(`   Destinatário: ${email.to}`);
    console.log(`   Assunto: ${email.subject}`);
    console.log(`   Status: Pronto para rascunho`);

    // Cria rascunho simulado (será conectado ao Gmail API depois)
    this.createDraftSimulation(email);

    // Emite evento customizado para validação
    this.dispatchCaseEvent('emailGenerated', {
      email: email,
      case: caso
    });
  }

  /**
   * Gera email de follow-up/cobrança com tom apropriado
   */
  generateFollowUpEmail(caso, diasDecorridos) {
    return this.agent.generateFollowUpEmail(caso, diasDecorridos);
  }

  /**
   * Simula criação de rascunho (será conectado ao Gmail API depois)
   */
  createDraftSimulation(email) {
    const draftId = 'draft_' + Date.now();
    console.log(`\n   📎 ID do rascunho: ${draftId}`);
    console.log(`   ⏳ Aguardando autenticação OAuth para Gmail...`);
    console.log(`   📋 Assunto: ${email.subject}`);

    // Aqui será implementado o createGmailDraft() do email-agent
    if (this.agent && this.agent.createGmailDraft) {
      this.agent.createGmailDraft(email).then(resultado => {
        console.log(`   ✅ Resultado: ${resultado.status}`);
        console.log(`   💬 ${resultado.message}`);
      });
    }
  }

  /**
   * Emite eventos customizados para a aplicação
   */
  dispatchCaseEvent(eventName, detail) {
    const event = new CustomEvent(`portal:${eventName}`, { detail });
    window.dispatchEvent(event);
  }

  /**
   * Para o monitoramento
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.monitoringActive = false;
    console.log('⏸️  Monitoramento pausado');
  }
}

// Inicializa automaticamente quando o DOM está pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Aguarda carregamento do email-agent.js
    if (typeof EmailAgent !== 'undefined') {
      const integration = new PortalAgentIntegration();
      integration.init();
      window.portalAgent = integration; // Expõe globalmente
    } else {
      console.warn('⚠️  EmailAgent não carregado - aguarde o carregamento...');
      setTimeout(() => {
        if (typeof EmailAgent !== 'undefined') {
          const integration = new PortalAgentIntegration();
          integration.init();
          window.portalAgent = integration;
        }
      }, 1000);
    }
  });
} else {
  if (typeof EmailAgent !== 'undefined') {
    const integration = new PortalAgentIntegration();
    integration.init();
    window.portalAgent = integration;
  }
}

/**
 * Guia de Comunicação com Prefeituras - Padrão de Voz Caveo
 *
 * Este arquivo contém os exemplos reais de comunicação que o agente deve reproduzir.
 * Tom: cordial, profissional, direto, colaborativo, simples, sem excesso de formalidade
 */

const CommunicationGuide = {
  // Padrão estrutural preferencial
  structure: {
    greeting: [
      "Pessoal, bom dia!",
      "Pessoal, boa tarde! Tudo bem?",
      "Pessoal, bom dia! Tudo bem?"
    ],
    contextStarters: [
      "Preciso de ajuda com...",
      "Gostaria de verificar...",
      "Identificamos uma inconsistência...",
      "Precisamos de ajuda com...",
      "Passando para verificar se conseguem nos apoiar com..."
    ],
    problemExplanation: "Explicação objetiva: o que aconteceu, o que deveria acontecer, o que está acontecendo",
    actionRequest: [
      "Poderiam verificar, por gentileza?",
      "Conseguem verificar para nós?",
      "Poderiam nos orientar sobre como prosseguir?",
      "Poderiam nos informar, por gentileza?",
      "Se puderem nos orientar sobre o procedimento correto, agradeço!"
    ],
    closing: [
      "Obrigada!",
      "Fico no aguardo. Obrigada!",
      "Agradeço!"
    ]
  },

  // Exemplos reais de comunicação
  examples: [
    {
      id: 1,
      type: "alvara_liberacao",
      title: "Solicitação de liberação de alvará",
      fullEmail: `Pessoal, bom dia! Tudo bem?

Preciso de ajuda com a liberação do alvará desse cliente. Ao tentar consultar, a informação ainda não está disponível no sistema.

Normalmente, a liberação ocorre um dia após a emissão do CNPJ. Poderiam verificar, por gentileza, se existe alguma pendência ou previsão para disponibilização?

Obrigada!`,
      keyPhrase: "Preciso de ajuda com a liberação do alvará",
      tone: "cordial",
      structure: ["greeting", "context", "problem", "request", "closing"]
    },
    {
      id: 2,
      type: "alvara_nao_aparece",
      title: "Alvará não disponível para consulta",
      fullEmail: `Pessoal, bom dia!

Poderiam verificar, por gentileza, a situação do alvará desse cliente?

O CNPJ já foi emitido, porém, ao realizar a consulta no sistema da Prefeitura, o alvará ainda não aparece disponível.

Conseguem verificar se existe alguma inconsistência ou pendência que esteja impedindo a liberação?

Obrigada!`,
      keyPhrase: "Poderiam verificar a situação do alvará",
      tone: "direto"
    },
    {
      id: 3,
      type: "status_update",
      title: "Solicitação de atualização de status",
      fullEmail: `Pessoal, bom dia! Tudo bem?

Gostaria de verificar o status da solicitação desse cliente.

O processo já foi enviado, porém ainda não tivemos atualização no sistema. Poderiam verificar, por gentileza, se existe alguma pendência ou se é necessário realizar alguma ação adicional?

Obrigada!`,
      keyPhrase: "Gostaria de verificar o status",
      tone: "profissional"
    },
    {
      id: 4,
      type: "processo_parado",
      title: "Processo parado / sem atualização",
      fullEmail: `Pessoal, bom dia!

Preciso de uma ajuda com esse processo, por gentileza.

Identificamos que a solicitação está sem atualização no sistema há alguns dias. Poderiam verificar se o processo está em análise ou se existe alguma pendência que esteja impedindo o andamento?

Fico no aguardo. Obrigada!`,
      keyPhrase: "Processo sem atualização",
      tone: "colaborativo"
    },
    {
      id: 5,
      type: "integracao_sistemas",
      title: "Problema de integração entre sistemas",
      fullEmail: `Pessoal, bom dia!

Precisamos de ajuda com uma inconsistência identificada na integração entre os sistemas.

A solicitação foi realizada corretamente, porém a informação ainda não está sendo apresentada no sistema da Prefeitura.

Poderiam verificar, por gentileza, se existe alguma instabilidade ou inconsistência na integração?

Obrigada!`,
      keyPhrase: "Inconsistência na integração",
      tone: "direto"
    },
    {
      id: 6,
      type: "sistema_indisponivel",
      title: "Sistema da Prefeitura indisponível",
      fullEmail: `Pessoal, bom dia!

Estamos tentando realizar a consulta desse cliente, porém o sistema não está disponibilizando as informações necessárias no momento.

Poderiam verificar, por gentileza, se existe alguma instabilidade no sistema ou previsão para normalização?

Obrigada!`,
      keyPhrase: "Sistema não disponibilizando informações",
      tone: "profissional"
    },
    {
      id: 7,
      type: "correcao_info",
      title: "Solicitação de correção de informação",
      fullEmail: `Pessoal, bom dia!

Preciso de ajuda com uma informação que consta divergente no sistema da Prefeitura.

Os dados do cliente foram enviados corretamente, porém identificamos uma inconsistência na informação apresentada na consulta.

Poderiam verificar, por gentileza, e nos orientar sobre a possibilidade de correção?

Obrigada!`,
      keyPhrase: "Informação divergente no sistema",
      tone: "profissional"
    },
    {
      id: 8,
      type: "liberacao_apos_correcao",
      title: "Solicitação de liberação após correção",
      fullEmail: `Pessoal, bom dia!

Após a correção da pendência, poderiam verificar, por gentileza, a liberação do processo desse cliente?

A documentação/informação necessária já foi ajustada, porém a solicitação ainda consta sem liberação no sistema.

Conseguem verificar para nós?

Obrigada!`,
      keyPhrase: "Liberação após correção",
      tone: "direto"
    },
    {
      id: 9,
      type: "prefeitura_informou_pendencia",
      title: "Prefeitura informou que existe pendência",
      fullEmail: `Pessoal, bom dia!

Recebemos a informação de que existe uma pendência nesse processo, porém não conseguimos identificar qual ajuste precisa ser realizado.

Poderiam nos informar, por gentileza, qual é a pendência identificada e se existe alguma ação necessária da nossa parte?

Obrigada!`,
      keyPhrase: "Pendência não identificada",
      tone: "colaborativo"
    },
    {
      id: 10,
      type: "orientacao_procedimento",
      title: "Pedido de orientação sobre procedimento",
      fullEmail: `Pessoal, bom dia!

Poderiam nos orientar, por gentileza, sobre como devemos prosseguir nesse caso?

Ao realizar o procedimento pelo sistema, identificamos uma situação diferente do fluxo habitual e não conseguimos concluir a solicitação.

Se puderem nos orientar sobre o procedimento correto, agradeço!`,
      keyPhrase: "Situação diferente do fluxo habitual",
      tone: "simples"
    },
    {
      id: 11,
      type: "prioridade_impacto",
      title: "Solicitação de prioridade por impacto operacional",
      fullEmail: `Pessoal, bom dia!

Precisamos de uma ajuda com esse processo, por gentileza.

A solicitação está pendente de liberação e isso está impactando a continuidade do processo do cliente.

Poderiam verificar se é possível analisar e realizar a liberação?

Obrigada!`,
      keyPhrase: "Impactando a continuidade",
      tone: "profissional"
    },
    {
      id: 12,
      type: "retorno_contato_anterior",
      title: "Retorno após contato anterior",
      fullEmail: `Pessoal, bom dia!

Gostaria de verificar se temos alguma atualização sobre o caso abaixo.

Entramos em contato anteriormente sobre essa solicitação, porém ainda não identificamos a atualização no sistema.

Poderiam verificar, por gentileza, se existe alguma previsão de retorno ou liberação?

Obrigada!`,
      keyPhrase: "Retorno do contato anterior",
      tone: "cordial"
    },
    {
      id: 13,
      type: "cobranca_educada",
      title: "Cobrança educada",
      fullEmail: `Pessoal, bom dia!

Passando para verificar se conseguem nos apoiar com o caso abaixo.

Ainda não identificamos a atualização solicitada e precisamos dessa informação para dar continuidade ao processo do cliente.

Poderiam verificar, por gentileza?

Obrigada!`,
      keyPhrase: "Precisamos dessa informação para dar continuidade",
      tone: "direto"
    },
    {
      id: 14,
      type: "solicitacao_cnpj",
      title: "Solicitação relacionada ao CNPJ",
      fullEmail: `Pessoal, bom dia!

Preciso de ajuda com a solicitação desse cliente.

O CNPJ já foi emitido, porém ainda não conseguimos identificar a liberação/atualização da informação no sistema da Prefeitura.

Poderiam verificar, por gentileza, se o processo já foi recebido e se existe alguma pendência para seguirmos?

Obrigada!`,
      keyPhrase: "CNPJ emitido, mas sem liberação",
      tone: "profissional"
    },
    {
      id: 15,
      type: "chamado_rapido",
      title: "Exemplo mais curto — padrão para chamados rápidos",
      fullEmail: `Pessoal, bom dia!

Poderiam verificar, por gentileza, a situação desse processo?

O CNPJ já foi emitido, porém o alvará ainda não está disponível para consulta no sistema.

Conseguem verificar se existe alguma pendência ou previsão de liberação?

Obrigada!`,
      keyPhrase: "Situação rápida do processo",
      tone: "direto"
    }
  ],

  // Padrões a EVITAR
  toAvoid: [
    "textos muito longos",
    "linguagem excessivamente jurídica",
    "palavras difíceis sem necessidade",
    "cobrança agressiva",
    "repetir a mesma informação várias vezes",
    "frases como 'venho por meio deste'",
    "excesso de formalidade",
    "colocar muitas informações antes de explicar o problema"
  ],

  // Padrão geral recomendado
  recommendedPattern: "Contexto → Problema → Impacto/Necessidade → Pedido de Ação → Agradecimento",

  // Termos preferidos
  preferredTerms: {
    greeting: ["Pessoal", "bom dia", "boa tarde", "Tudo bem?"],
    helping: ["Preciso de ajuda", "Precisamos de ajuda", "Poderiam nos apoiar"],
    checking: ["Poderiam verificar", "Conseguem verificar", "Gostaria de verificar"],
    politeness: ["por gentileza", "agradeço", "Obrigada"],
    collaboration: ["nos orientar", "conseguem verificar para nós", "poderiam nos informar"],
    urgency: ["impactando", "precisamos dessa", "está pendente"]
  },

  // Métodos auxiliares
  getExampleByType: function(type) {
    return this.examples.find(e => e.type === type);
  },

  getRandomExample: function() {
    return this.examples[Math.floor(Math.random() * this.examples.length)];
  },

  getExampleByCaseType: function(caseType) {
    const typeMap = {
      'fiscal': [1, 2, 3, 4, 13, 15],
      'contratacao': [5, 6, 7, 8, 10, 11],
      'ambiental': [9, 12, 14],
      'alvara': [1, 2, 8, 14, 15]
    };

    const relevantIds = typeMap[caseType] || [1, 2, 3];
    const randomId = relevantIds[Math.floor(Math.random() * relevantIds.length)];
    return this.examples.find(e => e.id === randomId);
  },

  // Verificar se tem anexo mencionado
  shouldMentionAttachment: function(problemDescription) {
    const attachmentKeywords = ['anexo', 'documento', 'arquivo', 'comprovante', 'planilha', 'relatório'];
    return attachmentKeywords.some(keyword => problemDescription.toLowerCase().includes(keyword));
  }
};

// Exportar para Node.js (se aplicável)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CommunicationGuide;
}

// Exportar para navegador (global)
if (typeof window !== 'undefined') {
  window.CommunicationGuide = CommunicationGuide;
}

const USER_ROLES = {
    CLIENT: 'client',
    CONSULTANT: 'consultant',
    LEADER: 'leader',
    ALLOCATION: 'allocation',
    MASTER: 'master'
  };
  
  let currentUser = {
    role: USER_ROLES.CLIENT,
    name: 'Usuário Convidado'
  };
  
  let financialData = {
    initialAmount: 0,
    goalAmount: 0,
    monthlyContribution: 0,
    timePeriod: 0,
    profitabilityType: 'fixa',
    profitabilityValue: 0,
    financialGoal: '',
    riskProfile: 'moderado'
  };
  
  let interactions = [];
  
  // Inicialização da Aplicação (AJUSTADO)
  document.addEventListener('DOMContentLoaded', function() {
    // Carrega primeiro os dados salvos
    loadFromLocalStorage();
    
    // Depois inicializa a aplicação
    initializeApplication();
    setupEventListeners();
    
    // Atualiza a UI com o perfil carregado
    updateUIForRole();
  });
  
  // Funções de Controle de Usuário (CORRIGIDAS)
  function handleLogin() {
    const roleSelect = document.getElementById('user-role');
    if (!roleSelect) {
      console.error('Elemento user-role não encontrado');
      return;
    }
  
    currentUser = {
      role: roleSelect.value,
      name: `Usuário ${roleSelect.options[roleSelect.selectedIndex].text}`
    };
  
    updateUIForRole();
    saveToLocalStorage();
    showNotification(`Bem-vindo, ${currentUser.name}!`, 'success');
  }
  
  function handleLogout() {
    currentUser = {
      role: USER_ROLES.CLIENT,
      name: 'Usuário Convidado'
    };
    
    updateUIForRole();
    saveToLocalStorage();
    showNotification('Você saiu do sistema', 'info');
  }
  
  function updateUIForRole() {
    const role = currentUser.role;
    
    // 1. Atualiza seção de login/logout
    const loginSection = document.getElementById('login-section');
    const userInfo = document.getElementById('user-info');
    
    if (loginSection && userInfo) {
      if (role !== USER_ROLES.CLIENT) {
        loginSection.style.display = 'none';
        userInfo.style.display = 'flex';
        const currentRoleElement = document.getElementById('current-role');
        if (currentRoleElement) currentRoleElement.textContent = currentUser.name;
      } else {
        loginSection.style.display = 'flex';
        userInfo.style.display = 'none';
      }
    }
  
    // 2. Atualiza elementos específicos por perfil (MELHORADO)
    const roleElements = {
      consultant: [USER_ROLES.CONSULTANT, USER_ROLES.LEADER, USER_ROLES.MASTER],
      leader: [USER_ROLES.LEADER, USER_ROLES.MASTER],
      allocation: [USER_ROLES.ALLOCATION, USER_ROLES.MASTER],
      master: [USER_ROLES.MASTER]
    };
  
    Object.entries(roleElements).forEach(([className, validRoles]) => {
      document.querySelectorAll(`.${className}-only`).forEach(el => {
        el.style.display = validRoles.includes(role) ? 'block' : 'none';
      });
    });
  
    // 3. Atualiza menu ativo (MANTIDO)
    document.querySelectorAll('#main-menu a').forEach(link => {
      link.classList.remove('active');
    });
    
    const activeLink = document.querySelector('#main-menu a[data-section="dashboard"]');
    if (activeLink) activeLink.classList.add('active');
  }
  
  // Persistência (CORRIGIDA)
  function saveToLocalStorage() {
    try {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('financialData', JSON.stringify(financialData));
      localStorage.setItem('interactions', JSON.stringify(interactions));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  }
  
  function loadFromLocalStorage() {
    try {
      const savedUser = localStorage.getItem('currentUser');
      const savedData = localStorage.getItem('financialData');
      const savedInteractions = localStorage.getItem('interactions');
      
      if (savedUser) currentUser = JSON.parse(savedUser);
      if (savedData) financialData = JSON.parse(savedData);
      if (savedInteractions) interactions = JSON.parse(savedInteractions);
    } catch (e) {
      console.error('Erro ao carregar do localStorage:', e);
    }
  }
  {
    
    // Inicializa gráficos
    initializeCharts();
  }
  
  function setupEventListeners() {
    // Sistema de Login
    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Formulário Financeiro
    document.getElementById('finance-form').addEventListener('submit', handleFinancialFormSubmit);
    document.getElementById('objetivo').addEventListener('change', handleGoalChange);
    document.getElementById('rentabilidade-tipo').addEventListener('change', updateProfitabilitySuffix);
    
    // Interações
    document.getElementById('interaction-form').addEventListener('submit', handleInteractionSubmit);
    
    // Botões de Ação
    document.getElementById('export-pdf').addEventListener('click', exportToPDF);
    document.getElementById('what-if-btn').addEventListener('click', runWhatIfSimulation);
    document.getElementById('simular-fgc').addEventListener('click', simulateFGCCoverage);
    document.getElementById('anbima-btn').addEventListener('click', fetchAnbimaData);
    document.getElementById('run-holding-sim').addEventListener('click', runHoldingSimulation);
    
    // Botões de Navegação
    document.getElementById('public-link').addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'publico.html';
    });
  }
  
  // Funções de Controle de Usuário
  function handleLogin() {
    const selectedRole = document.getElementById('user-role').value;
    currentUser.role = selectedRole;
    
    // Simula login - em produção, isso seria feito com autenticação real
    currentUser.name = `Usuário ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`;
    
    updateUIForRole();
    saveToLocalStorage();
    
    // Mostra mensagem de boas-vindas
    showNotification(`Bem-vindo, ${currentUser.name}!`, 'success');
  }
  
  function handleLogout() {
    currentUser = {
      role: USER_ROLES.CLIENT,
      name: 'Usuário Convidado'
    };
    
    updateUIForRole();
    saveToLocalStorage();
    
    showNotification('Você saiu do sistema', 'info');
  }
  
  function updateUIForRole() {
    // Atualiza a interface baseado no perfil do usuário
    const role = currentUser.role;
    
    // Atualiza seções visíveis
    document.querySelectorAll('.consultant-only').forEach(el => {
      el.style.display = role === USER_ROLES.CONSULTANT || 
                        role === USER_ROLES.LEADER || 
                        role === USER_ROLES.MASTER ? 'block' : 'none';
    });
    
    document.querySelectorAll('.leader-only').forEach(el => {
      el.style.display = role === USER_ROLES.LEADER || 
                        role === USER_ROLES.MASTER ? 'block' : 'none';
    });
    
    document.querySelectorAll('.allocation-only').forEach(el => {
      el.style.display = role === USER_ROLES.ALLOCATION || 
                        role === USER_ROLES.MASTER ? 'block' : 'none';
    });
    
    document.querySelectorAll('.master-only').forEach(el => {
      el.style.display = role === USER_ROLES.MASTER ? 'block' : 'none';
    });
    
    // Atualiza informações do usuário
    const userInfoElement = document.getElementById('user-info');
    const currentRoleElement = document.getElementById('current-role');
    
    if (role !== USER_ROLES.CLIENT) {
      userInfoElement.classList.add('visible');
      currentRoleElement.textContent = currentUser.name;
      document.getElementById('login-section').style.display = 'none';
    } else {
      userInfoElement.classList.remove('visible');
      document.getElementById('login-section').style.display = 'flex';
    }
    
    // Ativa menu correspondente
    document.querySelectorAll('#main-menu a').forEach(link => {
      link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`#main-menu a[data-section="dashboard"]`);
    if (activeLink) activeLink.classList.add('active');
  }
  
  // Funções de Navegação
  function showSection(sectionId) {
    // Esconde todas as seções
    document.querySelectorAll('section').forEach(section => {
      section.classList.remove('active-section');
      section.classList.add('hidden-section');
    });
    
    // Mostra a seção selecionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active-section');
      targetSection.classList.remove('hidden-section');
    }
    
    // Atualiza menu ativo
    document.querySelectorAll('#main-menu a').forEach(link => {
      link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`#main-menu a[data-section="${sectionId}"]`);
    if (activeLink) activeLink.classList.add('active');
  }
  
  // Funções do Formulário Financeiro
  function handleFinancialFormSubmit(e) {
    e.preventDefault();
    
    // Coleta dados do formulário
    financialData = {
      initialAmount: parseFloat(document.getElementById('patrimonio-inicial').value) || 0,
      goalAmount: parseFloat(document.getElementById('patrimonio-meta').value) || 0,
      monthlyContribution: parseFloat(document.getElementById('aporte-mensal').value) || 0,
      timePeriod: parseInt(document.getElementById('tempo').value) || 0,
      profitabilityType: document.getElementById('rentabilidade-tipo').value,
      profitabilityValue: parseFloat(document.getElementById('rentabilidade-valor').value) || 0,
      financialGoal: document.getElementById('objetivo').value,
      riskProfile: document.getElementById('perfil-risco').value || 'moderado'
    };
    
    // Validações básicas
    if (financialData.timePeriod <= 0) {
      showNotification('O período deve ser maior que zero', 'error');
      return;
    }
    
    // Processa os dados
    processFinancialData();
    saveToLocalStorage();
    
    // Mostra resultados
    showSection('dashboard');
    showNotification('Dados financeiros atualizados com sucesso!', 'success');
  }
  
  function handleGoalChange() {
    const goal = document.getElementById('objetivo').value;
    const customGoalContainer = document.getElementById('custom-goal-container');
    
    if (goal === 'outro') {
      customGoalContainer.classList.remove('hidden');
      document.getElementById('objetivo-personalizado').required = true;
    } else {
      customGoalContainer.classList.add('hidden');
      document.getElementById('objetivo-personalizado').required = false;
    }
  }
  
  function updateProfitabilitySuffix() {
    const type = document.getElementById('rentabilidade-tipo').value;
    const suffix = document.getElementById('rentabilidade-sufixo');
    
    if (type === 'cdi-percent') {
      suffix.textContent = '% do CDI';
    } else {
      suffix.textContent = '% a.a.';
    }
  }
  
  // Processamento de Dados Financeiros
  function processFinancialData() {
    const { initialAmount, monthlyContribution, timePeriod, profitabilityType, profitabilityValue } = financialData;
    
    // Calcula evolução patrimonial
    let months = [];
    let values = [];
    let currentAmount = initialAmount;
    
    for (let i = 0; i <= timePeriod; i++) {
      months.push(i);
      values.push(currentAmount);
      
      if (i < timePeriod) {
        // Aplica rentabilidade
        const monthlyProfit = calculateMonthlyProfit(currentAmount, profitabilityType, profitabilityValue);
        currentAmount += monthlyContribution + monthlyProfit;
      }
    }
    
    // Atualiza gráficos
    updateCharts(months, values, currentAmount);
    
    // Atualiza informações do FGC
    updateFGCCoverage(currentAmount);
    
    // Atualiza sugestões de rebalanceamento
    updateRebalancementSuggestions();
  }
  
  function calculateMonthlyProfit(amount, type, value) {
    if (!value || value === 0) return 0;
    
    const monthlyRates = {
      'fixa': value / 12 / 100,
      'ipca': (getIPCA() + value) / 12 / 100, // IPCA + X%
      'cdi': (getCDI() + value) / 12 / 100,   // CDI + X%
      'cdi-percent': (getCDI() * value / 100) / 12 / 100 // X% do CDI
    };
    
    return amount * (monthlyRates[type] || 0);
  }
  
  // Funções de Gráficos
  function initializeCharts() {
    window.comparisonChart = new Chart(
      document.getElementById('graficoComparacao').getContext('2d'),
      getComparisonChartConfig([], [])
    );
    
    window.allocationChart = new Chart(
      document.getElementById('graficoAlocacao').getContext('2d'),
      getAllocationChartConfig(0, 0)
    );
    
    window.simulationChart = new Chart(
      document.getElementById('simulation-chart').getContext('2d'),
      getComparisonChartConfig([], [])
    );
  }
  
  function updateCharts(months, values, currentAmount) {
    const goalAmount = financialData.goalAmount;
    
    // Atualiza gráfico de comparação
    window.comparisonChart.data.labels = months;
    window.comparisonChart.data.datasets[0].data = values;
    window.comparisonChart.update();
    
    // Atualiza gráfico de alocação
    window.allocationChart.data.datasets[0].data = [
      currentAmount,
      Math.max(goalAmount - currentAmount, 0)
    ];
    window.allocationChart.update();
  }
  
  function getComparisonChartConfig(labels, data) {
    return {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Crescimento Patrimonial',
          data: data,
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Evolução do Patrimônio'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `R$ ${context.raw.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return `R$ ${value.toLocaleString('pt-BR')}`;
              }
            }
          }
        }
      }
    };
  }
  
  function getAllocationChartConfig(current, target) {
    return {
      type: 'doughnut',
      data: {
        labels: ['Investido', 'Faltante'],
        datasets: [{
          data: [current, Math.max(target - current, 0)],
          backgroundColor: ['#27ae60', '#e74c3c'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Progresso em Relação à Meta'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: R$ ${context.raw.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              }
            }
          }
        }
      }
    };
  }
  
  // Funções de FGC
  function updateFGCCoverage(currentAmount) {
    const fgcLimit = 250000;
    const coverage = calculateFGCCoverage(currentAmount);
    const percentage = Math.min((coverage / fgcLimit) * 100, 100);
    
    document.querySelector('.fgc-progress').style.width = `${percentage}%`;
    
    const statusElement = document.getElementById('fgc-status');
    if (coverage <= fgcLimit) {
      statusElement.innerHTML = 'Status: <span class="safe">Dentro do limite</span>';
    } else {
      statusElement.innerHTML = 'Status: <span class="danger">Acima do limite</span>';
    }
  }
  
  function calculateFGCCoverage(amount) {
    // Simulação - em produção, isso seria calculado por ativo/emissor
    return amount * 0.3; // Assume que 30% do patrimônio está em produtos com FGC
  }
  
  function simulateFGCCoverage() {
    const currentAmount = financialData.initialAmount + 
                         (financialData.monthlyContribution * financialData.timePeriod);
    
    const maxAmount = 250000 / 0.3; // Considerando 30% em produtos com FGC
    const suggestedContribution = (maxAmount - financialData.initialAmount) / financialData.timePeriod;
    
    showNotification(
      `Para ficar dentro do limite do FGC, seu aporte mensal máximo sugerido é R$ ${suggestedContribution.toFixed(2)}`,
      'info'
    );
  }
  
  // Funções de Interação
  function handleInteractionSubmit(e) {
    e.preventDefault();
    
    const newInteraction = {
      date: document.getElementById('interaction-date').value,
      type: document.getElementById('interaction-type').value,
      notes: document.getElementById('interaction-notes').value,
      consultant: currentUser.name
    };
    
    interactions.push(newInteraction);
    addInteractionToHistory(newInteraction);
    
    // Limpa o formulário
    e.target.reset();
    
    saveToLocalStorage();
    showNotification('Interação registrada com sucesso!', 'success');
  }
  
  function addInteractionToHistory(interaction) {
    const interactionsList = document.getElementById('interactions-list');
    
    // Remove mensagem de lista vazia se existir
    const emptyMessage = interactionsList.querySelector('.empty-message');
    if (emptyMessage) emptyMessage.remove();
    
    const interactionTypes = {
      'whatsapp': 'WhatsApp',
      'ligacao': 'Ligação',
      'reuniao-presencial': 'Reunião Presencial',
      'reuniao-video': 'Reunião por Vídeo',
      'email': 'E-mail'
    };
    
    const interactionItem = document.createElement('div');
    interactionItem.className = 'interaction-item';
    interactionItem.innerHTML = `
      <strong>${formatDate(interaction.date)}</strong> - 
      ${interactionTypes[interaction.type]}<br>
      ${interaction.notes}<br>
      <small>Registrado por: ${interaction.consultant}</small>
    `;
    
    interactionsList.prepend(interactionItem);
  }
  
  // Funções de Simulação
  function runWhatIfSimulation() {
    const simulationType = document.getElementById('simulation-type').value;
    let simulationResults = { ...financialData };
    
    // Aplica modificações baseadas no tipo de simulação
    switch (simulationType) {
      case 'aporte':
        simulationResults.monthlyContribution *= 1.2; // Aumenta 20%
        break;
      case 'tempo':
        simulationResults.timePeriod = Math.floor(simulationResults.timePeriod * 0.8); // Reduz 20%
        break;
      case 'rentabilidade':
        simulationResults.profitabilityValue *= 1.1; // Aumenta 10%
        break;
    }
    
    // Calcula cenário simulado
    let months = [];
    let values = [];
    let currentAmount = simulationResults.initialAmount;
    
    for (let i = 0; i <= simulationResults.timePeriod; i++) {
      months.push(i);
      values.push(currentAmount);
      
      if (i < simulationResults.timePeriod) {
        const monthlyProfit = calculateMonthlyProfit(
          currentAmount,
          simulationResults.profitabilityType,
          simulationResults.profitabilityValue
        );
        currentAmount += simulationResults.monthlyContribution + monthlyProfit;
      }
    }
    
    // Atualiza gráfico de simulação
    window.simulationChart.data.labels = months;
    window.simulationChart.data.datasets[0].data = values;
    window.simulationChart.update();
    
    // Mostra resultados
    const simulationResultsElement = document.getElementById('simulation-results');
    simulationResultsElement.classList.remove('hidden');
    
    const detailsElement = document.getElementById('simulation-details');
    detailsElement.innerHTML = `
      <p><strong>Simulação:</strong> ${getSimulationDescription(simulationType)}</p>
      <p><strong>Patrimônio final projetado:</strong> R$ ${currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p><strong>Diferença:</strong> R$ ${(currentAmount - (financialData.initialAmount + (financialData.monthlyContribution * financialData.timePeriod))).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    `;
  }
  
  function getSimulationDescription(type) {
    const descriptions = {
      'aporte': 'Aumento de 20% nos aportes mensais',
      'tempo': 'Redução de 20% no período de investimento',
      'rentabilidade': 'Aumento de 10% na rentabilidade'
    };
    return descriptions[type] || 'Simulação personalizada';
  }
  
  // Funções de ANBIMA (simuladas)
  function fetchAnbimaData() {
    // Simulação - em produção, faria uma chamada à API da ANBIMA
    showNotification('Conectando à ANBIMA...', 'info');
    
    setTimeout(() => {
      // Valores simulados
      const simulatedData = {
        ipca: 5.5,  // IPCA acumulado últimos 12 meses
        cdi: 13.25, // CDI anual
        selic: 13.75 // Taxa Selic
      };
      
      document.getElementById('rentabilidade-valor').value = simulatedData.cdi.toFixed(2);
      showNotification('Dados da ANBIMA carregados com sucesso!', 'success');
    }, 1500);
  }
  
  function getIPCA() {
    // Valor fixo para demonstração - em produção viria da ANBIMA
    return 5.5;
  }
  
  function getCDI() {
    // Valor fixo para demonstração - em produção viria da ANBIMA
    return 13.25;
  }
  
  // Funções de Holding/Offshore
  function runHoldingSimulation() {
    // Cálculos complexos simplificados para demonstração
    const { initialAmount, monthlyContribution, timePeriod } = financialData;
    const totalAmount = initialAmount + (monthlyContribution * timePeriod);
    
    const holdingCosts = {
      creation: 15000,
      annual: 5000,
      taxSavings: totalAmount * 0.015 // 1.5% de economia fiscal
    };
    
    const years = timePeriod / 12;
    const totalCosts = holdingCosts.creation + (holdingCosts.annual * years);
    const netBenefit = holdingCosts.taxSavings - totalCosts;
    
    const resultHTML = `
      <h4>Análise de Viabilidade</h4>
      <p><strong>Custo Total:</strong> R$ ${totalCosts.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p><strong>Economia Fiscal Estimada:</strong> R$ ${holdingCosts.taxSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p><strong>Resultado Líquido:</strong> R$ ${netBenefit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p><strong>Recomendação:</strong> ${netBenefit > 0 ? 'Viável' : 'Não viável'}</p>
    `;
    
    document.getElementById('holding-analysis').innerHTML = resultHTML;
    showNotification('Simulação de holding concluída!', 'success');
  }
  
  // Funções de Rebalanceamento
  function updateRebalancementSuggestions() {
    const { financialGoal, riskProfile } = financialData;
    let suggestions = [];
    
    // Lógica simplificada de sugestão baseada em objetivo e perfil
    if (financialGoal === 'aposentadoria') {
      suggestions = riskProfile === 'conservador' 
        ? ['50% Renda Fixa', '30% Fundos Imobiliários', '20% Ações Dividendárias']
        : riskProfile === 'moderado'
          ? ['40% Renda Fixa', '30% Ações', '20% Fundos Imobiliários', '10% ETFs Internacionais']
          : ['30% Renda Fixa', '40% Ações', '20% Private Equity', '10% Criptomoedas'];
    } else if (financialGoal === 'imovel') {
      suggestions = ['60% CDB/LCI/LCA', '30% Fundos Imobiliários', '10% Ações'];
    } else {
      suggestions = ['70% Renda Fixa', '30% Fundos Balanceados'];
    }
    
    const suggestionsHTML = suggestions.map(item => `<li>${item}</li>`).join('');
    document.getElementById('assets-suggestion').innerHTML = `
      <p>Para seu objetivo de <strong>${financialGoal}</strong> e perfil <strong>${riskProfile}</strong>, sugerimos:</p>
      <ul>${suggestionsHTML}</ul>
    `;
  }
  
  // Funções de Exportação
  function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Adiciona conteúdo ao PDF
    doc.setFontSize(18);
    doc.text('Relatório Financeiro - Portfel', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Cliente: ${currentUser.name}`, 20, 40);
    doc.text(`Data: ${formatDate(new Date().toISOString())}`, 20, 50);
    
    // Adiciona dados financeiros
    doc.text('Dados Financeiros:', 20, 70);
    doc.text(`Patrimônio Inicial: R$ ${financialData.initialAmount.toLocaleString('pt-BR')}`, 30, 80);
    doc.text(`Meta: R$ ${financialData.goalAmount.toLocaleString('pt-BR')}`, 30, 90);
    doc.text(`Aporte Mensal: R$ ${financialData.monthlyContribution.toLocaleString('pt-BR')}`, 30, 100);
    doc.text(`Período: ${financialData.timePeriod} meses`, 30, 110);
    
    // Adiciona gráficos (simplificado)
    doc.addPage();
    doc.text('Gráficos de Análise', 105, 20, { align: 'center' });
    
    // Em produção, usaria html2canvas para capturar os gráficos reais
    doc.text('Gráfico de Evolução Patrimonial', 20, 40);
    doc.text('(Incluir imagem do gráfico aqui)', 20, 50);
    
    doc.addPage();
    doc.text('Gráfico de Alocação', 105, 20, { align: 'center' });
    doc.text('(Incluir imagem do gráfico aqui)', 20, 40);
    
    // Salva o PDF
    doc.save(`relatorio_portfel_${new Date().toISOString().split('T')[0]}.pdf`);
    showNotification('PDF gerado com sucesso!', 'success');
  }
  
  // Funções Auxiliares
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }
  
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }
  
  // Persistência de Dados
  function saveToLocalStorage() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('financialData', JSON.stringify(financialData));
    localStorage.setItem('interactions', JSON.stringify(interactions));
  }
  
  function loadFromLocalStorage() {
    const savedUser = localStorage.getItem('currentUser');
    const savedData = localStorage.getItem('financialData');
    const savedInteractions = localStorage.getItem('interactions');
    
    if (savedUser) currentUser = JSON.parse(savedUser);
    if (savedData) financialData = JSON.parse(savedData);
    if (savedInteractions) interactions = JSON.parse(savedInteractions);
  }
    
    // Preenche formulários com dados salvos
    if (financialData) {
      document.getElementById('patrimonio-inicial').value = financialData.initialAmount || '';
      document.getElementById('patrimonio-meta').value = financialData.goalAmount || '';
      document.getElementById('aporte-mensal').value = financialData.monthlyContribution || '';
      document.getElementById('tempo').value = financialData.timePeriod || '';
      document.getElementById('rentabilidade-tipo').value = financialData.profitabilityType || 'fixa';
      document.getElementById('rentabilidade-valor').value = financialData.profitabilityValue || '';
      document.getElementById('objetivo').value = financialData.financialGoal || '';
      document.getElementById('perfil-risco').value = financialData.riskProfile || 'moderado';
      
      update
    }
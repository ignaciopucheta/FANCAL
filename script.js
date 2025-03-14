const calendar = document.getElementById('calendar');
const totalIncomeElem = document.getElementById('total-income');
const netResultElem = document.getElementById('net-result');
const yearElem = document.getElementById('year');
const prevYearLabel = document.getElementById('prev-year-label');
const nextYearLabel = document.getElementById('next-year-label');
const monthElem = document.getElementById('month');
const prevMonthLabel = document.getElementById('prev-month-label');
const nextMonthLabel = document.getElementById('next-month-label');
const financialForm = document.getElementById('financial-form');
const dayInput = document.getElementById('day');
const dateInput = document.getElementById('date');
const nameInput = document.getElementById('name');
const valueInput = document.getElementById('value');
const categoryInput = document.getElementById('category');
const typeSwitchReceita = document.getElementById('type-switch-receita');
const typeSwitchDespesa = document.getElementById('type-switch-despesa');

const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
let currentYear = 2025;
let currentMonth = 2; // Março

let financialData = [];

// Retorna o número de dias em um mês específico de um ano específico
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

// Renderiza os dias do mês no calendário
function renderDays() {
    calendar.innerHTML = `
        <div class="day">Dom</div>
        <div class="day">Seg</div>
        <div class="day">Ter</div>
        <div class="day">Qua</div>
        <div class="day">Qui</div>
        <div class="day">Sex</div>
        <div class="day">Sab</div>
    `;

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDayElem = document.createElement('div');
        emptyDayElem.className = 'day faded';
        calendar.appendChild(emptyDayElem);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayElem = document.createElement('div');
        dayElem.className = 'day';
        dayElem.textContent = i;
        dayElem.addEventListener('click', () => openFinancialModal(i));
        calendar.appendChild(dayElem);
    }
}

// Renderiza o calendário com os dados financeiros
function renderCalendar() {
    renderDays();

    financialData.forEach(entry => {
        const date = new Date(entry.date);
        if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
            const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
            const dayElem = calendar.querySelector(`.day:nth-child(${date.getDate() + firstDayOfMonth + 7})`);
            if (dayElem) {
                dayElem.classList.add(entry.type === 'receita' ? 'income' : 'expense');
            }
        }
    });
}

// Atualiza os rótulos do ano no calendário
function updateYearLabels() {
    prevYearLabel.textContent = currentYear - 1;
    yearElem.textContent = currentYear;
    nextYearLabel.textContent = currentYear + 1;
}

// Atualiza os rótulos do mês no calendário
function updateMonthLabels() {
    prevMonthLabel.textContent = months[(currentMonth - 1 + 12) % 12];
    monthElem.textContent = months[currentMonth];
    nextMonthLabel.textContent = months[(currentMonth + 1) % 12];
}

// Abre o modal para adicionar ou editar um lançamento financeiro
function openFinancialModal(day) {
    const data = financialData.find(entry => new Date(entry.date).getDate() === day) || { date: '', name: '', value: 0, category: '', type: '' };
    dayInput.value = day;
    dateInput.value = data.date;
    nameInput.value = data.name;
    valueInput.value = data.value;
    categoryInput.value = data.category;
    typeSwitchReceita.checked = data.type === 'receita';
    typeSwitchDespesa.checked = data.type === 'despesa';
    financialForm.style.display = 'flex';
}

// Evento para abrir o modal de novo lançamento
document.getElementById('new-entry').addEventListener('click', () => {
    financialForm.style.display = 'flex';
});

// Evento para salvar o lançamento financeiro
financialForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const day = dayInput.value;
    const date = dateInput.value;
    const name = nameInput.value;
    const value = parseFloat(valueInput.value);
    const category = categoryInput.value;
    const type = typeSwitchReceita.checked ? 'receita' : 'despesa';
    const entry = { day, date, name, value, category, type };
    financialData.push(entry);
    updateSummary();
    saveFinancialData(entry);
    financialForm.style.display = 'none';
});

// Evento para cancelar o modal de novo lançamento
document.getElementById('cancel').addEventListener('click', () => {
    financialForm.style.display = 'none';
});

// Alterna os disjuntores para garantir que apenas um esteja ligado por vez
typeSwitchReceita.addEventListener('change', () => {
    if (typeSwitchReceita.checked) {
        typeSwitchDespesa.checked = false;
    }
});

typeSwitchDespesa.addEventListener('change', () => {
    if (typeSwitchDespesa.checked) {
        typeSwitchReceita.checked = false;
    }
});

// Salva os dados financeiros no servidor
function saveFinancialData(entry) {
    console.log('Salvando dados financeiros:', entry);
    fetch('http://localhost:3001/save', { // Certifique-se de usar a URL correta
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar dados financeiros');
        }
        return response.text();
    }).then(data => {
        console.log('Resposta do servidor:', data);
        updateSummary();
        renderCalendar();
    }).catch(error => console.error('Error:', error));
}

// Atualiza o resumo financeiro
function updateSummary() {
    const totalIncome = financialData.reduce((sum, entry) => sum + (entry.type === 'receita' ? entry.value : 0), 0);
    const totalExpense = financialData.reduce((sum, entry) => sum + (entry.type === 'despesa' ? entry.value : 0), 0);
    const netResult = totalIncome - totalExpense;

    totalIncomeElem.innerHTML = `R$${totalIncome.toFixed(2)}<br>Saldo do Mês`;
    netResultElem.innerHTML = `R$${netResult.toFixed(2)}<br>Saldo Geral *`;

    if (netResult >= 0) {
        netResultElem.classList.remove('negative-balance');
        netResultElem.classList.add('positive-balance');
    } else {
        netResultElem.classList.remove('positive-balance');
        netResultElem.classList.add('negative-balance');
    }
}

// Busca os dados financeiros do servidor
function fetchFinancialData() {
    console.log('Buscando dados financeiros do servidor');
    fetch('http://localhost:3001/data') // Certifique-se de usar a URL correta
        .then(response => response.json())
        .then(data => {
            console.log('Dados financeiros recebidos:', data);
            financialData = data;
            renderCalendar();
            updateSummary();
        })
        .catch(error => console.error('Erro ao buscar dados financeiros:', error));
}

// Verifica a conexão com o banco de dados
function checkDatabaseConnection() {
    console.log('Verificando conexão com o banco de dados');
    fetch('http://localhost:3001/data') // Certifique-se de usar a URL correta
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao conectar ao banco de dados');
            }
            return response.json();
        })
        .then(data => {
            console.log('Conexão com o banco de dados bem-sucedida');
            initializeCalendar();
        })
        .catch(error => {
            console.error('Erro ao conectar ao banco de dados:', error);
            alert('Erro ao conectar ao banco de dados. Verifique a conexão e tente novamente.');
        });
}

// Inicializa o calendário financeiro
function initializeCalendar() {
    alert("Bem-vindo ao Calendário Financeiro! Aqui você pode gerenciar suas receitas e despesas financeiras.");
    fetchFinancialData();
    updateYearLabels();
    updateMonthLabels();
    renderDays();
}

// Verifica a conexão com o banco de dados e inicializa o calendário
checkDatabaseConnection();

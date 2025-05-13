let index = 0;

function nextSlide() {
    const slides = document.querySelector(".slides");
    index = (index + 1) % 3; // Vai para o próximo slide, volta ao início após o último
    slides.style.transition = "transform 1s ease-in-out";
    slides.style.transform = `translateX(-${index * 100}%)`;
}

// Tempo de troca do slide: 10 segundos
setInterval(nextSlide, 7000);

function toggleNav() {
    const sidebar = document.querySelector(".nav-sidebar");
    const menuIcon = document.querySelector(".button-list i");

    // Alterna a classe 'active' para abrir/fechar a sidebar
    sidebar.classList.toggle("active");

    // Alterna o ícone entre "fa-bars" e "fa-times"
    if (sidebar.classList.contains("active")) {
        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-times");
    } else {
        menuIcon.classList.remove("fa-times");
        menuIcon.classList.add("fa-bars");
    }
}

function openLoginModal() {
    document.getElementById("loginModal").style.display = "flex";
}

function closeLoginModal() {
    document.getElementById("loginModal").style.display = "none";
}

// Fecha o modal ao clicar fora da caixa de login
window.onclick = function(event) {
    const modal = document.getElementById("loginModal");
    if (event.target === modal) {
        closeLoginModal();
    }
};




document.addEventListener("DOMContentLoaded", () => {
    const btnContato = document.getElementById("anchor");
    const secContato = document.getElementById("contato");
    const logoutBtn = document.getElementById("logoutBtn");
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return; // Evita erro se loginForm não existir

    // 🌐 Evento de rolagem suave para a seção de contato
    btnContato.addEventListener("click", (e) => {
      e.preventDefault();
      secContato.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // 🔐 Verifica se o usuário já está logado
    const token = localStorage.getItem("token");
    if (token) {
      replaceLoginButton();
    } else {
      logoutBtn.style.display = "none"; // Esconde botão de logout se não estiver logado
    }

    // ✨ Evento de login centralizado
    loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("senha").value;
      const conteudo = document.getElementById("conteudo");

  try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
        console.log("🚀 resposta do login:", data);
      if (response.ok) {
          localStorage.setItem("token", data.token);
          replaceLoginButton();

          loadPage("profile");
              closeLoginModal();
  } else {
          alert(data.error); // Exibe erro se login falhar
      }
  } catch (error) {
        console.error("🔥 Erro no login:", error);
    }
  });
});






document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const registerButton = document.querySelector('.register');

  if (!registerForm || !registerButton) return; // ignora se não estiver na página certa

  registerButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const first_name = document.getElementById('first_name')?.value;
    const last_name  = document.getElementById('last_name')?.value;
    const email      = document.getElementById('email')?.value;
    const password   = document.getElementById('password')?.value;
    const phone      = document.getElementById('phone')?.value;

    if (!first_name || !last_name || !email || !password || !phone) {
      alert('⚠️ Todos os campos são obrigatórios!');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name, last_name, email, password, phone })
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        window.location.href = '/index.html';
      } else {
        alert(result.error || 'Erro no cadastro');
      }

    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao cadastrar usuário.');
    }
  });
});

const token = localStorage.getItem('token'); // ou de onde você armazenar
fetch('http://localhost:3000/api/profile', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'x-auth-token': token
  }
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("profileContainer");
  if (!container) return; // Evita erro caso a página não tenha carregado corretamente

 
  if (!token) {
    alert("⚠️ Faça login primeiro.");
    window.location.href = "/";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token
      }
    });

    const user = await res.json();
    console.log("✅ Dados do perfil recebidos:", user); // 🔥 Verifica se os dados aparecem aqui

    // Insere os dados no HTML
    container.innerHTML = `
      <p><strong>Nome:</strong> ${user.name || "—"}</p>
      <p><strong>Email:</strong> ${user.email || "—"}</p>
      <p><strong>CPF:</strong> ${user.cpf || "—"}</p>
      <p><strong>Telefone:</strong> ${user.phone || "—"}</p>
      <p><strong>Data de Nascimento:</strong> ${user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : "—"}</p>
    `;

  } catch (err) {
    console.error("❌ Erro ao carregar perfil:", err);
    container.innerHTML = `<p style="color: red;">⚠️ Não foi possível carregar o perfil.</p>`;
  }
});






document.addEventListener('DOMContentLoaded', () => {
  const principalInput = document.getElementById('principal');
  const installmentsInput = document.getElementById('installments');
  const resultDiv = document.getElementById('result');

  // Função de cálculo em tempo real
  function calcularParcela() {
    const principal = parseFloat(principalInput.value);
    const installments = parseInt(installmentsInput.value, 10);
    const interestRate = 0.05; // 5% fixo ao mês

    // Validações básicas
    if (isNaN(principal) || principal <= 0 || isNaN(installments) || installments <= 0) {
      resultDiv.textContent = '';
      return;
    }

    // Juros simples: M = (P * (1 + i * n)) / n
    const monthlyPayment = (principal * (1 + interestRate * installments)) / installments;

    // Mostrar apenas o valor da parcela
    resultDiv.innerHTML = `Valor da Parcela: R$ ${monthlyPayment.toFixed(2)}
    <button type="submit" class="submit-btn">Confirmar Emprestimo</button>`;
  }

  // Atualiza toda vez que o usuário digita
  principalInput.addEventListener('input', calcularParcela);
  installmentsInput.addEventListener('input', calcularParcela);

  // Cálculo inicial caso haja valores padrão
  calcularParcela();
});



function replaceLoginButton() {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
    const userMenu = document.createElement("div");

  if (!loginBtn) return;

    // Ícone de usuário
  loginBtn.innerHTML = '<i class="fa fa-user-circle"></i>';
  loginBtn.onclick = null;
  // se quiser, redefina onclick ou adicione perfil:
  loginBtn.addEventListener('click', () => {
    // exibe menu de usuário ou perfil
  });

  logoutBtn.style.display = 'inline-block';
  logoutBtn.onclick     = logout;
}

function logout() {
  localStorage.removeItem('token');   // 1) apaga o token
  window.location.href = '/';         // 2) redireciona pro login
}

document.querySelectorAll("#link > a").forEach(link => {
  const conteudo = document.getElementById('conteudo')
  link.onclick = function(e) {
    e.preventDefault();
    fetch(link.href)
      .then(resp => resp.text())
      .then(html => {
        conteudo.innerHTML = html;
      })
      .catch(err => console.error('Erro:', err));
  }
});




function initLoanCalculator() {
  // Define as datas padrão
  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];
  startInput.value = formattedToday;

  // Define a data final para um mês depois
  const oneMonthLater = new Date(today);
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  const formattedOneMonthLater = oneMonthLater.toISOString().split("T")[0];
  endInput.value = formattedOneMonthLater;

  // Adiciona escuta para qualquer alteração nos inputs
  const inputs = document.querySelectorAll("#loanForm input, #loanForm select");
  inputs.forEach(input => {
    input.addEventListener("input", calcularEmprestimo);
  });

  // Chama o cálculo logo ao carregar para exibir resultados iniciais
  calcularEmprestimo();
}

function calcularEmprestimo() {
  // Captura os inputs e aplica trim
  const principalStr = document.getElementById("principal").value.trim();
  const interestRateStr = document.getElementById("interestRate").value.trim();

  // Se estiver vazio ou inválido, usa os valores padrão
  const principal = principalStr === "" || isNaN(parseFloat(principalStr)) ? 1000 : parseFloat(principalStr);
  const interestRatePercent = interestRateStr === "" || isNaN(parseFloat(interestRateStr)) ? 5 : parseFloat(interestRateStr);

  const interestType = document.getElementById("interestType").value;

  // Verifica se as datas estão preenchidas
  if (!document.getElementById("startDate").value || !document.getElementById("endDate").value) {
    document.getElementById("result").innerHTML = "";
    return;
  }

  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);
  const interestRate = interestRatePercent / 100; // Converter para decimal

  const months = calculateMonthsDifference(startDate, endDate);
  if (months <= 0) {
    document.getElementById("result").innerHTML = "Verifique as datas informadas. A data de término deve ser posterior à data do primeiro pagamento.";
    return;
  }

  let monthlyPayment;
  if (interestType === "composta") {
    monthlyPayment = (principal * interestRate * Math.pow(1 + interestRate, months)) /
                     (Math.pow(1 + interestRate, months) - 1);
  }else {
    monthlyPayment = (principal * (1 + 0.05 * months)) / months;
  }
  const totalAmount = monthlyPayment * months;
  document.getElementById("result").innerHTML = `
    Número de Parcelas: ${months}<br>
    Valor da Parcela: R$ ${monthlyPayment.toFixed(2)}<br>
    Total do Montante: R$ ${totalAmount.toFixed(2)}
  `;
}


/**
 * Calcula a diferença de meses entre duas datas.
 * Se a data final não completar um mês inteiro, ela é considerada como mês completo.
 */
function calculateMonthsDifference(start, end) {
  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months += end.getMonth() - start.getMonth();
  if (end.getDate() < start.getDate()) {
    months--;
  }
  return months;
}



fetch("https://brapi.dev/api/quote/list?sortBy=market_cap_basic&sortOrder=desc&limit=50&token=eJGEyu8vVHctULdVdHYzQd")
  .then(response => response.json())
  .then(data => {
    const stocks = data.stocks.slice(0, 50); // Pegamos apenas 50 ações para exibição
    const tickerBar = document.getElementById("ticker-bar");

    // Criar um contêiner para os itens e duplicá-los
    const tickerContent = document.createElement("div");
    tickerContent.classList.add("ticker-content");

    stocks.forEach(stock => {
      const stockItem = document.createElement("div");
      stockItem.classList.add("ticker-item");

      const stockLogo = document.createElement("img");
      stockLogo.src = stock.logo;
      stockLogo.alt = stock.stock;
      stockLogo.width = 20;

      const stockText = document.createElement("span");
      stockText.innerHTML = `${stock.stock}: <strong>${stock.change.toFixed(2)}%</strong>`;
      stockText.style.color = stock.change >= 0 ? "green" : "red";

      stockItem.appendChild(stockLogo);
      stockItem.appendChild(stockText);
      tickerContent.appendChild(stockItem);
    });

    // Duplicamos os itens para criar um loop infinito
    const tickerDuplicate = tickerContent.cloneNode(true);
    tickerBar.appendChild(tickerContent);
    tickerBar.appendChild(tickerDuplicate);
  })
  .catch(error => console.error("Erro ao buscar dados:", error));



  // Função para carregar os dados de ações de acordo com o range escolhido (padrão: "3mo") para o símbolo desejado (padrão: "BOVA11")
function loadStockData(range = "3mo", symbol = "BOVA11") {
    const token = "3P4iaVo32aM97jgbqNDVyu";
    const url = `https://brapi.dev/api/quote/${symbol}?range=${range}&interval=1d&fundamental=true&modules=summaryProfile&token=${token}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const result = data.results[0];
        // Atualiza as informações de mercado
        const marketTime = new Date(result.regularMarketTime);
        const stockInfoHTML = `
        <div class="stock-info">
            <svg>       
                <image href="${result.logourl}" height="50" width="50"></image>
            </svg>
            <h2> ${result.symbol} • BVMF</h2>
            <p>${result.longName}</p>
        </div>`;
        const stockValorHTML =`
        <div class="stock-valor">
            <p>R$${result.regularMarketPrice.toFixed(2)}  ${result.regularMarketChange.toFixed(2)}%</p>
            <p>${marketTime.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} · ${result.currency} </p>
        </div>
        
        `;
        document.getElementById("stock-info").innerHTML = stockInfoHTML;
        document.getElementById("stock-valor").innerHTML = stockValorHTML;
  
        // Prepara os dados do histórico para o gráfico
        const history = result.historicalDataPrice;
        const labels = history.map(item => {
          const d = new Date(item.date * 1000);
          return `${d.getDate()}/${d.getMonth() + 1}`;
        });
        const closePrices = history.map(item => item.close);
        
  
        // Cria (ou atualiza) o gráfico usando Chart.js
        const ctx = document.getElementById("lineChart").getContext("2d");
        if (window.myLineChart) {
          window.myLineChart.destroy();
        }
        window.myLineChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: `${result.symbol} - Fechamento`,
              data: closePrices,
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 0, 255, 0.1)',
              fill: false,
              tension: 0.2,
              pointRadius: 3,
              pointHoverRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,  // Permite que o canvas se ajuste à altura definida no CSS
            plugins: {
              tooltip: {
                enabled: true
              }
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: 'Data'
                }
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: 'Preço (BRL)'
                }
              }
            }
          }
        });
        
      })
      .catch(error => console.error("Erro ao carregar dados de ações:", error));
  }
  



  // Função acionada quando o usuário altera a faixa no seletor
function onRangeChange() {
    const range = document.getElementById("rangeSelect").value;
    loadStockData(range, "BOVA11");
}
  

// Chama a função para carregar os dados ao carregar a página (padrão: BOVA11 com faixa 1mo)
loadStockData("1mo", "BOVA11");
  




function toggleDarkTheme() {
    const body = document.body;
    const icon = document.querySelector(".dark-theme i");
    
    body.classList.toggle("dark-mode");
    
    if (body.classList.contains("dark-mode")) {
      icon.classList.remove("fa-moon-o");
      icon.classList.add("fa-sun-o");
      
    } else {
      icon.classList.remove("fa-sun-o");
      icon.classList.add("fa-moon-o");
    }
}
  

function moveLeft() {
  const container = document.querySelector(".emprestimos-container");
  container.scrollBy({ left: -300, behavior: 'smooth' });
  setTimeout(updateScrollArrows, 400);
}

function moveRight() {
  const container = document.querySelector(".emprestimos-container");
  container.scrollBy({ left: 300, behavior: 'smooth' });
  setTimeout(updateScrollArrows, 400);
}
  
  function updateScrollArrows() {
    const container = document.querySelector(".emprestimos-container");
    const leftArrow = document.querySelector(".scroll-arrow.left");
    const rightArrow = document.querySelector(".scroll-arrow.right");
    
    if (container.scrollLeft === 0) {
      leftArrow.classList.add("disabled");
    } else {
      leftArrow.classList.remove("disabled");
    }
    
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
      rightArrow.classList.add("disabled");
    } else {
      rightArrow.classList.remove("disabled");
    }
  }
  
  // Atualiza as setas sempre que o usuário rolar o container
  document.querySelector(".emprestimos-container").addEventListener('scroll', updateScrollArrows);
  
  // Chama updateScrollArrows na carga para definir o estado inicial
  updateScrollArrows();

  window.addEventListener('load', function() {
    const container = document.querySelector(".emprestimos-container");
    container.scrollLeft = 0;
    updateScrollArrows();
  });
  

  async function loadNews() {
    try {
      // 1) Busca do seu servidor, que já esconde o token
      const res = await fetch('/api/news');
      const data = await res.json();
      
      // 2) Normaliza para array  
      // se já for Array, ok;  
      // senão, tenta extrair de algum campo comum, ou vira vazio
      let newsArray = [];
      if (Array.isArray(data)) {
        newsArray = data;
      } else if (Array.isArray(data.news)) {
        newsArray = data.news;
      } else if (Array.isArray(data.articles)) {
        newsArray = data.articles;
      } else {
        console.warn('Resposta de /api/news não era array:', data);
      }
  
      // 3) Pega as 6 primeiras
      const newsItems = newsArray.slice(0, 6);
  
      // 4) Renderiza
      const container = document.getElementById('news-container');
      container.innerHTML = '';
      for (let item of newsItems) {
        // traduz a manchete
        const q = encodeURIComponent(item.headline);
        const gtUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=${q}`;
        const tResp = await fetch(gtUrl);
        const tJson = await tResp.json();
        const tituloPT = (tJson[0] && tJson[0][0] && tJson[0][0][0]) || item.headline;
  
        const div = document.createElement('div');
        div.classList.add('news-item');
        div.onclick = () => {
          const u = encodeURIComponent(item.url);
          window.open(`https://translate.google.com/translate?hl=pt&sl=auto&tl=pt&u=${u}`, '_blank');
        };
        const img = document.createElement('img');
        img.src = item.image || 'placeholder.jpg';
        img.alt = tituloPT;
        const h3 = document.createElement('h3');
        h3.textContent = tituloPT;
        div.append(img, h3);
        container.append(div);
      }
    } catch (err) {
      console.error('Erro ao carregar notícias:', err);
    }
  }
  
  // chama ao iniciar
  document.addEventListener('DOMContentLoaded', loadNews);





  
  document.querySelectorAll('[wm-nav]').forEach(link => {
    const conteudo = document.getElementById('conteudo')
    link.onclick = function (e) {
      e.preventDefault()
      fetch(link.getAttribute('wm-nav'))
        .then(resp => resp.text())
        .then(html => conteudo.innerHTML = html)
    }
  });
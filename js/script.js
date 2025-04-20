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







document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
      const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (response.ok) {
          localStorage.setItem('token', data.token); // Guarda o token
          window.location.href = '/cliente.html'; // Redireciona para página cliente
      } else {
          alert(data.error); // Exibe erro se login falhar
      }
  } catch (error) {
      console.error('Erro no login:', error);
  }
});









//acesso a fintech
document.querySelectorAll(".slider > a").forEach(link => {
  const conteudo = document.getElementById('conteudo')
  link.onclick = function(e) {
    e.preventDefault();
    fetch(link.href)
      .then(resp => resp.text())
      .then(html => {
        conteudo.innerHTML = html;
        // Após carregar o conteúdo, inicialize a calculadora
        initLoanCalculator();
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
  } else {
    monthlyPayment = (principal * (1 + interestRate * months)) / months;
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
  

  function loadNews() {
    const apiURL = "https://finnhub.io/api/v1/news?category=general&token=cumagt1r01qsaphv5uogcumagt1r01qsaphv5up0";
    
    fetch(apiURL)
      .then(response => response.json())
      .then(newsArray => {
        const newsContainer = document.getElementById("news-container");
        newsContainer.innerHTML = ""; // Limpa qualquer conteúdo anterior
        
        // Seleciona as 6 primeiras notícias
        const newsItems = newsArray.slice(0, 6);
        
        newsItems.forEach(item => {
          // Cria um elemento para a notícia
          const newsDiv = document.createElement("div");
          newsDiv.classList.add("news-item");
          
          // Quando clicado, redireciona para a versão traduzida da notícia
          newsDiv.onclick = function() {
            // Exemplo: usa o Google Translate (de auto para pt)
            const translateURL = "https://translate.google.com/translate?hl=pt&sl=auto&tl=pt&u=" + encodeURIComponent(item.url);
            window.open(translateURL, "_blank");
          };
          
          // Cria a imagem (se existir)
          const img = document.createElement("img");
          img.src = item.image || "placeholder.jpg"; // Use uma imagem padrão se não houver
          img.alt = item.headline;
          
          // Cria o container de texto (título e sumário)
          const textDiv = document.createElement("div");
          textDiv.classList.add("news-content");
          
          const title = document.createElement("h3");
          title.textContent = item.headline;
          
          const summary = document.createElement("p");
          summary.textContent = item.summary;
          
          // Anexa os elementos
          textDiv.appendChild(title);
          textDiv.appendChild(summary);
          
          newsDiv.appendChild(img);
          newsDiv.appendChild(textDiv);
          
          newsContainer.appendChild(newsDiv);
        });
        
        // (Opcional) Se desejar, insira alguma lógica para mostrar "Ver mais notícias" ou já está presente no HTML.
      })
      .catch(error => {
        console.error("Erro ao carregar notícias:", error);
      });
  }
  
  // Chama a função para carregar as notícias ao iniciar
  loadNews();
  
  document.querySelectorAll('[wm-nav]').forEach(link => {
    const conteudo = document.getElementById('conteudo')
    link.onclick = function (e) {
      e.preventDefault()
      fetch(link.getAttribute('wm-nav'))
        .then(resp => resp.text())
        .then(html => conteudo.innerHTML = html)
    }
  });
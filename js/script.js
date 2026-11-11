let index = 0;

function nextSlide() {
    const slides = document.querySelector(".slides");
    if (!slides) return;
    index = (index + 1) % 3; // Vai para o próximo slide, volta ao início após o último
    slides.style.transition = "transform 1s ease-in-out";
    slides.style.transform = `translateX(-${index * 100}%)`;
}

// Tempo de troca do slide: 10 segundos
setInterval(nextSlide, 7000);

function toggleNav() {
    const sidebar = document.querySelector(".nav-sidebar");
    const menuIcon = document.querySelector(".button-list i");
    if (!sidebar || !menuIcon) return;

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
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "flex";
}

function closeLoginModal() {
    console.log("🔒 Fechando modal de login...");
    const modal = document.getElementById("loginModal");
    if (modal) {
        modal.style.display = "none";
        modal.classList.add("hidden");
    }
}

// Fecha o modal ao clicar fora da caixa de login
window.onclick = function(event) {
    const modal = document.getElementById("loginModal");
    if (event.target === modal) {
        closeLoginModal();
    }
};

function loadPage() {
    window.location.href = `/index.html`;
}

function replaceLoginButton() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    if (!loginBtn) return;

    // Remove existing userMenu if any
    const existingMenu = document.getElementById("userMenu");
    if (existingMenu) existingMenu.remove();

    const userMenu = document.createElement("div");

    // Ícone de usuário
    loginBtn.innerHTML = '<i class="fa fa-user-circle"></i>';
    loginBtn.style.position = "relative";
    loginBtn.onclick = null;

    // Criar menu suspenso
    userMenu.id = "userMenu";
    userMenu.style.position = "absolute";
    userMenu.style.top = "35px";
    userMenu.style.right = "1px";
    userMenu.style.width = "190px";
    userMenu.style.backgroundColor = "#fff";
    userMenu.style.border = "1px solid #ccc";
    userMenu.style.padding = "10px";
    userMenu.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    userMenu.style.display = "none";
    userMenu.innerHTML = `
      <p><strong>Usuário: Admin</strong></p>
      <ul>
        <li><a href="../scr/User/profile.html" data-page="profile">Perfil</a></li>
        <li><a href="#" data-page="emprestimos">Empréstimos</a></li>
        <li><a href="#" data-page="preference">Preferências</a></li>
        <li><a href="#" id="logoutLink">Sair</a><i class="fa fa-sign-out"></i></li>
      </ul>
    `;

    // Adiciona o menu ao botão
    loginBtn.appendChild(userMenu);

    // Mostrar menu ao passar o mouse
    loginBtn.addEventListener("mouseenter", () => {
      userMenu.style.display = "block";
    });

    // Esconder menu ao sair do botão
    loginBtn.addEventListener("mouseleave", () => {
      userMenu.style.display = "none";
    });

    // Configurar evento de logout
    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) logoutLink.addEventListener("click", logout);

    if (logoutBtn) {
        logoutBtn.style.display = "inline-block";
        logoutBtn.onclick = logout;
    }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}

function loadPageByAttribute(selector, attribute) {
  document.querySelectorAll(selector).forEach(link => {
    const conteudo = document.getElementById("conteudo");

    link.onclick = function (e) {
      e.preventDefault();

      const url = attribute === "href" ? link.href : link.getAttribute(attribute);

      fetch(url)
        .then(resp => resp.text())
        .then(html => {
          if (conteudo) {
              conteudo.innerHTML = html;
              console.log(`✅ Página carregada: ${url}`);
          }
        })
        .catch(err => console.error(`❌ Erro ao carregar ${url}:`, err));
    };
  });
}

function initLoanCalculator() {
  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");
  if (!startInput || !endInput) return;

  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];
  startInput.value = formattedToday;

  const oneMonthLater = new Date(today);
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  const formattedOneMonthLater = oneMonthLater.toISOString().split("T")[0];
  endInput.value = formattedOneMonthLater;

  const inputs = document.querySelectorAll("#loanForm input, #loanForm select");
  inputs.forEach(input => {
    input.addEventListener("input", calcularEmprestimo);
  });

  calcularEmprestimo();
}

function calcularEmprestimo() {
  const principalEl = document.getElementById("principal");
  const interestRateEl = document.getElementById("interestRate");
  const interestTypeEl = document.getElementById("interestType");
  const resultEl = document.getElementById("result");
  const startEl = document.getElementById("startDate");
  const endEl = document.getElementById("endDate");

  if (!principalEl || !interestRateEl || !interestTypeEl || !resultEl || !startEl || !endEl) return;

  const principalStr = principalEl.value.trim();
  const interestRateStr = interestRateEl.value.trim();

  const principal = principalStr === "" || isNaN(parseFloat(principalStr)) ? 1000 : parseFloat(principalStr);
  const interestRatePercent = interestRateStr === "" || isNaN(parseFloat(interestRateStr)) ? 5 : parseFloat(interestRateStr);
  const interestType = interestTypeEl.value;

  if (!startEl.value || !endEl.value) {
    resultEl.innerHTML = "";
    return;
  }

  const startDate = new Date(startEl.value);
  const endDate = new Date(endEl.value);
  const interestRate = interestRatePercent / 100;

  const months = calculateMonthsDifference(startDate, endDate);
  if (months <= 0) {
    resultEl.innerHTML = "Verifique as datas informadas. A data de término deve ser posterior à data do primeiro pagamento.";
    return;
  }

  let monthlyPayment;
  if (interestType === "composta") {
    monthlyPayment = (principal * interestRate * Math.pow(1 + interestRate, months)) /
                     (Math.pow(1 + interestRate, months) - 1);
  } else {
    monthlyPayment = (principal * (1 + 0.05 * months)) / months;
  }
  const totalAmount = monthlyPayment * months;
  resultEl.innerHTML = `
    Número de Parcelas: ${months}<br>
    Valor da Parcela: R$ ${monthlyPayment.toFixed(2)}<br>
    Total do Montante: R$ ${totalAmount.toFixed(2)}
  `;
}

function calculateMonthsDifference(start, end) {
  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months += end.getMonth() - start.getMonth();
  if (end.getDate() < start.getDate()) {
    months--;
  }
  return months;
}

function loadStockTicker() {
  const tickerBar = document.getElementById("ticker-bar");
  if (!tickerBar) return;

  fetch("/api/stocks/list")
    .then(response => response.json())
    .then(data => {
      const stocks = data.stocks.slice(0, 50);
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

      const tickerDuplicate = tickerContent.cloneNode(true);
      tickerBar.appendChild(tickerContent);
      tickerBar.appendChild(tickerDuplicate);
    })
    .catch(error => console.error("Erro ao buscar dados:", error));
}

function loadStockData(range = "3mo", symbol = "BOVA11") {
    const infoEl = document.getElementById("stock-info");
    const valorEl = document.getElementById("stock-valor");
    if (!infoEl || !valorEl) return;

    const url = `/api/stock/${symbol}?range=${range}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const result = data.results[0];
        const marketTime = new Date(result.regularMarketTime);

        infoEl.innerHTML = `
        <div class="stock-info">
            <svg>
                <image href="${result.logourl}" height="50" width="50"></image>
            </svg>
            <h2> ${result.symbol} • BVMF</h2>
            <p>${result.longName}</p>
        </div>`;

        valorEl.innerHTML =`
        <div class="stock-valor">
            <p>R$${result.regularMarketPrice.toFixed(2)}  ${result.regularMarketChange.toFixed(2)}%</p>
            <p>${marketTime.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} · ${result.currency} </p>
        </div>`;

        const history = result.historicalDataPrice;
        const labels = history.map(item => {
          const d = new Date(item.date * 1000);
          return `${d.getDate()}/${d.getMonth() + 1}`;
        });
        const closePrices = history.map(item => item.close);

        const chartEl = document.getElementById("lineChart");
        if (!chartEl) return;
        const ctx = chartEl.getContext("2d");
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
            maintainAspectRatio: false,
            plugins: { tooltip: { enabled: true } },
            scales: {
              x: { display: true, title: { display: true, text: 'Data' } },
              y: { display: true, title: { display: true, text: 'Preço (BRL)' } }
            }
          }
        });
      })
      .catch(error => console.error("Erro ao carregar dados de ações:", error));
}

function onRangeChange() {
    const rangeEl = document.getElementById("rangeSelect");
    if (rangeEl) loadStockData(rangeEl.value, "BOVA11");
}

function toggleDarkTheme() {
    const body = document.body;
    const icon = document.querySelector(".dark-theme i");
    if (!icon) return;

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
  if (container) {
    container.scrollBy({ left: -300, behavior: 'smooth' });
    setTimeout(updateScrollArrows, 400);
  }
}

function moveRight() {
  const container = document.querySelector(".emprestimos-container");
  if (container) {
    container.scrollBy({ left: 300, behavior: 'smooth' });
    setTimeout(updateScrollArrows, 400);
  }
}

function updateScrollArrows() {
    const container = document.querySelector(".emprestimos-container");
    const leftArrow = document.querySelector(".scroll-arrow.left");
    const rightArrow = document.querySelector(".scroll-arrow.right");
    if (!container || !leftArrow || !rightArrow) return;

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

async function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    try {
      const res = await fetch('/api/news');
      const data = await res.json();

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

      const newsItems = newsArray.slice(0, 6);
      container.innerHTML = '';

      for (let item of newsItems) {
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

// Single Consolidated DOMContentLoaded Listener
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Sidebar & UI Initialization
    const btnContato = document.getElementById("anchor");
    const secContato = document.getElementById("contato");
    const logoutBtn = document.getElementById("logoutBtn");
    const loginForm = document.getElementById("loginForm");

    if (btnContato && secContato) {
        btnContato.addEventListener("click", (e) => {
            e.preventDefault();
            secContato.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    // 2. Authentication Check
    const token = localStorage.getItem("token");
    if (token) {
        replaceLoginButton();
    } else if (logoutBtn) {
        logoutBtn.style.display = "none";
    }

    // 3. Login Form Handler
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("senha").value;

            try {
                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem("token", data.token);
                    replaceLoginButton();
                    loadPage();
                    closeLoginModal();
                } else {
                    alert(data.error);
                }
            } catch (error) {
                console.error("🔥 Erro no login:", error);
            }
        });
    }

    // 4. Register Form Handler
    const registerForm = document.getElementById('registerForm');
    const registerButton = document.querySelector('.register');
    if (registerForm && registerButton) {
        registerButton.addEventListener('click', async (event) => {
            event.preventDefault();
            const name = document.getElementById('name')?.value;
            const cpf = document.getElementById('cpf')?.value;
            const date_of_birth = document.getElementById('date_of_birth')?.value;
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;
            const phone = document.getElementById('phone')?.value;

            if (!name || !cpf || !date_of_birth || !email || !password || !phone) {
                alert('⚠️ Todos os campos são obrigatórios!');
                return;
            }

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, cpf, date_of_birth, email, password, phone })
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
    }

    // 5. Profile Check
    const profileContainer = document.getElementById("profileContainer");
    if (profileContainer) {
        if (!token) {
            alert("⚠️ Faça login primeiro.");
            window.location.href = "/";
            return;
        }

        try {
            const res = await fetch("/api/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token
                }
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 400) {
                    localStorage.removeItem('token');
                    alert("⚠️ Sessão expirada. Faça login novamente.");
                    window.location.href = "/";
                    return;
                }
                throw new Error(`Erro ${res.status}: ${res.statusText}`);
            }

            const user = await res.json();
            profileContainer.innerHTML = `
                <p><strong>Nome:</strong> ${user.name || "—"}</p>
                <p><strong>Email:</strong> ${user.email || "—"}</p>
                <p><strong>CPF:</strong> ${user.cpf || "—"}</p>
                <p><strong>Telefone:</strong> ${user.phone || "—"}</p>
                <p><strong>Data de Nascimento:</strong> ${user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : "—"}</p>
            `;
        } catch (err) {
            console.error("❌ Erro ao carregar perfil:", err);
            profileContainer.innerHTML = `<p style="color: red;">⚠️ Não foi possível carregar o perfil.</p>`;
        }
    }

    // 6. Simple Loan Calculator Setup (from lines 215-246)
    const pInput = document.getElementById('principal');
    const iInput = document.getElementById('installments');
    const rDiv = document.getElementById('result');

    if (pInput && iInput && rDiv && !document.getElementById('loanForm')) {
        const calcularP = () => {
            const p = parseFloat(pInput.value);
            const inst = parseInt(iInput.value, 10);
            if (isNaN(p) || p <= 0 || isNaN(inst) || inst <= 0) {
                rDiv.textContent = '';
                return;
            }
            const monthlyP = (p * (1 + 0.05 * inst)) / inst;
            rDiv.innerHTML = `Valor da Parcela: R$ ${monthlyP.toFixed(2)}
            <button type="submit" class="submit-btn">Confirmar Emprestimo</button>`;
        };
        pInput.addEventListener('input', calcularP);
        iInput.addEventListener('input', calcularP);
        calcularP();
    }

    // 7. AJAX Page Loading Initialization
    loadPageByAttribute("[wm-nav]", "wm-nav");
    loadPageByAttribute("#link > a", "href");

    // 8. Advanced Loan Calculator Initialization
    if (document.getElementById("loanForm")) {
        initLoanCalculator();
    }

    // 9. Stock Market Data Initialization
    if (document.getElementById("ticker-bar")) {
        loadStockTicker();
    }
    if (document.getElementById("lineChart")) {
        loadStockData("1mo", "BOVA11");
    }

    // 10. News Loading
    if (document.getElementById('news-container')) {
        await loadNews();
    }

    // 11. Emprestimos Carousel Initialization
    const empContainer = document.querySelector(".emprestimos-container");
    if (empContainer) {
        empContainer.addEventListener('scroll', updateScrollArrows);
        updateScrollArrows();
        empContainer.scrollLeft = 0;
    }
});

// Final handling for window load to ensure everything is aligned
window.addEventListener('load', function() {
    const container = document.querySelector(".emprestimos-container");
    if (container) {
        container.scrollLeft = 0;
        updateScrollArrows();
    }
});

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault(); // impede envio do formulário
    console.log('Formulário interceptado!');
  });
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) {
      console.error('❌ Formulário não encontrado!');
      return;
    }
  
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // ✅ Impede redirecionamento do <form>
  
      const first_name = document.getElementById('first_name')?.value.trim();
      const last_name  = document.getElementById('last_name')?.value.trim();
      const email      = document.getElementById('email')?.value.trim();
      const password   = document.getElementById('password')?.value.trim();
      const phone      = document.getElementById('phone')?.value.trim();
  
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
          alert(`✅ ${result.message}`);
          // window.location.href = '/index.html'; // habilite só se quiser redirecionar
        } else {
          alert(`❌ Erro: ${result.error || 'Falha ao cadastrar usuário.'}`);
          console.error('Erro ao registrar:', result);
        }
  
      } catch (error) {
        alert('❌ Erro de rede ou servidor. Veja o console.');
        console.error('Erro inesperado ao registrar:', error);
      }
    });
  });
  
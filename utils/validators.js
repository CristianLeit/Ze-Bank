// Valida CPF: formato 000.000.000-00 e dígitos verificadores
function validarCPF(cpf) {
  if (!cpf) return false;
  const numeros = String(cpf).replace(/\D/g, '');
  if (numeros.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numeros)) return false; // rejeita todos os dígitos iguais

  const calcularDigito = (base) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += parseInt(base[i]) * (base.length + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const d1 = calcularDigito(numeros.slice(0, 9));
  const d2 = calcularDigito(numeros.slice(0, 10));
  return d1 === parseInt(numeros[9]) && d2 === parseInt(numeros[10]);
}

module.exports = { validarCPF };

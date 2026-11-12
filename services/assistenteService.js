/**
 * Serviço de respostas do assistente (Asyntia) para o domínio Zé Bank.
 * Recebe a mensagem do usuário via webhook e devolve uma resposta
 * baseada em palavras-chave do contexto do banco.
 */

const RESPOSTAS = [
  {
    palavras: ['emprestimo', 'emprestimos', 'crédito', 'credito', 'financiamento', 'parcela'],
    texto: 'No Zé Bank você pode simular e contratar empréstimos na página de Empréstimos. Faça login, acesse o menu "Empréstimos" e use a calculadora para ver taxas e parcelas antes de confirmar.',
  },
  {
    palavras: ['login', 'entrar', 'senha', 'acesso', 'cadastrar', 'registro', 'conta'],
    texto: 'Para acessar sua conta, clique em "Entrar" no topo da página. Se ainda não tem cadastro, use a página de Registro com seu CPF e e-mail. Esqueceu a senha? Fale com nosso suporte.',
  },
  {
    palavras: ['investimento', 'investir', 'ação', 'acoes', 'carteira', 'bolsa'],
    texto: 'Na página de Investimentos você acompanha o mercado em tempo real, com cotações de ações e notícias financeiras. Faça login para montar sua carteira.',
  },
  {
    palavras: ['notícia', 'noticias', 'mercado', 'cotação', 'cotacao', 'dólar', 'dolar'],
    texto: 'As notícias e cotações do mercado aparecem no ticker da página inicial e na página de Investimentos, atualizadas em tempo real via Finnhub.',
  },
  {
    palavras: ['perfil', 'dados', 'meus dados', 'informações pessoais'],
    texto: 'Para ver ou editar seus dados, faça login e acesse a página de Perfil. Lá ficam suas informações cadastrais e preferências.',
  },
  {
    palavras: ['tarifa', 'taxa', 'juros', 'custo', 'cobrança'],
    texto: 'As taxas e juros de cada empréstimo são mostrados na simulação, antes da contratação. O Zé Bank não cobra tarifa de manutenção de conta.',
  },
  {
    palavras: ['sobre', 'quem', 'instituição', 'instituicao', 'banco'],
    texto: 'O Zé Bank é um banco digital focado em empréstimos e investimentos simples e transparentes. Saiba mais na página "Sobre".',
  },
];

const RESPOSTA_PADRAO =
  'Posso ajudar com empréstimos, investimentos, login, perfil, taxas e notícias do mercado. O que você gostaria de saber? Para atendimento personalizado, use o formulário de contato da página inicial.';

/**
 * Remove acentos e normaliza para minúsculas, permitindo casar
 * "empréstimo" com a palavra-chave "emprestimo".
 */
function normalizar(texto) {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

class AssistenteService {
  /**
   * Gera a resposta do assistente para uma mensagem do usuário.
   * @param {string} mensagem
   * @returns {{reply: string, source: string}}
   */
  responder(mensagem) {
    const texto = normalizar(mensagem);

    for (const item of RESPOSTAS) {
      if (item.palavras.some((p) => texto.includes(normalizar(p)))) {
        return { reply: item.texto, source: 'ze-bank-faq' };
      }
    }

    return { reply: RESPOSTA_PADRAO, source: 'ze-bank-fallback' };
  }
}

module.exports = new AssistenteService();

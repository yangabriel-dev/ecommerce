/*
Objetivo 1 - quando clicar no botão de adicionar ao carrinho:
    - atualizar o contador
    - adicionar o produto no localStorage
    - atualizar a tabela HTML do carrinho

Objetivo 2 - remover produtos do carrinho:
    - ouvir o botão de deletar
    - remover do localStorage
    - atualizar o DOM e o total

Objetivo 3 - atualizar valores do carrinho:
    - ouvir mudanças de quantidade
    - recalcular total individual
    - recalcular total geral
*/
// Evento global para capturar cliques em botões de adicionar ao carrinho
document.addEventListener('click', (evento) => {
    // Verifica se o clique foi em um botão de adicionar ao carrinho
    if (evento.target.classList.contains('adicionar-ao-carrinho')) {
        // Seleciona o elemento do produto relacionado ao botão clicado
        const elementoProduto = evento.target.closest('.produto');
        if (!elementoProduto) return;
        // Obtém os dados do produto a partir do DOM
        const produtoId = elementoProduto.dataset.id;
        const produtoNome = elementoProduto.querySelector('.nome').textContent;
        const produtoImagem = elementoProduto.querySelector('img').getAttribute('src');
        const produtoPreco = parseFloat(elementoProduto.querySelector('.preco').textContent.replace('R$ ', '').replace('.', '').replace(',', '.'));

        // Busca o carrinho atual no localStorage
        const carrinho = obterProdutosDoCarrinho();
        // Verifica se o produto já está no carrinho
        const existeProduto = carrinho.find(produto => produto.id === produtoId);
        if (existeProduto) {
            // Se já existe, incrementa a quantidade
            existeProduto.quantidade += 1;
        } else {
            // Se não existe, adiciona novo produto ao carrinho
            carrinho.push({
                id: produtoId,
                nome: produtoNome,
                imagem: produtoImagem,
                preco: produtoPreco,
                quantidade: 1
            });
        }
        // Salva o carrinho atualizado e atualiza a interface
        salvarProdutoNoCarrinho(carrinho);
        atualizarCarrinhoETabela();
    }
});

// Função para salvar os produtos do carrinho no localStorage
// Salva o array de produtos do carrinho no localStorage
function salvarProdutoNoCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Função para obter os produtos do carrinho armazenados no localStorage
// Recupera o array de produtos do carrinho do localStorage
function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem('carrinho');
    return produtos ? JSON.parse(produtos) : [];
}

// Função para atualizar o contador do carrinho
// Atualiza o número total de itens exibido no ícone do carrinho
function atualizarContadorCarrinho() {
    const carrinho = obterProdutosDoCarrinho();
    let totalQuantidade = 0;
    carrinho.forEach(produto => {
        totalQuantidade += produto.quantidade;
    });
    document.getElementById('contador-carrinho').textContent = totalQuantidade;
}



//RENDERIZAR OS PRODUTOS DO CARRINHO NA TABELA
// Renderiza os produtos do carrinho na tabela do modal
function renderizarProdutosNoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector('#modal-1-content tbody');
    corpoTabela.innerHTML = '';
    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="td-produto">
                <img src="${produto.imagem}" alt="${produto.nome}" />
            </td>
            <td class="td-nome">${produto.nome}</td>
            <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace('.', ',')}</td>
            <td class="td-quantidade">
                <input type="number" class="input-quantidade" data-id="${produto.id}" value="${produto.quantidade}" min="1"/>
            </td>
            <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace('.', ',')}</td>
            <td class="td-remover">
                <button class="btn-remover" data-id="${produto.id}">Remover</button>
            </td>
        `;
        corpoTabela.appendChild(tr);
    });
}



// Evento para remover produto do carrinho ao clicar no botão "Remover"
document.querySelector('#modal-1-content tbody').addEventListener('click', (evento) => {
    if (evento.target.classList.contains('btn-remover')) {
        const id = evento.target.dataset.id;
        removerProdutoDoCarrinho(id);
    }
});

// Evento para atualizar a quantidade de um produto ao alterar o input
document.querySelector('#modal-1-content tbody').addEventListener('input', (evento) => {
    if (evento.target.classList.contains('input-quantidade')) {
        const produtos = obterProdutosDoCarrinho();
        const produto = produtos.find(produto => produto.id === evento.target.dataset.id);
        let novaQuantidade = parseInt(evento.target.value);
        if (produto && novaQuantidade > 0) {
            produto.quantidade = novaQuantidade;
            salvarProdutoNoCarrinho(produtos);
            atualizarCarrinhoETabela();
        }
    }
});

// Função para remover o produto do carrinho
// Remove um produto do carrinho pelo id e atualiza a interface
function removerProdutoDoCarrinho(id) {
    const carrinho = obterProdutosDoCarrinho();
    const carrinhoAtualizado = carrinho.filter(produto => produto.id !== id);
    salvarProdutoNoCarrinho(carrinhoAtualizado);
    atualizarCarrinhoETabela();
}

//ATUALIZAR O VALOR TOTAL DO CARRINHO
// Calcula e exibe o valor total do carrinho na interface
function atualizarValorTotalCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const total = produtos.reduce((soma, produto) => soma + produto.preco * produto.quantidade, 0);
    const totalEl = document.getElementById('total-carrinho');
    if (totalEl) {
        totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
}

// Atualiza o contador, a tabela e o valor total do carrinho
function atualizarCarrinhoETabela() {
    atualizarContadorCarrinho();
    renderizarProdutosNoCarrinho();
    atualizarValorTotalCarrinho();
}

// Inicializa a interface do carrinho ao carregar a página
atualizarCarrinhoETabela();

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

const botoesAdicionarAoCarrinho = document.querySelectorAll('.adicionar-ao-carrinho');


botoesAdicionarAoCarrinho.forEach(botao => {
    botao.addEventListener('click', (evento) => {
        const elementoProduto = evento.target.closest(".produto");
        const produtoId = elementoProduto.dataset.id;
        const produtoNome = elementoProduto.querySelector('.nome').textContent;
        const produtoImagem = elementoProduto.querySelector('img').getAttribute('src');
        const produtoPreco = parseFloat(elementoProduto.querySelector('.preco').textContent.replace('R$ ', '').replace('.','').replace(',', '.'));

        //BUSCAR A LISTA DE PRODUTOS NO LOCALSTORAGE
        const carrinho = obterProdutosDoCarrinho(); // array

        //VERIFICAR SE O PRODUTO JÁ EXISTE NO CARRINHO
        const existeProduto = carrinho.find(produto => produto.id === produtoId); // se encontrar, retorna o produto, se não, retorna undefined
        if (existeProduto) {
            existeProduto.quantidade += 1; // se o produto já existe, incrementa a quantidade
        } else {
            //ADICIONAR O PRODUTO AO CARRINHO
            const produto = {
                id: produtoId,
                nome: produtoNome,
                imagem: produtoImagem,
                preco: produtoPreco,
                quantidade: 1
            };
            carrinho.push(produto);
        }
        salvarProdutoNoCarrinho(carrinho); // salva o array atualizado no localStorage
        atualizarContadorCarrinho(); // atualiza o contador no HTML
        renderizarProdutosNoCarrinho(); // atualiza a tabela do carrinho
    });
})

// Função para salvar os produtos do carrinho no localStorage
function salvarProdutoNoCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Função para obter os produtos do carrinho armazenados no localStorage
function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem('carrinho'); // 'carrinho' é a chave onde os produtos estão armazenados
    return produtos ? JSON.parse(produtos) : []; // se produtos for nulo, retorna um array vazio
}

// Função para atualizar o contador do carrinho
function atualizarContadorCarrinho() {
    const carrinho = obterProdutosDoCarrinho(); // array
    let totalQuantidade = 0; // contador
    carrinho.forEach(produto => {
        totalQuantidade += produto.quantidade;
    }); // soma a quantidade de cada produto

    // atualiza o contador no HTML
    document.getElementById('contador-carrinho').textContent = totalQuantidade;
}

atualizarContadorCarrinho();// chama a função para atualizar o contador quando a página carrega

//RENDERIZAR OS PRODUTOS DO CARRINHO NA TABELA
function renderizarProdutosNoCarrinho() {
    const produtos = obterProdutosDoCarrinho();// array
    const corpoTabela = document.querySelector('#modal-1-content tbody');// seleciona o corpo da tabela
    corpoTabela.innerHTML = ''; // limpa o corpo da tabela
    // para cada produto, cria uma linha na tabela
    produtos.forEach(produto => {
        const tr = document.createElement('tr'); // cria uma linha
        tr.innerHTML = `<td class="td-produto">
             <img 
                src="${produto.imagem}" 
                alt="${produto.nome}"
             />
            </td>
            <td class="td-nome">${produto.nome}</td>
            < class="td-preco-unitaruio">R$ ${produto.preco.toFixed(2).replace('.', ',')}</td>
            <td class="td-quantidade">
            <input type="number" value="${produto.quantidade}" min="1"/>
            </td>
            <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace('.', ',')}</td>
            <td class="td-remover">
                <button class="remover-produto" data-id="${produto.id}"></button>
            </td>
            `;
         corpoTabela.appendChild(tr); // adiciona a linha ao corpo da tabela
    });
    
}

renderizarProdutosNoCarrinho(); // chama a função para renderizar os produtos no carrinho
USE atividade2pfsii;

-- Tabela Cliente
CREATE TABLE cliente (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(15),
    endereco VARCHAR(255)
);


-- Tabela para armazenar os pedidos
-- Tabela Pedido
CREATE TABLE pedido (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    cliente_codigo INT NOT NULL,
    data_pedido DATE NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (cliente_codigo) REFERENCES cliente(codigo)
);


-- Tabela para armazenar os itens do pedido
-- Tabela Pedido_Produto (Relacionamento muitos-para-muitos entre Pedido e Produto)
CREATE TABLE pedido_produto (
    pedido_codigo INT NOT NULL,
    produto_codigo INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (pedido_codigo, produto_codigo),
    FOREIGN KEY (pedido_codigo) REFERENCES pedido(codigo),
    FOREIGN KEY (produto_codigo) REFERENCES produto(prod_codigo)
);


-- Tabela Livro (Ajuste conforme a necessidade de substituição de Produto por Livro)
CREATE TABLE livro (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    precoCusto DECIMAL(10, 2) NOT NULL,
    precoVenda DECIMAL(10, 2) NOT NULL,
    dataCompra DATE NOT NULL,
    qtdEstoque INT NOT NULL,
    autor INT,
    FOREIGN KEY (autor) REFERENCES autor(aut_codigo)
);

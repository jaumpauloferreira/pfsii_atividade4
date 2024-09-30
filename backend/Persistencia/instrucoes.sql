-- Tabela Autor
CREATE TABLE autor (
    aut_codigo INT AUTO_INCREMENT PRIMARY KEY,
    aut_genero VARCHAR(50) NOT NULL
);

-- Tabela Produto
CREATE TABLE produto (
    prod_codigo INT AUTO_INCREMENT PRIMARY KEY,
    prod_nome VARCHAR(100) NOT NULL,
    prod_precoCusto DECIMAL(10, 2) NOT NULL,
    prod_precoVenda DECIMAL(10, 2) NOT NULL,
    prod_dataCompra DATE,
    prod_qtdEstoque INT NOT NULL,
    aut_codigo INT,
    FOREIGN KEY (aut_codigo) REFERENCES autor(aut_codigo)
);





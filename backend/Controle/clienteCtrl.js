import ClienteDAO from '../Persistencia/ClienteDAO.js';  // Ajuste o caminho conforme necessário
import Cliente from '../Modelo/cliente.js';  // Importa a classe Cliente

// Esta classe irá manipular/controlar a entidade Cliente
export default class ClienteCTRL {

    constructor() {
        this.clienteDAO = new ClienteDAO();  // Instancia o ClienteDAO
    }

    // Método responsável por gravar os dados de um cliente
    gravar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "POST" && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { nome, telefone, endereco } = dados;

            if (nome && telefone && endereco) {
                // Criar uma instância da classe Cliente
                const cliente = new Cliente(null, nome, telefone, endereco);

                // Método assíncrono que grava o cliente no banco de dados
                this.clienteDAO.adicionar(cliente).then((codigo) => {
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Cliente gravado com sucesso!",
                        codigo
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe adequadamente todos os dados do cliente!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou cliente no formato JSON não fornecido! Consulte a documentação da API."
            });
        }
    }

    // Requisição HTTP do tipo PUT para atualizar um cliente
    atualizar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "PUT" && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { codigo, nome, telefone, endereco } = dados;

            if (codigo && nome && telefone && endereco) {
                // Criar uma instância da classe Cliente
                const cliente = new Cliente(codigo, nome, telefone, endereco);

                // Método assíncrono para atualizar o cliente
                this.clienteDAO.alterar(cliente).then(() => {
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Cliente atualizado com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe adequadamente todos os dados do cliente!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou cliente no formato JSON não fornecido! Consulte a documentação da API."
            });
        }
    }

    // Método para excluir um cliente
    excluir(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "DELETE" && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { codigo } = dados;

            if (codigo) {
                // Método assíncrono para remover o cliente do banco de dados
                this.clienteDAO.deletar(codigo).then(() => {
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Cliente excluído com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o código do cliente!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou cliente no formato JSON não fornecido! Consulte a documentação da API."
            });
        }
    }

    // Método para consultar todos os clientes
    consultar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "GET") {
            // Método assíncrono para recuperar os clientes do banco de dados
            this.clienteDAO.consultarTodos().then((clientes) => {
                resposta.status(200).json(clientes);
            }).catch((erro) => {
                resposta.status(500).json({
                    status: false,
                    mensagem: erro.message
                });
            });
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido! Consulte a documentação da API."
            });
        }
    }

    // Método para consultar um cliente pelo código
    consultarPeloCodigo(requisicao, resposta) {
        resposta.type("application/json");

        const codigo = requisicao.params['codigo'];

        if (requisicao.method === "GET") {
            // Método assíncrono que recupera o cliente pelo código
            this.clienteDAO.consultarPorCodigo(codigo).then((cliente) => {
                if (cliente) {
                    resposta.status(200).json(cliente);
                } else {
                    resposta.status(404).json({
                        status: false,
                        mensagem: "Cliente não encontrado!"
                    });
                }
            }).catch((erro) => {
                resposta.status(500).json({
                    status: false,
                    mensagem: erro.message
                });
            });
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido! Consulte a documentação da API."
            });
        }
    }
}

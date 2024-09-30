import Cliente from "../Modelo/cliente.js";
import Pedido from "../Modelo/pedido.js";
import Livro from "../Modelo/livro.js";
import ItemPedido from "../Modelo/itemPedido.js";

export default class PedidoCtrl {
    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            try {
                const dados = requisicao.body;
                const { cliente, dataPedido, totalPedido, itens } = dados;

                if (!cliente || !dataPedido || !totalPedido || !itens || itens.length === 0) {
                    return resposta.status(400).json({
                        status: false,
                        mensagem: "Dados incompletos para registrar o pedido!"
                    });
                }

                const objCliente = new Cliente(cliente.codigo);
                let itensPedido = [];

                for (const item of itens) {
                    const livro = new Livro(item.codigo);
                    const objItem = new ItemPedido(livro, item.quantidade, item.precoUnitario);
                    itensPedido.push(objItem);
                }

                const pedido = new Pedido(0, objCliente, dataPedido, totalPedido, itensPedido);

                await pedido.gravar();

                resposta.status(200).json({
                    status: true,
                    mensagem: "Pedido registrado com sucesso!",
                    codigo: pedido.codigo
                });
            } catch (erro) {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao registrar o pedido: " + erro.message
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'PUT' && requisicao.is('application/json')) {
            try {
                const dados = requisicao.body;
                const { codigo, cliente, dataPedido, totalPedido, itens } = dados;

                if (!codigo || !cliente || !dataPedido || !totalPedido || !itens || itens.length === 0) {
                    return resposta.status(400).json({
                        status: false,
                        mensagem: "Dados incompletos para atualizar o pedido!"
                    });
                }

                const objCliente = new Cliente(cliente.codigo);
                let itensPedido = [];

                for (const item of itens) {
                    const livro = new Livro(item.codigo);
                    const objItem = new ItemPedido(livro, item.quantidade, item.precoUnitario);
                    itensPedido.push(objItem);
                }

                const pedido = new Pedido(codigo, objCliente, dataPedido, totalPedido, itensPedido);
                
                await pedido.atualizar();

                resposta.status(200).json({
                    status: true,
                    mensagem: "Pedido atualizado com sucesso!"
                });
            } catch (erro) {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao atualizar o pedido: " + erro.message
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const { codigo } = requisicao.body;

            if (!codigo || isNaN(codigo)) {
                return resposta.status(400).json({
                    status: false,
                    mensagem: "Por favor, informe um código de pedido válido!"
                });
            }

            try {
                const pedido = new Pedido(codigo);
                await pedido.excluir();

                resposta.status(200).json({
                    status: true,
                    mensagem: "Pedido excluído com sucesso!"
                });
            } catch (erro) {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao excluir o pedido: " + erro.message
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida!"
            });
        }
    }

    async consultarTodos(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'GET') {
            try {
                const termo = requisicao.params.termo || "";

                const pedido = new Pedido();
                const listaPedidos = await pedido.consultarTodos(termo);

                resposta.status(200).json({
                    status: true,
                    listaPedidos
                });
            } catch (erro) {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao consultar os pedidos: " + erro.message
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'GET') {
            const termo = requisicao.params.termo;

            if (isNaN(termo)) {
                return resposta.status(400).json({
                    status: false,
                    mensagem: "Por favor, informe um código de pedido válido!"
                });
            }

            try {
                const pedido = new Pedido(0);
                const listaPedidos = await pedido.consultar(termo);

                if (listaPedidos.length > 0) {
                    resposta.status(200).json({
                        status: true,
                        listaPedidos
                    });
                } else {
                    resposta.status(200).json({
                        status: false,
                        mensagem: "Código de pedido inválido"
                    });
                }
            } catch (erro) {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao consultar o pedido: " + erro.message
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida!"
            });
        }
    }
}

import Cliente from '../Modelo/cliente.js'; // Verifique se o caminho está correto
import conectar from "./conexao.js";

export default class ClienteDAO {

    // Adicionar um novo cliente
    async adicionar(cliente) {
        if (cliente instanceof Cliente) {
            const conexao = await conectar();
            const sql = "INSERT INTO cliente (nome, telefone, endereco) VALUES (?, ?, ?)";
            const valores = [cliente.nome, cliente.telefone, cliente.endereco];
            const [result] = await conexao.query(sql, valores);
            cliente.codigo = result.insertId;  // Capturar o ID gerado pelo MySQL
            return cliente.codigo;  // Retorna o código do cliente inserido
        }
        throw new Error("Instância inválida de cliente");
    }

    // Atualizar um cliente existente
    async alterar(cliente) {
        if (cliente instanceof Cliente && cliente.codigo) {
            const conexao = await conectar();
            const sql = "UPDATE cliente SET nome = ?, telefone = ?, endereco = ? WHERE codigo = ?";
            const valores = [cliente.nome, cliente.telefone, cliente.endereco, cliente.codigo];
            await conexao.query(sql, valores);
            return true; // Sucesso
        } else {
            throw new Error("Instância inválida de cliente ou código não fornecido");
        }
    }

    // Deletar um cliente pelo código
    async deletar(codigo) {
        if (codigo) {
            const conexao = await conectar();
            const sql = "DELETE FROM cliente WHERE codigo = ?";
            const valores = [codigo];
            await conexao.query(sql, valores);
            return true; // Sucesso
        } else {
            throw new Error("Código do cliente não fornecido");
        }
    }

    // Consultar clientes pelo nome (busca parcial)
    async consultarPorNome(termo) {
        const conexao = await conectar();
        const sql = "SELECT * FROM cliente WHERE nome LIKE ?";
        const valores = [`%${termo}%`]; // Busca parcial com LIKE
        const [rows] = await conexao.query(sql, valores);
        const listaClientes = rows.map(row => new Cliente(row['codigo'], row['nome'], row['telefone'], row['endereco']));
        return listaClientes;
    }

    // Consultar cliente pelo telefone
    async consultarPorTelefone(telefone) {
        const conexao = await conectar();
        const sql = "SELECT * FROM cliente WHERE telefone = ?";
        const valores = [telefone];
        const [rows] = await conexao.query(sql, valores);
        const listaClientes = rows.map(row => new Cliente(row['codigo'], row['nome'], row['telefone'], row['endereco']));
        return listaClientes;
    }

    // Consultar cliente pelo código
    async consultarPorCodigo(codigo) {
        const conexao = await conectar();
        const sql = "SELECT * FROM cliente WHERE codigo = ?";
        const valores = [codigo];
        const [rows] = await conexao.query(sql, valores);
        if (rows.length > 0) {
            const row = rows[0];
            return new Cliente(row['codigo'], row['nome'], row['telefone'], row['endereco']);
        }
        return null;  // Retorna nulo se o cliente não for encontrado
    }

    // Consultar todos os clientes
    async consultarTodos() {
        const conexao = await conectar();
        const sql = "SELECT * FROM cliente";
        const [rows] = await conexao.query(sql);
        const listaClientes = rows.map(row => new Cliente(row['codigo'], row['nome'], row['telefone'], row['endereco']));
        return listaClientes;
    }
}

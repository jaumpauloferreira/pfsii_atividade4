import ClienteDAO from '../Persistencia/ClienteDAO.js';  // Certifique-se de que o caminho está correto

export default class Cliente {
    #codigo;
    #nome;
    #telefone;
    #endereco;

    constructor(codigo, nome, telefone, endereco) {
        this.#codigo = codigo || null; // Código pode ser nulo para novos clientes
        this.#nome = nome;
        this.#telefone = telefone;
        this.#endereco = endereco;
    }

    // Getters e setters
    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        if (isNaN(novoCodigo) || novoCodigo <= 0) {
            throw new Error("Código inválido");
        }
        this.#codigo = novoCodigo;
    }

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        if (!novoNome || novoNome.trim() === "") {
            throw new Error("Nome não pode ser vazio");
        }
        this.#nome = novoNome;
    }

    get telefone() {
        return this.#telefone;
    }

    set telefone(novoTelefone) {
        const telefoneLimpo = novoTelefone.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (telefoneLimpo.length !== 11) {
            throw new Error("Formato de telefone inválido. Deve ter 11 dígitos.");
        }
        this.#telefone = telefoneLimpo;
    }

    get endereco() {
        return this.#endereco;
    }

    set endereco(novoEndereco) {
        if (!novoEndereco || novoEndereco.trim() === "") {
            throw new Error("Endereço não pode ser vazio");
        }
        this.#endereco = novoEndereco;
    }

    // Método para converter para JSON
    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            telefone: this.#telefone,
            endereco: this.#endereco
        };
    }

    // Métodos de persistência
    async gravar() {
        const clienteDAO = new ClienteDAO();
        this.#codigo = await clienteDAO.adicionar(this.toJSON()); // Adiciona cliente e retorna código gerado
    }

    async atualizar() {
        const clienteDAO = new ClienteDAO();
        await clienteDAO.alterar(this.toJSON()); // Atualiza cliente no banco de dados
    }

    async apagar() {
        if (this.#codigo) {
            const clienteDAO = new ClienteDAO();
            await clienteDAO.deletar(this.#codigo); // Remove cliente do banco de dados pelo código
        } else {
            throw new Error("Código do cliente não fornecido para exclusão");
        }
    }

    // Métodos estáticos para consulta
    static async consultarPorNome(nome) {
        const clienteDAO = new ClienteDAO();
        return await clienteDAO.consultarPorNome(nome); // Consulta clientes pelo nome
    }

    static async consultarPorTelefone(telefone) {
        const clienteDAO = new ClienteDAO();
        return await clienteDAO.consultarPorTelefone(telefone); // Consulta clientes pelo telefone
    }

    static async consultarTodos() {
        const clienteDAO = new ClienteDAO();
        return await clienteDAO.consultarTodos(); // Consulta todos os clientes
    }

    static async consultarPorCodigo(codigo) {
        const clienteDAO = new ClienteDAO();
        return await clienteDAO.consultarPorCodigo(codigo); // Consulta cliente pelo código
    }
}

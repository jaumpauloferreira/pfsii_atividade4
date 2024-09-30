import { Router } from "express";
import ClienteCTRL from "../Controle/clienteCtrl.js";

const rotaCliente = new Router();
const clienteCTRL = new ClienteCTRL();

// Define os endpoints e associa os métodos da camada de controle
rotaCliente
    .post('/', (req, res) => clienteCTRL.gravar(req, res))            // Rota para adicionar um cliente
    .put('/', (req, res) => clienteCTRL.atualizar(req, res))          // Rota para atualizar um cliente
    .delete('/:codigo', (req, res) => clienteCTRL.excluir(req, res))  // Rota para excluir um cliente com base no código
    .get('/', (req, res) => clienteCTRL.consultar(req, res))          // Rota para consultar todos os clientes
    .get('/:codigo', (req, res) => clienteCTRL.consultarPeloCodigo(req, res)); // Rota para consultar cliente pelo código

export default rotaCliente;



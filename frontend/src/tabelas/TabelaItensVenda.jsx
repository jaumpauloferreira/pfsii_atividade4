import { Button, Container, Table } from "react-bootstrap";
// import { useState } from "react";
import './TabelaItensVenda.css'
export default function TabelaItensVenda(props) {
    var totalVendas = 0;
    return (
        <Container id="teste">
            <Table striped bordered hover variant="info">
                <thead>
                    <tr>
                        <th>Código do livro</th>
                        <th>Nome do livro</th>
                        <th>Preço</th>
                        <th>Qtd</th>
                        <th>Subtotal</th>
                        <th>Remover</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.listaItens?.map((item, indice) => {
                            totalVendas += parseFloat(item.subtotal);
                            //props.setVenda({...props.dadosVenda, totalPedido: totalVendas});
                            return <tr key={indice}>
                                <td>{item.codigo}</td>
                                <td>{item.nome}</td>
                                <td>R$ {item.precoUnitario}</td>
                                <td>{item.quantidade}</td>
                                <td>R$ {item.subtotal.toFixed(2)}</td>
                                <td>
                                    <Button onClick={() => {
                                        const lista = props.listaItens.filter((prod) => prod.codigo !== item.codigo);
                                        props.setVenda({ ...props.dadosVenda, itens: lista });
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                        </svg>
                                    </Button>
                                </td>
                            </tr>
                        })
                    }
                </tbody>
            </Table>
            <p>Total da Venda: R$ {totalVendas.toFixed(2)}</p>
        </Container>
    )
}
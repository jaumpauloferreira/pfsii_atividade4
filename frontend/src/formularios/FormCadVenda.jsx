import { useState, useEffect } from "react";
import { Form, Row, Col, Button, Container, } from 'react-bootstrap';
import { BagPlusFill } from 'react-bootstrap-icons';
import BarraBusca from "../meusComponentes/busca/BarraBusca";
import CaixaSelecao from "../meusComponentes/busca/CaixaSelecao";
import TabelaItensVenda from "../tabelas/TabelaItensVenda";
import './FormCadVenda.css'

export default function FormCadVenda(props) {
    const [validado, setValidado] = useState(false);
    const [listaClientes, setListaClientes] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState({});
    const [produtoSelecionado, setProdutoSelecionado] = useState({});
    const [qtdItem, setQtdItem] = useState(0);
    const [subTotalCalculado, setSubTotalCalculado] = useState(0.00);


    //O estado venda possui correlação com a venda gerenciada no backend
    const [venda, setVenda] = useState({
        id: 0,
        dataPedido: "",
        totalPedido: 0,
        cliente: clienteSelecionado,
        itens: []
    });

    //manipulando o ciclo de vida do componente FormCadVenda
    useEffect(() => {
        fetch('http://localhost:4000/cliente', { method: "GET" })
            .then((resposta) => {
                return resposta.json();
            })
            .then((listaClientes) => {
                setListaClientes(listaClientes);
            })
            .catch((erro) => {
                //Informar o erro em um componente do tipo Mensagem
                alert("Não foi possível recuperar os clientes do backend.");
            });
    }, []); //willMount

    function manipularMudanca(e) {
        const alvo = e.target.name;
        if (e.target.type === "checkbox") {
            //spread operator = operador de espalhamento
            setVenda({ ...venda, [alvo]: e.target.checked });
        }
        else {
            //spread operator = operador de espalhamento
            setVenda({ ...venda, [alvo]: e.target.value });
        }
    }

    // function gravarVenda() {
    //     fetch('http://localhost:4000/pedido',{
    //         method:'POST',
    //         headers:{
    //             'Content-Type':'application/json'
    //         },
    //         body: JSON.stringify({
    //             dataPedido: venda.dataPedido,
    //             cliente: clienteSelecionado,
    //             totalPedido: venda.totalPedido,
    //             itens:venda.itens
    //         })
    //     })
    //     .then((resposta) => {
    //         return resposta.json()
    //     })
    //     .then((dados)=>{
    //         if(dados.status){
    //             setVenda({...venda, id: dados.codigo})
    //         }
    //         alert(dados.mensagem);
    //     })
    //     .catch(erro => alert(erro.message));
    // }

    function gravarVenda() {
        // Verifica se a data do pedido e o cliente selecionado estão definidos
        if (!venda.dataPedido || Object.keys(clienteSelecionado).length === 0) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }
    
        // Monta o objeto de venda a ser enviado para o servidor
        const vendaParaEnviar = {
            dataPedido: venda.dataPedido,
            cliente: clienteSelecionado,
            totalPedido: venda.totalPedido,
            itens: venda.itens
        };
    
        fetch('http://localhost:4000/pedido',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(vendaParaEnviar)
        })
        .then((resposta) => resposta.json())
        .then((dados) => {
            if (dados.status) {
                // Atualiza o estado da venda com o ID retornado pelo servidor
                setVenda({...venda, id: dados.codigo});
            }
            alert(dados.mensagem);
        })
        .catch(erro => alert(erro.message));
    }
    

    const manipulaSubmissao = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity()) {
            setValidado(false);
            gravarVenda();
        }
        else {
            setValidado(true);
        }
        event.preventDefault();
        event.stopPropagation();


    };

    return (
        <Container className="border p-4">
            <h2>Cadastro de Venda de Livros <BagPlusFill id="icone" size={26} color="black"/></h2>
        <Form noValidate validated={validado} onSubmit={manipulaSubmissao}>
            <Container id="container1">
            <Row className="mb-3">
                {/* <h2>Cadastro de Venda <BagPlusFill id="icone" size={26} color="black"/></h2> */}
                <Form.Group as={Col} md="4" controlId="idVenda">
                    <Form.Label>Pedido nº</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="0"
                        defaultValue="0"
                        disabled
                        name="id"
                        value={venda.id}
                        onChange={manipularMudanca}
                    />
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="dataVenda">
                    <Form.Label>Data do Pedido</Form.Label>
                    <Form.Control
                        type="date"
                        required
                        name="dataPedido"
                        value={venda.dataPedido}
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type="invalid">
                        Por favor informe a data da venda.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="desconto">
                    <Form.Label>Total do Pedido</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="0,00"
                        value={venda.totalPedido}
                        name="totalPedido"
                        onChange={manipularMudanca}
                        required
                        disabled />
                    <Form.Control.Feedback type="invalid">
                        Por favor, informe o valor total do pedido
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group as={Col} md="12" controlId="valorTotalTributos">
                    <Form.Label>Cliente:</Form.Label>
                    <BarraBusca campoBusca={"nome"}
                        campoChave={"codigo"}
                        dados={listaClientes}
                        funcaoSelecao={setClienteSelecionado}
                        placeHolder={"Selecione um cliente"}
                        valor={""} />
                </Form.Group>
            </Row>
            </Container>
            <h3 id="titulo2">Itens da Venda</h3>
            <Row>
                {
                    //Seção resposável por permitir que produtos sejam selecionados para a venda
                    //Demonstração de relacionamento muitos para muitos
                }
                <Container id="container2">
                    <Row className="m-3">
                        <Col md={2}>
                            <Form.Label>Selecione um livro</Form.Label>
                        </Col>
                        <Col>
                            <CaixaSelecao enderecoFonteDados={"http://localhost:4000/livro"}
                                campoChave={"codigo"}
                                campoExibicao={"nome"}
                                funcaoSelecao={setProdutoSelecionado}
                                localLista={'listaLivros'} />
                        </Col>
                    </Row>

                    <Row>
                        {
                            //Seção ficará responsável por detalhar o produto selecionado
                        }
                        <Col md={10}>
                            <Row>
                                <Col md={1}>
                                    <Form.Group>
                                        <Form.Label style={{ marginLeft: '10px' }}>Código:</Form.Label>
                                        <Form.Control style={{ marginLeft: '10px' }} type="text" value={produtoSelecionado?.codigo} disabled />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Nome do livro:</Form.Label>
                                        <Form.Control type="text" value={produtoSelecionado?.nome} disabled />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>Preço R$:</Form.Label>
                                        <Form.Control type="text" value={produtoSelecionado?.precoVenda} disabled />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>Qtd</Form.Label>
                                        <Form.Control type="number"
                                            min={1}
                                            value={qtdItem}
                                            onChange={(e) => {
                                                //calcular o subtotal
                                                const qtdInformada = e.currentTarget.value;
                                                if (!isNaN(qtdInformada)) {
                                                    setQtdItem(qtdInformada);
                                                    setSubTotalCalculado(qtdInformada * parseFloat(produtoSelecionado?.precoVenda));
                                                }
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>SubTotal</Form.Label>
                                        <Form.Control type="text" value={subTotalCalculado} disabled />
                                    </Form.Group>
                                </Col>
                                <Col md={1} className="middle">
                                    <Form.Group>
                                        <Form.Label>Adicionar</Form.Label>
                                        <Button id="btn1" onClick={() => {
                                            //adicionar o item na lista de itens vendidos
                                            if (qtdItem > 0) {
                                                setVenda({
                                                    ...venda,
                                                    itens: [...venda.itens, {
                                                        codigo: produtoSelecionado?.codigo,
                                                        nome: produtoSelecionado?.nome,
                                                        quantidade: qtdItem,
                                                        precoUnitario: produtoSelecionado?.precoVenda,
                                                        subtotal: subTotalCalculado
                                                    }],
                                                    totalPedido: venda.totalPedido + subTotalCalculado
                                                })
                                            }
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-bag-plus-fill"
                                                viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zM8.5 8a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V12a.5.5 0 0 0 1 0v-1.5H10a.5.5 0 0 0 0-1H8.5V8z" />
                                            </svg>
                                        </Button>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <h5 id="titulo3">Lista de livros escolhidos</h5>
                        <TabelaItensVenda
                            listaItens={venda.itens}
                            setVenda={setVenda}  /// aqui irá os itens da venda
                            dadosVenda={venda} />  
                    </Row>
                </Container>
            </Row>
            <Button type="submit" className="btn btn-success">Confirmar a Venda</Button>
        </Form>
        </Container>
    );
}


import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "../../components/LayoutDashboard";
import { useEffect, useState } from "react";
import { IToken } from "../../interfaces/token";
import { validaPermissao, verificaTokenExpirado } from "../../services/token";
import { Loading } from "../../components/Loading";
import axios from "axios";

interface IAgendamentos {
    id: number;
    data: string;
    hora: string;
    cliente: string;
    servico: string;
    ambiente: string; // Novo campo para o nome do ambiente
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dadosAgendamentos, setDadosAgendamentos] = useState<Array<IAgendamentos>>([]);
    const [ambientes, setAmbientes] = useState<string[]>([]); // Lista de ambientes
    const [filtroAmbiente, setFiltroAmbiente] = useState<string>(""); // Ambiente selecionado

    useEffect(() => {
        let lsStorage = localStorage.getItem('americanos.token');
        let token: IToken | null = null;

        if (typeof lsStorage === 'string') {
            token = JSON.parse(lsStorage);
        }

        if (!token || verificaTokenExpirado(token.accessToken)) {
            navigate("/");
        }

        if (!validaPermissao(['admin', 'secretarios'], token?.user.permissoes)) {
            navigate('/dashboard');
        }

        console.log("Pode desfrutar do sistema :D");

        setLoading(true);
        // Carregar agendamentos
        axios.get('http://localhost:3001/agendamentos')
            .then((res) => {
                setDadosAgendamentos(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });

        // Carregar lista de ambientes
        axios.get('http://localhost:3001/ambientes')
            .then((res) => {
                setAmbientes(res.data); // Carrega a lista de ambientes
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // Função para manipular a mudança no filtro de ambiente
    const handleFiltroChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFiltroAmbiente(event.target.value);
    };

    // Filtrar agendamentos pelo ambiente selecionado
    const agendamentosFiltrados = filtroAmbiente
        ? dadosAgendamentos.filter(agendamento => agendamento.ambiente === filtroAmbiente)
        : dadosAgendamentos;

    const handleEditClick = (id: number) => {
        navigate(`/agendamentos/${id}?action=edit`);
    };

    const handleDeleteClick = (id: number) => {
        navigate(`/agendamentos/${id}?action=delete`);
    };

    return (
        <>
            <Loading visible={loading} />
            <LayoutDashboard>
                <div className="d-flex justify-content-between mt-3">
                    <h1 className="h2">Dashboard/Agendamentos</h1>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                            navigate('/agendamentos/criar');
                        }}
                    >
                        Adicionar
                    </button>
                </div>
                <div className="mt-3">
                    {/* Filtro de Ambiente */}
                    <label htmlFor="filtroAmbiente">Filtrar por Ambiente: </label>
                    <select
                        id="filtroAmbiente"
                        value={filtroAmbiente}
                        onChange={handleFiltroChange}
                        className="form-select"
                        style={{ maxWidth: '300px', display: 'inline-block', marginLeft: '10px' }}
                    >
                        <option value="">Todos</option>
                        {ambientes.map((ambiente, index) => (
                            <option key={index} value={ambiente}>{ambiente}</option>
                        ))}
                    </select>
                </div>
                <table className="table table-striped mt-3">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Usuário</th>
                            <th scope="col">Ambiente</th>
                            <th scope="col">Data/Hora Início</th>
                            <th scope="col">Data/Hora Fim</th>
                            <th scope="col">Status</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agendamentosFiltrados.map((agendamento, index) => (
                            <tr key={index}>
                                <th scope="row">{agendamento.id}</th>
                                <td>{agendamento.data}</td>
                                <td>{agendamento.hora}</td>
                                <td>{agendamento.cliente}</td>
                                <td>{agendamento.servico}</td>
                                <td>{agendamento.ambiente}</td>
                                <td>
                                    <button
                                        className="btn btn-warning"
                                        type="button"
                                        style={{ marginRight: 5 }}
                                        onClick={() => handleEditClick(agendamento.id)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        type="button"
                                        style={{ marginRight: 5 }}
                                        onClick={() => handleDeleteClick(agendamento.id)}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </LayoutDashboard>
        </>
    );
}

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
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dadosAgendamentos, setDadosAgendamentos] = useState<Array<IAgendamentos>>([]);

    // Inicio, Update State, Destruir
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
        axios.get('http://localhost:3001/agendamentos')
            .then((res) => {
                setDadosAgendamentos(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }, []);

    const handleEditClick = (id: number) => {
        navigate(`/agendamentos/${id}?action=edit`); // Inclui a query string para sinalizar que a ação é editar
    }

    const handleDeleteClick = (id: number) => {
        navigate(`/agendamentos/${id}?action=delete`); // Passa a query string para indicar que a ação é exclusão
    }

    return (
        <>
            <Loading visible={loading} />
            <LayoutDashboard>
                <div className="d-flex justify-content-between mt-3">
                    <h1 className="h2">Agendamentos</h1>
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
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Usuário</th>
                            <th scope="col">Ambiente</th>
                            <th scope="col">Início</th>
                            <th scope="col">Fim</th>
                            <th scope="col">status</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dadosAgendamentos.map((agendamento, index) => (
                            <tr key={index}>
                                <th scope="row">{agendamento.id}</th>
                                <td>{agendamento.data}</td>
                                <td>{agendamento.hora}</td>
                                <td>{agendamento.cliente}</td>
                                <td>{agendamento.servico}</td>
                                <td>
                                    <button
                                        className="btn btn-warning"
                                        type="submit"
                                        style={{ marginRight: 5 }}
                                        onClick={() => handleEditClick(agendamento.id)} // Agora chama a função para editar
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        type="submit"
                                        style={{ marginRight: 5 }}
                                        onClick={() => handleDeleteClick(agendamento.id)} // Define o ID e navega para o filho
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

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LayoutDashboard } from "../../../components/LayoutDashboard"; // Certifique-se de que o caminho está correto
import { IToken } from "../../../interfaces/token";
import { verificaTokenExpirado, validaPermissao } from "../../../services/token";
import { Loading } from "../../../components/Loading";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useSearchParams } from "react-router-dom";


interface IAgendamento {
    id: number;
    id_usuario: number;
    id_ambiente: number;
    inicio: string;
    fim: string;
    status: string;
    usuarioNome: string;
    ambienteNome: string;
}

export default function GerenciarDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dadosAgendamentos, setDadosAgendamentos] = useState<Array<IAgendamento>>([]);

    // Função para buscar o nome do usuário pelo ID
    const fetchNomeUsuario = async (id: number): Promise<string> => {
        try {
            const response = await axios.get(`http://localhost:3001/usuarios/${id}`);
            return response.data.nome; // Supondo que o nome do usuário está no campo 'nome'
        } catch (error) {
            console.error("Erro ao buscar o nome do usuário:", error);
            return "Usuário não encontrado";
        }
    };

    // Função para buscar o nome do ambiente pelo ID
    const fetchNomeAmbiente = async (id: number): Promise<string> => {
        try {
            const response = await axios.get(`http://localhost:3001/ambientes/${id}`);
            return response.data.nome; // Supondo que o nome do ambiente está no campo 'nome'
        } catch (error) {
            console.error("Erro ao buscar o nome do ambiente:", error);
            return "Ambiente não encontrado";
        }
    };

    // Carregamento inicial dos agendamentos
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

        console.log("Acesso permitido ao sistema!");

        setLoading(true);
        axios.get('http://localhost:3001/agendamentos')
            .then(async (res) => {
                // Mapear os agendamentos para incluir os nomes de usuário e ambiente
                const agendamentosComNomes = await Promise.all(
                    res.data.map(async (agendamento: IAgendamento) => {
                        const usuarioNome = await fetchNomeUsuario(agendamento.id_usuario);
                        const ambienteNome = await fetchNomeAmbiente(agendamento.id_ambiente);
                        return {
                            ...agendamento,
                            usuarioNome,
                            ambienteNome,
                        };
                    })
                );
                setDadosAgendamentos(agendamentosComNomes);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }, []);

    // Função para editar um agendamento
    const handleEditClick = (id: number) => {
        navigate(`/agendamentos/${id}?action=edit`);
    }

    // Função para excluir um agendamento
    const handleDeleteClick = (id: number) => {
        if (window.confirm("Você tem certeza que deseja excluir este agendamento?")) {
            axios.delete(`http://localhost:3001/agendamentos/${id}`)
                .then(() => {
                    setDadosAgendamentos(dadosAgendamentos.filter(item => item.id !== id));
                    alert("Agendamento excluído com sucesso!");
                })
                .catch((err) => {
                    console.error("Erro ao excluir o agendamento:", err);
                });
        }
    }

    return (
        <>
            <Loading visible={loading} />
            <LayoutDashboard>
                <div className="d-flex justify-content-between mt-3">
                    <h1 className="h2">Gerenciar Agendamentos</h1>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                            navigate('/agendamentos/criar');
                        }}
                    >
                        Adicionar Agendamento
                    </button>
                </div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Usuário (ID)</th>
                            <th scope="col">Ambiente (ID)</th>
                            <th scope="col">Início</th>
                            <th scope="col">Fim</th>
                            <th scope="col">Status</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dadosAgendamentos.map((agendamento, index) => (
                            <tr key={index}>
                                <th scope="row">{agendamento.id}</th>
                                <td>{`${agendamento.usuarioNome} (ID: ${agendamento.id_usuario})`}</td>
                                <td>{`${agendamento.ambienteNome} (ID: ${agendamento.id_ambiente})`}</td>
                                <td>{agendamento.inicio}</td>
                                <td>{agendamento.fim}</td>
                                <td>{agendamento.status}</td>
                                <td>
                                    <button
                                        className="btn btn-warning"
                                        style={{ marginRight: 5 }}
                                        onClick={() => handleEditClick(agendamento.id)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger"
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

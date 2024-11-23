import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "../../components/LayoutDashboard";
import axios from "axios";

interface IAgendamento {
    id: number;
    usuario: { nome: string };
    ambiente: { nome: string };
    data_hora_inicio: string;
    data_hora_fim: string;
    status: string;
}

export default function HistoricoAgendamentos() {
    const navigate = useNavigate();
    const [agendamentos, setAgendamentos] = useState<IAgendamento[]>([]);
    const [loading, setLoading] = useState(true);

    // Carrega agendamentos passados ao montar o componente
    useEffect(() => {
        axios.get('http://localhost:3001/agendamentos/historico')
            .then((res) => {
                setAgendamentos(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar histórico de agendamentos:", err);
                setLoading(false);
            });
    }, []);

    return (
        <LayoutDashboard>
            <div className="d-flex justify-content-between mt-3">
                <h1 className="h2">Histórico de Agendamentos</h1>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                        navigate('/dashboard');
                    }}
                >
                    Voltar ao Dashboard
                </button>
            </div>
            {loading ? (
                <div>Carregando...</div>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Usuário</th>
                            <th scope="col">Ambiente</th>
                            <th scope="col">Data/Hora Início</th>
                            <th scope="col">Data/Hora Fim</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agendamentos.map((agendamento, index) => (
                            <tr key={index}>
                                <th scope="row">{agendamento.id}</th>
                                <td>{agendamento.usuario.nome}</td>
                                <td>{agendamento.ambiente.nome}</td>
                                <td>{new Date(agendamento.data_hora_inicio).toLocaleString()}</td>
                                <td>{new Date(agendamento.data_hora_fim).toLocaleString()}</td>
                                <td>{agendamento.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </LayoutDashboard>
    );
}

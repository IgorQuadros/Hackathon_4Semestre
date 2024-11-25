import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "../../components/LayoutDashboard";
import axios from "axios";

interface IAgendamento {
    id: number;
    ambiente: { nome: string };
    data_hora_inicio: string;
    data_hora_fim: string;
    status: string;
}

// Definindo os tipos de filtro disponíveis
type FiltroAgendamento = "ativos" | "expirados";

export default function MeusAgendamentos() {
    const navigate = useNavigate();
    const [agendamentos, setAgendamentos] = useState<IAgendamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState<FiltroAgendamento>("ativos");

    // Carrega agendamentos do usuário ao montar o componente
    useEffect(() => {
        const endpoint = filtro === "ativos" 
            ? 'http://localhost:3001/agendamentos/meus/ativos' 
            : 'http://localhost:3001/agendamentos/meus/expirados';

        setLoading(true);
        axios.get(endpoint)
            .then((res) => {
                setAgendamentos(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar agendamentos:", err);
                setLoading(false);
            });
    }, [filtro]);

    return (
        <LayoutDashboard>
            <div className="d-flex justify-content-between mt-3">
                <h1 className="h2">Meus Agendamentos</h1>
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
            
            {/* Botões de filtro */}
            <div className="btn-group mt-3 mb-3">
                <button
                    type="button"
                    className={`btn ${filtro === "ativos" ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFiltro("ativos")}
                >
                    Agendamentos Ativos
                </button>
                <button
                    type="button"
                    className={`btn ${filtro === "expirados" ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFiltro("expirados")}
                >
                    Agendamentos Expirados
                </button>
            </div>

            {loading ? (
                <div>Carregando...</div>
            ) : agendamentos.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
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
                                <td>{agendamento.ambiente.nome}</td>
                                <td>{new Date(agendamento.data_hora_inicio).toLocaleString()}</td>
                                <td>{new Date(agendamento.data_hora_fim).toLocaleString()}</td>
                                <td>{agendamento.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>Nenhum agendamento encontrado.</div>
            )}
        </LayoutDashboard>
    );
}

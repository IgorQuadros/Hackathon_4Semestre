import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loading } from "../../../components/Loading";
import { LayoutDashboard } from "../../../components/LayoutDashboard";

// Interface para os horários disponíveis
interface IHorario {
    id: number;
    data: string;
    horario: string;
    disponivel: boolean;
}

// Interface para os dados do ambiente
interface IAmbiente {
    id: number;
    nome: string;
    tipo: string;
    status: string;
    hora_funcionamento: string;
}

export default function GerenciarListarAmbiente() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(false);
    const [horarios, setHorarios] = useState<Array<IHorario>>([]);
    const [selectedHorario, setSelectedHorario] = useState<number | null>(null);
    const [ambiente, setAmbiente] = useState<IAmbiente | null>(null);

    useEffect(() => {
        setLoading(true);
        // Obtém os dados do ambiente específico
        axios.get(`http://localhost:8000/api/ambientes/${id}`) // Ajuste a URL para o endpoint correto do Laravel
            .then((res) => {
                setAmbiente(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }, [id]);

    useEffect(() => {
        setLoading(true);
        // Obtém os horários disponíveis do ambiente
        axios.get(`http://localhost:8000/api/ambientes/${id}/horarios`) // Ajuste a URL para o endpoint correto do Laravel
            .then((res) => {
                setHorarios(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }, [id]);

    const handleAgendarClick = () => {
        if (selectedHorario !== null) {
            setLoading(true);
            axios.post(`http://localhost:8000/api/ambientes/${id}/agendar`, {
                horarioId: selectedHorario
            })
            .then(() => {
                setLoading(false);
                alert("Agendamento realizado com sucesso!");
                navigate('/ambientes');
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
        }
    };

    const handleEditClick = () => {
        // Implemente a lógica para editar agendamento aqui
    };

    const handleCancelClick = () => {
        // Implemente a lógica para cancelar agendamento aqui
    };

    return (
        <>
            <Loading visible={loading} />
            <LayoutDashboard>
                <div className="mt-3">
                    <h1 className="h2">Gerenciar Ambiente</h1>
                    {ambiente && (
                        <div className="mb-3">
                            <p><strong>ID do Ambiente:</strong> {ambiente.id}</p>
                            <p><strong>Nome:</strong> {ambiente.nome}</p>
                            <p><strong>Tipo:</strong> {ambiente.tipo}</p>
                            <p><strong>Status:</strong> {ambiente.status}</p>
                            <p><strong>Funcionamento:</strong> {ambiente.hora_funcionamento}</p>
                        </div>
                    )}
                    <div className="list-group">
                        {horarios.map((horario) => (
                            <button
                                key={horario.id}
                                type="button"
                                className={`list-group-item list-group-item-action ${selectedHorario === horario.id ? 'active' : ''}`}
                                disabled={!horario.disponivel}
                                onClick={() => setSelectedHorario(horario.id)}
                            >
                                {horario.data} - {horario.horario} {horario.disponivel ? '(Disponível)' : '(Indisponível)'}
                            </button>
                        ))}
                    </div>
                    <button
                        className="btn btn-success mt-3"
                        type="button"
                        onClick={handleAgendarClick}
                        disabled={selectedHorario === null}
                    >
                        Confirmar Agendamento
                    </button>
                </div>
            </LayoutDashboard>
        </>
    );
}

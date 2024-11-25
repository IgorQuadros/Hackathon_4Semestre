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

export default function AgendarAmbiente() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(false);
    const [horarios, setHorarios] = useState<Array<IHorario>>([]);
    const [selectedHorario, setSelectedHorario] = useState<number | null>(null);

    useEffect(() => {
        setLoading(true);
        // Obtém os horários disponíveis do ambiente
        axios.get(`http://localhost:3001/ambientes/${id}/horarios`)
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
            axios.post(`http://localhost:3001/ambientes/${id}/agendar`, {
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

    return (
        <>
            <Loading visible={loading} />
            <LayoutDashboard>
                <div className="mt-3">
                    <h1 className="h2">Agendar Ambiente</h1>
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

import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "../../components/LayoutDashboard";
import { useEffect, useState } from "react";
import { IToken } from "../../interfaces/token";
import { validaPermissao, verificaTokenExpirado } from "../../services/token";
import { Loading } from "../../components/Loading";
import axios from "axios";

// Interface dos Ambientes
interface IAmbientes {
    id: number;
    nome: string;
    tipo: string;
    status: string;
    hora_funcionamento: string;
}

export default function Ambientes() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [dadosAmbientes, setDadosAmbientes] = useState<Array<IAmbientes>>([]);

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

        setLoading(true);
        axios.get('http://localhost:3001/ambientes')
            .then((res) => {
                setDadosAmbientes(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }, []);

    const handleEditClick = (id: number) => {
        navigate(`/ambientes/${id}?action=edit`);
    };

    const handleDeleteClick = (id: number) => {
        navigate(`/ambientes/${id}?action=delete`);
    };

    // Nova função para o redirecionamento ao agendar
    const handleAgendarClick = (id: number) => {
        navigate(`/ambientes/${id}/agendar`);
    };

    return (
        <>
            <Loading visible={loading} />
            <LayoutDashboard>
                <div className="d-flex justify-content-between mt-3">
                    <h1 className="h2">Ambientes Disponíveis Para Reserva</h1>

                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                            navigate('/ambientes/criar');
                        }}
                    >
                        Adicionar
                    </button>
                </div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nome</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Status</th>
                            <th scope="col">Funcionamento</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dadosAmbientes.map((ambiente, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">{ambiente.id}</th>
                                    <td>{ambiente.nome}</td>
                                    <td>{ambiente.tipo}</td>
                                    <td>{ambiente.status}</td>
                                    <td>{ambiente.hora_funcionamento}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            style={{ marginRight: 5 }}
                                            onClick={() => handleAgendarClick(ambiente.id)}
                                        >
                                            Agendar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </LayoutDashboard>
        </>
    );
}

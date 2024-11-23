import React, { useEffect, useState } from "react";
import { LayoutDashboard } from "../../components/LayoutDashboard";
import axios from "axios";

// Interface para definir o formato de uma notificação
interface INotificacao {
    id: number;
    userId: number;
    mensagem: string;
    dataEnvio: string;
    lida: boolean;
}

export default function Notificacoes() {
    const [notificacoes, setNotificacoes] = useState<INotificacao[]>([]);
    const [loading, setLoading] = useState(true);

    // Carrega as notificações ao montar o componente
    useEffect(() => {
        axios.get('http://localhost:3001/mensagens')
            .then((res) => {
                setNotificacoes(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar notificações:", err);
                setLoading(false);
            });
    }, []);

    return (
        <LayoutDashboard>
            <div className="d-flex justify-content-between mt-3">
                <h1 className="h2">Notificações</h1>
            </div>
            {loading ? (
                <div>Carregando...</div>
            ) : (
                <ul className="list-group mt-3">
                    {notificacoes.map((notificacao) => (
                        <li key={notificacao.id} className={`list-group-item ${notificacao.lida ? '' : 'list-group-item-warning'}`}>
                            <div>
                                <strong>ID do Usuário:</strong> {notificacao.userId}
                            </div>
                            <div>
                                <strong>Mensagem:</strong> {notificacao.mensagem}
                            </div>
                            <div>
                                <strong>Data de Envio:</strong> {new Date(notificacao.dataEnvio).toLocaleString()}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </LayoutDashboard>
    );
}

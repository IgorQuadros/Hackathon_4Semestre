import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IToken } from "../../interfaces/token";
import { LayoutDashboard } from "../../components/LayoutDashboard";
import { validaPermissao, verificaTokenExpirado } from "../../services/token";
import axios from "axios";

interface IUser {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    papel: string; // Informação que não será alterável pelo usuário
}

export default function UserProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        let lsStorage = localStorage.getItem('americanos.token');
        let token: IToken | null = null;

        if (typeof lsStorage === 'string') {
            token = JSON.parse(lsStorage);
        }

        if (!token || verificaTokenExpirado(token.accessToken)) {
            navigate("/");
        }

        // Carregar informações do usuário logado
        if (token) {
            axios.get(`http://localhost:3001/usuarios/${token.user.id}`)
                .then((res) => {
                    setUser(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [navigate]);

    const handleEditClick = () => {
        navigate('/perfil/editar');
    };

    return (
        <LayoutDashboard>
            <div className="container mt-5">
                <h1 className="h2">Perfil de Usuário</h1>
                {user ? (
                    <div className="card mt-4">
                        <div className="card-body">
                            <h5 className="card-title">Informações do Usuário</h5>
                            <p className="card-text"><strong>Nome:</strong> {user.nome}</p>
                            <p className="card-text"><strong>Email:</strong> {user.email}</p>
                            <p className="card-text"><strong>Telefone:</strong> {user.telefone}</p>
                            <p className="card-text"><strong>Papel:</strong> {user.papel}</p>
                            <button
                                className="btn btn-primary mt-3"
                                onClick={handleEditClick}
                            >
                                Alterar Informações
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>Carregando...</p>
                )}
            </div>
        </LayoutDashboard>
    );
}

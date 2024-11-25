import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IToken } from "../../../interfaces/token";
import { LayoutDashboard } from "../../../components/LayoutDashboard";
import { verificaTokenExpirado } from "../../../services/token";
import axios from "axios";

interface IUser {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    papel: string; // Informação que não será alterável pelo usuário
}

export default function EditUserProfile() {
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prevState) => prevState ? { ...prevState, [name]: value } : null);
    };

    const handleSaveClick = () => {
        if (user) {
            axios.put(`http://localhost:3001/usuarios/${user.id}`, {
                nome: user.nome,
                email: user.email,
                telefone: user.telefone,
            })
            .then(() => {
                navigate('/perfil');
            })
            .catch((err) => {
                console.log(err);
            });
        }
    };

    return (
        <LayoutDashboard>
            <div className="container mt-5">
                <h1 className="h2">Editar Perfil</h1>
                {user ? (
                    <div className="card mt-4">
                        <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="nome">Nome</label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    className="form-control"
                                    value={user.nome}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-control"
                                    value={user.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="telefone">Telefone</label>
                                <input
                                    type="text"
                                    id="telefone"
                                    name="telefone"
                                    className="form-control"
                                    value={user.telefone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button
                                className="btn btn-success mt-3"
                                onClick={handleSaveClick}
                            >
                                Salvar Alterações
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

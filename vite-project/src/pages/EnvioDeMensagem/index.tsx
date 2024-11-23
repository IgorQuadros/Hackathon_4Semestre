import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "../../components/LayoutDashboard";
import axios from "axios";

interface IEnviarMensagemForm {
    userId: number;
    mensagem: string;
}

interface IUsuario {
    id: number;
    nome: string;
}

export default function EnviarMensagem() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<IEnviarMensagemForm>({
        userId: 0,
        mensagem: "",
    });
    const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
    const [loading, setLoading] = useState(false);

    // Carrega a lista de usuários ao montar o componente
    useEffect(() => {
        axios.get('http://localhost:3001/usuarios')
            .then((response) => {
                setUsuarios(response.data);
            })
            .catch((error) => {
                console.error("Erro ao carregar usuários:", error);
                alert("Erro ao carregar a lista de usuários.");
            });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, userId: parseInt(e.target.value) });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        axios.post('http://localhost:3001/mensagens/enviar', formData)
            .then((response) => {
                alert("Mensagem enviada com sucesso!");
                navigate('/dashboard'); // Redireciona para o dashboard
            })
            .catch((error) => {
                console.error("Erro ao enviar a mensagem:", error);
                alert("Erro ao enviar a mensagem.");
            })
            .finally(() => setLoading(false));
    };

    return (
        <LayoutDashboard>
            <div className="d-flex justify-content-between mt-3">
                <h1 className="h2">Enviar Mensagem</h1>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/dashboard')}
                >
                    Voltar ao Dashboard
                </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="userId" className="form-label">Selecionar Usuário</label>
                    <select
                        className="form-control"
                        id="userId"
                        name="userId"
                        value={formData.userId}
                        onChange={handleSelectChange}
                        required
                    >
                        <option value="">Selecione um usuário</option>
                        {usuarios.map((usuario) => (
                            <option key={usuario.id} value={usuario.id}>
                                {usuario.nome} (ID: {usuario.id})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="mensagem" className="form-label">Mensagem</label>
                    <textarea
                        className="form-control"
                        id="mensagem"
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleInputChange}
                        rows={5}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Mensagem"}
                </button>
            </form>
        </LayoutDashboard>
    );
}

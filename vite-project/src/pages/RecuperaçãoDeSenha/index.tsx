import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "../../components/LayoutDashboard";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

interface IRecuperacaoSenhaForm {
    email: string;
}

export default function RecuperacaoSenha() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<IRecuperacaoSenhaForm>();
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<IRecuperacaoSenhaForm> = (data) => {
        setLoading(true);

        axios.post('http://localhost:3001/usuarios/recuperar-senha', data)
            .then((response) => {
                alert("Instruções para recuperação de senha foram enviadas ao email informado.");
                navigate('/login');
            })
            .catch((error) => {
                console.error("Erro ao enviar recuperação de senha:", error);
                alert("Erro ao enviar recuperação de senha.");
            })
            .finally(() => setLoading(false));
    };

    return (
        <LayoutDashboard>
            <div className="d-flex justify-content-between mt-3">
                <h1 className="h2">Recuperação de Senha</h1>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/login')}
                >
                    Voltar ao Login
                </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        {...register('email', { required: "O email é obrigatório" })}
                    />
                    {errors.email && <p className="text-danger">{errors.email.message}</p>}
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Instruções"}
                </button>
            </form>
        </LayoutDashboard>
    );
}

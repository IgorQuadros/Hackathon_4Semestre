import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "../../components/LayoutDashboard";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

interface IRegistroForm {
    nome: string;
    email: string;
    senha: string;
    confirmacaoSenha: string;
}

export default function Registro() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch } = useForm<IRegistroForm>();
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<IRegistroForm> = (data) => {
        if (data.senha !== data.confirmacaoSenha) {
            alert("As senhas não coincidem.");
            return;
        }

        setLoading(true);

        axios.post('http://localhost:3001/usuarios/registro', data)
            .then((response) => {
                alert("Registro realizado com sucesso! Você pode fazer o login agora.");
                navigate('/login');
            })
            .catch((error) => {
                console.error("Erro ao registrar usuário:", error);
                alert("Erro ao registrar usuário.");
            })
            .finally(() => setLoading(false));
    };

    return (
        <LayoutDashboard>
            <div className="d-flex justify-content-between mt-3">
                <h1 className="h2">Registro de Usuário</h1>
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
                    <label htmlFor="nome" className="form-label">Nome</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nome"
                        {...register('nome', { required: "O nome é obrigatório" })}
                    />
                    {errors.nome && <p className="text-danger">{errors.nome.message}</p>}
                </div>
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
                <div className="mb-3">
                    <label htmlFor="senha" className="form-label">Senha</label>
                    <input
                        type="password"
                        className="form-control"
                        id="senha"
                        {...register('senha', { required: "A senha é obrigatória" })}
                    />
                    {errors.senha && <p className="text-danger">{errors.senha.message}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmacaoSenha" className="form-label">Confirmar Senha</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmacaoSenha"
                        {...register('confirmacaoSenha', {
                            required: "A confirmação de senha é obrigatória"
                        })}
                    />
                    {errors.confirmacaoSenha && <p className="text-danger">{errors.confirmacaoSenha.message}</p>}
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Registrando..." : "Registrar"}
                </button>
            </form>
        </LayoutDashboard>
    );
}

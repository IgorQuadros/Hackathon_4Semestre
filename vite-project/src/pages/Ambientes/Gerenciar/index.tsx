import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IToken } from "../../../interfaces/token";
import { verificaTokenExpirado } from "../../../services/token";
import { LayoutDashboard } from "../../../components/LayoutDashboard";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

interface IForm {
    nome: string;
    tipo: string;
    status: string;
    hora_funcionamento: string;
    descricao: string;
}

export default function GerenciarAmbientes() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<IForm>();

    const refForm = useRef<any>();
    const navigate = useNavigate();
    const { id } = useParams();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const action = searchParams.get('action');

    // Inicio, Update State, Destruir
    useEffect(() => {
        let lsStorage = localStorage.getItem('americanos.token');
        let token: IToken | null = null;

        if (typeof lsStorage === 'string') {
            token = JSON.parse(lsStorage);
        }

        if (!token || verificaTokenExpirado(token.accessToken)) {
            navigate("/");
        }

        const idAmbiente = Number(id);

        if (!isNaN(idAmbiente)) {
            axios.get(import.meta.env.VITE_URL + '/ambientes?id=' + idAmbiente)
                .then((res) => {
                    setIsEdit(action === "edit"); // Definir se é edição
                    setValue("nome", res.data[0].nome);
                    setValue("tipo", res.data[0].tipo);
                    setValue("status", res.data[0].status);
                    setValue("hora_funcionamento", res.data[0].hora_funcionamento);
                    setValue("descricao", res.data[0].descricao);
                });
        }

        if (action === "delete") {
            setIsDelete(true); // Habilitar modo de exclusão
        }
    }, [id]);

    const submitForm: SubmitHandler<IForm> = useCallback(
        async (data) => {
            if (isDelete) {
                if (window.confirm("Você tem certeza que deseja excluir o ambiente?")) {
                    try {
                        await axios.delete(import.meta.env.VITE_URL + "/ambientes/" + id);
                        navigate("/ambientes"); // Redireciona de volta para a lista de ambientes
                    } catch (error) {
                        console.error(error);
                    }
                }
            } else {
                if (isEdit) {
                    await axios.put(import.meta.env.VITE_URL + "/ambientes/" + id, data)
                        .then(() => {
                            navigate("/ambientes");
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                } else {
                    await axios.post(import.meta.env.VITE_URL + "/ambientes", data)
                        .then(() => {
                            navigate("/ambientes");
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                }
            }
        },
        [isDelete, isEdit, id]
    );

    return (
        <>
            <LayoutDashboard>
                <h1>
                    {isDelete ? "Excluir Ambiente" : (isEdit ? "Editar Ambiente" : "Adicionar Ambiente")}
                </h1>

                <form
                    className="row g-3 needs-validation mb-3"
                    noValidate
                    style={{
                        alignItems: 'center'
                    }}
                    onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        refForm.current.classList.add('was-validated');
                        handleSubmit(submitForm)(event);
                    }}
                    ref={refForm}
                >
                    <div className="col-md-12">
                        <label htmlFor="nome" className="form-label">Nome</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nome do Ambiente"
                            id="nome"
                            required
                            {...register('nome', {
                                required: 'Nome é obrigatório!',
                            })}
                        />
                        <div className="invalid-feedback">
                            {errors.nome && errors.nome.message}
                        </div>
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="tipo" className="form-label">Tipo</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tipo de Ambiente"
                            id="tipo"
                            required
                            {...register('tipo', {
                                required: 'Tipo é obrigatório!',
                            })}
                        />
                        <div className="invalid-feedback">
                            {errors.tipo && errors.tipo.message}
                        </div>
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="status" className="form-label">Status</label>
                        <select
                            className="form-select"
                            defaultValue={''}
                            id="status"
                            required
                            {...register("status", {
                                required: 'Selecione o status!',
                            })}
                        >
                            <option value="">Selecione o status</option>
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                        <div className="invalid-feedback">
                            {errors.status && errors.status.message}
                        </div>
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="hora_funcionamento" className="form-label">Hora de Funcionamento</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="08:00 - 18:00"
                            id="hora_funcionamento"
                            required
                            {...register('hora_funcionamento', {
                                required: 'Hora de funcionamento é obrigatória!',
                            })}
                        />
                        <div className="invalid-feedback">
                            {errors.hora_funcionamento && errors.hora_funcionamento.message}
                        </div>
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="descricao" className="form-label">Descrição</label>
                        <textarea
                            className="form-control"
                            placeholder="Descrição do Ambiente"
                            id="descricao"
                            required
                            {...register('descricao', {
                                required: 'Descrição é obrigatória!',
                            })}
                        />
                        <div className="invalid-feedback">
                            {errors.descricao && errors.descricao.message}
                        </div>
                    </div>

                    <div className="col-md-2 d-flex justify-content-between">
                        <button
                            type="submit"
                            className={isDelete ? "btn btn-danger" : (isEdit ? "btn btn-warning" : "btn btn-success")}
                        >
                            {isDelete ? "Excluir" : (isEdit ? "Editar" : "Adicionar")}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate(-1)}
                        >
                            Voltar
                        </button>
                    </div>
                </form>
            </LayoutDashboard>
        </>
    );
}

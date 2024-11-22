import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { IToken } from "../../../interfaces/token";
import { verificaTokenExpirado } from "../../../services/token";
import { LayoutDashboard } from "../../../components/LayoutDashboard";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

interface IForm {
    nome: string
    email: string
    password?: string
    permissoes: string
}

export default function GerenciarUsuarios() {

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<IForm>()

    const refForm = useRef<any>();

    const navigate = useNavigate();

    const { id } = useParams()

    const [isEdit, setIsEdit] = useState<boolean>(false)

    const [isDelete, setIsDelete] = useState<boolean>(false)

    const [searchParams] = useSearchParams();
    const action = searchParams.get('action');

    // Inicio, Update State, Destruir
    useEffect(() => {

        let lsStorage = localStorage.getItem('americanos.token')

        let token: IToken | null = null

        if (typeof lsStorage === 'string') {
            token = JSON.parse(lsStorage)
        }


        if (!token || verificaTokenExpirado(token.accessToken)) {

            navigate("/")
        }

        // console.log("Pode desfrutar do sistema :D")

        const idUser = Number(id)

        console.log(import.meta.env.VITE_URL)
        if (!isNaN(idUser)) {
            // sweetalert2
            axios.get(import.meta.env.VITE_URL + '/users?id=' + idUser)
                .then((res) => {
                    setIsEdit(action === "edit"); // Definir se é edição
                    setValue("nome", res.data[0].nome);
                    setValue("email", res.data[0].email);
                    setValue("permissoes", res.data[0].permissoes);
                    setValue('password', res.data[0].password);
                })
        }

        if (action === "delete") {
            setIsDelete(true); // Habilitar modo de exclusão
        }

    }, [id])


    const submitForm: SubmitHandler<IForm> = useCallback(
        async (data) => {
            if (isDelete) {
                // Exibe um alerta de confirmação antes de excluir
                if (window.confirm("Você tem certeza que deseja excluir o usuário?")) {
                    try {
                        await axios.delete(import.meta.env.VITE_URL + "/users/" + id);
                        navigate("/usuarios"); // Redireciona de volta para a lista de usuários
                    } catch (error) {
                        console.error(error);
                        // Aqui você pode implementar um alerta de erro (use SweetAlert2, por exemplo)
                    }
                }
            } else {
                if (isEdit) {
                    // Caso seja edição
                    await axios.put(import.meta.env.VITE_URL + "/users/" + id, data)
                        .then((res) => {
                            navigate("/usuarios");
                        })
                        .catch((err) => {
                            console.error(err);
                            // Aqui você pode implementar um alerta de erro
                        });
                } else {
                    // Caso seja criação
                    await axios.post(import.meta.env.VITE_URL + "/users", data)
                        .then((res) => {
                            navigate("/usuarios");
                        })
                        .catch((err) => {
                            console.error(err);
                            // Aqui você pode implementar um alerta de erro
                        });
                }
            }
        },
        [isDelete, isEdit, id] // Certifica-se de que a função se atualize com base nesses estados
      );


    return (
        <>
            <LayoutDashboard>
                <h1>
                    {isDelete ? "Excluir Usuário" : (isEdit ? "Editar Usuário" : "Adicionar Usuário")}
                </h1>

                <form
                    className="row g-3 needs-validation mb-3"
                    noValidate
                    style={{
                        alignItems: 'center'
                    }}
                    onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault()

                        refForm.current.classList.add('was-validated')

                        handleSubmit(submitForm)(event)

                    }}
                    ref={refForm}
                // ref={(valorReferenciaHtml) => { refForm.current = valorReferenciaHtml }}
                >
                    <div className="col-md-12">
                        <label
                            htmlFor="nome"
                            className="form-label"
                        >
                            Nome
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Yuri"
                            id="nome"
                            required
                            {...register('nome',
                                {
                                    required: 'Nome é obrigatório!',
                                }
                            )}
                        />
                        <div className="invalid-feedback">
                            {errors.nome && errors.nome.message}
                        </div>

                    </div>

                    <div className="col-md-12">
                        <label
                            htmlFor="email"
                            className="form-label"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Yuri"
                            id="email"
                            required
                            {...register('email',
                                {
                                    required: 'Email é obrigatório!',
                                }
                            )}
                        />
                        <div className="invalid-feedback">
                            {errors.email && errors.email.message}
                        </div>

                    </div>

                    <div className="col-md-12">
                        <label
                            htmlFor="permissoes"
                            className="form-label"
                        >
                            Perfil
                        </label>

                        <select
                            className="form-select"
                            defaultValue={''}
                            id="permissoes"
                            required
                            {
                            ...register("permissoes",
                                { required: 'Selecione' }
                            )
                            }
                        >
                            <option value="">
                                Selecione o tipo
                            </option>
                            <option value="admin">
                                Admin
                            </option>
                            <option value="colaborador">
                                Colaborador
                            </option>
                        </select>
                        <div className="invalid-feedback">
                            {errors.permissoes && errors.permissoes.message}
                        </div>
                    </div>

                    <div className="col-md-12">
                        <label
                            htmlFor="password"
                            className="form-label"
                        >
                            Senha
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Yuri"
                            id="password"
                            defaultValue={isEdit || isDelete ? '*' : ''} // Preenche automaticamente no modo de edição
                            readOnly={isEdit || isDelete} // Deixa o campo somente leitura no modo de edição e exclusão
                            disabled={isDelete} // Desabilita o campo no modo de exclusão
                            {
                                ...register('password', {
                                    required: !isEdit && !isDelete ? 'Senha é obrigatória!' : undefined, // Obrigatório apenas na criação
                                })
                            }
                        />
                        <div className="invalid-feedback">
                            {errors.password && errors.password.message}
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
                            onClick={() => navigate(-1)} // Volta para a página anterior
                        >
                            Voltar
                        </button>
                    </div>
                    
                </form>
            </LayoutDashboard>
        </>
    )
}
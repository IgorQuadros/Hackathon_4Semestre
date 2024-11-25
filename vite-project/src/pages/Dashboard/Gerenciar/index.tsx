import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LayoutDashboard } from "../../../components/LayoutDashboard";
import { IToken } from "../../../interfaces/token";
import { verificaTokenExpirado } from "../../../services/token";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

interface IForm {
  id_usuario: number;
  id_ambiente: number;
  inicio: string;
  fim: string;
  status: string;
}

export default function GerenciarAgendamentos() {
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

  // Configurações iniciais e busca de agendamento para edição
  useEffect(() => {
    let lsStorage = localStorage.getItem('americanos.token');
    let token: IToken | null = null;

    if (typeof lsStorage === 'string') {
      token = JSON.parse(lsStorage);
    }

    if (!token || verificaTokenExpirado(token.accessToken)) {
      navigate("/");
    }

    const idAgendamento = Number(id);

    if (!isNaN(idAgendamento)) {
      axios.get(`http://localhost:3001/agendamentos/${idAgendamento}`)
        .then((res) => {
          setIsEdit(action === "edit");
          setValue("id_usuario", res.data.id_usuario);
          setValue("id_ambiente", res.data.id_ambiente);
          setValue("inicio", res.data.inicio);
          setValue("fim", res.data.fim);
          setValue("status", res.data.status);
        });
    }

    if (action === "delete") {
      setIsDelete(true);
    }
  }, [id]);

  // Função para enviar o formulário
  const submitForm: SubmitHandler<IForm> = useCallback(
    async (data) => {
      if (isDelete) {
        if (window.confirm("Você tem certeza que deseja excluir o agendamento?")) {
          try {
            await axios.delete(`http://localhost:3001/agendamentos/${id}`);
            navigate("/agendamentos");
          } catch (error) {
            console.error("Erro ao excluir o agendamento:", error);
          }
        }
      } else {
        if (isEdit) {
          // Edição de um agendamento
          await axios.put(`http://localhost:3001/agendamentos/${id}`, data)
            .then(() => {
              navigate("/agendamentos");
            })
            .catch((err) => {
              console.error("Erro ao editar o agendamento:", err);
            });
        } else {
          // Criação de um novo agendamento
          await axios.post("http://localhost:3001/agendamentos", data)
            .then(() => {
              navigate("/agendamentos");
            })
            .catch((err) => {
              console.error("Erro ao criar o agendamento:", err);
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
          {isDelete ? "Excluir Agendamento" : (isEdit ? "Editar Agendamento" : "Adicionar Agendamento")}
        </h1>

        <form
          className="row g-3 needs-validation mb-3"
          noValidate
          style={{ alignItems: 'center' }}
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            refForm.current.classList.add('was-validated');
            handleSubmit(submitForm)(event);
          }}
          ref={refForm}
        >
          <div className="col-md-12">
            <label htmlFor="id_usuario" className="form-label">ID do Usuário</label>
            <input
              type="number"
              className="form-control"
              id="id_usuario"
              required
              {...register('id_usuario', { required: 'ID do usuário é obrigatório!' })}
            />
            <div className="invalid-feedback">
              {errors.id_usuario && errors.id_usuario.message}
            </div>
          </div>

          <div className="col-md-12">
            <label htmlFor="id_ambiente" className="form-label">ID do Ambiente</label>
            <input
              type="number"
              className="form-control"
              id="id_ambiente"
              required
              {...register('id_ambiente', { required: 'ID do ambiente é obrigatório!' })}
            />
            <div className="invalid-feedback">
              {errors.id_ambiente && errors.id_ambiente.message}
            </div>
          </div>

          <div className="col-md-12">
            <label htmlFor="inicio" className="form-label">Início</label>
            <input
              type="datetime-local"
              className="form-control"
              id="inicio"
              required
              {...register('inicio', { required: 'Data de início é obrigatória!' })}
            />
            <div className="invalid-feedback">
              {errors.inicio && errors.inicio.message}
            </div>
          </div>

          <div className="col-md-12">
            <label htmlFor="fim" className="form-label">Fim</label>
            <input
              type="datetime-local"
              className="form-control"
              id="fim"
              required
              {...register('fim', { required: 'Data de fim é obrigatória!' })}
            />
            <div className="invalid-feedback">
              {errors.fim && errors.fim.message}
            </div>
          </div>

          <div className="col-md-12">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              className="form-select"
              id="status"
              required
              {...register("status", { required: 'Selecione o status' })}
            >
              <option value="">Selecione o status</option>
              <option value="pendente">Pendente</option>
              <option value="confirmado">Confirmado</option>
              <option value="cancelado">Cancelado</option>
            </select>
            <div className="invalid-feedback">
              {errors.status && errors.status.message}
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            {isDelete ? "Excluir" : (isEdit ? "Salvar Alterações" : "Criar Agendamento")}
          </button>
        </form>
      </LayoutDashboard>
    </>
  );
}

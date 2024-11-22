import { useNavigate } from "react-router-dom"
import { LayoutDashboard } from "../../components/LayoutDashboard"
import { useEffect, useState } from "react"
import { IToken } from "../../interfaces/token"
import { validaPermissao, verificaTokenExpirado } from "../../services/token"
import { Loading } from "../../components/Loading"
import axios from "axios"

interface IUsuarios {
    id: number
    nome: string
    email: string
    permissoes: string
}

export default function Usuarios() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [dadosUsuarios, setDadosUsuarios] = useState<Array<IUsuarios>>([])

    const [userToDelete, setUserToDelete] = useState<number | null>(null)

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

        if(!validaPermissao(
            ['admin', 'secretarios'],
            token?.user.permissoes
        )){
            navigate('/dashboard')
        }

        console.log("Pode desfrutar do sistema :D")

        setLoading(true)
        axios.get('http://localhost:3001/users')
            .then((res) => {
                setDadosUsuarios(res.data)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })

    }, [])


    const handleEditClick = (id: number) => {
        navigate(`/usuarios/${id}?action=edit`); // Inclui a query string para sinalizar que a ação é editar
    }

    const handleDeleteClick = (id: number) => {
        navigate(`/usuarios/${id}?action=delete`); // Passa a query string para indicar que a ação é exclusão
    }


    return (
        <>
            <Loading visible={loading} />
            <LayoutDashboard>
                <div
                    className="d-flex justify-content-between mt-3"
                >
                    <h1 className="h2">Usuários</h1>

                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                            navigate('/usuarios/criar')
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
                            <th scope="col">Email</th>
                            <th scope="col">papel</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            dadosUsuarios.map((
                                usuario,
                                index
                            ) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{usuario.id}</th>
                                        <td>{usuario.nome}</td>
                                        <td>{usuario.email}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning"
                                                type="submit"
                                                style={{
                                                    marginRight: 5
                                                }}
                                                onClick={() => handleEditClick(usuario.id)} // Agora chama a função para editar
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                type="submit"
                                                style={{
                                                    marginRight: 5
                                                }}
                                                onClick={() => handleDeleteClick(usuario.id)} // Define o ID e navega para o filho
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>

                </table>
            </LayoutDashboard>
        </>
    )
}
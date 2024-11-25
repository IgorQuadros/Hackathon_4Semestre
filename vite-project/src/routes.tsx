import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Ambientes from './pages/Ambientes';
import HistoricoAgendamentos from './pages/HistoricoAgendamentos';
import EnviarMensagem from './pages/EnvioDeMensagem';
import Registro from './pages/Registro';
import Notificacoes from './pages/Notificações';
import RecuperacaoSenha from './pages/RecuperaçãoDeSenha';
import ListarAmbientes from './pages/ListagemAmbientes';
import AgendarAmbiente from './pages/ListagemAmbientes/Gerenciar';
import GerenciarUsuarios from './pages/Usuarios/Gerenciar';
import GerenciarDashboard from './pages/Dashboard/Gerenciar';
import GerenciarAmbientes from './pages/Ambientes/Gerenciar';


export const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/*Rota principal*/}
                <Route 
                    path='/'
                    element={<GerenciarDashboard />}
                />

                {/* Rota para página de Login */}
                <Route 
                    path='/login'
                    element={<Login />}
                />
                
                {/* Rota para página de Registro */}
                <Route 
                    path='/registro'
                    element={<Registro />}
                />

                {/* Rota para página de Listagem de Ambientes */}
                <Route 
                    path='/listarAmbientes'
                    element={<ListarAmbientes />}
                />

                {/* Rota para Recuperação de Senha */}
                <Route 
                    path='/recuperacao-senha'
                    element={<RecuperacaoSenha />}
                />

                {/* Rota para página de Dashboard */}
                <Route 
                    path='/dashboard'
                    element={<Dashboard />}
                />

                {/* Rota para página de Gerenciamento de Usuários */}
                <Route 
                    path='/usuarios'
                    element={<Usuarios />}
                />

                {/* Rota para página de Gerenciamento de Ambientes */}
                <Route 
                    path='/ambientes'
                    element={<Ambientes />}
                />

                {/* Rota para página de Histórico de Agendamentos */}
                <Route 
                    path='/historico-agendamentos'
                    element={<HistoricoAgendamentos />}
                />

                {/* Rota para página de Envio de Mensagem */}
                <Route 
                    path='/enviar-mensagem'
                    element={<EnviarMensagem />}
                />

                {/* Rota para página de Notificações */}
                <Route 
                    path='/notificacoes'
                    element={<Notificacoes />}
                />
            </Routes>
        </BrowserRouter>
    );
};

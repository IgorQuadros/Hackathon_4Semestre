import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IToken } from '../../interfaces/token';
import { validaPermissao } from '../../services/token';

interface IProps {
    children: ReactNode;
}

export const LayoutDashboard = (props: IProps) => {
    const [token, setToken] = useState<IToken | undefined>();

    useEffect(() => {
        let lsToken = localStorage.getItem('americanos.token');
        let token: IToken | undefined;

        if (typeof lsToken === 'string') {
            token = JSON.parse(lsToken);
            setToken(token);
        }
    }, []);

    return (
        <>
            {/* Header com menu */}
            <header className="header">
                <a className="navbar-brand" href="#">
                    Hackathon
                </a>
                <nav className="nav-menu">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                    {validaPermissao(['admin', 'secretarios'], token?.user.permissoes) && (
                        <Link className="nav-link" to="/usuarios">Usuários</Link>
                    )}
                    <Link className="nav-link" to="/ambientes">Ambientes</Link>
                    <Link className="nav-link" to="/historico">Histórico</Link>
                    <Link className="nav-link" to="/perfil">Perfil</Link>
                    <Link className="nav-link logout" to="/">Sair</Link>
                </nav>
            </header>

            {/* Conteúdo principal */}
            <main className="main-content">
                {props.children}
            </main>

            {/* Footer */}
            <footer className="footer">
                Desenvolvido por alunos da UniAlfa!
            </footer>

            {/* Estilos CSS */}
            <style>{`
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                body {
                    font-family: Arial, sans-serif;
                    color: #333;
                }

                .header {
                    background: linear-gradient(135deg, #184c32, #194d33);
                    padding: 15px 20px;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }

                .navbar-brand {
                    font-size: 1.5em;
                    font-weight: bold;
                    color: #f9f9fc;
                    text-decoration: none;
                }

                .nav-menu {
                    display: flex;
                    gap: 20px;
                }

                .nav-link {
                    color: #f9f9fc;
                    text-decoration: none;
                    font-size: 1em;
                    transition: color 0.3s ease;
                    position: relative;
                }

                .nav-link::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: -5px;
                    width: 100%;
                    height: 2px;
                    background-color: transparent;
                    transition: background-color 0.3s ease;
                }

                .nav-link:hover {
                    color: #9bcf68;
                }

                .nav-link:hover::after {
                    background-color: #9bcf68;
                }

                .logout {
                    background-color: #0072bb;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-weight: bold;
                    color: white;
                    transition: background-color 0.3s ease;
                }

                .logout:hover {
                    background-color: #ff006e;
                    color: white;
                }

                .main-content {
                    background-color: #f1f3f5;
                    padding: 30px;
                    min-height: calc(100vh - 160px);
                    box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.05);
                    border-radius: 8px;
                    margin: 20px auto;
                    max-width: 1200px;
                }

                .footer {
                    background-color: #184c32;
                    color: #f9f9fc;
                    padding: 15px;
                    text-align: center;
                    font-size: 0.9em;
                    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
                    position: sticky;
                    bottom: 0;
                }

                /* Media queries para responsividade */
                @media (max-width: 768px) {
                    .header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .nav-menu {
                        flex-direction: column;
                        width: 100%;
                        gap: 10px;
                    }

                    .main-content {
                        padding: 20px;
                    }
                }
            `}</style>
        </>
    );    
};

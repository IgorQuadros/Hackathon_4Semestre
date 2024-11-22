import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Usuarios from './pages/Usuarios'
import Ambientes from './pages/Ambientes'

export const Rotas = () => {
    
    return(
        <BrowserRouter>
            <Routes>

                <Route 
                    path='/'
                    element={<Ambientes />}
                />
                <Route 
                    path='/usuarios'
                    element={<Usuarios />}
                />

            </Routes>
        </BrowserRouter>
    )
}
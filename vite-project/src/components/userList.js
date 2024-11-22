import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/usuarios') // URL da API Laravel
            .then(response => {
                setUsers(response.data); // Armazena os usuários na variável de estado
            })
            .catch(error => {
                console.error('Erro ao carregar usuários:', error);
            });
    }, []);

    return (
        <div>
            <h1>Usuários</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name}</li> // Exibe os nomes dos usuários
                ))}
            </ul>
        </div>
    );
}

export default UserList;

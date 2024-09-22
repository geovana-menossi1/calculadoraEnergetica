document.addEventListener("DOMContentLoaded", function () {
    fetchUnidadesConsumidorasSelect(); // Preenche o select das unidades consumidoras
    
    // Evento para salvar dependência
    document.getElementById('dependenciaFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        const dependenciaId = document.getElementById('dependenciaId').value;
        if (dependenciaId) {
            saveDependencia('update');
        } else {
            saveDependencia('add');
        }
    });
});

function fetchUnidadesConsumidorasSelect() {
    fetch('http://localhost:8000/unidades-consumidoras')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const unidadeConsumidoraSelect = document.getElementById('unidadeConsumidoraSelect');
            unidadeConsumidoraSelect.innerHTML = '';
            data.unidades_consumidoras.forEach(unidade => {
                const option = document.createElement('option');
                option.value = unidade.id;
                option.text = `${unidade.nome}`;
                unidadeConsumidoraSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao buscar unidades consumidoras:', error));
}

function fetchDependencias() {
    const unidadeConsumidoraId = document.getElementById('unidadeConsumidoraSelect').value;
    fetch(`http://localhost:8000/dependencias/unidade-consumidora/${unidadeConsumidoraId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const dependenciasList = document.getElementById('dependenciasList');
            dependenciasList.innerHTML = '';
            data.dependencias.forEach(dependencia => {
                dependenciasList.innerHTML += `
                    <tr>
                        <td>${dependencia.id}</td>
                        <td>${dependencia.nome}</td>
                        <td>
                            <button class="editar" onclick="showUpdateDependenciaForm(${dependencia.id}, '${dependencia.nome}')">Atualizar</button>
                            <button class="excluir" onclick="deleteDependencia(${dependencia.id})">Deletar</button>
                            <button class="gerenciar" onclick="redirectToGerenciarDispositivos(${dependencia.id}, ${unidadeConsumidoraId})">Gerenciar Dispositivos</button>
                        </td>
                    </tr>`;
            });
        })
        .catch(error => console.error('Erro ao buscar dependências:', error));
}

function redirectToGerenciarDispositivos(dependenciaId, unidadeConsumidoraId) {
    window.location.href = `dispositivo.html?dependenciaId=${dependenciaId}&unidadeConsumidoraId=${unidadeConsumidoraId}`;
}


function showAddDependenciaForm() {
    document.getElementById('dependenciaId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('addModal').style.display = 'block'; 
}

function showUpdateDependenciaForm(id, nome) {
    document.getElementById('dependenciaId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('addModal').style.display = 'block';
}

function saveDependencia(type) {
    const id = document.getElementById('dependenciaId').value;
    const nome = document.getElementById('nome').value;
    const unidade_consumidora_id = document.getElementById('unidadeConsumidoraSelect').value;

    const method = type === 'add' ? 'POST' : 'PATCH';
    const url = type === 'add' ? 'http://localhost:8000/dependencias' : `http://localhost:8000/dependencias/${id}`;
    const body = JSON.stringify({ nome, unidade_consumidora_id });

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        fetchDependencias();
        document.getElementById('addModal').style.display = 'none';
    })
    .catch(error => console.error(`Erro ao ${type === 'add' ? 'adicionar' : 'atualizar'} dependência:`, error));
}

function deleteDependencia(id) {
    fetch(`http://localhost:8000/dependencias/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        fetchDependencias();
    })
    .catch(error => console.error('Erro ao deletar dependência:', error));
}

document.getElementById('closeModal').onclick = function() {
    document.getElementById('addModal').style.display = 'none'; 
}

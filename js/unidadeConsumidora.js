document.addEventListener("DOMContentLoaded", function () {
    fetchTiposConsumidores();
    fetchUnidadesConsumidoras();

    document.getElementById('unidadeConsumidoraFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveUnidadeConsumidora();
    });

    document.getElementById('addItemBtn').onclick = function() {
        showForm();
    };

    document.getElementById('closeModal').onclick = function() {
        document.getElementById('addModal').style.display = 'none';
    };

    document.getElementById('closeDependenciasModal').onclick = function() {
        document.getElementById('dependenciasModal').style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == document.getElementById('addModal')) {
            document.getElementById('addModal').style.display = 'none';
        }
        if (event.target == document.getElementById('dependenciasModal')) {
            document.getElementById('dependenciasModal').style.display = 'none';
        }
    };
});

function fetchTiposConsumidores() {
    fetch('http://localhost:8000/tipos-consumidores')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('tipoConsumidor');
            select.innerHTML = '';
            if (data.tipos_consumidores && Array.isArray(data.tipos_consumidores)) {
                data.tipos_consumidores.forEach(tipo => {
                    select.innerHTML += `<option value="${tipo.id}">${tipo.nome}</option>`;
                });
            } else {
                console.error("A resposta da API não contém uma lista válida:", data);
            }
        })
        .catch(error => console.error('Erro ao buscar tipos de consumidores:', error));
}

function fetchUnidadesConsumidoras() {
    fetch('http://localhost:8000/unidades-consumidoras')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('unidadeConsumidoraList');
            list.innerHTML = '';
            if (data.unidades_consumidoras && Array.isArray(data.unidades_consumidoras)) {
                data.unidades_consumidoras.forEach(unidade => {
                    fetch(`http://localhost:8000/tipos-consumidores/${unidade.tipo_id}`)
                        .then(response => response.json())
                        .then(tipo => {
                            list.innerHTML += `
                            <tr>
                                <td>${unidade.id}</td>
                                <td>${unidade.nome}</td>
                                <td>${tipo.nome}</td>
                                <td>
                                    <button class="editar" onclick="editUnidadeConsumidora(${unidade.id}, '${unidade.nome}', ${unidade.tipo_id})">Editar</button>
                                    <button class="excluir" onclick="deleteUnidadeConsumidora(${unidade.id})">Excluir</button>
                                </td>
                            </tr>`;
                        })
                        .catch(error => console.error('Erro ao buscar tipo de consumidor:', error));
                });
            } else {
                console.error("A resposta da API não contém uma lista válida:", data);
            }
        })
        .catch(error => console.error('Erro ao buscar unidades consumidoras:', error));
}
function showForm() {
    document.getElementById('addModal').style.display = 'block';
    document.getElementById('formTitle').innerText = 'Adicionar Nova Unidade Consumidora';
    document.getElementById('unidadeConsumidoraId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('tipoConsumidor').value = '';
}

function editUnidadeConsumidora(id, nome, tipoId) {
    document.getElementById('addModal').style.display = 'block';
    document.getElementById('formTitle').innerText = 'Editar Unidade Consumidora';
    document.getElementById('unidadeConsumidoraId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('tipoConsumidor').value = tipoId;
}

function saveUnidadeConsumidora() {
    const id = document.getElementById('unidadeConsumidoraId').value;
    const nome = document.getElementById('nome').value;
    const tipoId = document.getElementById('tipoConsumidor').value;
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/unidades-consumidoras/${id}` : 'http://localhost:8000/unidades-consumidoras';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, tipo_id: tipoId })
    })
    .then(response => response.json())
    .then(data => {
        fetchUnidadesConsumidoras();
        document.getElementById('addModal').style.display = 'none';
    })
    .catch(error => console.error('Erro ao salvar unidade consumidora:', error));
}

function deleteUnidadeConsumidora(id) {
    if (confirm('Deseja realmente excluir esta unidade consumidora?')) {
        fetch(`http://localhost:8000/unidades-consumidoras/${id}`, {
            method: 'DELETE'
        })
        .then(() => fetchUnidadesConsumidoras())
        .catch(error => console.error('Erro ao excluir unidade consumidora:', error));
    }
}
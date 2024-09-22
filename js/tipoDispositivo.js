document.addEventListener("DOMContentLoaded", function () {
    fetchTiposDispositivos();
    document.getElementById('tipoDispositivoFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveTipoDispositivo();
    });

    document.getElementById('addItemBtn').onclick = function() {
        showAddForm();
    }

    document.getElementById('closeModal').onclick = function() {
        document.getElementById('addModal').style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == document.getElementById('addModal')) {
            document.getElementById('addModal').style.display = 'none';
        }
    }
});

function fetchTiposDispositivos() {
    fetch('http://localhost:8000/tipos-dispositivos')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('tiposDispositivosList');
            list.innerHTML = '';
            data.tipos_dispositivos.forEach(dispositivo => {
                list.innerHTML += `
                <tr>
                    <td>${dispositivo.id}</td>
                    <td>${dispositivo.nome}</td>
                    <td>
                        <button class="editar" onclick="showEditForm(${dispositivo.id}, '${dispositivo.nome}')">Editar</button>
                        <button class="excluir" onclick="deleteTipoDispositivo(${dispositivo.id})">Excluir</button>
                    </td>
                </tr>`;
            });
        })
        .catch(error => console.error('Erro ao buscar tipos de dispositivos:', error));
}

function showAddForm() {
    document.getElementById('addModal').style.display = 'block';
    document.getElementById('tipoDispositivoId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Novo Tipo de Dispositivo';
}

function showEditForm(id, nome) {
    document.getElementById('addModal').style.display = 'block';
    document.getElementById('tipoDispositivoId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('formTitle').innerText = 'Editar Tipo de Dispositivo';
}

function saveTipoDispositivo() {
    const id = document.getElementById('tipoDispositivoId').value;
    const nome = document.getElementById('nome').value;
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/tipos-dispositivos/${id}` : 'http://localhost:8000/tipos-dispositivos';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome })
    })
    .then(response => response.json())
    .then(() => {
        fetchTiposDispositivos();
        document.getElementById('addModal').style.display = 'none';
    })
    .catch(error => console.error('Erro ao salvar tipo de dispositivo:', error));
}

function deleteTipoDispositivo(id) {
    if (confirm('Deseja realmente excluir este tipo de dispositivo?')) {
        fetch(`http://localhost:8000/tipos-dispositivos/${id}`, {
            method: 'DELETE'
        })
        .then(() => fetchTiposDispositivos())
        .catch(error => console.error('Erro ao deletar tipo de dispositivo:', error));
    }
}

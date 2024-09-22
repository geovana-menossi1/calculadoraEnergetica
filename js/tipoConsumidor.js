document.addEventListener("DOMContentLoaded", function () {
    fetchTiposConsumidores();
    document.getElementById('formTipoConsumidor').addEventListener('submit', function (event) {
        event.preventDefault();
        saveTipoConsumidor();
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

function fetchTiposConsumidores() {
    fetch('http://localhost:8000/tipos-consumidores')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('tipoConsumidorList');
            list.innerHTML = '';
            data.tipos_consumidores.forEach(tipo => {
                list.innerHTML += `
                <tr>
                    <td>${tipo.id}</td>
                    <td>${tipo.nome}</td>
                    <td>${tipo.valor_kwh}</td>
                    <td>
                        <button class="editar" onclick="showEditForm(${tipo.id}, '${tipo.nome}', ${tipo.valor_kwh})">Editar</button>
                        <button class="excluir" onclick="deleteTipoConsumidor(${tipo.id})">Excluir</button>
                    </td>
                </tr>`;
            });
        })
        .catch(error => console.error('Erro ao buscar tipos de consumidores:', error));
}

function showAddForm() {
    document.getElementById('addModal').style.display = 'block';
    document.getElementById('tipoConsumidorId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('valor_kwh').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Novo Tipo de Consumidor';
}

function showEditForm(id, nome, valor_kwh) {
    document.getElementById('addModal').style.display = 'block';
    document.getElementById('tipoConsumidorId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('valor_kwh').value = valor_kwh;
    document.getElementById('formTitle').innerText = 'Editar Tipo de Consumidor';
}

function saveTipoConsumidor() {
    const id = document.getElementById('tipoConsumidorId').value;
    const nome = document.getElementById('nome').value;
    const valor_kwh = document.getElementById('valor_kwh').value;
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/tipos-consumidores/${id}` : 'http://localhost:8000/tipos-consumidores';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, valor_kwh: valor_kwh })
    })
        .then(response => response.json())
        .then(() => {
            fetchTiposConsumidores();
            document.getElementById('addModal').style.display = 'none';
        })
        .catch(error => console.error('Erro ao salvar tipo de consumidor:', error));
}

function deleteTipoConsumidor(id) {
    if (confirm('Deseja realmente excluir este tipo de consumidor?')) {
        fetch(`http://localhost:8000/tipos-consumidores/${id}`, {
            method: 'DELETE'
        })
            .then(() => fetchTiposConsumidores())
            .catch(error => console.error('Erro ao excluir tipo de consumidor:', error));
    }
}

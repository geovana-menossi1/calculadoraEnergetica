document.addEventListener("DOMContentLoaded", function () {
    fetchBandeiras();
    document.getElementById('bandeiraFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveBandeira();
    });
});

function fetchBandeiras() {
    fetch('http://localhost:8000/bandeiras')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('bandeirasList');
            list.innerHTML = '';
            data.bandeiras.forEach(bandeira => {
                list.innerHTML += `
                <tr>
                    <td>${bandeira.id}</td>
                    <td>${bandeira.nome}</td>
                    <td>${bandeira.tarifa}</td>
                    <td>
                        <button class="editar" onclick="showEditForm(${bandeira.id}, '${bandeira.nome}', '${bandeira.tarifa}')">Editar</button>
                        <button class="excluir" onclick="deleteBandeira(${bandeira.id})">Excluir</button>
                    </td>
                </tr>`;
            });
        })
        .catch(error => console.error('Erro ao buscar bandeiras:', error));
}

function showAddForm() {
    document.getElementById('addModal').style.display = 'block';
    document.getElementById('bandeiraId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('tarifa').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Nova Bandeira';
}

function showEditForm(id, nome, tarifa) {
    document.getElementById('addModal').style.display = 'block';
    document.getElementById('bandeiraId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('tarifa').value = tarifa;
    document.getElementById('formTitle').innerText = 'Editar Bandeira';
}

function saveBandeira() {
    const id = document.getElementById('bandeiraId').value;
    const nome = document.getElementById('nome').value;
    const tarifa = document.getElementById('tarifa').value;
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/bandeiras/${id}` : 'http://localhost:8000/bandeiras';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, tarifa: tarifa })
    })
        .then(response => response.json())
        .then(() => {
            fetchBandeiras();
            document.getElementById('addModal').style.display = 'none';
        })
        .catch(error => console.error('Erro ao salvar bandeira:', error));
}

function deleteBandeira(id) {
    if (confirm('Deseja realmente excluir esta bandeira?')) {
        fetch(`http://localhost:8000/bandeiras/${id}`, {
            method: 'DELETE'
        })
            .then(() => fetchBandeiras())
            .catch(error => console.error('Erro ao deletar bandeira:', error));
    }
}

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

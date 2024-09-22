document.addEventListener("DOMContentLoaded", function () {
    const origemSelect = document.getElementById('origemDoConsumo');
    const itemSelect = document.getElementById('itemId');
    const residenciaContainer = document.getElementById('residenciaContainer');
    const residenciaSelect = document.getElementById('residenciaId');
    const dependenciaSelect = document.getElementById('dependenciaId');
    const dispositivoContainer = document.getElementById('dispositivoContainer');
    const oi = document.getElementById('oi');

    origemSelect.addEventListener('change', function () {
        const origem = this.value;
        if (origem === 'dependencias') {
            residenciaContainer.style.display = 'block';
            dispositivoContainer.style.display = 'none';
            itemSelect.style.display = 'block'; // Mostrar campo itemId
            itemSelect.required = true; // Adicionar o atributo required
            loadResidencias();
        } else if (origem === 'dispositivos') {
            residenciaContainer.style.display = 'block';
            dispositivoContainer.style.display = 'block';
            itemSelect.style.display = 'none'; // Esconder campo itemId
            oi.style.display = 'none'; // Esconder campo itemId
            itemSelect.required = false; // Remover o atributo required
            loadResidencias();
        } else {
            residenciaContainer.style.display = 'none';
            dispositivoContainer.style.display = 'none';
            itemSelect.style.display = 'block'; // Esconder campo itemId
            itemSelect.required = true; // Remover o atributo required
            loadResidencias();
            if (origem) {
                loadItemIds(origem);
            } else {
                itemSelect.innerHTML = '<option value="">Selecione um item</option>';
            }
        }
    });

    residenciaSelect.addEventListener('change', function () {
        const residenciaId = this.value;
        if (residenciaId) {
            loadDependencias(residenciaId);
            if (origemSelect.value === 'dispositivos') {
                loadDispositivos(residenciaId);
            }
        } else {
            dependenciaSelect.innerHTML = '<option value="">Selecione um cômodo</option>';
            dispositivoSelect.innerHTML = '<option value="">Selecione um dispositivo</option>';
        }
    });

    itemSelect.addEventListener('change', function () {
        const dependenciaId = this.value;
        if (dependenciaId) {
            loadDispositivos(dependenciaId);
        } else {
            dispositivoSelect.innerHTML = '<option value="">Selecione um dispositivo</option>';
        }
    });

    document.getElementById('consumoForm').addEventListener('submit', function (event) {
        event.preventDefault();
        calcularConsumo();
    });
});

function loadResidencias() {
    fetch(`http://localhost:8000/unidades-consumidoras`)
        .then(response => response.json())
        .then(data => {
            const residenciaSelect = document.getElementById('residenciaId');
            residenciaSelect.innerHTML = '<option value="">Selecione uma residência</option>';
            data.unidades_consumidoras.forEach(residencia => {
                residenciaSelect.innerHTML += `<option value="${residencia.id}">${residencia.nome || residencia.id}</option>`;
            });
        })
        .catch(error => console.error('Erro ao carregar as residências:', error));
}

function loadDependencias(residenciaId) {
    fetch(`http://localhost:8000/dependencias/unidade-consumidora/${residenciaId}`)
        .then(response => response.json())
        .then(data => {
            const itemId = document.getElementById('itemId');
            itemId.innerHTML = '<option value="">Selecione um cômodo</option>';
            data.dependencias.forEach(dependencia => {
                itemId.innerHTML += `<option value="${dependencia.id}">${dependencia.nome || dependencia.id}</option>`;
            });
        })
        .catch(error => console.error('Erro ao carregar os cômodos:', error));
}

function loadDispositivos(residenciaId) {
    fetch(`http://localhost:8000/dispositivos/unidades-consumidoras/${residenciaId}`)
        .then(response => response.json())
        .then(data => {
            const dispositivoSelect = document.getElementById('dispositivoId');
            dispositivoSelect.innerHTML = '<option value="">Selecione um dispositivo</option>';
            if (data.dispositivos) {
                data.dispositivos.forEach(dispositivo => {
                    dispositivoSelect.innerHTML += `<option value="${dispositivo.id}">${dispositivo.nome || dispositivo.id} - Consumo: ${dispositivo.consumo} kWh - Uso diário: ${dispositivo.uso_diario} horas</option>`;
                });
            } else {
                console.error('Dados de dispositivos não encontrados:', data);
            }
        })
        .catch(error => console.error('Erro ao carregar os dispositivos:', error));
}

function loadItemIds(origem) {
    const itemSelect = document.getElementById('itemId');
    let url;

    if (origem === 'dispositivos') {
        const residenciaId = document.getElementById('residenciaId').value;
        if (residenciaId) {
            url = `http://localhost:8000/dispositivos/unidades-consumidoras/${residenciaId}`;
        } else {
            console.error('ID da residência não encontrado.');
            return;
        }
    } else {
        url = `http://localhost:8000/unidades-consumidoras`;
    } 

    if (url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                itemSelect.innerHTML = '<option value="">Selecione um item</option>';
                if (origem === 'dispositivos') {
                    if (data.dispositivos) {
                        data.dispositivos.forEach(item => {
                            itemSelect.innerHTML += `
                            <option value="${item.id}">
                              ${item.nome || item.id} - Consumo: ${item.consumo} kWh - Uso diário: ${item.uso_diario} horas
                            </option>
                          `;
                        });
                    } else {
                        console.error('Dados de dispositivos não encontrados:', data);
                    }
                } else {
                    if (data.unidades_consumidoras) {
                        data.unidades_consumidoras.forEach(item => {
                            itemSelect.innerHTML += `<option value="${item.id}">${item.nome || item.id}</option>`;
                        });
                    } else {
                        console.error('Dados de unidades consumidoras não encontrados:', data);
                    }
                }
            })
            .catch(error => console.error('Erro ao carregar os IDs dos itens:', error));
    } else {
        itemSelect.innerHTML = '<option value="">Selecione um item</option>';
    }
}

function calcularConsumo() {
    let origemDoConsumo = document.getElementById('origemDoConsumo').value;
    let itemId = document.getElementById('itemId').value;
    let dispositivoId = document.getElementById('dispositivoId').value;
    let residenciaId = document.getElementById('residenciaId').value;
    
    if (!itemId && !dispositivoId) {
        alert("Por favor, selecione um item.");
        return;
    }

    let url;

    if (origemDoConsumo === 'dispositivos') {
        url = `http://localhost:8000/dispositivos/unidades-consumidoras/?${residenciaId}`;
    } else if (origemDoConsumo === 'dependencias') {
        url = `http://localhost:8000/consumos/dependencia?dependencia_id=${itemId}&ban8deira_id=${document.getElementById('bandeiraId').value}`;
    } else if (origemDoConsumo === 'unidades-consumidoras') {
        url = `http://localhost:8000/consumos/unidade-consumidora?unidade_consumidora_id=${itemId}&bandeira_id=${document.getElementById('bandeiraId').value}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Dados recebidos:', data);
            if (origemDoConsumo === 'dispositivos') {
                // Supondo que a resposta contenha uma lista de dispositivos e uma bandeira
                const dispositivos = data.dispositivos;
                const bandeira = data.bandeira;
                const consumo = calcularConsumo(dispositivos, bandeira);
                mostrarResultado(consumo);
            } else {
                mostrarResultado(data);
            }
        })
        .catch(error => console.error('Erro ao calcular o consumo:', error));
}


function mostrarResultado(data) {
    const resultadoDiv = document.getElementById('resultado');
    console.log(data)
    if (data && data.consumo_diario !== undefined && data.consumo_mensal !== undefined && data.consumo_anual !== undefined) {
        resultadoDiv.innerHTML = `
            <div class="alert alert-success" role="alert">
                <h4>Consumo Calculado:</h4>
                <p><strong>Consumo Diário:</strong> ${data.consumo_diario} kWh</p>
                <p><strong>Consumo Mensal:</strong> ${data.consumo_mensal} kWh</p>
                <p><strong>Consumo Anual:</strong> ${data.consumo_anual} kWh</p>
                <p><strong>Custo Diário:</strong> R$ ${data.custo_diario.toFixed(2)}</p>
                <p><strong>Custo Mensal:</strong> R$ ${data.custo_mensal.toFixed(2)}</p>
                <p><strong>Custo Anual:</strong> R$ ${data.custo_anual.toFixed(2)}</p>
            </div>`;
    } else {
        resultadoDiv.innerHTML = '<div class="alert alert-danger" role="alert">Não  possível calcular o cofoinsumo.</div>';
    }
}


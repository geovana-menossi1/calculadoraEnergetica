// Exemplo de dados fictícios - substitua isso com os dados reais do seu banco de dados
const dados = {
    bandeiras: [
        { nome: 'Bandeira 1', quantidade: 5 },
        { nome: 'Bandeira 2', quantidade: 3 },
        // Adicione mais bandeiras conforme necessário
    ],
    tiposDispositivos: [
        { nome: 'Tipo 1', quantidade: 10 },
        { nome: 'Tipo 2', quantidade: 7 },
        // Adicione mais tipos de dispositivos conforme necessário
    ],
    unidadesConsumidoras: [
        { nome: 'Unidade 1', quantidade: 8 },
        { nome: 'Unidade 2', quantidade: 4 },
        // Adicione mais unidades consumidoras conforme necessário
    ]
};

// Função para criar gráfico
function criarGrafico(ctx, labels, data, label) {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Inicializar gráficos com dados
document.addEventListener('DOMContentLoaded', () => {
    const bandeirasCtx = document.getElementById('bandeirasChart').getContext('2d');
    const tiposDispositivosCtx = document.getElementById('tiposDispositivosChart').getContext('2d');
    const unidadesConsumidorasCtx = document.getElementById('unidadesConsumidorasChart').getContext('2d');

    criarGrafico(
        bandeirasCtx,
        dados.bandeiras.map(b => b.nome),
        dados.bandeiras.map(b => b.quantidade),
        'Quantidade de Bandeiras'
    );

    criarGrafico(
        tiposDispositivosCtx,
        dados.tiposDispositivos.map(t => t.nome),
        dados.tiposDispositivos.map(t => t.quantidade),
        'Quantidade de Tipos de Dispositivos'
    );

    criarGrafico(
        unidadesConsumidorasCtx,
        dados.unidadesConsumidoras.map(u => u.nome),
        dados.unidadesConsumidoras.map(u => u.quantidade),
        'Quantidade de Unidades Consumidoras'
    );
});

// Variable donde se guardarán los datos tras cargarse del JSON
let datosDiccionario = []; 

// Referencias a los elementos del DOM
const inputUchina = document.getElementById('buscarUchina'); 
const inputSignificado = document.getElementById('buscarSignificado'); 
const contenedorResultados = document.getElementById('resultados'); 

// Matriz de conversión de Romaji a Katakana
const mapaKatakana = {
    'byu': 'ビュ', 'byo': 'ビョ', 'bya': 'ビャ',
    'chyu': 'チュ', 'chyo': 'チョ', 'chya': 'チャ',
    'shyu': 'シュ', 'shyo': 'ショ', 'shya': 'シャ',
    'myu': 'ミュ', 'myo': 'ミョ', 'mya': 'ミャ',
    'kyu': 'キュ', 'kyo': 'キョ', 'kya': 'キャ',
    'gyu': 'ギュ', 'gyo': 'ギョ', 'gya': 'ギャ',
    'nyu': 'ニュ', 'nyo': 'ニョ', 'nya': 'ニャ',
    'hyu': 'ヒュ', 'hyo': 'ヒョ', 'hya': 'ヒャ',
    'ryu': 'リュ', 'ryo': 'リョ', 'rya': 'リャ',
    'pyu': 'ピュ', 'pyo': 'ピョ', 'pya': 'ピャ',
    'fyu': 'フュ', 'fyo': 'フョ', 'fya': 'フャ',
    
    'chi': 'チ', 'shi': 'シ', 'tsu': 'ツ', 'fui': 'フィ', 'fee': 'フェー',
    
    'ka': 'カ', 'ki': 'キ', 'ku': 'ク', 'ke': 'ケ', 'ko': 'コ',
    'sa': 'サ', 'si': 'シ', 'su': 'ス', 'se': 'セ', 'so': 'ソ',
    'ta': 'タ', 'ti': 'チ', 'tu': 'ツ', 'te': 'テ', 'to': 'ト',
    'na': 'ナ', 'ni': 'ニ', 'nu': 'ヌ', 'ne': 'ネ', 'no': 'ノ',
    'ha': 'ハ', 'hi': 'ヒ', 'fu': 'フ', 'he': 'ヘ', 'ho': 'ホ',
    'ma': 'マ', 'mi': 'ミ', 'mu': 'ム', 'me': 'メ', 'mo': 'モ',
    'ya': 'ヤ', 'yu': 'ユ', 'yo': 'ヨ',
    'ra': 'ラ', 'ri': 'リ', 'ru': 'ル', 're': 'レ', 'ro': 'ロ',
    'wa': 'ワ', 'wo': 'ヲ', 'nn': 'ン', 'n': 'ン',
    
    'ga': 'ガ', 'gi': 'ギ', 'gu': 'グ', 'ge': 'ゲ', 'go': 'ゴ',
    'za': 'ザ', 'zi': 'ジ', 'ji': 'ジ', 'zu': 'ズ', 'ze': 'ゼ', 'zo': 'ゾ',
    'da': 'ダ', 'di': 'ヂ', 'du': 'ヅ', 'de': 'デ', 'do': 'ド',
    'ba': 'バ', 'bi': 'ビ', 'bu': 'ブ', 'be': 'ベ', 'bo': 'ボ',
    'pa': 'パ', 'pi': 'ピ', 'pu': 'プ', 'pe': 'ペ', 'po': 'ポ',
    
    'a': 'ア', 'i': 'イ', 'u': 'ウ', 'e': 'エ', 'o': 'オ',
    '-': 'ー'
};

function romajiAKatakana(texto) {
    let resultado = texto.toLowerCase();
    resultado = resultado.replace(/aa/g, 'ア-').replace(/ii/g, 'イ-').replace(/uu/g, 'ウ-').replace(/ee/g, 'エ-').replace(/oo/g, 'オ-');
    const llavesOrdenadas = Object.keys(mapaKatakana).sort((a, b) => b.length - a.length);
    
    for (let patron of llavesOrdenadas) {
        const reg = new RegExp(patron, 'g');
        resultado = resultado.replace(reg, mapaKatakana[patron]);
    }
    resultado = resultado.replace(/-ー/g, 'ー').replace(/-/g, 'ー');
    return resultado;
}

function normalizarTexto(texto) {
    if (!texto) return "";
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function filtrarDiccionario() {
    const textoOriginalUchina = inputUchina.value.trim();
    const valorSignificado = normalizarTexto(inputSignificado.value).trim();
    const valorUchinaConvertido = romajiAKatakana(textoOriginalUchina);

    const resultadosFiltrados = datosDiccionario.filter(item => {
        const palabraNorm = normalizarTexto(item.palabra); 
        const romajiNorm = normalizarTexto(item.romaji || ""); 
        const significadoNorm = normalizarTexto(item.significado); 
        
        // Coincidencia en palabra, romaji o conversión automática
        const coincideUchina = palabraNorm.includes(normalizarTexto(textoOriginalUchina)) || 
                               romajiNorm.includes(normalizarTexto(textoOriginalUchina)) ||
                               palabraNorm.includes(valorUchinaConvertido);
                               
        const coincideSignificado = significadoNorm.includes(valorSignificado);

        return coincideUchina && coincideSignificado;
    });

    mostrarResultados(resultadosFiltrados);
}

inputUchina.addEventListener('input', (e) => {
    if (e.target.value.trim() !== "") inputSignificado.value = ''; 
    filtrarDiccionario(); 
});

inputSignificado.addEventListener('input', (e) => {
    if (e.target.value.trim() !== "") inputUchina.value = ''; 
    filtrarDiccionario(); 
});

function mostrarResultados(lista) {
    contenedorResultados.innerHTML = ''; 
    
    if (lista.length === 0) {
        contenedorResultados.innerHTML = '<p style="text-align:center; color:#95a5a6;">No se encontraron palabras.</p>';
        return;
    }

    const palabrasA_Mostrar = lista.slice(0, 50);

    palabrasA_Mostrar.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('word-card'); 
        // Se muestra el Romaji si existe
        card.innerHTML = `
            <h3>${item.palabra}</h3>
            ${item.romaji ? `<p><em>${item.romaji}</em></p>` : ''}
            <p>${item.significado}</p>
        `;
        contenedorResultados.appendChild(card);
    });

    if (lista.length > 50) {
        const aviso = document.createElement('p');
        aviso.style.cssText = "text-align:center; color:#7f8c8d; font-size:14px; margin-top:15px;";
        aviso.innerText = `Mostrando 50 de ${lista.length} resultados.`;
        contenedorResultados.appendChild(aviso);
    }
}

async function cargarDiccionario() {
    try {
        contenedorResultados.innerHTML = '<p style="text-align:center;">Cargando diccionario...</p>';
        const respuesta = await fetch('diccionario.json');
        if (!respuesta.ok) throw new Error(`Error: ${respuesta.status}`);
        
        datosDiccionario = await respuesta.json();
        datosDiccionario.sort((a, b) => a.palabra.localeCompare(b.palabra));
        filtrarDiccionario(); 
    } catch (error) {
        console.error("Error:", error);
        contenedorResultados.innerHTML = '<p style="text-align:center; color:red;">Error al cargar el archivo JSON.</p>';
    }
}

cargarDiccionario();
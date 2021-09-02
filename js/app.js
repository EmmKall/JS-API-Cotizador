const criptomonedaSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');

let objMoneda = {
    moneda: '',
    criptomoneda: '',
};

//Promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve (criptomonedas);
} );

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    monedaSelect.addEventListener('change', leerValor);
    criptomonedaSelect.addEventListener('change', leerValor);

    formulario.addEventListener('submit', procesarFormulario);
});

function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    
    fetch( url )
        .then( respuesta => respuesta.json() )
        .then( datos => obtenerCriptomonedas( datos.Data ) )
        .then( criptomonedas => selectCriptomonedas( criptomonedas) )
}

function leerValor(e){
    objMoneda[e.target.name] = e.target.value;
}

function selectCriptomonedas( criptomonedas ) {
    criptomonedas.forEach( criptomoneda => {
        const { FullName, Name } = criptomoneda.CoinInfo;
        
        const option = document.createElement('OPTION');
        option.value= Name;
        option.textContent = FullName;
        criptomonedaSelect.appendChild( option );

    })
}

function procesarFormulario(e){
    e.preventDefault();
    const { moneda, criptomoneda } = objMoneda;
    if( moneda === '' || criptomoneda === '' ){
        mostrarAlerta('Seleccione ambos campos', 'error');
        return;
    }
    mostrarAlerta('Validando');
    obtenerConsulta();
}

function mostrarAlerta(mensaje, tipo = 'success'){
    
    const alerta = document.querySelector('.alert');
    if( alerta ) alerta.remove();
    
    const mensajeDiv = document.createElement('DIV');
    mensajeDiv.classList.add('alert');

    mensajeDiv.textContent = mensaje;    
    if( tipo === 'error') mensajeDiv.classList.add('error');
    else mensajeDiv.classList.add('success');

    formulario.appendChild( mensajeDiv );
    setTimeout(() => {
        mensajeDiv.remove();
    }, 3000);
}

function obtenerConsulta(){
    const { moneda, criptomoneda } = objMoneda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    
    mostrarSpinner();

    setTimeout(() => {
        fetch( url )
        .then( respuesta => respuesta.json() )
        .then( data => mostarValor( data.DISPLAY[criptomoneda][moneda] ) );
    }, 2500);
}

function mostrarSpinner(){

    const div = document.querySelector('.spinner');
    if( div ) div.remove();

    const spinnerDiv = document.querySelector('.divSpinner');
    const spinner = document.createElement('DIV');
    spinner.innerHTML = `
        <div class="spinner" id="spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
        </div>
    `;

    spinnerDiv.appendChild( spinner );

    setTimeout(() => {
        spinner.remove();
    }, 3000);

}

function mostarValor( data ) {

    const { moneda } = objMoneda;
    const { PRICE, LASTUPDATE, CHANGEPCT24HOUR, HIGHDAY, LOWDAY } = data;
    
    const resultado = document.createElement('DIV');

    const resultadoAnterior = document.querySelector('.resultado');
    if ( resultadoAnterior ) resultadoAnterior.remove();
    
    resultado.classList.add('resultado', 'mostrar');
    resultado.innerHTML = `
        <h2>Moneda: ${moneda}</h2>
        <p class="precio">Price = <span>${PRICE}</span></p>
        <p>Precio Máximo del día: <span>${HIGHDAY}</span></p>
        <p>Precio Mínimo del día: <span>${LOWDAY}</span></p>
        <p>LAST UPDATED: <span>${LASTUPDATE}</span></p>
        <p>Porcentaje: <span>${CHANGEPCT24HOUR} %</span></p>
    `;

    formulario.appendChild( resultado );

    
}
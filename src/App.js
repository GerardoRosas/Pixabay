import React, {useState, useEffect} from 'react';
import Formulario from './components/Formulario';
import ListadoImagenes from './components/ListadoImagenes';

function App() {

  //State de la app
  const [ busqueda, guardarBusqueda ] = useState('');
  const [ imagenes, guardarImagenes ] = useState([]);
  const [ paginaactual, guardarPaginaActual ] = useState(1);
  const [ totalpaginas, guardarTotalPaginas ] = useState(5);

  useEffect(() => {
    const consultarApi = async () => {
      if(busqueda === '') return
      const imagenesPorPagina = 30;
      //The API key was taken from https://pixabay.com/api/docs/
      const key = '16045093-50d45c8814b7eeec83b8e61ad';
      const url=`https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaactual}`;

      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      guardarImagenes(resultado.hits);

      //CAlcular el total de páginas
      const calcularTotalPaginas = Math.ceil(resultado.totalHits / imagenesPorPagina);
      guardarTotalPaginas(calcularTotalPaginas);

      //Mover la pantalla hacia arriba
      const jumbotron = document.querySelector('.jumbotron');
      jumbotron.scrollIntoView({
        behavior: 'smooth'
      })
    }
    consultarApi();
  }, [busqueda, paginaactual])

  //Definir la pagina anterior
  const paginaAnterior = () => {
    const nuevaPaginaActual = paginaactual - 1;

    if(nuevaPaginaActual === 0) return
    guardarPaginaActual(nuevaPaginaActual);
  }

  //Definir la pagina Siguiente
  const paginaSiguiente = () => {
    const nuevaPaginaActual = paginaactual + 1;

    if(nuevaPaginaActual > totalpaginas) return

    guardarPaginaActual(nuevaPaginaActual);
  }


  return (
    <div className="container">
      <div className="jumbotron">
          <p className="lead text-center">Buscador de Imágenes</p>

          <Formulario 
            guardarBusqueda={guardarBusqueda}
          />
      </div>

      <div className="row justify-content-center">
          <ListadoImagenes 
            imagenes={imagenes}
          />

          {(paginaactual === 1) ? null: (
              <button
                type="button"
                className="btn btn-info mr-1"
                onClick={paginaAnterior}
              >&laquo; Anterior</button>
          )}

          {(paginaactual === totalpaginas) ? null : (
              <button
                type="button"
                className="btn btn-info mr-1"
                onClick={paginaSiguiente}
              >Siguiente &raquo;</button>
          )}

      </div>
    </div>
  );
}

export default App;

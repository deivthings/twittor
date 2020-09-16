
function updateDinamicCache (dynamicCache, req, res) {

  // si la respuesta es ok
  if ( res.ok ) {
    // alamceno el data de la respuesta en el caché
    return caches.open( dynamicCache ).then( cache => {
      cache.put( req, res.clone() );
      return res.clone();
  });

  } else {
    // fallo el caché o la red y retornará un error de conexion
    // no se puede hacer más
    return res;
  }

}
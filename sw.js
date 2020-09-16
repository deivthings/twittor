importScripts('js/sw-utils.js');

const STATIC_CACHE    = 'static-v4';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];


self.addEventListener('install', e => {
  // rellenar los cachés
  const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
    cache.addAll( APP_SHELL ));

  const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
      cache.addAll( APP_SHELL_INMUTABLE ));

  e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]) );
});


self.addEventListener('activate', e => {
  // cuando cambien el sw y se active, borro los cachés anteriores
  const respuesta = caches.keys().then( keys => {
      keys.forEach( key => {
          // verifica si la caché que hay es distinta que la del service worker que viene
          // hay que borrar esa
          if (  key !== STATIC_CACHE && key.includes('static') ) {
              return caches.delete(key);
          }
      });
  });
  e.waitUntil( respuesta );
});

self.addEventListener( 'fetch', e => {
  // CACHE WITH NETWORK FALLBACK
  // si hay match en el caché retorna la respuesta 
  const respuesta = caches.match( e.request ).then( res => {
      // si existe en la caché return la respuesta de cache
      if ( res ) {
          return res;
      } else {
        // y si no existe en la caché (por ejemplo en google fonts pasa que el css que metiste
        // en la app shell llama internamente a un woff o ttf) por lo que tenemos que hacer la
        // llamada nosotros desde el sw a esas requests
          return fetch( e.request ).then( newRes => {
              return updateDinamicCache( DYNAMIC_CACHE, e.request, newRes );
          });
      }
  });



  e.respondWith( respuesta );

});

/* self.addEventListener('fetch', e => {
  // si hay match en el caché retorna la respuesta 
  const resp = caches.match(e.request)
    .then( res => {
      if (res) {
        // si existe en la caché return la respuesta de cache
        return res
      } else {
        // y si no existe en la caché (por ejemplo en google fonts pasa que el css que metiste
        // en la app shell llama internamente a un woff o ttf) por lo que tenemos que hacer la
        // llamada nosotros desde el sw a esas requests
        fetch(e.request).then( newRes => {
          return updateDinamicCache(DYNAMIC_CACHE, e.request, newRes)
        })
      }
    })
  
  // Al final siempre habrá un respondWith que deberá devolver algún tipo de Response
  e.respondWith(resp)
  // e.respondWith(caches.match(e.request))
  
}); */


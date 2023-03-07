//jshint esversion:8

/*
    Note: This uses the lazy template.innerHTML = text approach
          for building widget templates out of html - which nerfs/
          inhibits script tags by default on all HTMLElement(s).
          
          So the html for widgets must not contain <script> tags
          or they simply won't work.
          
          All javascript for widget "index.html" file resources,
          in named folders under the project "_widgets/" folder,
          must be in separate "index.js" file resources.
          
          The loading of these javascript resources is deferred
          until the widget html is converted to a document
          fragment, an empty script tag is added to the fragment
          and the fragment is appended to the documentwith an additional script tag is
          connected to the DOM.
          
          Then the script element can receive a src to load.
    
    Recursively builds widgets out of templates whose
    id's match a _widgets/<widget-name> folder.

    Such templates may be composed of other such templates.
*/
export default ( container = {} ) => {
    const name = `widgetFactory.js`,
          warning = ( file, path, object, type ) => global.Function (
              `console.warn ( '${name}: ${ object } "${
                  file }" not found.\nLoading widget "${
                  path }" without ${ type }. )` ),
          global = ( function () { return this } ) (),
          createCssLayer = ( value = '' ) => Object.create ( { value } ),
          cssLayers = { widgets: createCssLayer () },
          cssLayer = { reference: cssLayers.widgets },
          buildCssAtLayerRule = ( layer ) => {
              
          },
          loadWidget = async function ( template ) {
              const name = template.dataset.widgetName,
                    path = `_widgets/${name}/`,
                    cssPath = path + `index.css`,
                    htmlPath = path + `index.html`,
                    jsPath = path + `index.js`,
                    cssNotFound = warning (
                        cssPath, path, 'stylesheet', 'styles' ),
                    htmlNotFound = () => { throw new Error (
                        name + `: file not found "${ htmlPath }".\n` +
                        `Unable to build widget without html template.` ) },
                    jsNotFound = warning (
                        jsPath, path, 'script', 'javascript' )
              
              return await Promise.All ( [
                  fetch ( cssPath ), fetch ( htmlPath ), fetch ( jsPath )
              ] ).then ( ( cssResponse, htmlResponse, jsResponse ) => {
                  return Promise.All ( [
                      cssResponse.ok ? cssResponse.text () : cssNotFound (),
                      htmlResponse.ok ? htmlResponse.text () : htmlNotFound (),
                      jsResponse.ok ? jsResponse.text () : jsNotFound ()
                  ] ).then ( ( css, html, js ) => {
                          
                          if ( css && !( name in cssLayer.reference ) )
                              cssLayer.reference =
                                  cssLayer.reference [ name ] =
                                      createCssLayer ( css )
                          
                          
                          return ( async () => {
                              template.innerHTML = html
                              return template.content.cloneNode ( true )
                          } ) ().then (
                              fragment => {
                                  let subTemplates = fragment.querySelectorAll ( 'template' )

                                  // defer running parent script until all
                                  // subtemplates are resolved
                                  return Promise.All (
                                      [ ...subTemplates ].map ( loadWidget ) ).then ( () => {
                                          let script = document.createElement ( 'script' )
                                          fragment.append ( script )
                                          let widget = fragment.firstChildElement;
                                          template.replaceWith ( fragment )
                                          script.onerror = notFound
                                          script.src = jsPath
                                          return widget } ) } ) } ) } ) }
    
    let widgets = document.querySelectorAll ( 'template[data-widget-name]' );
    
    container.widgets = [ ...widgets ].map ( loadWidget )
    return container
}

//jshint esversion:8

import widgetFactory from '_javascript/widgetFactory.js'

const global = ( function () { return this } ) (),
      app = global.app = {
          
          // the init callback is responsible for defining the palette
          // and assigning it to app.palette
          palette: null,

          // factory widgets get assigned to widgetFactory ( container )
          // "app" in this case under the property app.widgets
          widgets: null,
          
          // Palettize Graphics App depends on widgetFactory plugin for
          // building its widgets
          load: function ( init ) {
              return widgetFactory ( app ).then ( app => init ( app ) )
          }
      }

export default app
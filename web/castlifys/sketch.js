//jshint esversion:11

// TESTING AREA


// END TESTING AREA

let iconText = '👋';

function renderIcon () {
    let fontSize = height + 7,
        em = 16,
        offsetWidth = 0.0 * fontSize / em,
        offsetHeight = 1.203125 * fontSize / em;
    background ( 0, 0, 0, 0 );
    textSize ( fontSize );
    textAlign ( CENTER, CENTER );
    text ( iconText, 0.5 * width + 0, 0.5 * height + offsetHeight );

    filterImage ();
}

let canvas, context2D, widget, castlePalette,
    rotateAtX, rotateAtY, castleActorScale,
    imageData,
    iconRendered = false, imageUpdate = false,
    // %(&var)
    hotEditHistoryMaxRam = "32mb";

function setup () {

    createCanvas ( 512, 512 );
    let mainCanvasIndex = 0,
        sketchContainer = document.getElementById ( 'main' );

    canvas = sketchContainer.getElementsByTagName ( 'canvas' ) [ mainCanvasIndex ];
    context2D = canvas.getContext ( '2d' );
//     widget = document.getElementById ( 'widgets-template' );

//     sketchContainer.append ( widget.content.cloneNode ( true ) );

    // it's 6 rows of 10 but each row is halved so twice as high
    // this is just so they don't wrapp horribly in the editor here
    castlePalette = [
    /*1*/ [ 59,  23,  37], [115,  23,  45], [180,  32,  42], [223,  62,  35], [250, 106,  10],
          [249, 163,  27], [255, 213,  65], [255, 252,  64], [214, 242, 100], [156, 219,  67],
    /*2*/ [ 89, 193,  53], [ 20, 160,  46], [ 26, 122,  62], [ 36,  82,  59], [ 18,  32,  32],
          [ 20,  52, 100], [ 40,  92, 196], [ 36, 159, 222], [ 32, 214, 199], [166, 252, 219],
    /*3*/ [254, 243, 192], [250, 214, 184], [245, 160, 151], [232, 106, 115], [188,  74, 155],
          [121,  58, 128], [ 64,  51,  83], [ 36,  34,  52], [ 50,  43,  40], [113,  65,  59],
    /*4*/ [187, 117,  71], [219, 164,  99], [244, 210, 156], [218, 224, 234], [179, 185, 209],
          [139, 147, 175], [109, 117, 141], [ 74,  84,  98], [ 51,  57,  65], [ 66,  36,  51],
    /*5*/ [ 91,  49,  56], [142,  82,  82], [186, 117, 106], [233, 181, 163], [227, 230, 255],
          [185, 191, 251], [132, 155, 228], [ 88, 141, 190], [ 71, 125, 133], [ 35, 103,  78],
    /*6*/ [ 50, 132, 100], [ 93, 175, 141], [146, 220, 186], [205, 247, 226], [228, 210, 170],
          [199, 176, 139], [160, 134,  98], [121, 103,  85], [ 90,  78,  68], [ 66,  57,  52]
    ].map (
    channels => {
        // Converts sRGB [ 0 - 255 ] to sRBGA decimal from [ 0.0 to 1.0 ]
        return color.apply ( null, channels )._array;
    } );

    const app = import ( '_javascript/palettizeGraphicsApp.js' ).then ( app =>

        app.load ( app => {

        app.palette = castlePalette

        app.draw = () => {
            if ( !iconRendered ) {
                renderIcon ();
                iconRendered = true;
                imageData = context2D
            }

            if ( imageUpdate === true ) {

            }
        } } ) )
}

function draw () {
    if ( window.app ) window.app.draw ()
}

function scalarNorm ( value, range ) {
    return constrain ( value, 0, naturalRange ) / naturalRange;
}

class sRGBAColorVector {

    constructor ( naturalRange, channels, canvasPixels, offset ) {
        naturalRange = naturalRange || 1;
        if ( 'number' === typeof arguments [ 1 ] ) {
            channels = [].slice.call ( arguments, 1 );
        }
        if ( channels.length === 4 ) {

        } else if ( channels.length === 1 ) {
            this.isMonochrome = true;
            this.value = channels [ 0 ];
        }
    }
}

function filterImage () {

}

function enableDownload () {

}

function disableDownload () {

}

/* [hotEditHistoryMaxRam]
    Hot Image Edit History
    ----------------------
    The hot image edit history is like a memory
    buffer of "hot" image layers which result
    from edits you make to your final image.
    When managed in this way, your edits can
    be undone or redone on the fly very quickly.

    It's like a buffer because it's not stored
    in uncompressed form. These images layers
    are stored as raw bytes PNG format compressed
    data, like files in memory.

    This is what enables the slider at the top
    this application to work as it does.

    When you move the slider, one of these
    compressed files is selected which represents
    the point in time you wish to view and that
    file is turned into a blob and a url for that
    blob is generated and used to create an HTML
    img tag, which is used to load and display
    the file. That image tag can then be shown
    directly on the p5* canvas, after which the
    img tag itself can be discarded, which frees
    the memory it used. After doing this a few
    times, your browser should correctly assume
    that it can use the same chunk of memory
    for performing this image load operation and
    the performance of this edit control feature
    should not suffer.

    You can set this value in:
        kilobytes - "<number>kb"
        megabytes - "<number>mb"
        gigabytes - "<number>gb"

    If there is a problem allocating the size
    buffer you want, a warning will be issued
    on the console and an alert message will
    be displayed.

    I that case the default value will be used.

    This application has no way of knowing how
    much ram you have available, so you have
    to determine larger sizes to meet your own
    needs.
*/

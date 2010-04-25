# SeeSaw

Text Beautifier, Minifier, and Converter

## What's it do?

SeeSaw was built to make it easier to learn from other people's code, to convert textile and markdown to html, and to convert html to haml.  Now it does much more:

* HTML to Textile, Markdown, HAML
* Textile to HTML, HAML
* Markdown to Textile, HTML, HAML
* HAML to HTML, Textile, and Markdown
* Javascript Beautification and Minification
* CSS Beautification and Minification

## How do I use it?

You can use it programmatically by making `POST` requests (below), or by using it at [http://meetseesaw.com](http://meetseesaw.com).

The online version has all kinds of nifty keyboard inputs to make it really quick to see how your changes look.  It's annoying to have to press "Submit" and reload a new page every time you convert.  This way you can press 'left' and 'right', or 'tab' and everything changes in real-time.

## Is there an API?

Yep.  Make a `POST` request to `http://meetseesaw.com/see` with the following parameters: `input` (your text), `input_format`, and `output_format`.  The response body will have your modified output.

Format options are:

* `input_format`
    * html
    * textile
    * haml
    * markdown
    * sass
    * tlf
    * css
    * js
* `output_format`
    * html
    * textile
    * haml
    * markdown
    * css
    * minified
    
Currently beautification is done through javascript as there weren't any available ruby scripts to prettify javascript or css that I could find (I'm running this on Heroku so I can't install Java or PHP apps).  If you know of a server side beautifier, let me know.

TODO:

1. Add progress indicator
2. Flash's Text Layout Framework to HTML
3. XML and HTML pretty printer
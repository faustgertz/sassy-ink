Sassy Ink
=========

A quick and dirty attempt to make a Sass version of [Ink](http://zurb.com/ink). 

Not perfect, but there are about 80 or so Sass variables provided in the `_settings.scss` file, including container width, number of columns, gutter width, etc... So it is a good start for someone looking for a simple Sass port. Still, there is much left to be done, so feel free to pitch in.

I tried to follow [Foundation](http://foundation.zurb.com/)'s structure and keep the generated CSS as close to the original as possible. Compare the Saas generated `ink.css` with the original, `ink-original.css`. Differences include:

* white space
* <del>significant digits (8.333333% vs 8.33333%)</del> (as long as precision is set to 6)
* rounding (16.666666% vs 16.666667%)
* <del>Sass conversion of some hexadecimal colors to color names (#FFFFFF vs white) and</del> other hexadecimal color annoyances (#555555 vs #555, etc..)

Otherwise, it is the same.

Note: I haven't yet figured out what to do with the docs, `Gruntfile.js`, `bower.json`, `package.json`, etc... 

Runtime Dependencies
=========
Per the `Gemfile`:
**compass** <= 1.0.1 & >= 0.12.2
**sass** <= 3.3.13 & >= 3.2.5

As of this writing, Sassy Ink is still compatible with [Koala](http://koala-app.com/) version 2.0.3 and [CodeKit](https://incident57.com/codekit/) version 2.1.3. It also appears to be compatible with [Scout](http://mhs.github.io/scout-app/) version 0.7.1, even though Scout appears to be using Sass 3.2.1.

It is not necessarily compatible with Sass >= 3.4 because assigning to global variables by default is deprecated. Using "!global" to fix this is incompatible with Sass < 3.3 and would break current versions of Koala, Scout, and probably several other Sass compilers. It would also break things for Compass users who haven't updated since August 18, 2014. Fortunately, the incompatibilty is limited to the `export` mixin, which is used to prevent styles from being loaded multiple times for compenents that rely on other components. Unless doing customization beyond setting variables in `_settings.scss`, this is not likely to be a problem. Yet, it seems worth mentioning.

Precision
=========
In order to have the same number of significant digits as in the original Zurb ink.css, you must set the precision to 6. For example:

	sass --precision 6 scss/ink.scss css/ink.css

In the Compass `config.rb`:
	
	Sass::Script::Number.precision = 6

In `Gruntfile.js`:

	grunt.initConfig({
	  sass: {
	    dist: {
	      options: {
	        precision: 6
	      },
	      files: {
	        'css/ink.css': 'scss/ink.scss'
	      }
	    }
	  }
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.registerTask('default', ['sass']);

Testing
=======
The only testing I am doing so far is comparing the Saas generated `ink.css` with Zurb's original `ink.css`.

Diff
====
`diff -bB ink.css sassy-ink.css`

	293c292
	<   width: 16.666666%;
	---
	>   width: 16.666667%;
	308c307
	<   width: 41.666666%;
	---
	>   width: 41.666667%;
	323c322
	<   width: 66.666666%;
	---
	>   width: 66.666667%;
	338c337
	<   width: 91.666666%;
	---
	>   width: 91.666667%;
	489c488
	<   font-family: "Helvetica", "Arial", sans-serif;
	---
	>   font-family: Helvetica, Arial, sans-serif;
	683c682
	<   color: #fff !important;
	---
	>   color: #ffffff !important;
	715c714
	<   color: #555;
	---
	>   color: #555555;
	719c718
	<   color: #555;
	---
	>   color: #555555;
	724c723
	<   color: #555;
	---
	>   color: #555555;
	730c729
	<   color: #555 !important;
	---
	>   color: #555555 !important;
	820c819
	<     width: 16.666666% !important;
	---
	>     width: 16.666667% !important;
	835c834
	<     width: 41.666666% !important;
	---
	>     width: 41.666667% !important;
	850c849
	<     width: 66.666666% !important;
	---
	>     width: 66.666667% !important;
	865c864
	<     width: 91.666666% !important;
	---
	>     width: 91.666667% !important;
	873,883c872
	<   table[class="body"] td.offset-by-one,
	<   table[class="body"] td.offset-by-two,
	<   table[class="body"] td.offset-by-three,
	<   table[class="body"] td.offset-by-four,
	<   table[class="body"] td.offset-by-five,
	<   table[class="body"] td.offset-by-six,
	<   table[class="body"] td.offset-by-seven,
	<   table[class="body"] td.offset-by-eight,
	<   table[class="body"] td.offset-by-nine,
	<   table[class="body"] td.offset-by-ten,
	<   table[class="body"] td.offset-by-eleven {
	---
	>   table[class="body"] td.offset-by-one, table[class="body"] td.offset-by-two, table[class="body"] td.offset-by-three, table[class="body"] td.offset-by-four, table[class="body"] td.offset-by-five, table[class="body"] td.offset-by-six, table[class="body"] td.offset-by-seven, table[class="body"] td.offset-by-eight, table[class="body"] td.offset-by-nine, table[class="body"] td.offset-by-ten, table[class="body"] td.offset-by-eleven {

Of these, the only ones that seem like they could make a difference are:

	293c292
	<   width: 16.666666%;
	---
	>   width: 16.666667%;
	308c307
	<   width: 41.666666%;
	---
	>   width: 41.666667%;
	323c322
	<   width: 66.666666%;
	---
	>   width: 66.666667%;
	338c337
	<   width: 91.666666%;
	---
	>   width: 91.666667%;
	820c819
	<     width: 16.666666% !important;
	---
	>     width: 16.666667% !important;
	835c834
	<     width: 41.666666% !important;
	---
	>     width: 41.666667% !important;
	850c849
	<     width: 66.666666% !important;
	---
	>     width: 66.666667% !important;
	865c864
	<     width: 91.666666% !important;
	---
	>     width: 91.666667% !important;

Credit
======

* [ZURB](http://www.zurb.com) (obvious)
* [René Meye](https://github.com/renemeye)'s [pull request #61](https://github.com/zurb/ink/pull/61). (less obvious)

Ink
===

Ink is a responsive email framework, used to make HTML emails look great on any client or device.  It includes a 12-column grid, as well as some simple UI elements for rapid prototyping.

Homepage:      http://zurb.com/ink<br />
Documentation: http://zurb.com/ink/docs.php<br />
Download:      http://zurb.com/ink/download.php

Ink was made by [ZURB](http://www.zurb.com), is MIT-licensed, and absolutely free to use.

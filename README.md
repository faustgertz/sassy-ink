# Sassy Ink

> The *unofficial* Sass port of [Ink](http://zurb.com/ink), Zurb's responsive email framework. If you are going to build a responsive HTML email, treat yourself to the most customizable version of the leading framework, Sassy Ink.

Please let me know if you use Sassy Ink.

## Why use Sassy Ink?

1. Zurb's Ink is the leading responsive email framework. Sassy Ink provides 80 or so customizable variables. You can have it your way. 
1. It makes clients happy. Clients never want framework defaults. Sassy Ink makes it easy to customize container width, number of columns, gutter width, break point, colors, font sizes, font-families, margins, padding, etc... 
1. Pretty closely follows [Foundation](http://foundation.zurb.com/)'s Sass structure and naming conventions. If you are familiar with Foundation (or even Bootstrap), you are familiar with Sassy Ink.
1. You can easily verify that you are getting all the benefits of Ink because the generated CSS is as close to Zurb's original `ink.css` as possible. If you don't touch the default variables, the differences are trivial. In fact, the differences are an improvement.

`diff -bB test/results/target.css  test/results/ink.css`

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

It is a great start for a simple Sass port. 

## Contributing

There is much left to do, so please feel free to pitch in.


## _settings.scss

You will want to make changes to the settings file which includes 80 or so variables that can be customized for each component. Making changes is simple, in `_settings.scss` find the element you want to style. Find the variable, uncomment the style, and change its value. Be sure to compile Sass stylesheets to CSS in order see any changes.

## Runtime Dependencies

Per the `Gemfile`:

	**sass** <= 3.3.13 & >= 3.2.5

As of this writing, Sassy Ink is still compatible with [Compass](http://compass-style.org/) versions 0.12.2 through 1.0.1 (as long Sass is between version 3.2.5 and 3.3.13), [Koala](http://koala-app.com/) 2.0.3, and [CodeKit](https://incident57.com/codekit/) 2.1.3. It also appears to be compatible with [Scout](http://mhs.github.io/scout-app/) 0.7.1, even though Scout looks like it's using Sass 3.2.1. I haven't tested any others. Please let me know if you do.

It is **not** *necessarily* compatible with Sass >= 3.4 because assigning to global variables by default is deprecated. Using `!global` to fix this is incompatible with Sass < 3.3 and would break current versions of Koala and Scout; most versions of Compass less than 1.0.1 (August 18, 2014); and probably several other Sass compilers. Fortunately, the incompatibility is limited to the `export` mixin, which is used to prevent styles from being loaded multiple times for components that rely on other components. So, unless you are doing customization beyond setting variables in `_settings.scss`, this is not likely to be a problem. Yet, it seems worth mentioning.

## Precision

In order to have the same number of significant digits as in the original Zurb `ink.css`, you must set the precision to 6. For example:

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

## Testing

The only testing I am doing so far is comparing the Saas generated `ink.css` with a slightly massaged Zurb's `ink.css` version 1.0.5.

### Massaging

1. Run the CSS file through a Sass compiler to clean up some white space issues (`sass --precision 6  --style expanded test/fixtures/ink.css test/results/target.css`)
1. Expand three character hex shorthands (`s/#(\w|\d)(\w|\d)(\w|\d)\b/#$1$1$2$2$3$3/g`)
1. Remove unnecessary quotes from fonts (`s/(?<=font.*:.*)("|')(\w+)\1.*?;/$2/g`)
1. Remove an annoying line-break difference (`s/(table\[class="body"\] td\.offset\-by\-)(\w+)\s*?(,?\s*)(?=\1\w+)/$1$2, /g`)

### Diff

`diff -bBs test/results/target.css test/results/ink.css`

	Files test/results/target.css and test/results/ink.css are identical

## To Do

* I haven't yet figured out what to do with the docs, `CONTRIBUTING.md`, `Gruntfile.js`, `bower.json`, etc... 

## Credit

* [ZURB](http://www.zurb.com) (obvious)
* [René Meye](https://github.com/renemeye)'s [pull request #61](https://github.com/zurb/ink/pull/61). (less obvious)

### Ink


Ink is a responsive email framework, used to make HTML emails look great on any client or device.  It includes a 12-column grid, as well as some simple UI elements for rapid prototyping.

Homepage:      http://zurb.com/ink<br />
Documentation: http://zurb.com/ink/docs.php<br />
Download:      http://zurb.com/ink/download.php

Ink was made by [ZURB](http://www.zurb.com), is MIT-licensed, and absolutely free to use.
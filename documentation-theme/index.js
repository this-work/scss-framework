const themeleon = require('themeleon')().use('consolidate');
const extend = require('extend');
const extras = require('sassdoc-extras');

const partialsConfiguration = {
	partials: {
		head: 'includes/head',
		header: 'includes/header',
		navigation: 'includes/header',
		item: 'includes/item',
		footer: 'includes/footer',
	},
};

const theme = themeleon(__dirname, function (t) {
	t.copy('assets');

	t.handlebars(
		'views/index.handlebars',
		'index.html',
		JSON.parse(JSON.stringify(partialsConfiguration))
	);
	t.handlebars(
		'views/grid.handlebars',
		'grid.html',
		JSON.parse(JSON.stringify(partialsConfiguration))
	);
	t.handlebars(
		'views/theme.handlebars',
		'theme.html',
		JSON.parse(JSON.stringify(partialsConfiguration))
	);
	t.handlebars(
		'views/view.handlebars',
		'view.html',
		JSON.parse(JSON.stringify(partialsConfiguration))
	);
	t.handlebars(
		'views/utils.handlebars',
		'utils.html',
		JSON.parse(JSON.stringify(partialsConfiguration))
	);
});

module.exports = function (dest, ctx) {
	var def = {
		display: {
			access: ['public', 'private'],
			alias: false,
			watermark: true,
		},
		groups: {
			undefined: 'General',
		},
	};

	// Apply default values for groups and display.
	ctx.groups = extend(def.groups, ctx.groups);
	ctx.display = extend(def.display, ctx.display);

	// Extend top-level context keys.
	ctx = extend({}, def, ctx);

	/**
	 * Parse text data (like descriptions) as Markdown, and put the
	 * rendered HTML in `html*` variables.
	 *
	 * For example, `ctx.package.description` will be parsed as Markdown
	 * in `ctx.package.htmlDescription`.
	 *
	 * See <http://sassdoc.com/extra-tools/#markdown>.
	 */
	extras.markdown(ctx);

	/**
	 * Add a `display` property for each data item regarding of display
	 * configuration (hide private items and aliases for example).
	 *
	 * You'll need to add default values in your `.sassdocrc` before
	 * using this filter:
	 *
	 *     {
	 *       "display": {
	 *         "access": ["public", "private"],
	 *         "alias": false
	 *       }
	 *     }
	 *
	 * See <http://sassdoc.com/extra-tools/#display-toggle>.
	 */
	extras.display(ctx);

	/**
	 * Allow the user to give a name to the documentation groups.
	 *
	 * We can then have `@group slug` in the docblock, and map `slug`
	 * to `Some title string` in the theme configuration.
	 *
	 * **Note:** all items without a group are in the `undefined` group.
	 *
	 * See <http://sassdoc.com/extra-tools/#groups-aliases>.
	 */
	extras.groupName(ctx);

	/**
	 * Use SassDoc indexer to index the data by group and type, so we
	 * have the following structure:
	 *
	 *     {
	 *       "group-slug": {
	 *         "function": [...],
	 *         "mixin": [...],
	 *         "variable": [...]
	 *       },
	 *       "another-group": {
	 *         "function": [...],
	 *         "mixin": [...],
	 *         "variable": [...]
	 *       }
	 *     }
	 *
	 * You can then use `data.byGroupAndType` instead of `data` in your
	 * templates to manipulate the indexed object.
	 */
	ctx.data.byGroupAndType = extras.byGroupAndType(ctx.data);

	ctx._data = ctx.data;
	delete ctx.data;

	return theme.apply(this, arguments);
};

module.exports.annotations = [
	function () {
		return {
			name: 'values',
			parse: function (text) {
				var match = text.split('-');
				return {
					value: match[0].trim(),
					description: match[1] ? match[1].trim() : null,
				};
			},
			allowedOn: ['variable'],
			multiple: true,
		};
	},
	function () {
		return {
			name: 'file',
			parse: function (file) {
				return file;
			},
			multiple: false,
		};
	},
];

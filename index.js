var fs = require('fs');
var path = require('path');

/**
 * This extension will be used by default for all template files
 */
exports.extension = ".ect";

/**
 * Original templating engine
 */
exports.module = 'ect';

/**
 * Get source template filename
 */
exports.template = function(name) {
	return path.join(__dirname, 'templates', name + exports.extension);
}

exports.templateText = function (name, data) {
	switch(name) {
		case 'default_action_view':
			var buffer = new Array();
			buffer.push('<div class="page-header"><h1>');
			buffer.push.apply(buffer, data);
			buffer.push('</h1></div>\n');
			return buffer.join('');
		case 'scaffold_show':
			var fields = new Array();
			data.forEach(function (property) {
				switch (property.type) {
					default:
						fields.push('<tr><th>');
						fields.push(property.name);
						fields.push('</th><td><%= {{ model }}.');
						fields.push(property.name);
						fields.push(' %></td></tr>');
						break;
				}
			});
			return fs.readFileSync(exports.template('scaffold_show')).toString().replace('FIELDS', fields.join('\n\n        '));
		case 'scaffold_form':
			var form = new Array();
			form.push('<%- errorMessagesFor({{ model }}) %>\n');
			data.forEach(function (property) {
				switch (property.type) {
					case 'Boolean':
						form.push('<div class="control-group">');
						form.push('\t<%- form.label("');
						form.push(property.name);
						form.push('", false, {class: "control-label"}) %>');
						form.push('\t<div class="controls">');
						form.push('\t\t<%- form.checkbox("');
						form.push(property.name);
						form.push('") %>');
						form.push('\t</div>');
						form.push('</div>');
						break;
					default:
						form.push('<div class="control-group">');
						form.push('\t<%- form.label("');
						form.push(property.name);
						form.push('", false, {class: "control-label"}) %>');
						form.push('\t<div class="controls">');
						form.push('\t\t<%- form.input("');
						form.push(property.name);
						form.push('") %>');
						form.push('\t</div>');
						form.push('</div>');
						break;
				}
			});
			return form.join('\n\n');
	}
}

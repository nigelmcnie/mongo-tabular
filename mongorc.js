/**
 * tabular mongo table output
 *
 * Author: Martyn Smith & Nigel McNie, Shoptime Software
 * License: Public domain
 */

// Adjust to taste
var _tabular_defaults = {
    // How many rows to show by default
    limit: 20,

    // Columns longer than this will be truncated
    maxlen: 50,

    // Undefined fields will be output using this string
    undef: '',
};

// No configuration below this point


_tabular_encode = function(obj, opts) {
    if ( obj === undefined ) {
        return opts.undef;
    }
    if ( obj instanceof ObjectId ) {
        return obj.valueOf();
    }
    ret = tojson(obj, false, true);

    if ( ret.length > opts.maxlen + 3 ) {
        ret = ret.slice(0, opts.maxlen) + '...';
        ret = ret.replace("\t", "", 'g')
    }

    return ret;
};
DBQuery.prototype.tabular = function(opts) {
    if ( typeof(opts) == 'object' ) {
        opts.limit  = (typeof(opts.limit)  != 'undefined') ? opts.limit  : _tabular_defaults.limit;
        opts.maxlen = (typeof(opts.maxlen) != 'undefined') ? opts.maxlen : _tabular_defaults.maxlen;
        opts.undef  = (typeof(opts.undef)  != 'undefined') ? opts.undef  : _tabular_defaults.undef;
    }
    else if ( typeof(opts) == 'number' ) {
        opts.limit  = opts;
        opts.maxlen = _tabular_defaults.maxlen;
        opts.undef  = _tabular_defaults.undef;
    }
    else {
        opts = _tabular_defaults;
    }

    var field_length = { '_id': 24 };

    var docs = this.limit(opts.limit).toArray();

    docs.forEach(function(doc) {
        var field;
        for ( field in doc ) {
            var value = _tabular_encode(doc[field], opts);
            if ( !field_length[field] ) {
                field_length[field] = field.length;
            }
            if ( field_length[field] < value.length ) {
                field_length[field] = value.length;
            }
        }
    });

    var field;
    var fields = [];
    var output = '';

    for ( field in field_length ) {
        fields.push(field);
    }

    // Divider
    var divider = '+';
    fields.forEach(function(field) {
        var width = field_length[field];
        divider += Array(width+3).join('-');
        divider += '+';
    });

    var header = '| ';
    // Title row
    fields.forEach(function(field) {
        var width = field_length[field];
        var lpad = Math.floor((width - field.length)/2);
        var rpad = width - lpad - field.length;
        header += Array(lpad+1).join(' ') + field + Array(rpad+1).join(' ');
        header += ' | ';
    });

    output += divider + "\n";
    output += header + "\n";
    output += divider + "\n";

    // Rows
    docs.forEach(function(doc) {
        var row = '| ';
        fields.forEach(function(field) {
            var value = _tabular_encode(doc[field], opts);
            var width = field_length[field];
            var rpad = Math.floor(width - value.length);
            row += value + Array(rpad+1).join(' ');
            row += ' | ';
        });
        output += row + "\n";
    });

    output += divider + "\n";
    return output;
};
DBQuery.prototype.t = DBQuery.prototype.tabular;

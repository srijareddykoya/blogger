const moment = require('moment');
module.exports = {
  formatDate: function (date, format) {
    return moment(date).format(format);
  },
  fromNow: function (date) {
    return moment(date).fromNow();
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '');
  },
  editIcon: function (blogUser, loggedUser, blogId, floating = true) {
    if (blogUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/edit/${blogId}" class="btn-floating halfway-fab blue"><i style="font-size: 16px" class="fas fa-user-edit"></i></a>`;
      } else {
        return `<a href="/edit/${blogId}"><i class="fas fa-user-edit"></i></a>`;
      }
    } else {
      return '';
    }
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' ';
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(' '));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + '...';
    }
    return str;
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      );
  },
};

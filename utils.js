/**
 * Author: Vu Duy Tuan - tuanvd@gmail.com
 * Date: 5/29/19
 * Time: 9:38 AM
 */

const fs = require('fs');

module.exports = {
    // Get file list with extension filtering
    getFileList: function (path, extension) {
        return fs.readdirSync(path).filter(elm => elm.match(new RegExp(`.*\.(${extension})`, 'ig')));
    }
};
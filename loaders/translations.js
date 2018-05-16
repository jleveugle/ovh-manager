function formatTranslation(object) {
    var result = {};
    object.forEach(function(elem) {
        if (elem.hasOwnProperty('id') && elem.hasOwnProperty('text') && !~elem.id.indexOf('>')) {
            result[elem.id] = elem.text;
        }
        else {
            console.error('Error: xml: format is incorrect');
        }
    });
    return result;
}

module.exports = function(source) {
    let reg = /<translation\s+id="([\w-]+?)"\s*(qtlid="([0-9]+)")?\s*(?:translate="none")?\s*?>((?:.|\n|\r)*?)<\/translation>/gi,
    obj = [], match;

    while ((match = reg.exec(source))) {
        const elem = {
            id: match[1],
            text: match[4].replace(/&#13;\n/g, " ").replace(/&#160;/g, " ")
        };

        elem.text = elem.text.replace(/\{(\s?\d\s?)\}/g, "{{t$1}}")

        obj.push(elem);
    }
    return `export default ${ JSON.stringify(formatTranslation(obj))}`;
}
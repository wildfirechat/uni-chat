import anchorme from "anchorme";
import twemoji from "twemoji";
import Config from "../config";

const emoji = [];


function parser(text) {
    var decodeText = anchorme({
        input: text,
        options: {
            attributes: {
                target: "_blank",
            }

        }
    });

    // (text.match(/\[[\w\s\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29\ud840-\ud868\udc00-\udfff\ud869[\udc00-\uded6\udf00-\udfff\ud86a-\ud86c\udc00-\udfff\ud86d[\udc00-\udf34\udf40-\udfff\ud86e\udc00-\udc1d]+\]/g) || []).map(e => {
    //     var className = getEmojiClassName(e);
    //
    //     if (!className) {
    //         // Invalid emoji
    //         return;
    //     }
    //     text = decodeText = text.split(`${e}`).join(`<a target="_blank" class="${className}"></a>`);
    // });

    let emoji = twemoji.parse(decodeText);
    emoji = emoji.replace(/src="https:\/\/twemoji\.maxcdn\.com\/v\/[0-9.]+\//g, 'src="' +  Config.emojiBaseUrl())
    return emoji;
}

function normalize(text = '') {
    var matchs = text.match(/<span class="emoji emoji[0-9a-fA-F]+"><\/span>/g) || [];
    var decodeText = text;

    try {
        matchs.map(e => {
            // Decode utf16 to emoji
            var emojiCode = e.match(/emoji([0-9a-fA-F]+)/)[1].substr(0, 5);
            var emoji = String.fromCodePoint(parseInt(emojiCode, 16));
            text = decodeText = text.split(e).join(emoji);
        });
    } catch (ex) {
        console.error('Failed decode %s: %o', text, ex);
    }
    return decodeText;
}

export {emoji, parser, normalize};

const checkboxReplace = ({ utils: { arrayReplaceAt } }, options, Token) => {
  lastId = 0;
  pattern = /\[(X|\s|\_|\-)\]\s(.*)/i;
  createTokens = (checked, label, Token) => {
    let id;
    let nodes;
    nodes = [];

    id = lastId;
    lastId += 1;

    const tokenLabelOpen = new Token("label_open", "label", 1);
    if (checked === true) {
      tokenLabelOpen.attrs = [["class", "checked"]];
    }
    nodes.push(tokenLabelOpen);

    const tokenInput = new Token("checkbox_input", "input", 0);
    tokenInput.attrs = [
      ["type", "checkbox"],
      ["id", id],
    ];
    if (checked === true) {
      tokenInput.attrs.push(["checked", "true"]);
    }
    nodes.push(tokenInput);

    const textToken = new Token("text", "", 0);
    textToken.content = label;
    nodes.push(textToken);

    nodes.push(new Token("label_close", "label", -1));
    return nodes;
  };
  splitTextToken = (original, Token) => {
    let checked;
    let label;
    let matches;
    let text;
    let value;
    text = original.content;
    matches = text.match(pattern);
    if (matches === null) {
      return original;
    }
    checked = false;
    value = matches[1];
    label = matches[2];
    if (value === "X" || value === "x") {
      checked = true;
    }
    return createTokens(checked, label, Token);
  };
  return (state) => {
    let blockTokens;
    let i;
    let j;
    let l;
    let token;
    let tokens;
    blockTokens = state.tokens;
    j = 0;
    l = blockTokens.length;
    while (j < l) {
      if (blockTokens[j].type !== "inline") {
        j++;
        continue;
      }
      tokens = blockTokens[j].children;
      i = tokens.length - 1;
      while (i >= 0) {
        token = tokens[i];
        blockTokens[j].children = tokens = arrayReplaceAt(
          tokens,
          i,
          splitTextToken(token, state.Token)
        );
        i--;
      }
      j++;
    }
  };
};

/*global module */

module.exports = (md, options) => {
  md.core.ruler.push("checkbox", checkboxReplace(md, options));
};

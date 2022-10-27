import { CancellationToken, CompletionContext, CompletionItem, CompletionItemKind, CompletionItemProvider, CompletionList, Position, ProviderResult, Range, TextDocument } from "vscode";

import { attribute } from './resource/attribute'

export interface TagObject {
  text: string,
  offset: number
};

class BimwinCompletionItemProvider implements CompletionItemProvider {
  private _document!: TextDocument;
  private _position!: Position;
  private tagReg: RegExp = /<([\w-]+)\s*/g;
  private attrReg: RegExp = /(?:\(|\s*)(\w+)=['"][^'"]*/;
  private tagStartReg: RegExp = /<([\w-]*)$/;
  private pugTagStartReg: RegExp = /^\s*[\w-]*$/;
  private size!: number;
  private quotes!: string;

  constructor() {
    
  }

  getTextBeforePosition(position: Position): string {
    var start = new Position(position.line, 0);
    var range = new Range(start, position);
    return this._document.getText(range);
  }

  matchTag(reg: RegExp, txt: string, line: number): TagObject | string {
    let match: RegExpExecArray;
    let arr: TagObject[] = [];

    if (/<\/?[-\w]+[^<>]*>[\s\w]*<?\s*[\w-]*$/.test(txt) || (this._position.line === line && (/^\s*[^<]+\s*>[^<\/>]*$/.test(txt) || /[^<>]*<$/.test(txt[txt.length - 1])))) {
      return 'break';
    }
    //@ts-ignore
    while ((match = reg.exec(txt))) {
      arr.push({
        text: match[1],
        offset: this._document.offsetAt(new Position(line, match.index))
      });
    }
    //@ts-ignore
    return arr.pop();
  }

  getPreTag(): TagObject | undefined {
    console.log('start getPreTag')
    let line = this._position.line;
    let tag: TagObject | string;
    let txt = this.getTextBeforePosition(this._position);
    while (this._position.line - line < 10 && line >= 0) {
      if (line !== this._position.line) {
        txt = this._document.lineAt(line).text;
      }
      tag = this.matchTag(this.tagReg, txt, line);

      if (tag === 'break') return;
      if (tag) return <TagObject>tag;
      line--;
    }
    console.log('start getEndTag')
    return;
  }

  matchAttr(reg: RegExp, txt: string): string {
    let match: RegExpExecArray;
    //@ts-ignore
    match = reg.exec(txt);
    //@ts-ignore
    return !/"[^"]*"/.test(txt) && match && match[1];
  }

  getPreAttr(): string | undefined {
    let txt = this.getTextBeforePosition(this._position).replace(/"[^'"]*(\s*)[^'"]*$/, '');
    let end = this._position.character;
    let start = txt.lastIndexOf(' ', end) + 1;
    let parsedTxt = this._document.getText(new Range(this._position.line, start, this._position.line, end));

    return this.matchAttr(this.attrReg, parsedTxt);
  }

  // 获取属性value值建议
  getAttrValueSuggestion(tag: string, attr: string): CompletionItem[] {
    let suggestions: CompletionItem[] | { label: any; kind: CompletionItemKind; }[] = [];
    const values = ["我是属性值", "fuck"];
    values.forEach((value: any) => {
      suggestions.push({
        label: value,
        kind: CompletionItemKind.Value
      });
    });
    return suggestions;
  }

  // 获取属性值建议
  getAttrSuggestion(tag: string): CompletionItem[] {
    let suggestions: CompletionItem[] | { label: any; kind: CompletionItemKind; }[] = [];
    const values = attribute[tag] || [];
    values.forEach((value: any) => {
      suggestions.push({
        label: value,
        kind: CompletionItemKind.Property
      });
    });
    return suggestions;
  }

  provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
    this._document = document;
    this._position = position;
    let tag = this.getPreTag();
    let attr = this.getPreAttr();
    console.log("标签查询: ", tag);
    console.log("属性查询: ", attr);

    if (tag && attr) {
      return this.getAttrValueSuggestion(tag.text, attr)
    }

    if (tag) {
      return this.getAttrSuggestion(tag.text)
    }
    return []
  }
  resolveCompletionItem?(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem> {
    throw new Error("Method not implemented.");
  }

}

export { BimwinCompletionItemProvider }
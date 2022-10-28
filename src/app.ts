import { CancellationToken, CompletionContext, CompletionItem, CompletionItemKind, CompletionItemProvider, CompletionList, Hover, HoverProvider, MarkdownString, Position, ProviderResult, Range, TextDocument } from "vscode";

import { attribute, method, hoverDoc } from './resource/intelli';

export interface TagObject {
  text: string,
  offset: number
};

export interface Suggestion {
  [key: string]: any[] | any
}

export interface RefObject {
  label: string,
  tag: string | undefined
}

class BimwinHoverProvider implements HoverProvider {
  private matchRefReg: RegExp = /ref\s*=["'](.*?)["']/g;
  private matchRefObject: RefObject[] = [];
  private tagReg: RegExp = /<([\w-]+)\s*/g;
  private _document!: TextDocument;
  private _position!: Position;

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

  getPreTag(pos?: Position): TagObject | undefined {
    console.log('查找标签')
    const position = pos ? pos : this._position
    let line = position.line;
    let tag: TagObject | string;
    let txt = this.getTextBeforePosition(position);
    while (position.line - line < 10 && line >= 0) {
      if (line !== position.line) {
        txt = this._document.lineAt(line).text;
      }
      tag = this.matchTag(this.tagReg, txt, line);

      if (tag === 'break') return;
      if (tag) return <TagObject>tag;
      line--;
    }
    return;
  }

  // 获取文档中所有的Ref
  getRefs(): RefObject[] {
    let m;
    const arr: RefObject[] = []
    const txt = this._document.getText()
    while ((m = this.matchRefReg.exec(txt)) !== null) {
      const pos: Position = this._document.positionAt(m.index)
      const preTag = this.getPreTag(pos)
      arr.push({
        label: m[1],
        tag: preTag && preTag.text
      })
    }

    if (arr.length !== 0) {
      this.matchRefObject = arr;
    }
    return arr;
  }

  // 是否需要hover提供文档
  isNeedHover() {
    this.getRefs()
    const findRes = this.matchRefObject.find(v => v.tag === 'pit-bim-win-ui')
    if (findRes) {
      let reg = new RegExp('refs\\.' + findRes.label + '\\.(.*?)\W*$')
      if (reg.test(this.getTextBeforePosition(this._position))) {
        return true
      }
    }

    return false
  }

  provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover> {
    this._document = document;
    this._position = position;
    const isHover = this.isNeedHover()
    if (isHover) {
      const range = document.getWordRangeAtPosition(position);
      const word = document.getText(range);
      if (hoverDoc[word]) {
        const md = new MarkdownString()
        md.value = hoverDoc[word]
        return new Hover(md)
      }
    }
    return null
  }
}

class BimwinCompletionItemProvider implements CompletionItemProvider {
  private _document!: TextDocument;
  private _position!: Position;
  private tagReg: RegExp = /<([\w-]+)\s*/g;
  private attrReg: RegExp = /(?:\(|\s*)(\w+)=['"][^'"]*/;
  private tagStartReg: RegExp = /<([\w-]*)$/;
  private pugTagStartReg: RegExp = /^\s*[\w-]*$/;
  private size!: number;
  private quotes!: string;
  private matchRefReg: RegExp = /ref\s*=["'](.*?)["']/g;
  private matchRefObject: RefObject[] = [];

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

  getPreTag(pos?: Position): TagObject | undefined {
    console.log('查找标签')
    const position = pos ? pos : this._position
    let line = position.line;
    let tag: TagObject | string;
    let txt = this.getTextBeforePosition(position);
    while (position.line - line < 10 && line >= 0) {
      if (line !== position.line) {
        txt = this._document.lineAt(line).text;
      }
      tag = this.matchTag(this.tagReg, txt, line);

      if (tag === 'break') return;
      if (tag) return <TagObject>tag;
      line--;
    }
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

  // 是否需要提供Ref
  isNeedRef(pos?: Position): boolean {
    let txt = this.getTextBeforePosition(pos || this._position);
    if (/\$refs\.?$/.test(txt)) {
      return true;
    }

    // 有一种可能: 被换行了
    if (/\s+\.$/.test(txt)) {
      const line = this._document.lineAt(this._position.line - 1)
      return this.isNeedRef(line.range.end)
    }
    return false;
  }

  // 获取文档中所有的Ref
  getRefs(): RefObject[] {
    let m;
    const arr: RefObject[] = []
    const txt = this._document.getText()
    while ((m = this.matchRefReg.exec(txt)) !== null) {
      const pos: Position = this._document.positionAt(m.index)
      const preTag = this.getPreTag(pos)
      arr.push({
        label: m[1],
        tag: preTag && preTag.text
      })
    }

    if (arr.length !== 0) {
      this.matchRefObject = arr;
    }
    return arr;
  }

  // 是否需要提供Ref Method
  isNeedRefMethod(): boolean {
    if (this.matchRefObject.length === 0) {
      this.getRefs()
    }
    const findRes = this.matchRefObject.find(v => v.tag === 'pit-bim-win-ui')
    if (findRes) {
      let reg = new RegExp('refs\.' + findRes.label + '\.$')
      if (reg.test(this.getTextBeforePosition(this._position))) {
        return true
      }
    }
    return false
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

    let needRef = this.isNeedRef()
    let needRefMethod = this.isNeedRefMethod()

    if (needRef) {
      return this.getRefs().map(v => ({
        label: v.label,
        kind: CompletionItemKind.Property
      }))
    }

    if (needRefMethod) {
      return method['pit-bim-win-ui'].map((v: { label: any; description: any; }) => ({
        label: {
          label: v.label,
          description: v.description
        },
        kind: CompletionItemKind.Method
      }))
    }

    if (tag && !attr) {
      return this.getAttrSuggestion(tag.text)
    }
    return []
  }
  resolveCompletionItem?(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem> {
    return null;
  }

}

export { BimwinCompletionItemProvider, BimwinHoverProvider };

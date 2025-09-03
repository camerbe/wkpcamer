import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeywordAndHashtagService {
   extractHashtags(text: string): string{
    if (!text) {
      return '';
    }

    const hashtagRegex = /#\w+/g;
    const matches = text.match(hashtagRegex);
    const result = matches ? matches.map(tag => tag.trim()) : [];
    const resultString: string = result.join(",");
    return resultString;
  }
  removeHashtags(text: string): string {
    if (!text || text.indexOf('#') === -1) return text;
    const noTags = text.replace(/[#＃](?:[\p{L}\p{M}\p{N}\p{Pc}\-]|['’])+/gu, "");
    let s = noTags;
    s = s.replace(/\s*,\s*/g, ", ");
    s = s.replace(/(?:,\s*){2,}/g, ", ");

    s = s.replace(/^\s*,\s*/g, "");            // virgule en début
    s = s.replace(/,\s*$/g, "");               // virgule finale

    s = s.replace(/\s+([,;:.!?])/g, "$1");     // supprime espace avant ponctuation
    s = s.replace(/\s{2,}/g, " ");

    s = s.replace(/\(\s*\)/g, "");
    s = s.replace(/\[\s*\]/g, "");
    s = s.replace(/\{\s*\}/g, "");

    return s.trim();
  }
}

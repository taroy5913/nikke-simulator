export const Int = (s:string):number => {
    const t = s.replace(/[０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
    return parseInt(t) || 0
}
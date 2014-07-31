(function () {
    var a;

    function diff_match_patch() {
        function b() {
            var c = 0, d = 1;
            for (var e = 2; d != e;) {
                c++;
                d = e;
                e <<= 1
            }
            return c
        }

        this.Diff_Timeout = 1;
        this.Diff_EditCost = 4;
        this.Diff_DualThreshold = 32;
        this.Match_Threshold = 0.5;
        this.Match_Distance = 1E3;
        this.Patch_DeleteThreshold = 0.5;
        this.Patch_Margin = 4;
        this.Match_MaxBits = b()
    }

    a = diff_match_patch.prototype;
    a.diff_main = function (b, c, d) {
        if (b == null || c == null)throw Error("Null input. (diff_main)");
        if (b == c)return[
            [0, b]
        ];
        if (typeof d == "undefined")d = true;
        var e = d, f = this.diff_commonPrefix(b, c);
        d = b.substring(0, f);
        b = b.substring(f);
        c = c.substring(f);
        f = this.diff_commonSuffix(b, c);
        var g = b.substring(b.length - f);
        b = b.substring(0, b.length - f);
        c = c.substring(0, c.length - f);
        b = this.diff_compute(b, c, e);
        d && b.unshift([0, d]);
        g && b.push([0, g]);
        this.diff_cleanupMerge(b);
        return b
    };
    a.diff_compute = function (b, c, d) {
        var e;
        if (!b)return[
            [1, c]
        ];
        if (!c)return[
            [-1, b]
        ];
        e = b.length > c.length ? b : c;
        var f = b.length > c.length ? c : b, g = e.indexOf(f);
        if (g != -1) {
            e = [
                [1, e.substring(0, g)],
                [0, f],
                [1, e.substring(g + f.length)]
            ];
            if (b.length > c.length)e[0][0] = e[2][0] = -1;
            return e
        }
        if (e = this.diff_halfMatch(b, c)) {
            var h = e[0];
            b = e[1];
            f = e[2];
            c = e[3];
            e = e[4];
            h = this.diff_main(h, f, d);
            d = this.diff_main(b, c, d);
            return h.concat([
                [0, e]
            ], d)
        }
        if (d && (b.length < 100 || c.length < 100))d = false;
        if (d) {
            h = this.diff_linesToChars(b, c);
            b = h[0];
            c = h[1];
            h = h[2]
        }
        (e = this.diff_map(b, c)) || (e = [
            [-1, b],
            [1, c]
        ]);
        if (d) {
            this.diff_charsToLines(e, h);
            this.diff_cleanupSemantic(e);
            e.push([0, ""]);
            c = b = d = 0;
            h = "";
            for (f = ""; d < e.length;) {
                switch (e[d][0]) {
                    case 1:
                        c++;
                        f += e[d][1];
                        break;
                    case -1:
                        b++;
                        h += e[d][1];
                        break;
                    case 0:
                        if (b >= 1 && c >= 1) {
                            h = this.diff_main(h, f, false);
                            e.splice(d - b - c, b + c);
                            d = d - b - c;
                            for (b = h.length - 1; b >= 0; b--)e.splice(d, 0, h[b]);
                            d += h.length
                        }
                        b = c = 0;
                        f = h = "";
                        break
                }
                d++
            }
            e.pop()
        }
        return e
    };
    a.diff_linesToChars = function (b, c) {
        function d(i) {
            var k = "", j = 0, l = -1;
            for (var m = e.length; l < i.length - 1;) {
                l = i.indexOf("\n", j);
                if (l == -1)l = i.length - 1;
                var n = i.substring(j, l + 1);
                j = l + 1;
                if (f.hasOwnProperty ? f.hasOwnProperty(n) : f[n] !== undefined)k += String.fromCharCode(f[n]); else {
                    k += String.fromCharCode(m);
                    f[n] = m;
                    e[m++] = n
                }
            }
            return k
        }

        var e = [], f = {};
        e[0] = "";
        var g = d(b), h = d(c);
        return[g, h, e]
    };
    a.diff_charsToLines = function (b, c) {
        for (var d = 0; d < b.length; d++) {
            var e = b[d][1], f = [];
            for (var g = 0; g < e.length; g++)f[g] = c[e.charCodeAt(g)];
            b[d][1] = f.join("")
        }
    };
    a.diff_map = function (b, c) {
        var d = (new Date).getTime() + this.Diff_Timeout * 1E3, e = b.length, f = c.length, g = e + f - 1, h = this.Diff_DualThreshold * 2 < g, i = [], k = [], j = {}, l = {};
        j[1] = 0;
        l[1] = 0;
        var m, n, o, p = {}, s = false, r = !!p.hasOwnProperty, q = (e + f) % 2;
        for (var t = 0; t < g; t++) {
            if (this.Diff_Timeout > 0 && (new Date).getTime() > d)return null;
            i[t] = {};
            for (var u = -t; u <= t; u += 2) {
                m = u == -t || u != t && j[u - 1] < j[u + 1] ? j[u + 1] : j[u - 1] + 1;
                n = m - u;
                if (h) {
                    o = m + "," + n;
                    if (q && (r ? p.hasOwnProperty(o) : p[o] !== undefined))s = true;
                    q || (p[o] = t)
                }
                for (; !s && m < e && n < f && b.charAt(m) == c.charAt(n);) {
                    m++;
                    n++;
                    if (h) {
                        o = m + "," + n;
                        if (q && (r ? p.hasOwnProperty(o) : p[o] !== undefined))s = true;
                        q || (p[o] = t)
                    }
                }
                j[u] = m;
                i[t][m + "," + n] = true;
                if (m == e && n == f)return this.diff_path1(i, b, c); else if (s) {
                    k = k.slice(0, p[o] + 1);
                    d = this.diff_path1(i, b.substring(0, m), c.substring(0, n));
                    return d.concat(this.diff_path2(k, b.substring(m), c.substring(n)))
                }
            }
            if (h) {
                k[t] = {};
                for (u = -t; u <= t; u += 2) {
                    m = u == -t || u != t && l[u - 1] < l[u + 1] ? l[u + 1] : l[u - 1] + 1;
                    n = m - u;
                    o = e - m + "," + (f - n);
                    if (!q && (r ? p.hasOwnProperty(o) : p[o] !== undefined))s = true;
                    if (q)p[o] = t;
                    for (; !s && m < e && n < f && b.charAt(e -
                        m - 1) == c.charAt(f - n - 1);) {
                        m++;
                        n++;
                        o = e - m + "," + (f - n);
                        if (!q && (r ? p.hasOwnProperty(o) : p[o] !== undefined))s = true;
                        if (q)p[o] = t
                    }
                    l[u] = m;
                    k[t][m + "," + n] = true;
                    if (s) {
                        i = i.slice(0, p[o] + 1);
                        d = this.diff_path1(i, b.substring(0, e - m), c.substring(0, f - n));
                        return d.concat(this.diff_path2(k, b.substring(e - m), c.substring(f - n)))
                    }
                }
            }
        }
        return null
    };
    a.diff_path1 = function (b, c, d) {
        var e = [], f = c.length, g = d.length, h = null;
        for (var i = b.length - 2; i >= 0; i--)for (; ;)if (b[i].hasOwnProperty ? b[i].hasOwnProperty(f - 1 + "," + g) : b[i][f - 1 + "," + g] !== undefined) {
            f--;
            if (h === -1)e[0][1] = c.charAt(f) + e[0][1]; else e.unshift([-1, c.charAt(f)]);
            h = -1;
            break
        } else if (b[i].hasOwnProperty ? b[i].hasOwnProperty(f + "," + (g - 1)) : b[i][f + "," + (g - 1)] !== undefined) {
            g--;
            if (h === 1)e[0][1] = d.charAt(g) + e[0][1]; else e.unshift([1, d.charAt(g)]);
            h = 1;
            break
        } else {
            f--;
            g--;
            if (c.charCodeAt(f) != d.charCodeAt(g))throw Error("No diagonal.  Can't happen. (diff_path1)");
            if (h === 0)e[0][1] = c.charAt(f) + e[0][1]; else e.unshift([0, c.charAt(f)]);
            h = 0
        }
        return e
    };
    a.diff_path2 = function (b, c, d) {
        var e = [], f = 0, g = c.length, h = d.length, i = null;
        for (var k = b.length - 2; k >= 0; k--)for (; ;)if (b[k].hasOwnProperty ? b[k].hasOwnProperty(g - 1 + "," + h) : b[k][g - 1 + "," + h] !== undefined) {
            g--;
            if (i === -1)e[f - 1][1] += c.charAt(c.length - g - 1); else e[f++] = [-1, c.charAt(c.length - g - 1)];
            i = -1;
            break
        } else if (b[k].hasOwnProperty ? b[k].hasOwnProperty(g + "," + (h - 1)) : b[k][g + "," + (h - 1)] !== undefined) {
            h--;
            if (i === 1)e[f - 1][1] += d.charAt(d.length - h - 1); else e[f++] = [1, d.charAt(d.length - h - 1)];
            i = 1;
            break
        } else {
            g--;
            h--;
            if (c.charCodeAt(c.length -
                g - 1) != d.charCodeAt(d.length - h - 1))throw Error("No diagonal.  Can't happen. (diff_path2)");
            if (i === 0)e[f - 1][1] += c.charAt(c.length - g - 1); else e[f++] = [0, c.charAt(c.length - g - 1)];
            i = 0
        }
        return e
    };
    a.diff_commonPrefix = function (b, c) {
        if (!b || !c || b.charCodeAt(0) !== c.charCodeAt(0))return 0;
        var d = 0, e = Math.min(b.length, c.length), f = e;
        for (var g = 0; d < f;) {
            if (b.substring(g, f) == c.substring(g, f))g = d = f; else e = f;
            f = Math.floor((e - d) / 2 + d)
        }
        return f
    };
    a.diff_commonSuffix = function (b, c) {
        if (!b || !c || b.charCodeAt(b.length - 1) !== c.charCodeAt(c.length - 1))return 0;
        var d = 0, e = Math.min(b.length, c.length), f = e;
        for (var g = 0; d < f;) {
            if (b.substring(b.length - f, b.length - g) == c.substring(c.length - f, c.length - g))g = d = f; else e = f;
            f = Math.floor((e - d) / 2 + d)
        }
        return f
    };
    a.diff_halfMatch = function (b, c) {
        function d(j, l, m) {
            var n = j.substring(m, m + Math.floor(j.length / 4)), o = -1, p = "", s, r, q;
            for (var t; (o = l.indexOf(n, o + 1)) != -1;) {
                var u = g.diff_commonPrefix(j.substring(m), l.substring(o)), v = g.diff_commonSuffix(j.substring(0, m), l.substring(0, o));
                if (p.length < v + u) {
                    p = l.substring(o - v, o) + l.substring(o, o + u);
                    s = j.substring(0, m - v);
                    r = j.substring(m + u);
                    q = l.substring(0, o - v);
                    t = l.substring(o + u)
                }
            }
            return p.length >= j.length / 2 ? [s, r, q, t, p] : null
        }

        var e = b.length > c.length ? b : c, f = b.length > c.length ? c : b;
        if (e.length <
            10 || f.length < 1)return null;
        var g = this, h = d(e, f, Math.ceil(e.length / 4));
        e = d(e, f, Math.ceil(e.length / 2));
        var i;
        if (!h && !e)return null; else i = e ? h ? h[4].length > e[4].length ? h : e : e : h;
        var k;
        if (b.length > c.length) {
            h = i[0];
            e = i[1];
            f = i[2];
            k = i[3]
        } else {
            f = i[0];
            k = i[1];
            h = i[2];
            e = i[3]
        }
        i = i[4];
        return[h, e, f, k, i]
    };
    a.diff_cleanupSemantic = function (b) {
        var c = false, d = [], e = 0, f = null, g = 0, h = 0;
        for (var i = 0; g < b.length;) {
            if (b[g][0] == 0) {
                d[e++] = g;
                h = i;
                i = 0;
                f = b[g][1]
            } else {
                i += b[g][1].length;
                if (f !== null && f.length <= h && f.length <= i) {
                    b.splice(d[e - 1], 0, [-1, f]);
                    b[d[e - 1] + 1][0] = 1;
                    e--;
                    e--;
                    g = e > 0 ? d[e - 1] : -1;
                    i = h = 0;
                    f = null;
                    c = true
                }
            }
            g++
        }
        c && this.diff_cleanupMerge(b);
        this.diff_cleanupSemanticLossless(b)
    };
    a.diff_cleanupSemanticLossless = function (b) {
        function c(r, q) {
            if (!r || !q)return 5;
            var t = 0;
            if (r.charAt(r.length - 1).match(d) || q.charAt(0).match(d)) {
                t++;
                if (r.charAt(r.length - 1).match(e) || q.charAt(0).match(e)) {
                    t++;
                    if (r.charAt(r.length - 1).match(f) || q.charAt(0).match(f)) {
                        t++;
                        if (r.match(g) || q.match(h))t++
                    }
                }
            }
            return t
        }

        var d = /[^a-zA-Z0-9]/, e = /\s/, f = /[\r\n]/, g = /\n\r?\n$/, h = /^\r?\n\r?\n/;
        for (var i = 1; i < b.length - 1;) {
            if (b[i - 1][0] == 0 && b[i + 1][0] == 0) {
                var k = b[i - 1][1], j = b[i][1], l = b[i + 1][1], m = this.diff_commonSuffix(k, j);
                if (m) {
                    var n = j.substring(j.length - m);
                    k = k.substring(0, k.length - m);
                    j = n + j.substring(0, j.length - m);
                    l = n + l
                }
                m = k;
                n = j;
                var o = l;
                for (var p = c(k, j) + c(j, l); j.charAt(0) === l.charAt(0);) {
                    k += j.charAt(0);
                    j = j.substring(1) + l.charAt(0);
                    l = l.substring(1);
                    var s = c(k, j) + c(j, l);
                    if (s >= p) {
                        p = s;
                        m = k;
                        n = j;
                        o = l
                    }
                }
                if (b[i - 1][1] != m) {
                    if (m)b[i - 1][1] = m; else {
                        b.splice(i - 1, 1);
                        i--
                    }
                    b[i][1] = n;
                    if (o)b[i + 1][1] = o; else {
                        b.splice(i + 1, 1);
                        i--
                    }
                }
            }
            i++
        }
    };
    a.diff_cleanupEfficiency = function (b) {
        var c = false, d = [], e = 0, f = "", g = 0, h = false, i = false, k = false;
        for (var j = false; g < b.length;) {
            if (b[g][0] == 0) {
                if (b[g][1].length < this.Diff_EditCost && (k || j)) {
                    d[e++] = g;
                    h = k;
                    i = j;
                    f = b[g][1]
                } else {
                    e = 0;
                    f = ""
                }
                k = j = false
            } else {
                if (b[g][0] == -1)j = true; else k = true;
                if (f && (h && i && k && j || f.length < this.Diff_EditCost / 2 && h + i + k + j == 3)) {
                    b.splice(d[e - 1], 0, [-1, f]);
                    b[d[e - 1] + 1][0] = 1;
                    e--;
                    f = "";
                    if (h && i) {
                        k = j = true;
                        e = 0
                    } else {
                        e--;
                        g = e > 0 ? d[e - 1] : -1;
                        k = j = false
                    }
                    c = true
                }
            }
            g++
        }
        c && this.diff_cleanupMerge(b)
    };
    a.diff_cleanupMerge = function (b) {
        b.push([0, ""]);
        var c = 0, d = 0, e = 0, f = "", g = "";
        for (var h; c < b.length;)switch (b[c][0]) {
            case 1:
                e++;
                g += b[c][1];
                c++;
                break;
            case -1:
                d++;
                f += b[c][1];
                c++;
                break;
            case 0:
                if (d !== 0 || e !== 0) {
                    if (d !== 0 && e !== 0) {
                        h = this.diff_commonPrefix(g, f);
                        if (h !== 0) {
                            if (c - d - e > 0 && b[c - d - e - 1][0] == 0)b[c - d - e - 1][1] += g.substring(0, h); else {
                                b.splice(0, 0, [0, g.substring(0, h)]);
                                c++
                            }
                            g = g.substring(h);
                            f = f.substring(h)
                        }
                        h = this.diff_commonSuffix(g, f);
                        if (h !== 0) {
                            b[c][1] = g.substring(g.length - h) + b[c][1];
                            g = g.substring(0, g.length -
                                h);
                            f = f.substring(0, f.length - h)
                        }
                    }
                    if (d === 0)b.splice(c - d - e, d + e, [1, g]); else e === 0 ? b.splice(c - d - e, d + e, [-1, f]) : b.splice(c - d - e, d + e, [-1, f], [1, g]);
                    c = c - d - e + (d ? 1 : 0) + (e ? 1 : 0) + 1
                } else if (c !== 0 && b[c - 1][0] == 0) {
                    b[c - 1][1] += b[c][1];
                    b.splice(c, 1)
                } else c++;
                d = e = 0;
                g = f = "";
                break
        }
        b[b.length - 1][1] === "" && b.pop();
        d = false;
        for (c = 1; c < b.length - 1;) {
            if (b[c - 1][0] == 0 && b[c + 1][0] == 0)if (b[c][1].substring(b[c][1].length - b[c - 1][1].length) == b[c - 1][1]) {
                b[c][1] = b[c - 1][1] + b[c][1].substring(0, b[c][1].length - b[c - 1][1].length);
                b[c + 1][1] = b[c - 1][1] +
                    b[c + 1][1];
                b.splice(c - 1, 1);
                d = true
            } else if (b[c][1].substring(0, b[c + 1][1].length) == b[c + 1][1]) {
                b[c - 1][1] += b[c + 1][1];
                b[c][1] = b[c][1].substring(b[c + 1][1].length) + b[c + 1][1];
                b.splice(c + 1, 1);
                d = true
            }
            c++
        }
        d && this.diff_cleanupMerge(b)
    };
    a.diff_xIndex = function (b, c) {
        var d = 0, e = 0, f = 0, g = 0, h;
        for (h = 0; h < b.length; h++) {
            if (b[h][0] !== 1)d += b[h][1].length;
            if (b[h][0] !== -1)e += b[h][1].length;
            if (d > c)break;
            f = d;
            g = e
        }
        if (b.length != h && b[h][0] === -1)return g;
        return g + (c - f)
    };
    a.diff_prettyHtml = function (b) {
        var c = [], d = 0;
        for (var e = 0; e < b.length; e++) {
            var f = b[e][0], g = b[e][1], h = g.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "&para;<BR>");
            switch (f) {
                case 1:
                    c[e] = '<INS STYLE="background:#E6FFE6;" TITLE="i=' + d + '">' + h + "</INS>";
                    break;
                case -1:
                    c[e] = '<DEL STYLE="background:#FFE6E6;" TITLE="i=' + d + '">' + h + "</DEL>";
                    break;
                case 0:
                    c[e] = '<SPAN TITLE="i=' + d + '">' + h + "</SPAN>";
                    break
            }
            if (f !== -1)d += g.length
        }
        return c.join("")
    };
    a.diff_text1 = function (b) {
        var c = [];
        for (var d = 0; d < b.length; d++)if (b[d][0] !== 1)c[d] = b[d][1];
        return c.join("")
    };
    a.diff_text2 = function (b) {
        var c = [];
        for (var d = 0; d < b.length; d++)if (b[d][0] !== -1)c[d] = b[d][1];
        return c.join("")
    };
    a.diff_levenshtein = function (b) {
        var c = 0, d = 0, e = 0;
        for (var f = 0; f < b.length; f++) {
            var g = b[f][0], h = b[f][1];
            switch (g) {
                case 1:
                    d += h.length;
                    break;
                case -1:
                    e += h.length;
                    break;
                case 0:
                    c += Math.max(d, e);
                    e = d = 0;
                    break
            }
        }
        c += Math.max(d, e);
        return c
    };
    a.diff_toDelta = function (b) {
        var c = [];
        for (var d = 0; d < b.length; d++)switch (b[d][0]) {
            case 1:
                c[d] = "+" + encodeURI(b[d][1]);
                break;
            case -1:
                c[d] = "-" + b[d][1].length;
                break;
            case 0:
                c[d] = "=" + b[d][1].length;
                break
        }
        return c.join("\t").replace(/\x00/g, "%00").replace(/%20/g, " ")
    };
    a.diff_fromDelta = function (b, c) {
        var d = [], e = 0, f = 0;
        c = c.replace(/%00/g, "\u0000");
        var g = c.split(/\t/g);
        for (var h = 0; h < g.length; h++) {
            var i = g[h].substring(1);
            switch (g[h].charAt(0)) {
                case "+":
                    try {
                        d[e++] = [1, decodeURI(i)]
                    } catch (k) {
                        throw Error("Illegal escape in diff_fromDelta: " + i);
                    }
                    break;
                case "-":
                case "=":
                    var j = parseInt(i, 10);
                    if (isNaN(j) || j < 0)throw Error("Invalid number in diff_fromDelta: " + i);
                    i = b.substring(f, f += j);
                    if (g[h].charAt(0) == "=")d[e++] = [0, i]; else d[e++] = [-1, i];
                    break;
                default:
                    if (g[h])throw Error("Invalid diff operation in diff_fromDelta: " +
                        g[h]);
            }
        }
        if (f != b.length)throw Error("Delta length (" + f + ") does not equal source text length (" + b.length + ").");
        return d
    };
    a.match_main = function (b, c, d) {
        if (b == null || c == null || d == null)throw Error("Null input. (match_main)");
        d = Math.max(0, Math.min(d, b.length));
        return b == c ? 0 : b.length ? b.substring(d, d + c.length) == c ? d : this.match_bitap(b, c, d) : -1
    };
    a.match_bitap = function (b, c, d) {
        function e(r, q) {
            var t = r / c.length, u = Math.abs(d - q);
            if (!g.Match_Distance)return u ? 1 : t;
            return t + u / g.Match_Distance
        }

        if (c.length > this.Match_MaxBits)throw Error("Pattern too long for this browser.");
        var f = this.match_alphabet(c), g = this, h = this.Match_Threshold, i = b.indexOf(c, d);
        if (i != -1) {
            h = Math.min(e(0, i), h);
            i = b.lastIndexOf(c, d + c.length);
            if (i != -1)h = Math.min(e(0, i), h)
        }
        var k = 1 << c.length - 1;
        i = -1;
        var j, l, m = c.length + b.length, n;
        for (var o = 0; o < c.length; o++) {
            j = 0;
            for (l = m; j < l;) {
                if (e(o, d + l) <=
                    h)j = l; else m = l;
                l = Math.floor((m - j) / 2 + j)
            }
            m = l;
            j = Math.max(1, d - l + 1);
            var p = Math.min(d + l, b.length) + c.length;
            l = Array(p + 2);
            l[p + 1] = (1 << o) - 1;
            for (p = p; p >= j; p--) {
                var s = f[b.charAt(p - 1)];
                l[p] = o === 0 ? (l[p + 1] << 1 | 1) & s : (l[p + 1] << 1 | 1) & s | (n[p + 1] | n[p]) << 1 | 1 | n[p + 1];
                if (l[p] & k) {
                    s = e(o, p - 1);
                    if (s <= h) {
                        h = s;
                        i = p - 1;
                        if (i > d)j = Math.max(1, 2 * d - i); else break
                    }
                }
            }
            if (e(o + 1, d) > h)break;
            n = l
        }
        return i
    };
    a.match_alphabet = function (b) {
        var c = {};
        for (var d = 0; d < b.length; d++)c[b.charAt(d)] = 0;
        for (d = 0; d < b.length; d++)c[b.charAt(d)] |= 1 << b.length - d - 1;
        return c
    };
    a.patch_addContext = function (b, c) {
        if (c.length != 0) {
            var d = c.substring(b.start2, b.start2 + b.length1);
            for (var e = 0; c.indexOf(d) != c.lastIndexOf(d) && d.length < this.Match_MaxBits - this.Patch_Margin - this.Patch_Margin;) {
                e += this.Patch_Margin;
                d = c.substring(b.start2 - e, b.start2 + b.length1 + e)
            }
            e += this.Patch_Margin;
            (d = c.substring(b.start2 - e, b.start2)) && b.diffs.unshift([0, d]);
            (e = c.substring(b.start2 + b.length1, b.start2 + b.length1 + e)) && b.diffs.push([0, e]);
            b.start1 -= d.length;
            b.start2 -= d.length;
            b.length1 += d.length + e.length;
            b.length2 += d.length + e.length
        }
    };
    a.patch_make = function (b, c, d) {
        var e;
        if (typeof b == "string" && typeof c == "string" && typeof d == "undefined") {
            e = b;
            c = this.diff_main(e, c, true);
            if (c.length > 2) {
                this.diff_cleanupSemantic(c);
                this.diff_cleanupEfficiency(c)
            }
        } else if (b && typeof b == "object" && typeof c == "undefined" && typeof d == "undefined") {
            c = b;
            e = this.diff_text1(c)
        } else if (typeof b == "string" && c && typeof c == "object" && typeof d == "undefined") {
            e = b;
            c = c
        } else if (typeof b == "string" && typeof c == "string" && d && typeof d == "object") {
            e = b;
            c = d
        } else throw Error("Unknown call format to patch_make.");
        if (c.length ===
            0)return[];
        d = [];
        b = new patch_obj;
        var f = 0, g = 0, h = 0, i = e;
        e = e;
        for (var k = 0; k < c.length; k++) {
            var j = c[k][0], l = c[k][1];
            if (!f && j !== 0) {
                b.start1 = g;
                b.start2 = h
            }
            switch (j) {
                case 1:
                    b.diffs[f++] = c[k];
                    b.length2 += l.length;
                    e = e.substring(0, h) + l + e.substring(h);
                    break;
                case -1:
                    b.length1 += l.length;
                    b.diffs[f++] = c[k];
                    e = e.substring(0, h) + e.substring(h + l.length);
                    break;
                case 0:
                    if (l.length <= 2 * this.Patch_Margin && f && c.length != k + 1) {
                        b.diffs[f++] = c[k];
                        b.length1 += l.length;
                        b.length2 += l.length
                    } else if (l.length >= 2 * this.Patch_Margin)if (f) {
                        this.patch_addContext(b,
                            i);
                        d.push(b);
                        b = new patch_obj;
                        f = 0;
                        i = e;
                        g = h
                    }
                    break
            }
            if (j !== 1)g += l.length;
            if (j !== -1)h += l.length
        }
        if (f) {
            this.patch_addContext(b, i);
            d.push(b)
        }
        return d
    };
    a.patch_deepCopy = function (b) {
        var c = [];
        for (var d = 0; d < b.length; d++) {
            var e = b[d], f = new patch_obj;
            f.diffs = [];
            for (var g = 0; g < e.diffs.length; g++)f.diffs[g] = e.diffs[g].slice();
            f.start1 = e.start1;
            f.start2 = e.start2;
            f.length1 = e.length1;
            f.length2 = e.length2;
            c[d] = f
        }
        return c
    };
    a.patch_apply = function (b, c) {
        if (b.length == 0)return[c, []];
        b = this.patch_deepCopy(b);
        var d = this.patch_addPadding(b);
        c = d + c + d;
        this.patch_splitMax(b);
        var e = 0, f = [];
        for (var g = 0; g < b.length; g++) {
            var h = b[g].start2 + e, i = this.diff_text1(b[g].diffs), k, j = -1;
            if (i.length > this.Match_MaxBits) {
                k = this.match_main(c, i.substring(0, this.Match_MaxBits), h);
                if (k != -1) {
                    j = this.match_main(c, i.substring(i.length - this.Match_MaxBits), h + i.length - this.Match_MaxBits);
                    if (j == -1 || k >= j)k = -1
                }
            } else k = this.match_main(c, i, h);
            if (k == -1) {
                f[g] = false;
                e -= b[g].length2 - b[g].length1
            } else {
                f[g] = true;
                e = k - h;
                h = j == -1 ? c.substring(k, k + i.length) : c.substring(k, j + this.Match_MaxBits);
                if (i == h)c = c.substring(0, k) + this.diff_text2(b[g].diffs) + c.substring(k + i.length); else {
                    h = this.diff_main(i, h, false);
                    if (i.length > this.Match_MaxBits && this.diff_levenshtein(h) / i.length > this.Patch_DeleteThreshold)f[g] = false; else {
                        this.diff_cleanupSemanticLossless(h);
                        i = 0;
                        var l;
                        for (j = 0; j < b[g].diffs.length; j++) {
                            var m = b[g].diffs[j];
                            if (m[0] !== 0)l = this.diff_xIndex(h, i);
                            if (m[0] === 1)c = c.substring(0,
                                k + l) + m[1] + c.substring(k + l); else if (m[0] === -1)c = c.substring(0, k + l) + c.substring(k + this.diff_xIndex(h, i + m[1].length));
                            if (m[0] !== -1)i += m[1].length
                        }
                    }
                }
            }
        }
        c = c.substring(d.length, c.length - d.length);
        return[c, f]
    };
    a.patch_addPadding = function (b) {
        var c = this.Patch_Margin, d = "";
        for (var e = 1; e <= c; e++)d += String.fromCharCode(e);
        for (e = 0; e < b.length; e++) {
            b[e].start1 += c;
            b[e].start2 += c
        }
        e = b[0];
        var f = e.diffs;
        if (f.length == 0 || f[0][0] != 0) {
            f.unshift([0, d]);
            e.start1 -= c;
            e.start2 -= c;
            e.length1 += c;
            e.length2 += c
        } else if (c > f[0][1].length) {
            var g = c - f[0][1].length;
            f[0][1] = d.substring(f[0][1].length) + f[0][1];
            e.start1 -= g;
            e.start2 -= g;
            e.length1 += g;
            e.length2 += g
        }
        e = b[b.length - 1];
        f = e.diffs;
        if (f.length == 0 || f[f.length - 1][0] != 0) {
            f.push([0, d]);
            e.length1 +=
                c;
            e.length2 += c
        } else if (c > f[f.length - 1][1].length) {
            g = c - f[f.length - 1][1].length;
            f[f.length - 1][1] += d.substring(0, g);
            e.length1 += g;
            e.length2 += g
        }
        return d
    };
    a.patch_splitMax = function (b) {
        for (var c = 0; c < b.length; c++)if (b[c].length1 > this.Match_MaxBits) {
            var d = b[c];
            b.splice(c--, 1);
            var e = this.Match_MaxBits, f = d.start1, g = d.start2;
            for (var h = ""; d.diffs.length !== 0;) {
                var i = new patch_obj, k = true;
                i.start1 = f - h.length;
                i.start2 = g - h.length;
                if (h !== "") {
                    i.length1 = i.length2 = h.length;
                    i.diffs.push([0, h])
                }
                for (; d.diffs.length !== 0 && i.length1 < e - this.Patch_Margin;) {
                    h = d.diffs[0][0];
                    var j = d.diffs[0][1];
                    if (h === 1) {
                        i.length2 += j.length;
                        g += j.length;
                        i.diffs.push(d.diffs.shift());
                        k = false
                    } else if (h === -1 && i.diffs.length == 1 && i.diffs[0][0] == 0 && j.length > 2 * e) {
                        i.length1 += j.length;
                        f += j.length;
                        k = false;
                        i.diffs.push([h, j]);
                        d.diffs.shift()
                    } else {
                        j = j.substring(0, e - i.length1 - this.Patch_Margin);
                        i.length1 += j.length;
                        f += j.length;
                        if (h === 0) {
                            i.length2 += j.length;
                            g += j.length
                        } else k = false;
                        i.diffs.push([h, j]);
                        if (j == d.diffs[0][1])d.diffs.shift(); else d.diffs[0][1] = d.diffs[0][1].substring(j.length)
                    }
                }
                h = this.diff_text2(i.diffs);
                h = h.substring(h.length - this.Patch_Margin);
                j = this.diff_text1(d.diffs).substring(0, this.Patch_Margin);
                if (j !== "") {
                    i.length1 += j.length;
                    i.length2 += j.length;
                    if (i.diffs.length !== 0 && i.diffs[i.diffs.length - 1][0] === 0)i.diffs[i.diffs.length - 1][1] += j; else i.diffs.push([0, j])
                }
                k || b.splice(++c, 0, i)
            }
        }
    };
    a.patch_toText = function (b) {
        var c = [];
        for (var d = 0; d < b.length; d++)c[d] = b[d];
        return c.join("")
    };
    a.patch_fromText = function (b) {
        var c = [];
        if (!b)return c;
        b = b.replace(/%00/g, "\u0000");
        b = b.split("\n");
        for (var d = 0; d < b.length;) {
            var e = b[d].match(/^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/);
            if (!e)throw Error("Invalid patch string: " + b[d]);
            var f = new patch_obj;
            c.push(f);
            f.start1 = parseInt(e[1], 10);
            if (e[2] === "") {
                f.start1--;
                f.length1 = 1
            } else if (e[2] == "0")f.length1 = 0; else {
                f.start1--;
                f.length1 = parseInt(e[2], 10)
            }
            f.start2 = parseInt(e[3], 10);
            if (e[4] === "") {
                f.start2--;
                f.length2 = 1
            } else if (e[4] == "0")f.length2 = 0; else {
                f.start2--;
                f.length2 = parseInt(e[4], 10)
            }
            for (d++; d < b.length;) {
                e = b[d].charAt(0);
                try {
                    var g = decodeURI(b[d].substring(1))
                } catch (h) {
                    throw Error("Illegal escape in patch_fromText: " + g);
                }
                if (e == "-")f.diffs.push([-1, g]); else if (e == "+")f.diffs.push([1, g]); else if (e == " ")f.diffs.push([0, g]); else if (e == "@")break; else if (e !== "")throw Error('Invalid patch mode "' + e + '" in: ' + g);
                d++
            }
        }
        return c
    };
    function patch_obj() {
        this.diffs = [];
        this.start2 = this.start1 = null;
        this.length2 = this.length1 = 0
    }

    patch_obj.prototype.toString = function () {
        var b, c;
        b = this.length1 === 0 ? this.start1 + ",0" : this.length1 == 1 ? this.start1 + 1 : this.start1 + 1 + "," + this.length1;
        c = this.length2 === 0 ? this.start2 + ",0" : this.length2 == 1 ? this.start2 + 1 : this.start2 + 1 + "," + this.length2;
        b = ["@@ -" + b + " +" + c + " @@\n"];
        var d;
        for (c = 0; c < this.diffs.length; c++) {
            switch (this.diffs[c][0]) {
                case 1:
                    d = "+";
                    break;
                case -1:
                    d = "-";
                    break;
                case 0:
                    d = " ";
                    break
            }
            b[c + 1] = d + encodeURI(this.diffs[c][1]) + "\n"
        }
        return b.join("").replace(/\x00/g, "%00").replace(/%20/g, " ")
    };
    window.diff_match_patch = diff_match_patch;
    window.patch_obj = patch_obj;
    window.DIFF_DELETE = -1;
    window.DIFF_INSERT = 1;
    window.DIFF_EQUAL = 0;
    var mobwrite = {};
    mobwrite.syncGateway = "/scripts/q.py";
    mobwrite.get_maxchars = 1E3;
    mobwrite.debug = false;
    if (!("console"in window) || !("info"in window.console) || !("warn"in window.console) || !("error"in window.console))mobwrite.debug = false;
    mobwrite.sniffUserAgent = function () {
        if (window.opera)mobwrite.UA_opera = true; else {
            var b = navigator.userAgent.toLowerCase();
            mobwrite.UA_webkit = b.indexOf("webkit") != -1;
            if (!mobwrite.UA_webkit) {
                mobwrite.UA_gecko = b.indexOf("gecko") != -1;
                if (!mobwrite.UA_gecko)mobwrite.UA_msie = b.indexOf("msie") != -1
            }
        }
    };
    mobwrite.UA_gecko = false;
    mobwrite.UA_opera = false;
    mobwrite.UA_msie = false;
    mobwrite.UA_webkit = false;
    mobwrite.sniffUserAgent();
    mobwrite.syncRunPid_ = null;
    mobwrite.syncKillPid_ = null;
    mobwrite.timeoutInterval = 3E4;
    mobwrite.minSyncInterval = 1E3;
    mobwrite.maxSyncInterval = 1E4;
    mobwrite.syncInterval = 2E3;
    mobwrite.idPrefix = "";
    mobwrite.nullifyAll = false;
    mobwrite.clientChange_ = false;
    mobwrite.serverChange_ = false;
    mobwrite.syncAjaxObj_ = null;
    mobwrite.uniqueId = function () {
        var b = "abcdefghijklmnopqrstuvwxyz", c = b.charAt(Math.random() * b.length);
        b += "0123456789-_:.";
        for (var d = 1; d < 8; d++)c += b.charAt(Math.random() * b.length);
        if (c.indexOf("--") != -1)c = mobwrite.uniqueId();
        return c
    };
    mobwrite.syncUsername = mobwrite.uniqueId();
    mobwrite.shared = {};
    mobwrite.shareHandlers = [];
    mobwrite.shareObj = function (b) {
        if (b) {
            this.file = b;
            this.dmp = new diff_match_patch;
            this.dmp.Diff_Timeout = 0.5;
            this.editStack = [];
            mobwrite.debug && window.console.info('Creating shareObj: "' + b + '"')
        }
    };
    a = mobwrite.shareObj.prototype;
    a.shadowText = "";
    a.clientVersion = 0;
    a.serverVersion = 0;
    a.deltaOk = false;
    a.mergeChanges = true;
    a.getClientText = function () {
        window.alert("Defined by subclass");
        return""
    };
    a.setClientText = function () {
        window.alert("Defined by subclass")
    };
    a.patchClientText = function (b) {
        var c = this.getClientText();
        b = this.dmp.patch_apply(b, c);
        c != b[0] && this.setClientText(b[0])
    };
    a.onSentDiff = function () {
    };
    a.fireChange = function (b) {
        if ("createEvent"in document) {
            var c = document.createEvent("HTMLEvents");
            c.initEvent("change", false, false);
            b.dispatchEvent(c)
        } else"fireEvent"in b && b.fireEvent("onchange")
    };
    a.nullify = function () {
        mobwrite.unshare(this.file);
        return"N:" + mobwrite.idPrefix + this.file + "\n"
    };
    a.getMessages = function () {
        return null
    };
    a.setMessages = function () {
    };
    a.syncText = function () {
        var b = this.getClientText();
        if (this.deltaOk) {
            var c = this.dmp.diff_main(this.shadowText, b, true);
            if (c.length > 2) {
                this.dmp.diff_cleanupSemantic(c);
                this.dmp.diff_cleanupEfficiency(c)
            }
            var d = c.length != 1 || c[0][0] != 0;
            if (d) {
                mobwrite.clientChange_ = true;
                this.shadowText = b
            }
            if (d || !this.editStack.length) {
                b = (this.mergeChanges ? "d:" : "D:") + this.clientVersion + ":" + this.dmp.diff_toDelta(c);
                this.editStack.push([this.clientVersion, b]);
                this.clientVersion++;
                this.onSentDiff(c)
            }
        } else {
            this.shadowText = b;
            this.clientVersion++;
            b = "r:" + this.clientVersion + ":" + encodeURI(b).replace(/%20/g, " ");
            this.editStack.push([this.clientVersion, b]);
            this.deltaOk = true
        }
        c = "F:" + this.serverVersion + ":" + mobwrite.idPrefix + this.file + "\n";
        for (b = 0; b < this.editStack.length; b++)
            c += this.editStack[b][1] + "\n";
        if ("JSON"in window) {
            b = this.getMessages();
            if (b !== null)
                c += "M:" + window.JSON.stringify(b) + "\n"
        }
        return c.replace(/\x00/g, "%00")
    };
    mobwrite.syncRun1_ = function () {
        mobwrite.clientChange_ = false;
        var b = [];
        b[0] = "u:" + mobwrite.syncUsername + "\n";
        var c = true;
        for (var d in mobwrite.shared)if (mobwrite.shared.hasOwnProperty(d)) {
            mobwrite.nullifyAll ? b.push(mobwrite.shared[d].nullify()) : b.push(mobwrite.shared[d].syncText());
            c = false
        }
        if (c)mobwrite.debug && window.console.info("MobWrite task stopped."); else {
            mobwrite.syncStarted();
            if (b.length == 1) {
                mobwrite.debug && window.console.info("All objects silent; null sync.");
                mobwrite.syncRun2_("\n\n")
            } else {
                d =
                    mobwrite.syncGateway.indexOf("://") != -1;
                mobwrite.debug && window.console.info("TO server:\n" + b.join(""));
                b.push("\n");
                b = b.join("");
                mobwrite.syncKillPid_ = window.setTimeout(mobwrite.syncKill_, mobwrite.timeoutInterval);
                if (d) {
                    b = mobwrite.splitBlocks_(b);
                    c = document.getElementsByTagName("head")[0];
                    for (d = 0; d < b.length; d++) {
                        var e = document.getElementById("mobwrite_sync" + d);
                        if (e) {
                            e.parentNode.removeChild(e);
                            if (!mobwrite.UA_msie) {
                                for (var f in e)delete e[f];
                                e = null
                            }
                        }
                        if (!e) {
                            e = document.createElement("script");
                            e.type =
                                "text/javascript";
                            e.charset = "utf-8";
                            e.id = "mobwrite_sync" + d
                        }
                        e.src = b[d];
                        c.appendChild(e)
                    }
                } else {
                    b = "q=" + encodeURIComponent(b);
                    mobwrite.syncAjaxObj_ = mobwrite.syncLoadAjax_(mobwrite.syncGateway, b, mobwrite.syncCheckAjax_)
                }
            }
        }
    };
    mobwrite.splitBlocks_ = function (b, c) {
        var d = encodeURIComponent(b), e = mobwrite.syncGateway + "?p=", f = mobwrite.get_maxchars - e.length, g = d.replace(/%20/g, "+");
        if (g.length <= f)return[e + g];
        g = 1;
        if (typeof c != "undefined")g = String(c).length;
        f = [];
        d = encodeURIComponent(d);
        var h = mobwrite.uniqueId();
        g = (e + "b%3A" + h + "+++%0A%0A").length + 2 * g;
        g = mobwrite.get_maxchars - g;
        if (g < 3) {
            mobwrite.debug && window.console.error("mobwrite.get_maxchars too small to send data.");
            g = 3
        }
        var i = Math.ceil(d.length / g);
        if (typeof c != "undefined")i = Math.max(i,
            c);
        h = "b%3A" + h + "+" + encodeURIComponent(i) + "+";
        var k = 0;
        for (var j = 1; j <= i; j++) {
            var l = k + g;
            if (d.charAt(l - 1) == "%")l -= 1; else if (d.charAt(l - 2) == "%")l -= 2;
            k = d.substring(k, l);
            f.push(e + h + j + "+" + k + "%0A%0A");
            k = l
        }
        if (k < d.length) {
            mobwrite.debug && window.console.debug("Recursing splitBlocks_ at n=" + (i + 1));
            return this.splitBlocks_(b, i + 1)
        }
        return f
    };
    mobwrite.callback = function (b) {
        if (b)mobwrite.syncRun2_(b + "\n"); else {
            window.clearTimeout(mobwrite.syncKillPid_);
            mobwrite.syncKillPid_ = window.setTimeout(mobwrite.syncKill_, mobwrite.timeoutInterval)
        }
    };
    mobwrite.syncRun2_ = function (b) {
        mobwrite.serverChange_ = false;
        mobwrite.debug && window.console.info("FROM server:\n" + b);
        b = b.replace(/%00/g, "\u0000");
        if (b.length < 2 || b.substring(b.length - 2) != "\n\n") {
            b = "";
            mobwrite.error && window.console.info("Truncated data.  Abort.")
        }
        b = b.split("\n");
        var c = null, d = null, e = false;
        for (var f = 0; f < b.length; f++) {
            var g = b[f];
            if (!g)break;
            if (g.charAt(1) != ":")mobwrite.debug && window.console.error("Unparsable line: " + g); else {
                var h = g.charAt(0), i = g.substring(2), k;
                if ("FfDdRr".indexOf(h) != -1) {
                    var j =
                        i.indexOf(":");
                    if (j < 1) {
                        mobwrite.debug && window.console.error("No version number: " + g);
                        continue
                    }
                    k = parseInt(i.substring(0, j), 10);
                    if (isNaN(k)) {
                        mobwrite.debug && window.console.error("NaN version number: " + g);
                        continue
                    }
                    i = i.substring(j + 1)
                }
                if (h == "F" || h == "f") {
                    c && !e && c.setMessages(null);
                    if (i.substring(0, mobwrite.idPrefix.length) == mobwrite.idPrefix) {
                        i = i.substring(mobwrite.idPrefix.length);
                        if (mobwrite.shared.hasOwnProperty(i)) {
                            c = mobwrite.shared[i];
                            c.deltaOk = true;
                            d = k;
                            for (e = 0; e < c.editStack.length; e++)if (c.editStack[e][0] <=
                                d) {
                                c.editStack.splice(e, 1);
                                e--
                            }
                        } else {
                            c = null;
                            mobwrite.debug && window.console.error("Unknown file: " + i)
                        }
                        e = false
                    } else {
                        c = null;
                        mobwrite.debug && window.console.error('File does not have "' + mobwrite.idPrefix + '" prefix: ' + i)
                    }
                } else if (h == "R" || h == "r") {
                    if (c) {
                        c.shadowText = decodeURI(i);
                        c.clientVersion = d;
                        c.serverVersion = k;
                        c.editStack = [];
                        h == "R" && c.setClientText(c.shadowText);
                        mobwrite.serverChange_ = true
                    }
                } else if (h == "D" || h == "d") {
                    if (c)if (d != c.clientVersion) {
                        c.deltaOk = false;
                        mobwrite.debug && window.console.error("Client version number mismatch.\nExpected: " +
                            c.clientVersion + " Got: " + d)
                    } else if (k > c.serverVersion) {
                        c.deltaOk = false;
                        mobwrite.debug && window.console.error("Server version in future.\nExpected: " + c.serverVersion + " Got: " + k)
                    } else if (k < c.serverVersion)mobwrite.debug && window.console.warn("Server version in past.\nExpected: " + c.serverVersion + " Got: " + k); else {
                        var l;
                        try {
                            l = c.dmp.diff_fromDelta(c.shadowText, i);
                            c.serverVersion++
                        } catch (m) {
                            l = null;
                            c.deltaOk = false;
                            mobwrite.syncInterval = 0;
                            mobwrite.debug && window.console.error("Delta mismatch.\n" + encodeURI(c.shadowText))
                        }
                        if (l &&
                            (l.length != 1 || l[0][0] != 0)) {
                            if (h == "D") {
                                c.shadowText = c.dmp.diff_text2(l);
                                c.setClientText(c.shadowText)
                            } else {
                                i = c.dmp.patch_make(c.shadowText, l);
                                g = c.dmp.patch_apply(i, c.shadowText);
                                c.shadowText = g[0];
                                c.patchClientText(i)
                            }
                            mobwrite.serverChange_ = true
                        }
                    }
                } else if (h == "M" || h == "m")if (c && "JSON"in window) {
                    g = null;
                    try {
                        g = window.JSON.parse(i)
                    } catch (n) {
                        mobwrite.debug && window.console.severe("Message parse error.\n" + encodeURI(i))
                    }
                    if (g !== null && typeof g == "object") {
                        c.setMessages(g);
                        e = true
                    }
                }
            }
        }
        c && !e && c.setMessages(null);
        mobwrite.computeSyncInterval_();
        window.clearTimeout(mobwrite.syncRunPid_);
        mobwrite.syncRunPid_ = window.setTimeout(mobwrite.syncRun1_, mobwrite.syncInterval);
        mobwrite.syncSuccess();
        window.clearTimeout(mobwrite.syncKillPid_);
        mobwrite.syncKillPid_ = null
    };
    mobwrite.computeSyncInterval_ = function () {
        var b = mobwrite.maxSyncInterval - mobwrite.minSyncInterval;
        if (mobwrite.clientChange_ || mobwrite.serverChange_)mobwrite.syncInterval = 0; else mobwrite.syncInterval += b * 0.1;
        mobwrite.syncInterval = Math.max(mobwrite.minSyncInterval, mobwrite.syncInterval);
        mobwrite.syncInterval = Math.min(mobwrite.maxSyncInterval, mobwrite.syncInterval)
    };
    mobwrite.syncKill_ = function () {
        mobwrite.syncKillPid_ = null;
        if (mobwrite.syncAjaxObj_) {
            mobwrite.syncAjaxObj_.abort();
            mobwrite.syncAjaxObj_ = null
        }
        mobwrite.debug && window.console.warn("Connection timeout.");
        mobwrite.syncFailed();
        window.clearTimeout(mobwrite.syncRunPid_);
        mobwrite.syncRunPid_ = window.setTimeout(mobwrite.syncRun1_, 1)
    };
    mobwrite.syncStarted = function () {
    };
    mobwrite.syncSuccess = function () {
    };
    mobwrite.syncFailed = function () {
    };
    mobwrite.syncLoadAjax_ = function (b, c, d) {
        var e = null;
        if (window.XMLHttpRequest)try {
            e = new XMLHttpRequest
        } catch (f) {
            e = null
        } else if (window.ActiveXObject)try {
            e = new ActiveXObject("Msxml2.XMLHTTP")
        } catch (g) {
            try {
                e = new ActiveXObject("Microsoft.XMLHTTP")
            } catch (h) {
                e = null
            }
        }
        if (e) {
            e.onreadystatechange = d;
            e.open("POST", b, true);
            e.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            e.send(c)
        }
        return e
    };
    mobwrite.syncCheckAjax_ = function () {
        if (!(typeof mobwrite == "undefined" || !mobwrite.syncAjaxObj_))if (mobwrite.syncAjaxObj_.readyState == 4)if (mobwrite.syncAjaxObj_.status == 200) {
            var b = mobwrite.syncAjaxObj_.responseText;
            mobwrite.syncAjaxObj_ = null;
            mobwrite.syncRun2_(b)
        } else {
            mobwrite.debug && window.console.warn("Connection error code: " + mobwrite.syncAjaxObj_.status);
            mobwrite.syncAjaxObj_ = null
        }
    };
    mobwrite.unload_ = function () {
        if (!mobwrite.syncKillPid_) {
            mobwrite.debug = false;
            mobwrite.syncRun1_()
        }
    };
    if (window.addEventListener)window.addEventListener("unload", mobwrite.unload_, false); else window.attachEvent && window.attachEvent("onunload", mobwrite.unload_);
    mobwrite.share = function () {
        for (var b = 0; b < arguments.length; b++) {
            var c = arguments[b], d = null;
            for (var e = 0; e < mobwrite.shareHandlers.length && !d; e++)d = mobwrite.shareHandlers[e].call(mobwrite, c);
            if (d && d.file)if (d.file.match(/^[A-Za-z][-.:\w]*$/))if (d.file in mobwrite.shared)mobwrite.debug && window.console.warn('Ignoring duplicate share on "' + c + '".'); else {
                mobwrite.shared[d.file] = d;
                if (mobwrite.syncRunPid_ === null)mobwrite.debug && window.console.info("MobWrite task started."); else window.clearTimeout(mobwrite.syncRunPid_);
                mobwrite.syncRunPid_ = window.setTimeout(mobwrite.syncRun1_, 10)
            } else mobwrite.debug && window.console.error('Illegal id "' + d.file + '".'); else mobwrite.debug && window.console.warn("Share: Unknown widget type: " + c + ".")
        }
    };
    mobwrite.unshare = function () {
        for (var b = 0; b < arguments.length; b++) {
            var c = arguments[b];
            if (typeof c == "string" && mobwrite.shared.hasOwnProperty(c)) {
                delete mobwrite.shared[c];
                mobwrite.debug && window.console.info("Unshared: " + c)
            } else {
                var d = null;
                for (var e = 0; e < mobwrite.shareHandlers.length && !d; e++)d = mobwrite.shareHandlers[e].call(mobwrite, c);
                if (d && d.file)if (mobwrite.shared.hasOwnProperty(d.file)) {
                    delete mobwrite.shared[d.file];
                    mobwrite.debug && window.console.info("Unshared: " + c)
                } else mobwrite.debug && window.console.warn("Ignoring " +
                    c + ". Not currently shared."); else mobwrite.debug && window.console.warn("Unshare: Unknown widget type: " + c + ".")
            }
        }
    };
    window.mobwrite = mobwrite;
    if (!window.JSON)window.JSON = {};
    (function () {
        function b(j) {
            return j < 10 ? "0" + j : j
        }

        function c(j) {
            f.lastIndex = 0;
            return f.test(j) ? '"' + j.replace(f, function (l) {
                var m = i[l];
                return typeof m === "string" ? m : "\\u" + ("0000" + l.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + j + '"'
        }

        function d(j, l) {
            var m, n, o, p, s = g, r, q = l[j];
            if (q && typeof q === "object" && typeof q.toJSON === "function")q = q.toJSON(j);
            if (typeof k === "function")q = k.call(l, j, q);
            switch (typeof q) {
                case "string":
                    return c(q);
                case "number":
                    return isFinite(q) ? String(q) : "null";
                case "boolean":
                case "null":
                    return String(q);
                case "object":
                    if (!q)return"null";
                    g += h;
                    r = [];
                    if (Object.prototype.toString.apply(q) === "[object Array]") {
                        p = q.length;
                        for (m = 0; m < p; m += 1)r[m] = d(m, q) || "null";
                        o = r.length === 0 ? "[]" : g ? "[\n" + g + r.join(",\n" + g) + "\n" + s + "]" : "[" + r.join(",") + "]";
                        g = s;
                        return o
                    }
                    if (k && typeof k === "object") {
                        p = k.length;
                        for (m = 0; m < p; m += 1) {
                            n = k[m];
                            if (typeof n === "string")if (o = d(n, q))r.push(c(n) + (g ? ": " : ":") + o)
                        }
                    } else for (n in q)if (Object.hasOwnProperty.call(q, n))if (o = d(n, q))r.push(c(n) + (g ? ": " : ":") + o);
                    o = r.length === 0 ? "{}" : g ? "{\n" + g + r.join(",\n" + g) +
                        "\n" + s + "}" : "{" + r.join(",") + "}";
                    g = s;
                    return o
            }
        }

        if (typeof Date.prototype.toJSON !== "function") {
            Date.prototype.toJSON = function () {
                return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + b(this.getUTCMonth() + 1) + "-" + b(this.getUTCDate()) + "T" + b(this.getUTCHours()) + ":" + b(this.getUTCMinutes()) + ":" + b(this.getUTCSeconds()) + "Z" : null
            };
            String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
                return this.valueOf()
            }
        }
        var e = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            f = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, g, h, i = {"\u0008": "\\b", "\t": "\\t", "\n": "\\n", "\u000c": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\"}, k;
        if (typeof window.JSON.stringify !== "function")window.JSON.stringify = function (j, l, m) {
            var n;
            h = g = "";
            if (typeof m === "number")for (n = 0; n < m; n += 1)h += " "; else if (typeof m === "string")h = m;
            if ((k = l) && typeof l !== "function" && (typeof l !== "object" || typeof l.length !== "number"))throw Error("JSON.stringify");
            return d("", {"": j})
        };
        if (typeof window.JSON.parse !== "function")window.JSON.parse = function (j, l) {
            function m(o, p) {
                var s, r, q = o[p];
                if (q && typeof q === "object")for (s in q)if (Object.hasOwnProperty.call(q, s)) {
                    r = m(q, s);
                    if (r !== undefined)q[s] = r; else delete q[s]
                }
                return l.call(o, p, q)
            }

            var n;
            e.lastIndex = 0;
            if (e.test(j))j = j.replace(e, function (o) {
                return"\\u" + ("0000" + o.charCodeAt(0).toString(16)).slice(-4)
            });
            if (/^[\],:{}\s]*$/.test(j.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                n = eval("(" + j + ")");
                return typeof l === "function" ? m({"": n}, "") : n
            }
            throw Error("JSON.parse");
        }
    })();
    mobwrite.validNode_ = function (b) {
        for (; b.parentNode;)b = b.parentNode;
        return b.nodeType == 9
    };
    mobwrite.shareHandlerForm = function (b) {
        if (typeof b == "string")b = document.getElementById(b) || document.forms[b];
        if (b && "tagName"in b && b.tagName == "FORM") {
            var c = 0;
            for (var d; d = b.elements[c]; c++)mobwrite.share(d)
        }
        return null
    };
    mobwrite.shareHandlers.push(mobwrite.shareHandlerForm);
    mobwrite.shareHiddenObj = function (b) {
        mobwrite.shareObj.apply(this, [b.id]);
        this.element = b
    };
    mobwrite.shareHiddenObj.prototype = new mobwrite.shareObj("");
    mobwrite.shareHiddenObj.prototype.getClientText = function () {
        mobwrite.validNode_(this.element) || mobwrite.unshare(this.file);
        this.mergeChanges = !this.element.value.match(/^\s*-?[\d.]+\s*$/);
        return this.element.value
    };
    mobwrite.shareHiddenObj.prototype.setClientText = function (b) {
        this.element.value = b
    };
    mobwrite.shareHiddenObj.shareHandler = function (b) {
        if (typeof b == "string")b = document.getElementById(b);
        if (b && "type"in b && b.type == "hidden")return new mobwrite.shareHiddenObj(b);
        return null
    };
    mobwrite.shareHandlers.push(mobwrite.shareHiddenObj.shareHandler);
    mobwrite.shareCheckboxObj = function (b) {
        mobwrite.shareObj.apply(this, [b.id]);
        this.element = b;
        this.mergeChanges = false
    };
    mobwrite.shareCheckboxObj.prototype = new mobwrite.shareObj("");
    mobwrite.shareCheckboxObj.prototype.getClientText = function () {
        mobwrite.validNode_(this.element) || mobwrite.unshare(this.file);
        return this.element.checked ? this.element.value : ""
    };
    mobwrite.shareCheckboxObj.prototype.setClientText = function (b) {
        var c = this.element.value || "on";
        this.element.checked = b == c;
        this.fireChange(this.element)
    };
    mobwrite.shareCheckboxObj.shareHandler = function (b) {
        if (typeof b == "string")b = document.getElementById(b);
        if (b && "type"in b && b.type == "checkbox")return new mobwrite.shareCheckboxObj(b);
        return null
    };
    mobwrite.shareHandlers.push(mobwrite.shareCheckboxObj.shareHandler);
    mobwrite.shareSelectObj = function (b) {
        mobwrite.shareObj.apply(this, [b.id]);
        this.element = b;
        this.mergeChanges = b.type == "select-multiple"
    };
    mobwrite.shareSelectObj.prototype = new mobwrite.shareObj("");
    mobwrite.shareSelectObj.prototype.getClientText = function () {
        mobwrite.validNode_(this.element) || mobwrite.unshare(this.file);
        var b = [], c = 0;
        for (var d; d = this.element.options[c]; c++)d.selected && b.push(d.value);
        return b.join("\u0000")
    };
    mobwrite.shareSelectObj.prototype.setClientText = function (b) {
        b = "\u0000" + b + "\u0000";
        var c = 0;
        for (var d; d = this.element.options[c]; c++)d.selected = b.indexOf("\u0000" + d.value + "\u0000") != -1;
        this.fireChange(this.element)
    };
    mobwrite.shareSelectObj.shareHandler = function (b) {
        if (typeof b == "string")b = document.getElementById(b);
        if (b && "type"in b && (b.type == "select-one" || b.type == "select-multiple"))return new mobwrite.shareSelectObj(b);
        return null
    };
    mobwrite.shareHandlers.push(mobwrite.shareSelectObj.shareHandler);
    mobwrite.shareRadioObj = function (b) {
        mobwrite.shareObj.apply(this, [b.id]);
        this.elements = [b];
        this.form = b.form;
        this.name = b.name;
        this.mergeChanges = false
    };
    mobwrite.shareRadioObj.prototype = new mobwrite.shareObj("");
    mobwrite.shareRadioObj.prototype.getClientText = function () {
        mobwrite.validNode_(this.elements[0]) || mobwrite.unshare(this.file);
        for (var b = 0; b < this.elements.length; b++)if (this.elements[b].checked)return this.elements[b].value;
        return""
    };
    mobwrite.shareRadioObj.prototype.setClientText = function (b) {
        for (var c = 0; c < this.elements.length; c++) {
            this.elements[c].checked = b == this.elements[c].value;
            this.fireChange(this.elements[c])
        }
    };
    mobwrite.shareRadioObj.shareHandler = function (b) {
        if (typeof b == "string")b = document.getElementById(b);
        if (b && "type"in b && b.type == "radio") {
            for (var c in mobwrite.shared)if (mobwrite.shared[c].form == b.form && mobwrite.shared[c].name == b.name) {
                mobwrite.shared[c].elements.push(b);
                return null
            }
            return new mobwrite.shareRadioObj(b)
        }
        return null
    };
    mobwrite.shareHandlers.push(mobwrite.shareRadioObj.shareHandler);
    mobwrite.shareTextareaObj = function (b) {
        mobwrite.shareObj.apply(this, [b.id]);
        this.element = b;
        if (b.type == "password")this.mergeChanges = false
    };
    mobwrite.shareTextareaObj.prototype = new mobwrite.shareObj("");
    a = mobwrite.shareTextareaObj.prototype;
    a.getClientText = function () {
        mobwrite.validNode_(this.element) || mobwrite.unshare(this.file);
        var b = mobwrite.shareTextareaObj.normalizeLinebreaks_(this.element.value);
        if (this.element.type == "text")this.mergeChanges = !b.match(/^\s*-?[\d.,]+\s*$/);
        return b
    };
    a.setClientText = function (b) {
        this.element.value = b;
        this.fireChange(this.element)
    };
    a.patchClientText = function (b) {
        this.dmp.Match_Distance = 1E3;
        this.dmp.Match_Threshold = 0.6;
        var c = this.getClientText(), d = this.captureCursor_(), e = [];
        if (d) {
            e[0] = d.startOffset;
            if ("endOffset"in d)e[1] = d.endOffset
        }
        b = this.patch_apply_(b, c, e);
        if (c != b) {
            this.setClientText(b);
            if (d) {
                d.startOffset = e[0];
                if (e.length > 1) {
                    d.endOffset = e[1];
                    if (d.startOffset >= d.endOffset)d.collapsed = true
                }
                this.restoreCursor_(d)
            }
        }
    };
    a.patch_apply_ = function (b, c, d) {
        if (b.length == 0)return c;
        b = this.dmp.patch_deepCopy(b);
        var e = this.dmp.patch_addPadding(b);
        c = e + c + e;
        this.dmp.patch_splitMax(b);
        var f = 0;
        for (var g = 0; g < b.length; g++) {
            var h = b[g].start2 + f, i = this.dmp.diff_text1(b[g].diffs), k, j = -1;
            if (i.length > this.dmp.Match_MaxBits) {
                k = this.dmp.match_main(c, i.substring(0, this.dmp.Match_MaxBits), h);
                if (k != -1) {
                    j = this.dmp.match_main(c, i.substring(i.length - this.dmp.Match_MaxBits), h + i.length - this.dmp.Match_MaxBits);
                    if (j == -1 || k >= j)k = -1
                }
            } else k = this.dmp.match_main(c,
                i, h);
            if (k == -1) {
                mobwrite.debug && window.console.warn("Patch failed: " + b[g]);
                f -= b[g].length2 - b[g].length1
            } else {
                mobwrite.debug && window.console.info("Patch OK.");
                f = k - h;
                h = j == -1 ? c.substring(k, k + i.length) : c.substring(k, j + this.dmp.Match_MaxBits);
                h = this.dmp.diff_main(i, h, false);
                if (i.length > this.dmp.Match_MaxBits && this.dmp.diff_levenshtein(h) / i.length > this.dmp.Patch_DeleteThreshold)mobwrite.debug && window.console.warn("Patch contents mismatch: " + b[g]); else {
                    i = 0;
                    var l;
                    for (j = 0; j < b[g].diffs.length; j++) {
                        var m = b[g].diffs[j];
                        if (m[0] !== 0)l = this.dmp.diff_xIndex(h, i);
                        if (m[0] === 1) {
                            c = c.substring(0, k + l) + m[1] + c.substring(k + l);
                            for (var n = 0; n < d.length; n++)if (d[n] + e.length > k + l)d[n] += m[1].length
                        } else if (m[0] === -1) {
                            var o = k + l, p = k + this.dmp.diff_xIndex(h, i + m[1].length);
                            c = c.substring(0, o) + c.substring(p);
                            for (n = 0; n < d.length; n++)if (d[n] + e.length > o)if (d[n] + e.length < p)d[n] = o - e.length; else d[n] -= p - o
                        }
                        if (m[0] !== -1)i += m[1].length
                    }
                }
            }
        }
        return c = c.substring(e.length, c.length - e.length)
    };
    a.captureCursor_ = function () {
        if ("activeElement"in this.element && !this.element.activeElement)return null;
        var b = this.dmp.Match_MaxBits / 2, c = this.element.value, d = {};
        if ("selectionStart"in this.element) {
            try {
                var e = this.element.selectionStart, f = this.element.selectionEnd
            } catch (g) {
                return null
            }
            d.startPrefix = c.substring(e - b, e);
            d.startSuffix = c.substring(e, e + b);
            d.startOffset = e;
            d.collapsed = e == f;
            if (!d.collapsed) {
                d.endPrefix = c.substring(f - b, f);
                d.endSuffix = c.substring(f, f + b);
                d.endOffset = f
            }
        } else {
            for (e = this.element; e.parentNode;)e =
                e.parentNode;
            if (!e.selection || !e.selection.createRange)return null;
            c = e.selection.createRange();
            if (c.parentElement() != this.element)return null;
            e = e.body.createTextRange();
            d.collapsed = c.text == "";
            e.moveToElementText(this.element);
            if (!d.collapsed) {
                e.setEndPoint("EndToEnd", c);
                d.endPrefix = e.text;
                d.endOffset = d.endPrefix.length;
                d.endPrefix = d.endPrefix.substring(d.endPrefix.length - b)
            }
            e.setEndPoint("EndToStart", c);
            d.startPrefix = e.text;
            d.startOffset = d.startPrefix.length;
            d.startPrefix = d.startPrefix.substring(d.startPrefix.length -
                b);
            e.moveToElementText(this.element);
            e.setEndPoint("StartToStart", c);
            d.startSuffix = e.text.substring(0, b);
            if (!d.collapsed) {
                e.setEndPoint("StartToEnd", c);
                d.endSuffix = e.text.substring(0, b)
            }
        }
        if ("scrollTop"in this.element) {
            d.scrollTop = this.element.scrollTop / this.element.scrollHeight;
            d.scrollLeft = this.element.scrollLeft / this.element.scrollWidth
        }
        return d
    };
    a.restoreCursor_ = function (b) {
        this.dmp.Match_Distance = 1E3;
        this.dmp.Match_Threshold = 0.9;
        var c = this.dmp.Match_MaxBits / 2, d = this.element.value, e = b.startPrefix + b.startSuffix, f, g = this.dmp.match_main(d, e, b.startOffset - c);
        if (g !== null) {
            f = d.substring(g, g + e.length);
            e = this.dmp.diff_main(e, f, false);
            g += this.dmp.diff_xIndex(e, b.startPrefix.length)
        }
        var h = null;
        if (!b.collapsed) {
            e = b.endPrefix + b.endSuffix;
            h = this.dmp.match_main(d, e, b.endOffset - c);
            if (h !== null) {
                f = d.substring(h, h + e.length);
                e = this.dmp.diff_main(e, f, false);
                h += this.dmp.diff_xIndex(e, b.endPrefix.length)
            }
        }
        if (g === null && h !== null)g = h; else if (g === null && h === null)g = b.startOffset;
        if (h === null)h = g;
        if ("selectionStart"in this.element) {
            this.element.selectionStart = g;
            this.element.selectionEnd = h
        } else {
            for (c = this.element; c.parentNode;)c = c.parentNode;
            if (!c.selection || !c.selection.createRange)return;
            d = this.element.value.substring(0, g);
            d = d.replace(/\r\n/g, "\n").length;
            c = c.body.createTextRange();
            c.moveToElementText(this.element);
            c.collapse(true);
            c.moveStart("character", d);
            if (!b.collapsed) {
                d = this.element.value.substring(g, h);
                g = d.replace(/\r\n/g, "\n").length;
                c.moveEnd("character", g)
            }
            c.select()
        }
        if ("scrollTop"in b) {
            this.element.scrollTop = b.scrollTop * this.element.scrollHeight;
            this.element.scrollLeft = b.scrollLeft * this.element.scrollWidth
        }
    };
    mobwrite.shareTextareaObj.normalizeLinebreaks_ = function (b) {
        return b.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
    };
    mobwrite.shareTextareaObj.shareHandler = function (b) {
        if (typeof b == "string")b = document.getElementById(b);
        if (b && "value"in b && "type"in b && (b.type == "textarea" || b.type == "text" || b.type == "password")) {
            if (mobwrite.UA_webkit) {
                b.addEventListener("focus", function () {
                    this.activeElement = true
                }, false);
                b.addEventListener("blur", function () {
                    this.activeElement = false
                }, false);
                b.activeElement = false
            }
            return new mobwrite.shareTextareaObj(b)
        }
        return null
    };
    mobwrite.shareHandlers.push(mobwrite.shareTextareaObj.shareHandler);
})()

var cv = document.getElementById('c'), c = cv.getContext('2d');
var ps = [], es = [];
const g = 256, l = 32;
var lt = 0, jt = 0, di, pt = 0, pm = 125, st = 0, sm = 500, s = 0;
var jing = false, ja = false, go = false, pd = false, pr = true, ds = false;
var pl = {x: 16,y: g - l,w: 24,h: l}
function p (x,y,w,h) {this.x = x;this.y = y;this.w = w;this.h = h;}
function e1 (x,y,w,h) {this.x = x;this.y = y;this.w = w;this.h = h;}
function e2 (x,y,w,h) {this.x = x;this.y = y;this.w = w;this.h = h;}
function draw() {
    c.clearRect(0, 0, g, g);
    c.fillStyle = 'cornsilk';
    c.fillRect(0, 0, g, g);
    c.fillStyle = 'darkgreen';
    c.fillRect(pl.x, pl.y, pl.w, pl.h);
    c.fillRect(pl.x + pl.w, pl.y + 8, 8, 8);
    for (const proj of ps) {c.fillRect(proj.x, proj.y, proj.w, proj.h);}
    for (const obj of es) {c.fillRect(obj.x, obj.y, obj.w, obj.h);}
}
function input() {
    document.addEventListener("keydown", (e)=> {
        if (!go && pr && !pd && e.key == 'Enter') { pd = true; pr = false; } 
        else if (!go && pr && pd && e.key == 'Enter') { pd = false; pr = false; }
        if (pt >= pm && e.key == 'z') {
            pt = 0;
            var newProj = new p(pl.x + pl.w, pl.y +8, 8,8);
            ps.push(newProj);
        }
        if (e.key == 'x') {
            if (jing) {ja = true;} 
            jing = true;
        }
    })
    document.addEventListener("keyup", (e)=> {
        if (go && e.key == 'Enter') {reset();} 
        else if ((pd || !pd) && e.key == 'Enter') {pr = true;}
    })
}
function reset() {
    go = false;
    ds = false;
    s = 0;
    pl.x = 16;
    pl.y = g - l;
    jing = false;
    jt = 0;
    ps.splice(0, ps.length);
    es.splice(0, es.length);
}
function j(t) {
    t /= 100;
    jt += t;
    di = 0.5 * jt;
    if (pl.y <= 0) {pl.y = 0;jt = 6;}
    pl.y += (-3 + di);
    if (pl.y >= g - l) {jt = 0;jing = false;pl.y = g - l;}
}
function plm(ct) {
    if (jing) {
        if (ja) { jt = 0; ja = false; }
        j(ct);
    }
}
function prm() {
    if (ps.length > 0) {
        var i = 0;
        while (i < ps.length) {
            ps[i].x += 6;
            if (ps[i].x > g + ps[i].w) {ps.shift();} 
            else {i++;}
        }
    }
}
function em() {
    if (es.length > 0) {
        var i = 0;
        while (i < es.length) {
            es[i].x -= 2;
            if (es[i].x < - es[i].w) {es.shift();} 
            else {i++;}
        }
    }
}
function collisionCheck(ob1, ob2) {
    var x1 = ob1.x + ob1.w - ob2.x, x2 = ob2.x + ob2.w - ob1.x, y1 = ob1.y + ob1.h - ob2.y, y2 = ob2.y + ob2.h - ob1.y;
    if (((x1 > 0 && x1 <= ob1.w) || (x2 > 0 && x2 <= ob2.w))&& ((y1 > 0 && y1 <= ob1.h)|| (y2 > 0 && y2 <= ob2.h))) {return true;}
}
function se() {
    var type = Math.floor(Math.random() * 2);
    if (type == 0) {es.push(new e1(g, 16 + Math.floor(Math.random() * 8) * 31, l, 16));}
    else { es.push(new e2(g, Math.floor(Math.random() * 8) * 32, l, l));}
    st = 0; sm = Math.floor(Math.random() * 1000) + 500;
}
function gl(ts) {
    var ct = ts - lt;
    lt = ts;
    input();
    if (!go && !pd) {
        pt += ct;
        st += ct;
        if (st > sm) {se();}
        plm(ct);
        prm();
        em();
        draw();
        var j = 0;
        while (j < es.length) {
            var check = collisionCheck(pl, es[j]);
            if (check) { go = true; check = false; }
            var i = 0;
            while (i < ps.length) {
                if (j < es.length) {check = collisionCheck(ps[i], es[j]);}
                if (check) {
                    if (es[j].constructor.name == 'e2') {ps.splice(i, 1);} 
                    else { ps.splice(i, 1); es.splice(j, 1); s++; }
                    i = 0;
                    check = false;
                } else {i++;}
            }
            j++;
        }
    } else if (go && !ds) { ds = true; alert('Final Score: ' + s);}
    requestAnimationFrame(gl);
}
requestAnimationFrame(gl);
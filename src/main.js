import './styles/main.css';
import { LEGAL } from './legal.js';

const $=s=>document.querySelector(s);
const TEAMS=[[1,"Tiburones de Neo-Guayana","TNG"],[2,"Centinelas de Capital","CC"],[3,"Leones del Valle","LV"],[4,"Águilas del Litoral","AL"],[5,"Bravos del Puerto","BP"],[6,"Cóndores del Sur","CS"]].map(([id,n,a])=>({id,n,a}));
const T=id=>TEAMS.find(t=>t.id===id);
const F=["Carlos","Anthony","Luis","Diego","Mateo","Jhonny","Ender","Rafael","Kevin","Omar","Félix","Andrés","Héctor"];
const L=["Mendoza","Pérez","Quintero","Salazar","Rivas","Arteaga","Colmenares","Ocando","Bastidas","Zambrano","Duarte","Linares","Villasmil","Peña","Rojas","Ledezma","Camacho","Ibarra","Navas","Torrealba"];
const PL=["C","1B","2B","3B","SS","LF","CF","RF","BD","P","UT","UT","UT"];
const ALL=[];const R={};
TEAMS.forEach((t,i)=>{R[t.id]=PL.map((pos,j)=>{const s=i*17+j*13,avg=.23+(s*7%90)/1000,era=2.1+(s%32)/10;
 const p={id:t.id*100+j,t:t.id,pos,start:j<10,name:(i===0&&j===0)?"Carlos “El Rayo” Mendoza":F[(j+i)%13]+" "+L[(i*7+j*3)%20],
 avg,obp:avg+.065+(s%25)/1000,slg:avg+.14+(s*3%90)/1000,hr:s%27,rbi:18+s*5%70,era,whip:.95+(s%40)/100,fip:era+((s%7)-3)/10,rookie:j>=10};
 ALL.push(p);return p})});
const byId=id=>ALL.find(p=>p.id===id);
const f3=n=>n.toFixed(3).replace(/^0/,""),f2=n=>n.toFixed(2);
const ops=p=>p.obp+p.slg;
const bats=ALL.filter(p=>p.pos!=="P"),pits=ALL.filter(p=>p.pos==="P");
const av=(t,g)=>`<span class="av ${g?"g":""}" aria-hidden="true">${t.a}</span>`;
const tbl=(h,rows,cls)=>`<div style="overflow-x:auto"><table class="tbl ${cls||""}"><tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr>${rows.join("")}</table></div>`;

/* Calendario (datos estáticos) */
const JN=[...Array(10)].map((_,i)=>["J"+(i+1),"Jornada "+(i+1)]).concat([["SF","Semifinal"],["F","Final"]]);
const PAIRS=(()=>{let t=[1,2,3,4,5,6];const a=[];for(let r=0;r<5;r++){a.push([0,1,2].map(i=>r%2?[t[5-i],t[i]]:[t[i],t[5-i]]));t=[t[0],t[5],t[1],t[2],t[3],t[4]]}return a.concat(a.map(m=>m.map(([h,x])=>[x,h]))).concat([[[1,5],[3,2]],[[1,3]]])})();
const sched=PAIRS.map((m,j)=>m.map(([h,a],k)=>{const st=j<5||(j===5&&k===1)?"fin":(j===5&&k===0)?"live":"prog";let hs=(j*3+k*2+2)%8;const as=(j*2+k*3+1)%7;if(hs===as)hs++;
 return{di:j,k,h,a,st,hs:st==="prog"?0:hs,as:st==="prog"?0:as,inn:st==="live"?6:9,hora:["13:00","16:00","19:30"][k]}}));
const flat=sched.flat();
const sp=t=>R[t].find(p=>p.pos==="P");
const EV=["sencillo al jardín central","ponche (3 strikes)","elevado al jardín derecho, out","doble por la banda izquierda","rodado al campocorto, out","base por bolas","jonrón por el jardín izquierdo","línea al tercera base, out"];
const bat=(t,n)=>R[t].filter(p=>p.start&&p.pos!=="P")[n%9];
function plays(g){const n=g.st==="prog"?0:g.inn,o=[];
 for(let i=1;i<=n;i++)for(const top of[1,0]){if(!top&&g.st==="live"&&i===n)continue;const t=top?g.a:g.h,b=bat(t,i*2+(top?0:1));
  o.push(`<small>${top?"Alta":"Baja"} ${i} · ${T(t).a}</small>${b.name}: ${EV[(g.k+i*3+(top?1:4))%8]}`)}
 return (g.sim||[]).concat(o.reverse())}
function recap(g){if(g.st==="prog")return"";const w=g.hs>g.as?g.h:g.a,l=w===g.h?g.a:g.h,s=bat(w,g.k+g.di),ws=Math.max(g.hs,g.as),ls=Math.min(g.hs,g.as);
 return `<div class="card glass ai"><span class="tg">IA</span><b>${g.st==="live"?"Resumen parcial":"Resumen del partido"}</b><p>${T(w).n} ${g.st==="live"?"domina":"se impuso"} ${ws}-${ls} a ${T(l).n}${g.st==="live"?" en la entrada "+g.inn:""}. Destacó ${s.name} (AVG ${f3(s.avg)}, OPS ${f3(ops(s))}) y el abridor ${sp(w).name} aportó con ERA de ${f2(sp(w).era)} en la temporada. Generado desde el boxscore.</p></div>`}

/* Campo */
const SPOT={P:[200,232],C:[200,335],"1B":[300,225],"2B":[250,165],"3B":[100,225],SS:[150,165],LF:[75,100],CF:[200,55],RF:[325,100],BD:[352,300]};
function field(pl){return `<svg class="dia" viewBox="0 0 400 370" role="img" aria-label="Cuadro de béisbol"><path d="M200 345L20 150A260 260 0 0 1 380 150z" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.35)"/><path d="M200 305L295 215 200 125 105 215z" fill="rgba(254,203,2,.14)" stroke="#fecb02" stroke-width="2"/><circle cx="200" cy="215" r="48" fill="none" stroke="rgba(255,255,255,.25)"/>${[[295,215],[200,125],[105,215]].map(([x,y])=>`<rect x="${x-7}" y="${y-7}" width="14" height="14" transform="rotate(45 ${x} ${y})" fill="#fff"/>`).join("")}<path d="M200 296l9 9-9 9-9-9z" fill="#fff"/>`+
 pl.map(p=>{const[x,y]=SPOT[p.pos],ln=p.name.replace(/“.*”\s/,"").split(" ").slice(-1)[0];return `<g class="pl" tabindex="0" role="button" data-p="${p.id}" aria-label="${p.pos} ${p.name}"><circle cx="${x}" cy="${y}" r="16"/><text class="pos" x="${x}" y="${y+4}">${p.pos}</text><text class="nm" x="${x}" y="${y+32}">${ln}</text></g>`}).join("")+"</svg>"}
function pcard(p){return `<div class="pcard"><b>${p.name}</b><br>${p.pos==="P"?`ERA ${f2(p.era)} · WHIP ${f2(p.whip)} · FIP ${f2(p.fip)}`:`${p.pos} · AVG ${f3(p.avg)} · OBP ${f3(p.obp)} · SLG ${f3(p.slg)} · HR ${p.hr} · CI ${p.rbi}`}</div>`}
const fieldBox=pl=>`<div class="field"><div class="glass panel">${field(pl)}</div><div class="glass panel"><h2>Jugador</h2><div id="pc"><p style="color:var(--soft)">Toca un jugador del cuadro.</p></div></div></div>`;
document.addEventListener("click",e=>{const g=e.target.closest(".pl");if(!g)return;document.querySelectorAll(".pl").forEach(x=>x.classList.toggle("on",x===g));$("#pc").innerHTML=pcard(byId(+g.dataset.p))});
document.addEventListener("keydown",e=>{if(e.key==="Enter")e.target.closest?.(".pl")?.click()});

/* Estado */
let tab="live",dayI=5,game=null,gtab="plays",gteam=null,stPh="reg",sub="pos",posSel="C",dtMode="mes";
const chips=(arr,cur,key)=>`<div class="sel">${arr.map(([v,l])=>`<button class="chip" aria-pressed="${v==cur}" data-${key}="${v}">${l}</button>`).join("")}</div>`;

/* Marcadores */
function gcard(g){const h=T(g.h),a=T(g.a),pr=g.st==="prog";
 return `<button class="game glass" data-g="${g.di}-${g.k}"><div class="row ${g.as>g.hs?"lead":""}">${av(a)}<span class="n">${a.n}</span><span class="s">${pr?"–":g.as}</span></div><div class="row ${g.hs>=g.as&&!pr?"lead":""}">${av(h,1)}<span class="n">${h.n}</span><span class="s">${pr?"–":g.hs}</span></div><div class="meta"><span class="tag ${g.st==="live"?"":"off"}">${g.st==="live"?"En vivo · entrada "+g.inn:g.st==="fin"?"Final":g.hora}</span><span>${pr?"Abren: "+sp(g.a).name.split(" ").pop()+" / "+sp(g.h).name.split(" ").pop():"Ver detalle"}</span></div></button>`}
function viewLive(){if(game)return viewGame();
 return `<div class="days">${JN.map(([c,l],i)=>`<button class="day" aria-pressed="${i===dayI}" data-d="${i}">${i<10?"Jornada":"Fase"}<b ${i<10?"":'style="font-size:.8rem"'}>${i<10?i+1:l}</b></button>`).join("")}</div><h2>${dayI<10?"Ronda regular · Jornada "+(dayI+1)+" de 10":JN[dayI][1]}</h2><div class="games">${sched[dayI].map(gcard).join("")}</div>`}
function viewGame(){const g=game,h=T(g.h),a=T(g.a);gteam=gteam||g.a;
 const tm=T(gteam),st=R[gteam].filter(p=>p.start),bn=R[gteam].filter(p=>!p.start);
 let body="";
 if(gtab==="plays")body=g.st==="prog"?forecast(g):recap(g)+`<div class="glass panel"><h2>Noticias de cada jugada</h2><ul class="feed">${plays(g).map(t=>`<li>${t}</li>`).join("")}</ul></div>`;
 if(gtab==="lineup")body=`<div class="cols">${[g.a,g.h].map(id=>`<div class="glass panel"><h2>${T(id).n}</h2><ol style="padding-left:20px;display:grid;gap:6px">${R[id].filter(p=>p.start&&p.pos!=="P").map(p=>`<li><b>${p.pos}</b> · ${p.name}</li>`).join("")}</ol><p style="margin-top:10px;color:var(--soft)">Abridor: <b style="color:var(--white)">${sp(id).name}</b></p></div>`).join("")}</div>`;
 const tchips=chips([[g.a,a.a],[g.h,h.a]],gteam,"gt");
 if(gtab==="field")body=tchips+fieldBox(st);
 if(gtab==="stats")body=tchips+`<div class="glass panel"><h2>${tm.n} · en el campo primero</h2>`+tbl(["Jugador","Pos","AVG","OBP","SLG","HR","CI"],st.filter(p=>p.pos!=="P").concat(bn).map(p=>`<tr class="${p.start?"":"bn"}"><td>${p.name}${p.start?"":" (banca)"}</td><td>${p.pos}</td><td>${f3(p.avg)}</td><td>${f3(p.obp)}</td><td>${f3(p.slg)}</td><td>${p.hr}</td><td>${p.rbi}</td></tr>`))+`<br>`+tbl(["Abridor","ERA","WHIP","FIP"],[`<tr><td>${sp(gteam).name}</td><td>${f2(sp(gteam).era)}</td><td>${f2(sp(gteam).whip)}</td><td>${f2(sp(gteam).fip)}</td></tr>`])+`</div>`;
 return `<button class="back" data-back>← Volver a marcadores</button><div class="glass panel" style="margin-bottom:12px">${gcard(g).replace("<button","<div").replace("</button>","</div>").replace("game glass","game").replace(/ data-g="[^"]*"/,"")}</div>`+chips([["plays","Jugadas"],["lineup","Lineup"],["field","Cuadro"],["stats","Estadísticas"]],gtab,"gtab")+body}
function forecast(g){const p=45+(g.h*7+g.a*3)%26;return `<div class="card glass ai"><span class="tag">IA</span><b>Pronóstico</b><p>${T(g.h).n} ${p}% · ${T(g.a).n} ${100-p}%. Abridores: ${sp(g.h).name} (ERA ${f2(sp(g.h).era)}) vs ${sp(g.a).name} (ERA ${f2(sp(g.a).era)}). ${JN[g.di][1]} · ${g.hora}.</p><div class="bar"><i style="width:${p}%"></i></div></div>`}

/* Posiciones */
const STAND={reg:TEAMS.map((t,i)=>[t.id,40-i*5-i%2,20+i*5+i%2]),semi:[[1,6,3],[3,5,4],[2,3,6],[5,2,7]],fin:[[1,3,2],[3,2,3]]};
function viewStand(){return chips([["reg","Ronda regular"],["semi","Semifinal"],["fin","Final"]],stPh,"ph")+`<div class="glass panel">`+`<table class="stand"><tr><th>#</th><th>Equipo</th><th>G</th><th>P</th><th>PCT</th></tr>${STAND[stPh].map(([id,w,l],i)=>`<tr><td>${i+1}</td><td><span class="t">${av(T(id),i===0)}${T(id).n}</span></td><td>${w}</td><td>${l}</td><td>${f3(w/(w+l))}</td></tr>`).join("")}</table></div>`}

/* Estadísticas */
const topN=(arr,k,asc,n=5)=>[...arr].sort((a,b)=>asc?a[k]-b[k]:b[k]-a[k]).slice(0,n);
const lead=(title,arr,k,asc,fm)=>`<div class="glass panel"><h2>${title}</h2>`+tbl(["Jugador","Eq.",k.toUpperCase()],topN(arr,k,asc).map(p=>`<tr><td>${p.name}</td><td>${T(p.t).a}</td><td>${fm(p[k])}</td></tr>`))+`</div>`;
function viewPos(){const ps=["C","1B","2B","3B","SS","LF","CF","RF","BD","P"],list=ALL.filter(p=>p.pos===posSel&&p.start);
 const aw=[["MVP",topN(bats,"avg",0,1)[0]&&[...bats].sort((a,b)=>ops(b)-ops(a))[0]],["Bate de Plata",topN(bats,"avg",0,1)[0]],["Guante de Oro",ALL.filter(p=>p.pos==="SS")[2]],["Novato del Año",ALL.filter(p=>p.rookie).sort((a,b)=>ops(b)-ops(a))[0]],["Catcher Defensivo",ALL.filter(p=>p.pos==="C")[4]]];
 return chips(ps.map(x=>[x,x]),posSel,"ps")+`<div class="glass panel" style="margin-bottom:16px"><h2>${posSel==="P"?"Pitcher":"Posición "+posSel}: titulares por equipo</h2>`+(posSel==="P"?tbl(["Jugador","Eq.","ERA","WHIP","FIP"],list.sort((a,b)=>a.era-b.era).map(p=>`<tr><td>${p.name}</td><td>${T(p.t).a}</td><td>${f2(p.era)}</td><td>${f2(p.whip)}</td><td>${f2(p.fip)}</td></tr>`)):tbl(["Jugador","Eq.","AVG","OBP","SLG"],list.sort((a,b)=>b.avg-a.avg).map(p=>`<tr><td>${p.name}</td><td>${T(p.t).a}</td><td>${f3(p.avg)}</td><td>${f3(p.obp)}</td><td>${f3(p.slg)}</td></tr>`)))+`</div><div class="cols">${lead("Líderes AVG",bats,"avg",0,f3)}${lead("Líderes OBP",bats,"obp",0,f3)}${lead("Líderes SLG",bats,"slg",0,f3)}${lead("Picheo ERA",pits,"era",1,f2)}${lead("Picheo WHIP",pits,"whip",1,f2)}${lead("Picheo FIP",pits,"fip",1,f2)}</div><div class="glass panel" style="margin-top:16px"><h2>Premios y reconocimientos</h2>`+tbl(["Premio","Ganador","Eq."],aw.map(([n,p])=>`<tr><td>${n}</td><td>${p.name}</td><td>${T(p.t).a}</td></tr>`))+`</div>`}
const NEWS=[["Los Tiburones aseguran el primer lugar","Con una racha de ocho victorias, Neo-Guayana llega a la semifinal como líder de la ronda regular."],["Abridor de Leones lanza siete entradas en blanco","Anthony Pérez dominó la ofensiva rival con nueve ponches y ninguna base por bolas."],["Novato de Cóndores del Sur sorprende con 12 jonrones","El jardinero lidera a los debutantes y compite por el premio Novato del Año."],["Centinelas de Capital refuerza su bullpen","El cuerpo técnico anunció cambios en la rotación para la fase final."]];
const TX=[["Firma","Bravos del Puerto firman al relevista Héctor Villasmil por dos temporadas."],["Cambio","Águilas del Litoral envían al segunda base Diego Salazar a Leones del Valle por dos prospectos."],["Rumor","Se menciona a Carlos “El Rayo” Mendoza como objetivo de Centinelas de Capital para la próxima temporada."],["Contratación","Cóndores del Sur incorporan un nuevo coach de bateo para la serie final."],["Rumor","Fuentes cercanas indican que Tiburones buscan un cerrador antes de la final."]];
const viewNews=()=>`<div class="cols"><div>${NEWS.map(([t,x])=>`<div class="glass card"><h3>${t}</h3><p>${x}</p></div>`).join("")}</div><div class="glass panel"><h2>Transacciones y rumores</h2><ul class="feed" style="max-height:none">${TX.map(([t,x])=>`<li><span class="tg">${t}</span>${x}</li>`).join("")}</ul></div></div>`;
const viewAI=()=>flat.filter(g=>g.st!=="fin").slice(0,6).map(g=>forecast(g)).join("")||"<p>No hay partidos próximos.</p>";
function viewDream(){const mk=(p,s)=>(dtMode==="mes"?p.id*7%5/50:0)+(p.pos==="P"?(5-p.era)/5:ops(p)),
 team=["C","1B","2B","3B","SS","LF","CF","RF","BD","P"].map(pos=>ALL.filter(p=>p.pos===pos&&p.start).sort((a,b)=>mk(b)-mk(a))[0]);
 return chips([["mes","Mejor del mes"],["año","Mejor del año"]],dtMode,"dt")+fieldBox(team)+`<p style="color:var(--soft);margin-top:10px">Ranking ponderado: OPS para bateadores y ERA para el pitcher${dtMode==="mes"?", con peso extra al rendimiento reciente":""}.</p>`}
function viewStats(){const s=[["pos","Por posición"],["dream","Dream Team"]];
 return chips(s,sub,"sb")+({pos:viewPos,dream:viewDream})[sub]()}
let nsub="news";
function viewNewsTab(){return chips([["news","Noticias y rumores"],["ai","Pronóstico IA"]],nsub,"ns")+(nsub==="ai"?viewAI():viewNews())}

function render(){$("#main").innerHTML=page?viewPage():({live:viewLive,stand:viewStand,stats:viewStats,news:viewNewsTab})[tab]();
 const st=document.querySelector(".days"),b=st&&st.querySelector("[aria-pressed=true]");if(b)st.scrollLeft=b.offsetLeft-st.clientWidth/2+b.offsetWidth/2}
$("#main").addEventListener("click",e=>{const c=e.target.closest("[data-g],[data-d],[data-back],[data-gtab],[data-gt],[data-ph],[data-sb],[data-ps],[data-dt],[data-ns]");if(!c)return;const d=c.dataset;
 if(d.g){location.hash="juego-"+d.g;return}
 else if("back"in d){location.hash="";return}else if(d.d)dayI=+d.d;else if(d.gtab)gtab=d.gtab;else if(d.gt)gteam=+d.gt;
 else if(d.ph)stPh=d.ph;else if(d.sb)sub=d.sb;else if(d.ps)posSel=d.ps;else if(d.dt)dtMode=d.dt;else if(d.ns)nsub=d.ns;
 render()});
function pill(){const b=$('#tabs [aria-selected="true"]'),p=$("#pill");p.classList.add("go");p.style.left=b.offsetLeft+"px";p.style.width=b.offsetWidth+"px";setTimeout(()=>p.classList.remove("go"),550)}
$("#tabs").onclick=e=>{const b=e.target.closest("button");if(!b)return;document.querySelectorAll("#tabs button").forEach(x=>x.setAttribute("aria-selected",x===b));tab=b.dataset.t;game=null;if(location.hash)location.hash="";else{render();pill()}};
/* Simulación momentánea del partido en vivo (reemplazable por datos reales) */
const liveG=flat.filter(g=>g.st==="live");liveG.forEach(g=>{g.top=false;g.outs=0;g.sim=[]});
const SE=[["sencillo al jardín central",0,0],["ponche (3 strikes)",1,0],["elevado al jardín derecho, out",1,0],["doble por la banda izquierda",0,0],["rodado al campocorto, out",1,0],["base por bolas",0,0],["jonrón por el jardín izquierdo",0,1],["línea al tercera base, out",1,0]];
setInterval(()=>{const sc=[];liveG.forEach(g=>{const e=SE[Math.floor(Math.random()*8)],t=g.top?g.a:g.h,b=bat(t,Math.floor(Math.random()*9));
 const run=e[2]?1+(Math.random()<.4?1:0):0;if(g.top)g.as+=run;else g.hs+=run;g.outs+=e[1];
 g.sim.unshift(`<small>${g.top?"Alta":"Baja"} ${g.inn} · ${T(t).a}</small>${b.name}: ${e[0]}${run?" · +"+run+" carr.":""}`);if(g.sim.length>40)g.sim.pop();
 if(g.outs>=3){g.outs=0;if(g.top)g.top=false;else{g.top=true;g.inn++}}
 if(run)sc.push(g)});
 if(!page&&tab==="live"&&!(game&&gtab==="field")){render();sc.forEach(g=>document.querySelector(`[data-g="${g.di}-${g.k}"]`)?.classList.add("bump"))}},3500);
let page=null;
function viewPage(){const b='<button class="back" data-back>← Volver al inicio</button>';
 return page==="404"?b+'<div class="glass panel"><h2>404 · Jugada fuera del cuadro</h2><p style="color:var(--soft)">La página que buscas no existe o cambió de lugar. Vuelve al inicio para seguir los marcadores.</p></div>':b+`<div class="glass panel legal"><h2>${LEGAL[page][0]}</h2>${LEGAL[page][1]}</div>`}
function route(){const hs=location.hash.slice(1),m=/^juego-(\d+)-(\d)$/.exec(hs),g=m&&sched[+m[1]]&&sched[+m[1]][+m[2]];
 page=g||!hs?null:(LEGAL[hs]?hs:"404");
 if(g){if(game!==g){game=g;gtab="plays";gteam=null}tab="live";scrollTo(0,0)}else{game=null;if(page)scrollTo(0,0)}
 $("#tabs").hidden=!!(game||page);document.querySelectorAll("#tabs button").forEach(x=>x.setAttribute("aria-selected",x.dataset.t===tab));
 document.title=page?(page==="404"?"Página no encontrada":LEGAL[page][0])+" · Diamante Vivo":"Diamante Vivo · Resultados y estadísticas de béisbol";
 render();if(!game&&!page)pill()}
const getC=()=>{try{return localStorage.getItem("dv-consent")}catch(e){return null}};
function loadAnalytics(){/* Conecta aquí tu analítica (GA4, Plausible…) con tu ID. Solo se ejecuta con consentimiento. */}
function setC(v){try{localStorage.setItem("dv-consent",v)}catch(e){}$("#ck").hidden=true;if(v==="all")loadAnalytics()}
$("#ck").onclick=e=>{if(e.target.dataset.c)setC(e.target.dataset.c)};$("#ckp").onclick=()=>{$("#ck").hidden=false};
$("#ck").hidden=!!getC();if(getC()==="all")loadAnalytics();
addEventListener("hashchange",route);route();addEventListener("resize",pill);document.fonts?.ready.then(pill);

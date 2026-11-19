const c=document.getElementById("c"),ctx=c.getContext("2d"),ui=document.getElementById("ui");
function rs(){c.width=innerWidth;c.height=innerHeight}rs();addEventListener("resize",rs);
const CELL=8,COLS=Math.ceil(innerWidth/CELL),ROWS=Math.ceil(innerHeight/CELL);
const foodP=new Float32Array(COLS*ROWS),homeP=new Float32Array(COLS*ROWS),traffic=new Float32Array(COLS*ROWS),obs=new Uint8Array(COLS*ROWS);
const I=(x,y)=>y*COLS+x;
const nest={x:150,y:innerHeight/2};
const foods=[{x:innerWidth-140,y:innerHeight/2}];
let mode=1;
addEventListener('keydown',e=>{if(['1','2','3'].includes(e.key))mode=+e.key});
c.oncontextmenu=e=>e.preventDefault();
c.onmousedown=e=>{if(e.button===0)foods.push({x:e.clientX,y:e.clientY}); if(e.button===2){let gx=(e.clientX/CELL)|0,gy=(e.clientY/CELL)|0; for(let yy=-4;yy<=4;yy++)for(let xx=-4;xx<=4;xx++){let nx=gx+xx,ny=gy+yy;if(nx>=0&&ny>=0&&nx<COLS&&ny<ROWS)obs[I(nx,ny)]=1;}}};
const ants=[...Array(500)].map(()=>({x:nest.x,y:nest.y,a:Math.random()*6.28,state:0,path:[]}));
const sample=(arr,x,y)=>{let gx=(x/CELL)|0,gy=(y/CELL)|0; if(gx<0||gy<0||gx>=COLS||gy>=ROWS)return 0; return arr[I(gx,gy)]};
function dep(arr,x,y,v){let gx=(x/CELL)|0,gy=(y/CELL)|0; if(gx>=0&&gy>=0&&gx<COLS&&gy<ROWS)arr[I(gx,gy)]+=v;}
function nearestFood(a){let best=foods[0],d=1e9;for(const f of foods){let dd=(f.x-a.x)**2+(f.y-a.y)**2;if(dd<d){d=dd;best=f}}return best}
function steer(a,map){let best=a.a,val=-1;for(const o of[-0.8,0,0.8]){let ang=a.a+o,sx=a.x+Math.cos(ang)*18,sy=a.y+Math.sin(ang)*18;let v=sample(map,sx,sy)+Math.random();if(v>val){val=v;best=ang}}a.a+=(best-a.a)*0.2+(Math.random()-0.5)*0.15}
function update(a){if(a.state===0){steer(a,foodP);a.path.push([a.x,a.y]); if(a.path.length>250)a.path.shift(); let f=nearestFood(a); if(Math.hypot(a.x-f.x,a.y-f.y)<20)a.state=1;} else {dep(foodP,a.x,a.y,3); let p=a.path.pop(); if(p)a.a=Math.atan2(p[1]-a.y,p[0]-a.x); if(Math.hypot(a.x-nest.x,a.y-nest.y)<20){a.state=0;a.path=[];}}
 let nx=a.x+Math.cos(a.a)*1.6, ny=a.y+Math.sin(a.a)*1.6; let gx=(nx/CELL)|0,gy=(ny/CELL)|0; if(gx>=0&&gy>=0&&gx<COLS&&gy<ROWS&&obs[I(gx,gy)]) a.a+=1.7; else {a.x=nx;a.y=ny; traffic[I(Math.max(0,Math.min(COLS-1,gx)),Math.max(0,Math.min(ROWS-1,gy)))]++;}}
function evap(){for(let i=0;i<foodP.length;i++){foodP[i]*=0.996;traffic[i]*=0.995}}
function draw(){ctx.fillStyle='#101114';ctx.fillRect(0,0,c.width,c.height);for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){let id=I(x,y);if(obs[id]){ctx.fillStyle='#666';ctx.fillRect(x*CELL,y*CELL,CELL,CELL);continue;}let v=mode===1?foodP[id]:mode===2?traffic[id]:homeP[id]; if(v>1){let a=Math.min(.8,v/120); ctx.fillStyle=mode===1?`rgba(0,200,255,${a})`:mode===2?`rgba(255,180,0,${a})`:`rgba(0,255,120,${a})`; ctx.fillRect(x*CELL,y*CELL,CELL,CELL);}}
for(const f of foods){ctx.fillStyle='orange';ctx.fillRect(f.x-8,f.y-8,16,16)}
ctx.fillStyle='green';ctx.beginPath();ctx.arc(nest.x,nest.y,20,0,7);ctx.fill();
for(const a of ants){update(a);ctx.fillStyle=a.state?'#ffd700':'#fff';ctx.fillRect(a.x,a.y,2,2)}
evap(); ui.textContent=`Ants: ${ants.length}
Foods: ${foods.length}
Mode: ${mode}
Obstacles: ${obs.reduce((s,v)=>s+v,0)}`; requestAnimationFrame(draw)} draw();
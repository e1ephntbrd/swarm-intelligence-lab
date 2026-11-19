
const c=document.getElementById('world');
const ctx=c.getContext('2d');
const dbg=document.getElementById('debug');
function resize(){c.width=innerWidth;c.height=innerHeight;} resize(); addEventListener('resize',resize);
const nest={x:120,y:c.height/2};
const food={x:c.width-140,y:c.height/2};
const cell=8;
const cols=Math.ceil(c.width/cell); const rows=Math.ceil(c.height/cell);
const pher=new Float32Array(cols*rows);
const idx=(x,y)=>y*cols+x;
const ants=[...Array(120)].map(()=>({x:nest.x,y:nest.y,state:'SEARCH',speed:1+Math.random()*0.7,angle:Math.random()*Math.PI*2}));
function sample(gx,gy){ if(gx<0||gy<0||gx>=cols||gy>=rows) return 0; return pher[idx(gx,gy)]; }
function deposit(a){ const gx=(a.x/cell)|0, gy=(a.y/cell)|0; if(gx>=0&&gy>=0&&gx<cols&&gy<rows) pher[idx(gx,gy)] = Math.min(255, pher[idx(gx,gy)] + 18); }
function ev(){ for(let i=0;i<pher.length;i++) pher[i]*=0.996; }
function steer(a){
 const sensors=[-0.5,0,0.5];
 let best=a.angle,bestVal=-1;
 for(const off of sensors){
   const ang=a.angle+off;
   const sx=a.x+Math.cos(ang)*18;
   const sy=a.y+Math.sin(ang)*18;
   const val=sample((sx/cell)|0,(sy/cell)|0)+Math.random()*3;
   if(val>bestVal){bestVal=val;best=ang;}
 }
 a.angle += (best-a.angle)*0.15 + (Math.random()-0.5)*0.08;
}
function updateAnt(a){
 if(a.state==='SEARCH'){
   steer(a);
   const dx=food.x-a.x, dy=food.y-a.y;
   a.angle += Math.atan2(dy,dx)-a.angle>0?0.002:-0.002;
   if(Math.hypot(dx,dy)<20) a.state='RETURN';
 } else {
   deposit(a);
   const dx=nest.x-a.x, dy=nest.y-a.y;
   a.angle=Math.atan2(dy,dx)+(Math.random()-0.5)*0.1;
   if(Math.hypot(dx,dy)<20) a.state='SEARCH';
 }
 a.x+=Math.cos(a.angle)*a.speed;
 a.y+=Math.sin(a.angle)*a.speed;
 a.x=Math.max(0,Math.min(c.width,a.x));
 a.y=Math.max(0,Math.min(c.height,a.y));
}
function drawP(){
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  const p=pher[idx(x,y)]; if(p<4) continue;
  ctx.fillStyle=`rgba(0,200,255,${Math.min(0.8,p/255)})`;
  ctx.fillRect(x*cell,y*cell,cell,cell);
 }
}
function loop(){
 ev();
 ctx.fillStyle='#101114'; ctx.fillRect(0,0,c.width,c.height);
 drawP();
 let carrying=0;
 for(const a of ants){ updateAnt(a); if(a.state==='RETURN') carrying++; ctx.fillStyle=a.state==='RETURN'?'#ffd700':'#fff'; ctx.fillRect(a.x,a.y,3,3);} 
 ctx.fillStyle='green'; ctx.beginPath(); ctx.arc(nest.x,nest.y,22,0,7); ctx.fill();
 ctx.fillStyle='orange'; ctx.fillRect(food.x-18,food.y-18,36,36);
 dbg.textContent=`Population: ${ants.length}\nReturning: ${carrying}\nTrail cells: ${Array.from(pher).filter(v=>v>5).length}`;
 requestAnimationFrame(loop);
}
loop();

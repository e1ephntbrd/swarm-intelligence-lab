const c=document.getElementById("world"),ctx=c.getContext("2d"),dbg=document.getElementById("debug");
function r(){c.width=innerWidth;c.height=innerHeight};r();addEventListener("resize",r);
const nest={x:200,y:200};
const food={x:700,y:400};
const cell=8;
const cols=Math.ceil(innerWidth/cell);
const rows=Math.ceil(innerHeight/cell);
const pher=Array(cols*rows).fill(0);
function idx(x,y){return y*cols+x}
const ants=[...Array(80)].map(()=>({x:nest.x,y:nest.y,state:'SEARCHING',speed:1+Math.random()}));
function move(a,t){const dx=t.x-a.x,dy=t.y-a.y,d=Math.hypot(dx,dy)||1;a.x+=dx/d*a.speed;a.y+=dy/d*a.speed}
function deposit(a){const gx=Math.floor(a.x/cell),gy=Math.floor(a.y/cell);if(gx>=0&&gy>=0&&gx<cols&&gy<rows)pher[idx(gx,gy)]=Math.min(255,pher[idx(gx,gy)]+25)}
function evaporate(){for(let i=0;i<pher.length;i++) pher[i]*=0.992}
function drawPheromones(){for(let y=0;y<rows;y++){for(let x=0;x<cols;x++){const p=pher[idx(x,y)];if(p<2)continue;ctx.fillStyle=`rgba(0,180,255,${Math.min(0.7,p/255)})`;ctx.fillRect(x*cell,y*cell,cell,cell)}}}
function loop(){evaporate();ctx.fillStyle='#111';ctx.fillRect(0,0,c.width,c.height);drawPheromones();let carrying=0;
for(const a of ants){if(a.state==='SEARCHING'){move(a,food);if(Math.hypot(food.x-a.x,food.y-a.y)<15)a.state='RETURNING'}else{carrying++;deposit(a);move(a,nest);if(Math.hypot(nest.x-a.x,nest.y-a.y)<15)a.state='SEARCHING'}ctx.fillStyle=a.state==='RETURNING'?'#ffd700':'#ffffff';ctx.beginPath();ctx.arc(a.x,a.y,2.5,0,7);ctx.fill();}
ctx.fillStyle='green';ctx.beginPath();ctx.arc(nest.x,nest.y,20,0,7);ctx.fill();
ctx.fillStyle='orange';ctx.fillRect(food.x-15,food.y-15,30,30);
dbg.textContent=`Population: ${ants.length}
Carrying: ${carrying}
Pheromone Cells: ${pher.filter(v=>v>1).length}`;
requestAnimationFrame(loop)}loop();
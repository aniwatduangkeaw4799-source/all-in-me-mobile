let DB={stores:[]}, activeCat="ทั้งหมด", favorites=new Set(JSON.parse(localStorage.getItem("allinme-favorites")||"[]"));
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const cats=["ทั้งหมด","สัตว์เลี้ยง","ของใช้ในบ้าน"];
function saveFav(){localStorage.setItem("allinme-favorites",JSON.stringify([...favorites]))}
function catChip(cat,scope){return `<button class="chip ${activeCat===cat?"active":""}" onclick="setCat('${cat}','${scope}')">${cat}</button>`}
function renderCats(){
  $("#homeCats").innerHTML=cats.map(c=>catChip(c,"home")).join("");
  $("#catCats").innerHTML=cats.map(c=>catChip(c,"category")).join("");
  $("#searchCats").innerHTML=cats.map(c=>catChip(c,"search")).join("");
}
function filtered(q=""){q=q.trim().toLowerCase(); return DB.stores.filter(s=>(activeCat==="ทั้งหมด"||s.category===activeCat)&&(!q||(s.name+" "+s.detail+" "+s.category).toLowerCase().includes(q)))}
function card(s){
 return `<article class="store-card" onclick="openDetail('${s.id}')">
  <div class="pic"><img src="${s.image}" alt="${esc(s.name)}" loading="lazy"><button class="heart ${favorites.has(s.id)?"on":""}" onclick="event.stopPropagation();toggleFav('${s.id}')">${favorites.has(s.id)?"♥":"♡"}</button></div>
  <div class="store-body"><h3>${esc(s.name)}</h3><p>${esc(s.detail)}</p><a class="store-link" href="${s.url}" target="_blank" rel="noopener" onclick="event.stopPropagation()">เข้าร้าน ↗</a></div>
 </article>`;
}
function listItem(s){
 return `<div class="list-item"><img src="${s.image}" alt="${esc(s.name)}"><div class="list-main" onclick="openDetail('${s.id}')"><strong>${esc(s.name)}</strong><span>${esc(s.detail)}</span></div><button class="list-action" onclick="toggleFav('${s.id}')">${favorites.has(s.id)?"♥":"♡"}</button></div>`;
}
function esc(x){return String(x||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderAll(){
 renderCats();
 const all=filtered();
 $("#categoryGrid").innerHTML=all.map(card).join("")||`<div class="empty" style="grid-column:1/-1"><div class="empty-icon">⌕</div><h2>ไม่พบร้านค้า</h2><p>ลองเปลี่ยนคำค้นหรือหมวดหมู่</p></div>`;
 $("#catCount").textContent=`${all.length} ร้าน`;
 $("#featured").innerHTML=DB.stores.slice(0,4).map(card).join("");
 const hlogos=DB.stores.slice(0,4).map(s=>`<img src="${s.image}" alt="">`).join(""); $("#heroLogos").innerHTML=hlogos;
 renderSearch();
 renderFav();
}
function setCat(c,scope){activeCat=c;renderAll(); if(scope==="search") $("#searchInput").focus(); if(scope==="category") go("categories");}
function renderSearch(){
 const q=$("#searchInput")?.value||""; const items=filtered(q);
 $("#searchList").innerHTML=items.map(listItem).join("")||`<div class="empty"><div class="empty-icon">⌕</div><h2>ไม่พบร้านที่ค้นหา</h2><p>ลองใช้ชื่อร้านหรือประเภทสินค้าอื่น</p></div>`;
 $("#searchNote").textContent=`พบ ${items.length} ร้าน`;
}
function renderFav(){
 const items=DB.stores.filter(s=>favorites.has(s.id));
 $("#favList").innerHTML=items.map(listItem).join("");
 $("#favEmpty").style.display=items.length?"none":"block";
}
function toggleFav(id){favorites.has(id)?favorites.delete(id):favorites.add(id);saveFav();renderAll()}
function openDetail(id){const s=DB.stores.find(x=>x.id===id); if(!s)return;
 $("#detailContent").innerHTML=`<div class="detail-cover"><img src="${s.image}" alt="${esc(s.name)}"></div>
 <div class="detail-body"><span class="tag">${esc(s.category)}</span><h1>${esc(s.name)}</h1><p>${esc(s.detail)}</p>
 <a class="shop-now" href="${s.url}" target="_blank" rel="noopener">ไปที่ร้านค้า ↗</a>
 <div class="section-head"><h2>เกี่ยวกับร้าน</h2></div><p>ร้านนี้อยู่ในหมวด <b>${esc(s.category)}</b> ของ ALL IN ME กดปุ่มด้านบนเพื่อเปิดหน้าร้านจริง</p></div>`;
 go("detail");
}
function go(id){$$(".screen").forEach(x=>x.classList.toggle("active",x.id===id));$$(".bottom-nav button").forEach(b=>b.classList.toggle("active",b.dataset.target===id));window.scrollTo({top:0,behavior:"smooth"})}
$$(".bottom-nav button").forEach(b=>b.addEventListener("click",()=>go(b.dataset.target)));
$("#menuBtn").onclick=()=>go("menu");
$("#homeSearch").addEventListener("keydown",e=>{if(e.key==="Enter"){go("search");$("#searchInput").value=e.target.value;renderSearch()}});
$("#catSearch").addEventListener("input",e=>{$("#categoryGrid").innerHTML=filtered(e.target.value).map(card).join("")});
$("#searchInput").addEventListener("input",renderSearch);
fetch("data.json").then(r=>r.json()).then(d=>{DB=d;d.stores.forEach(s=>s.image=s.image.replace(/^assets\//,""));renderAll()}).catch(()=>{document.body.innerHTML='<div style="padding:30px;font-family:sans-serif">โหลดข้อมูลร้านค้าไม่สำเร็จ กรุณาเปิดผ่านเว็บเซิร์ฟเวอร์</div>'});

(function () {
"use strict";

const route = (location.hash || location.href).toLowerCase();

const blockedRoutes = [
"dashboard","settings","configuration","administration",
"userpage","wizard","login","server","selectserver"
];

if (blockedRoutes.some(r => route.includes(r))) return;


/* =========================
   STUDIOS MULTI-TAG
========================= */

const STUDIOS = [
{
name: "Apple TV+",
tag: "Apple TV,Apple Originals,Apple Studios LLC,Apple TV+",
gradient: "linear-gradient(135deg,#1a1a2e 0%,#0a0a0a 100%)",
logo: "https://image.tmdb.org/t/p/w780_filter(duotone,ffffff,bababa)/4KAy34EHvRM25Ih8wb82AuGU7zJ.png"
},
{
name: "Prime Video",
tag: "Amazon Prime Video,Amazon MGM Studios,AMC",
gradient: "linear-gradient(135deg,#0d1b2a 0%,#010409 100%)",
logo: "https://image.tmdb.org/t/p/w780_filter(duotone,ffffff,bababa)/ifhbNuuVnlwYy5oXA5VIb2YR8AZ.png"
},
{
name: "Hulu",
tag: "Hulu,Hulu Originals",
gradient: "linear-gradient(135deg,#0f2e1d 0%,#07150d 100%)",
logo: "https://image.tmdb.org/t/p/w780_filter(duotone,ffffff,bababa)/pqUTCleNUiTLAVlelGxUgWn1ELh.png"
},
{
name: "Netflix",
tag: "Netflix",
gradient: "linear-gradient(135deg,#1a0a0a 0%,#0d0000 100%)",
logo: "https://image.tmdb.org/t/p/w780_filter(duotone,ffffff,bababa)/wwemzKWzjKYJFfCeiB57q3r4Bcm.png"
},
{
name: "HBO Max",
tag: "HBO Max,Max,Warner Bros,Warner Bros. Pictures,Warner Bros Television,Warner Bros Animation,DC Studios",
gradient: "linear-gradient(135deg,#1a0a2e 0%,#0d0018 100%)",
logo: "https://image.tmdb.org/t/p/w500_filter(duotone,ffffff,bababa)/nmU0UMDJB3dRRQSTUqawzF2Od1a.png"
},
{
name: "Disney+",
tag: "Disney Plus,Disney+,Walt Disney Pictures,Walt Disney Animation Studios,Marvel Studios,Lucasfilm,20th Century Studios,20th Television",
gradient: "linear-gradient(135deg,#0c1b3a 0%,#050d1a 100%)",
logo: "https://image.tmdb.org/t/p/w780_filter(duotone,ffffff,bababa)/1edZOYAfoyZyZ3rklNSiUpXX30Q.png",
invert: true
},
{
name: "Pixar",
tag: "Pixar",
gradient: "linear-gradient(135deg,#0a1525 0%,#0d2540 50%,#0a0a12 100%)",
logo: "https://image.tmdb.org/t/p/w780_filter(duotone,ffffff,bababa)/1TjvGVDMYsj6JBxOAkUHpPEwLf7.png"
}
];

let currentPlatformOpen = null;


/* =========================
   CSS
========================= */

function injectCSS(){

if(document.getElementById("jfcr-css")) return;

const s = document.createElement("style");
s.id="jfcr-css";

s.textContent=`

#custom-rows-wrapper{
display:flex;
flex-direction:column;
gap:10px;
margin-bottom:20px;
}

.srow-section{
margin:.8em 0 .2em;
padding:0 3.3%;
}

.srow-scroll{
display:flex;
gap:12px;
}

.srow-card{
flex:1 1 0;
min-width:0;
height:110px;
border-radius:12px;
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
border:1.5px solid rgba(255,255,255,.06);
transition:all .35s ease;
overflow:hidden;
position:relative;
}

.srow-card:hover{
transform:translateY(-4px) scale(1.03);
border-color:rgba(255,255,255,.2);
box-shadow:0 12px 35px rgba(0,0,0,.55);
}

.srow-card::after{
content:"";
position:absolute;
inset:0;
background:rgba(0,0,0,0);
transition:.3s ease;
}

.srow-card:hover::after{
background:rgba(0,0,0,.25);
}

.srow-card img{
height:42px;
max-width:65%;
object-fit:contain;
transition:transform .35s ease,filter .35s ease;
z-index:2;
}

.srow-card:hover img{
transform:scale(1.08);
filter:brightness(1.15);
}

.srow-card img.srow-invert{
filter:brightness(0) invert(1);
height:58px;
max-width:75%;
}

.srow-active-card{
border-color:rgba(255,255,255,.35)!important;
}

.srow-items-row{
display:grid !important;
grid-template-columns:repeat(auto-fill,minmax(140px,1fr)) !important;
gap:12px !important;
margin-top:14px !important;
max-height:65vh !important;
overflow-y:auto !important;
width:100% !important;
animation:providerSlide .45s cubic-bezier(.2,.9,.2,1);

/* ===== HIDE SCROLLBAR (NETFLIX STYLE) ===== */
scrollbar-width: none;
-ms-overflow-style: none;
}

.srow-items-row::-webkit-scrollbar{
display:none;
}

@keyframes providerSlide{
from{
opacity:0;
transform:translateY(-20px) scaleY(.94);
}
to{
opacity:1;
transform:translateY(0) scaleY(1);
}
}

.srow-thumb{
position:relative;
width:135px;
margin:0 auto;
cursor:pointer;
}

.srow-thumb img{
width:135px;
height:202px;
object-fit:cover;
border-radius:14px;
box-shadow:0 10px 25px rgba(0,0,0,.4);
}

.type-badge{
position:absolute;
top:8px;
left:8px;
background:rgba(0,0,0,.75);
color:#fff;
font-size:10px;
font-weight:700;
padding:4px 8px;
border-radius:20px;
z-index:3;
}

.srow-thumb-t{
display:none!important;
}

@media(max-width:600px){

.srow-scroll{
display:grid;
grid-template-columns:1fr 1fr;
}

.srow-card{
height:80px;
}

.srow-items-row{
grid-template-columns:repeat(3,1fr)!important;
gap:8px!important;
}

.srow-thumb{
width:100px;
}

.srow-thumb img{
width:100px;
height:150px;
}

}
`;

document.head.appendChild(s);
}

/* === resto del codice invariato === */

function gc(){try{const c=JSON.parse(localStorage.getItem("jellyfin_credentials")||"{}");const sv=(c.Servers||[])[0]||{};return{token:sv.AccessToken,userId:sv.UserId,base:(sv.ManualAddress||sv.LocalAddress||location.origin).replace(/\/+$/,"")};}catch{return {};}}
async function fetchByTag(tag){const {token,userId,base}=gc();if(!token||!userId)return[];const tags=tag.split(",").map(t=>t.trim()).filter(Boolean);let allItems=[];for(const studioTag of tags){const url=`${base}/Users/${userId}/Items?IncludeItemTypes=Movie,Series&Recursive=true&SortBy=PremiereDate&SortOrder=Descending&Studios=${encodeURIComponent(studioTag)}`;const r=await fetch(url,{headers:{Authorization:`MediaBrowser Token="${token}"`}});const j=await r.json();if(j.Items?.length)allItems.push(...j.Items);}return[...new Map(allItems.map(i=>[i.Id,i])).values()];}
function getType(it){if(it?.Type==="Movie")return"FILM";if(it?.Type==="Series")return"SERIE";return"CONTENUTO";}
function buildThumbRow(items){const{base}=gc();const row=document.createElement("div");row.className="srow-items-row";if(!items.length){row.innerHTML=`<div class="srow-empty">No content found</div>`;return row;}for(const it of items){const thumb=document.createElement("div");thumb.className="srow-thumb";const src=it.ImageTags?.Primary?`${base}/Items/${it.Id}/Images/Primary?maxHeight=300&tag=${it.ImageTags.Primary}`:"";thumb.innerHTML=`<div class="type-badge">${getType(it)}</div><img src="${src}"><div class="srow-thumb-t">${it.Name}</div>`;thumb.onclick=()=>{location.hash=`#/details?id=${it.Id}&serverId=${it.ServerId}`;};row.appendChild(thumb);}return row;}
async function toggleSection(entry,cardEl,container){const old=container.querySelector(".srow-items-row");if(old)old.remove();container.querySelectorAll(".srow-active-card").forEach(c=>c.classList.remove("srow-active-card"));if(currentPlatformOpen===entry.tag){cardEl.classList.remove("srow-active-card");currentPlatformOpen=null;return;}cardEl.classList.add("srow-active-card");currentPlatformOpen=entry.tag;const placeholder=document.createElement("div");placeholder.className="srow-items-row";placeholder.innerHTML=`<div class="srow-loading">Loading...</div>`;container.appendChild(placeholder);const items=await fetchByTag(entry.tag);placeholder.remove();container.appendChild(buildThumbRow(items));}
function buildStudioSection(){const section=document.createElement("div");section.className="srow-section";const scroll=document.createElement("div");scroll.className="srow-scroll";for(const studio of STUDIOS){const card=document.createElement("div");card.className="srow-card";card.style.background=studio.gradient;const img=new Image();img.src=studio.logo;if(studio.invert)img.classList.add("srow-invert");card.appendChild(img);card.onclick=()=>toggleSection(studio,card,section);scroll.appendChild(card);}section.appendChild(scroll);return section;}
function injectUI(){if(document.getElementById("custom-rows-wrapper"))return;const anchor=document.querySelector("iframe.spotlightiframe")||document.querySelector(".spotlightiframe")||document.querySelector(".section0")||document.querySelector(".homeSection:first-child");if(!anchor?.parentElement)return;injectCSS();const wrapper=document.createElement("div");wrapper.id="custom-rows-wrapper";wrapper.appendChild(buildStudioSection());anchor.parentElement.insertBefore(wrapper,anchor.nextSibling);}
const observer=new MutationObserver(()=>{const hash=window.location.hash||window.location.pathname;if(hash===""||hash==="/"||hash.includes("home.html")||hash==="#/home"){injectUI();}});
observer.observe(document.body,{childList:true,subtree:true});
setTimeout(injectUI,1000);

})();

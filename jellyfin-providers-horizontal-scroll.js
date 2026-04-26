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
const providerCache = {};

/* =========================
   CSS
========================= */

function injectCSS(){

const old = document.getElementById("jfcr-css");
if(old) old.remove();

const s = document.createElement("style");
s.id="jfcr-css";

s.textContent=`

*{
scrollbar-width:none !important;
-ms-overflow-style:none !important;
}

*::-webkit-scrollbar{
display:none !important;
}

#custom-rows-wrapper,
.srow-section{
overflow:visible !important;
}

/* FILM GRID */
.srow-items-row{
display:grid !important;
grid-template-columns:repeat(auto-fill, minmax(120px, 1fr)) !important;
gap:12px !important;
margin-top:22px !important;
width:100% !important;
overflow-y:auto !important;
max-height:65vh !important;
padding-top:10px !important;
padding-bottom:18px !important;
}

/* WRAPPER */
#custom-rows-wrapper{
display:flex;
flex-direction:column;
gap:10px;
margin-bottom:20px;
position:relative;
z-index:10;
}

.srow-section{
margin:.8em 0 .2em;
padding:0 3.3%;
}

/* DEFAULT DESKTOP */
.srow-scroll{
display:flex;
gap:12px;
}

/* PROVIDER CARD */
.srow-card{
flex:0 0 130px !important;
width:130px !important;
height:110px !important;
box-sizing:border-box;
border-radius:12px;
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
border:1.5px solid rgba(255,255,255,.06);
overflow:hidden;
position:relative;
}

/* hover */
@media(min-width:601px){
.srow-card:hover{
transform:translateY(-3px) scale(1.02);
border-color:rgba(255,255,255,.2);
}
}

.srow-card img{
height:42px;
max-width:65%;
object-fit:contain;
}

.srow-card img.srow-invert{
filter:brightness(0) invert(1);
height:58px;
max-width:75%;
}

.srow-active-card{
border-color:rgba(120,200,255,.35) !important;
box-shadow:0 0 6px rgba(80,160,255,.18) !important;
transform:none !important;
}

/* THUMB */
.srow-thumb{
position:relative;
width:100%;
max-width:135px;
margin:0 auto;
cursor:pointer;
}

.srow-thumb img{
width:100%;
aspect-ratio:2/3;
object-fit:cover;
border-radius:14px;
pointer-events:none;
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

/* MOBILE */
@media(max-width:600px){

.srow-scroll{
display:flex !important;
overflow-x:auto !important;
overflow-y:hidden !important;
gap:10px;
touch-action: pan-x;
overscroll-behavior: contain;
}

.srow-card{
flex:0 0 110px !important;
width:110px !important;
height:100px !important;
}

.srow-items-row{
grid-template-columns:repeat(3,1fr) !important;
}
}

/* TABLET */
@media(min-width:601px) and (max-width:1024px){

.srow-scroll{
display:flex !important;
flex-wrap:nowrap !important;
overflow-x:auto !important;
overflow-y:hidden !important;
gap:10px;
-webkit-overflow-scrolling:touch;
touch-action: pan-x;
overscroll-behavior: contain;
}

.srow-card{
flex:0 0 110px !important;
width:110px !important;
height:100px !important;
transform:none !important;
}
}

`;

document.head.appendChild(s);
}

/* =========================
   RESTO IDENTICO
========================= */

function gc(){
try{
const c=JSON.parse(localStorage.getItem("jellyfin_credentials")||"{}");
const sv=(c.Servers||[])[0]||{};
return {
token:sv.AccessToken,
userId:sv.UserId,
base:(sv.ManualAddress||sv.LocalAddress||location.origin).replace(/\/+$/,"")
};
}catch{return {};}
}

async function fetchByTag(tag){
const {token,userId,base}=gc();
if(!token||!userId) return [];

const tags=tag.split(",").map(t=>t.trim()).filter(Boolean);
let allItems=[];

for(const studioTag of tags){
const url=`${base}/Users/${userId}/Items?IncludeItemTypes=Movie,Series&Recursive=true&SortBy=PremiereDate&SortOrder=Descending&Studios=${encodeURIComponent(studioTag)}`;

const r=await fetch(url,{headers:{Authorization:`MediaBrowser Token="${token}"`}});
const j=await r.json();

if(j?.Items?.length) allItems.push(...j.Items);
}

return [...new Map(allItems.map(i=>[i.Id,i])).values()];
}

function getType(it){
if(it?.Type==="Movie")return"FILM";
if(it?.Type==="Series")return"SERIE";
return"CONTENUTO";
}

function buildThumbRow(items){

const {base}=gc();
const row=document.createElement("div");
row.className="srow-items-row";

for(const it of items){

const thumb=document.createElement("div");
thumb.className="srow-thumb";

const src=it.ImageTags?.Primary
?`${base}/Items/${it.Id}/Images/Primary?maxHeight=300&tag=${it.ImageTags.Primary}`
:"";

thumb.innerHTML=`
<div class="type-badge">${getType(it)}</div>
<img src="${src}">
`;

thumb.onclick=()=>{
location.hash=`#/details?id=${it.Id}&serverId=${it.ServerId}`;
};

row.appendChild(thumb);
}

return row;
}

async function toggleSection(entry,cardEl,container){

const old=container.querySelector(".srow-items-row");
if(old)old.remove();

container.querySelectorAll(".srow-active-card")
.forEach(c=>c.classList.remove("srow-active-card"));

if(currentPlatformOpen===entry.tag){
cardEl.classList.remove("srow-active-card");
currentPlatformOpen=null;
return;
}

cardEl.classList.add("srow-active-card");
currentPlatformOpen=entry.tag;

if(providerCache[entry.tag]){
container.appendChild(providerCache[entry.tag]);
return;
}

const placeholder=document.createElement("div");
placeholder.className="srow-items-row";
placeholder.innerHTML=`<div class="srow-loading">Loading...</div>`;
container.appendChild(placeholder);

const items=await fetchByTag(entry.tag);
const row=buildThumbRow(items);

providerCache[entry.tag]=row;

placeholder.remove();
container.appendChild(row);
}

function buildStudioSection(){

const section=document.createElement("div");
section.className="srow-section";

const scroll=document.createElement("div");
scroll.className="srow-scroll";

/* FIX SWIPE JS (SOLO QUI) */
scroll.addEventListener("touchstart", e=>e.stopPropagation(), {passive:true});
scroll.addEventListener("touchmove", e=>e.stopPropagation(), {passive:true});

for(const studio of STUDIOS){
const card=document.createElement("div");
card.className="srow-card";
card.style.background=studio.gradient;

const img=new Image();
img.src=studio.logo;
if(studio.invert)img.classList.add("srow-invert");

card.appendChild(img);
card.onclick=()=>toggleSection(studio,card,section);
scroll.appendChild(card);
}

section.appendChild(scroll);
return section;
}

function injectUI(){
if(document.getElementById("custom-rows-wrapper"))return;

const anchor=
document.querySelector("iframe.spotlightiframe")||
document.querySelector(".spotlightiframe")||
document.querySelector(".section0")||
document.body;

injectCSS();

const wrapper=document.createElement("div");
wrapper.id="custom-rows-wrapper";
wrapper.appendChild(buildStudioSection());

(anchor?.parentElement || document.body)
.insertBefore(wrapper, anchor?.nextSibling || document.body.firstChild);
}

const observer=new MutationObserver(()=>injectUI());
observer.observe(document.body,{childList:true,subtree:true});
setTimeout(injectUI,1000);

})();

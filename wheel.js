// segments + GIFs
const segments = [
  { label: "₹1", value: 1, type: "win" },
  { label: "Double", value: null, type: "double" },
  { label: "₹5", value: 5, type: "win" },
  { label: "Try Again", value: 0, type: "lose" },
  { label: "₹3", value: 3, type: "win" },
  { label: "Try Again", value: 0, type: "lose" },
  { label: "₹10", value: 10, type: "win" },
  { label: "₹2", value: 2, type: "win" }
];
const gifMap = {
  win: "https://i.gifer.com/7efs.gif",
  double: "https://i.gifer.com/3o7bu8s0oY.gif",
  lose: "https://i.gifer.com/4V0K.gif"
};

// ad rotation links
const ads = [
  "https://dreadfulrulingextension.com/qegspyfiv?key=4ded15ec8272197c211924274a130a47",
  "https://dreadfulrulingextension.com/w1iw3senp?key=6183f7fe0d044a3b26e4faa96f8e4b0a",
  "https://dreadfulrulingextension.com/wv7n729zu?key=dfc9a55b32b16c9c2a12087ddd3ceaa6",
  "https://dreadfulrulingextension.com/ct8rjb02pj?key=1c3aea89b58347b73d58ac51a2e5e36b",
  "https://dreadfulrulingextension.com/q0j8kbehyt?key=61c687daba6d7428d9dce44bff654289",
  "https://dreadfulrulingextension.com/g4dg8f3k9w?key=45457f28d2902a359b61ae4bca6eb4a7",
  "https://dreadfulrulingextension.com/j9gse5sbnd?key=00eabd4cdb7359b2f12f1a9916a6e125",
  "https://dreadfulrulingextension.com/zyfjy0nj?key=7e308c86875a89538f55e40ca9ee239e",
  "https://dreadfulrulingextension.com/f8qj88z8e?key=ad766aff9a858344be5c93529b273bbf",
  "https://dreadfulrulingextension.com/rqsc4qz4?key=aed7af65e0095b19b3154059fe3eeb82",
  "https://dreadfulrulingextension.com/jaz4sv61q?key=bca10204a7df9b0b4902ad867b343a71",
  "https://dreadfulrulingextension.com/kjjs08bk1?key=2c74b6ace44150f9fc4889f928b87a1a",
  "https://dreadfulrulingextension.com/n5a53ivjsw?key=10f20e7816ba0b0c5ca764c2d1c46afe",
  "https://dreadfulrulingextension.com/xfkzs3b85?key=9df7f84ede014babbcc6e14c81a4ce6b",
  "https://dreadfulrulingextension.com/x2tph87xzz?key=040c7571a9041be416b1ea1596a0ce5a",
  "https://dreadfulrulingextension.com/tw7k52hsw0?key=415bb36ff9bd72ca6afb6bb40ec873c9",
  "https://dreadfulrulingextension.com/yade5ds4eg?key=0fe0e13abbd7770b6c0aded48d01e649",
  "https://dreadfulrulingextension.com/acdr1xu89?key=1c282832a44d6f97b59eff8da6f8e72e"
];

// DOM refs
const walletDisplay = document.getElementById("walletDisplay");
const walletSmall = document.getElementById("walletSmall");
const cashoutBar = document.getElementById("cashoutBar");
const cashoutInfo = document.getElementById("cashoutInfo");
const cashoutBadge = document.getElementById("cashoutBadge");
const spinBtn = document.getElementById("spinBtn");
const watchBtn = document.getElementById("watchBtn");
const gifOverlay = document.getElementById("gifOverlay");
const resultGif = document.getElementById("resultGif");
const gifText = document.getElementById("gifText");
const closeGif = document.getElementById("closeGif");
const withdrawSubmit = document.getElementById("withdrawSubmit");
const withdrawMsg = document.getElementById("withdrawMsg");
const supportInput = document.getElementById("supportInput");
const goSupport = document.getElementById("goSupport");
const userIDDisplay = document.getElementById("userIDDisplay");

// wallet helpers
function getWallet(){ return parseFloat(localStorage.getItem("wallet")||"0"); }
function setWallet(v){ localStorage.setItem("wallet", v.toFixed(2)); updateDisplay(); }
function updateDisplay(){
  const bal = getWallet();
  walletDisplay.textContent = "Wallet: ₹" + bal.toFixed(2);
  walletSmall.textContent = "₹" + bal.toFixed(2);
  const needed = Math.max(500 - bal, 0);
  const percent = Math.min((bal/500)*100,100);
  cashoutBar.style.width = percent + "%";
  if (bal >= 500) {
    cashoutInfo.textContent = "Ready to cash out ₹500!";
    cashoutBadge.style.display = "inline-block";
  } else {
    cashoutInfo.textContent = "Only ₹" + needed.toFixed(2) + " to cash out ₹500 !";
    cashoutBadge.style.display = "none";
  }
}

// ad index
function getAdIndex(){ return parseInt(localStorage.getItem("adIndex")||"0",10); }
function advanceAdIndex(){ const cur=getAdIndex(); const next=(cur+1)%ads.length; localStorage.setItem("adIndex", next.toString()); return ads[cur]; }

// random ID
function makeRandomID(){ return Math.floor(1000000000 + Math.random()*9000000000).toString(); }
function ensureUserID(){
  let id= localStorage.getItem("generatedID");
  if(!id){ id=makeRandomID(); localStorage.setItem("generatedID",id); }
  userIDDisplay.textContent = "ID: "+id;
}

// wheel build
function buildWheel(){
  const container = document.getElementById("wheelVisual");
  if(!container) return;
  container.innerHTML="";
  const sliceAngle = 360 / segments.length;
  const wheelEl = document.createElement("div");
  wheelEl.style.position="relative";
  wheelEl.style.width="100%";
  wheelEl.style.height="100%";
  wheelEl.style.borderRadius="50%";
  wheelEl.style.overflow="hidden";
  segments.forEach((seg,i)=>{
    const div=document.createElement("div");
    div.classList.add("segment");
    div.style.transform=`rotate(${i*sliceAngle}deg) skewY(-60deg)`;
    div.style.background=`hsl(${(i/segments.length)*360},70%,45%)`;
    div.innerHTML = `<div style="transform:skewY(60deg);">${seg.label}</div>`;
    wheelEl.appendChild(div);
  });
  container.appendChild(wheelEl);
  window._wheelEl = wheelEl;
}

// spin logic
let spinning=false;
const autoOpenAdAfterSpin=true;

function pickSegment(){ const idx=Math.floor(Math.random()*segments.length); return { segment: segments[idx], index: idx }; }

spinBtn.addEventListener("click", ()=>{
  if(spinning) return;
  spinning=true;
  spinBtn.disabled=true;
  watchBtn.style.display="none";
  const { segment,index } = pickSegment();
  const fullRotations=5;
  const sliceAngle=360/segments.length;
  const targetDeg=360*fullRotations + (index*sliceAngle) + sliceAngle/2;
  const wheelEl=window._wheelEl;
  if(!wheelEl){ spinning=false; spinBtn.disabled=false; return; }
  wheelEl.style.transition="transform 4s cubic-bezier(.33,.8,.35,1)";
  wheelEl.style.transform=`rotate(${-targetDeg}deg)`;
  setTimeout(()=>{
    wheelEl.style.transition="none";
    const normalized= targetDeg %360;
    wheelEl.style.transform=`rotate(${-normalized}deg)`;
    handleResult(segment);
    spinning=false;
    spinBtn.disabled=false;
    if(autoOpenAdAfterSpin) openNextAd();
  },4200);
});

function handleResult(seg){
  let curr=getWallet();
  if(seg.type==="win"){
    curr += seg.value;
  } else if(seg.type==="double"){
    curr = curr * 2;
  }
  setWallet(curr);
  let msg = seg.type==="lose" ? "Try Again!" : (seg.type==="double"? `Double! ₹${curr.toFixed(2)}` : `You won ₹${seg.value}!`);
  showGifOverlay(msg, seg.type==="lose" ? "lose" : (seg.type==="double"? "double" : "win"));
  setTimeout(()=>{ watchBtn.style.display="inline-block"; },500);
}

function showGifOverlay(text,type){
  gifText.textContent=text;
  resultGif.src= gifMap[type] || gifMap.win;
  gifOverlay.style.display="flex";
}
closeGif.addEventListener("click", ()=>{ gifOverlay.style.display="none"; });

function openNextAd(){
  const link= advanceAdIndex();
  if(link) window.open(link,"_blank");
  watchBtn.style.display="none";
}

// withdraw handling (mailto fallback)
document.getElementById("withdrawSubmit").addEventListener("click",(e)=>{
  e.preventDefault();
  const name=document.getElementById("name").value.trim();
  const account=document.getElementById("account").value.trim();
  const ifsc=document.getElementById("ifsc").value.trim();
  const phone=document.getElementById("phone").value.trim();
  const amount=parseFloat(document.getElementById("amount").value);
  const userID= localStorage.getItem("generatedID") || makeRandomID();
  localStorage.setItem("generatedID", userID);
  if(!name||!account||!ifsc||!phone||!amount){
    withdrawMsg.innerHTML='<div class="notice">Sab fields bhar do — sab required hain.</div>';
    return;
  }
  if(amount < 500){
    withdrawMsg.innerHTML='<div class="notice">Minimum withdraw ₹500 hai.</div>';
    return;
  }
  const subject= encodeURIComponent("Withdraw Request from "+name);
  const body= encodeURIComponent(
    `Name: ${name}\nAccount: ${account}\nIFSC: ${ifsc}\nPhone: ${phone}\nAmount: ₹${amount.toFixed(2)}\nUserID: ${userID}\n`
  );
  window.location.href = `mailto:ashishanand5438990@gmail.com?subject=${subject}&body=${body}`;
  withdrawMsg.innerHTML='<div class="success">Request draft ho gayi.</div>';
});

// support button fallback (in case separate)
document.getElementById("goSupport")?.addEventListener("click",(e)=>{
  e.preventDefault();
  const issue = encodeURIComponent(document.getElementById("supportInput")?.value || "Mujhe help chahiye");
  window.location.href = `https://t.me/Freefiremxdealer?text=${issue}`;
});
document.getElementById("supportInput")?.addEventListener("keypress",(e)=>{
  if(e.key==="Enter"){
    const issue = encodeURIComponent(document.getElementById("supportInput").value || "Mujhe help chahiye");
    window.location.href = `https://t.me/Freefiremxdealer?text=${issue}`;
  }
});

// helper scroll
function scrollTo(id){ const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:"smooth"}); }

// init
ensureUserID();
buildWheel();
updateDisplay();

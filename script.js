// QUEEN LOUNGE - JS compartido
const WHATSAPP_NUM="24162516457";
const SCRIPT_URL="https://script.google.com/macros/s/TON_SCRIPT_ID/exec";

// === CAUTION DYNAMIQUE - tiene sentido: % del total, no fija ===
let currentTotal = 0;
let currentCaution = 0;
let currentCautionPct = 50;
function calcCaution(total){
  total = parseInt(total)||0;
  if(total<=0) return {amount:0, pct:50};
  const pct = total >= 60000 ? 40 : 50;
  let amount = Math.round(total * pct / 100 / 500) * 500; // redondeado a 500 FCFA
  return {amount, pct};
}
function getPackTotal(pack){
  if(!pack) return 0;
  const m = pack.match(/(\d[\d\s]*)\s*F\b/);
  if(m) return parseInt(m[1].replace(/\s/g,''))||0;
  return 0;
}
function fmt(n){ return (parseInt(n)||0).toLocaleString('fr-FR'); }
function refreshCautionUI(){
  const c = calcCaution(currentTotal);
  currentCaution = c.amount; currentCautionPct = c.pct;
  const s = document.getElementById('securiteBox');
  const cs = document.getElementById('cautionSimple');
  const txt = currentTotal>0 ? ('Caution : <b>'+fmt(c.amount)+' FCFA</b> ('+c.pct+'% du total '+fmt(currentTotal)+' FCFA) — Restituée après vérification.') : ('Caution : <b>'+c.pct+'%</b> du total — calculée automatiquement.');
  if(s) s.innerHTML = '<b>Sécurité Jacuzzi &amp; Caution</b><br>• Le client fournit l\'eau + accès électricité.<br>• Interdiction charbons près du jacuzzi.<br>• '+txt;
  if(cs) cs.innerHTML = txt;
}

let currentHasJacuzzi=false, currentPack="";
// CLOSE_DROPDOWN_OUTSIDE - solo cierra si tocas FUERA, nunca hace toggle
document.addEventListener('click', function(e){ if(!e.target.closest('.dropdown')){ document.querySelectorAll('.dropdown.open').forEach(d=>d.classList.remove('open')); } });
function toggleMenu(){document.getElementById("navLinks").classList.toggle("open")}
function openModal(pack,hasJac){ currentPack=pack; currentHasJacuzzi=!!hasJac; currentTotal=getPackTotal(pack); const el=document.getElementById('selService'); if(el) el.value=pack; document.getElementById('modal').classList.add('active'); updateSecurite(hasJac); refreshCautionUI(); }
function updateSecurite(hasJac){const s=document.getElementById("securiteBox"),c=document.getElementById("cautionSimple");if(s)s.style.display=hasJac?"block":"none";if(c)c.style.display=hasJac?"none":"block"}
function closeModal(){document.getElementById("modal").classList.remove("active")}
function toggleBuilder(){const b=document.getElementById("builder");if(!b)return;b.style.display=b.style.display==="none"?"block":"none"}
function calcBuilder(pageHasJac){let t=0,names=[],has=false;document.querySelectorAll("#builder input[type=checkbox]:checked").forEach(c=>{t+=parseInt(c.dataset.price);names.push(c.dataset.name);if(c.dataset.jacuzzi)has=true});const tp=document.getElementById("totalPrice");if(tp)tp.textContent=t.toLocaleString("fr-FR");const withJac=has||pageHasJac;const cc=calcCaution(t);currentTotal=t;currentCaution=cc.amount;currentCautionPct=cc.pct;const cp=document.getElementById("cautionPrice");if(cp)cp.textContent=fmt(cc.amount)+" ("+cc.pct+"%)";currentPack=names.length?"Sur mesure: "+names.join(" + ")+" = "+t+"F":"";return withJac}
function openModalFromBuilder(pageHasJac){const w=calcBuilder(pageHasJac);if(!currentPack){alert("Cochez au moins un élément.");return}openModal(currentPack,w)}
let currentPay="Payer tout maintenant";
function selectPay(el){document.querySelectorAll(".pay-opt").forEach(o=>o.classList.remove("active"));el.classList.add("active");currentPay=el.dataset.pay||el.querySelector("b")?.textContent||"Payer tout maintenant"}
async function sendWhatsApp(){const name=document.getElementById("selName").value.trim(),phone=document.getElementById("selPhone").value.trim(),adresse=document.getElementById("selAdresse").value.trim(),date=document.getElementById("selDate").value,heure=document.getElementById("selHeure").value,status=document.getElementById("reservationStatus");if(!name||name.split(" ").length<2){status.textContent="Entrez votre Nom & Prénom (2 mots minimum).";return}if(!phone||phone.length<8){status.textContent="Entrez votre Téléphone.";return}if(!adresse||adresse.length<5){status.textContent="Entrez votre adresse exacte / quartier.";return}if(!date){status.textContent="Choisissez une date.";return}const btn=document.getElementById("reserveBtn");btn.disabled=true;btn.textContent="OUVERTURE WHATSAPP...";const form=new URLSearchParams();form.append("Date",date);form.append("Service",currentPack);form.append("Nom",name);form.append("Telephone",phone);form.append("Adresse",adresse);form.append("Heure",heure);form.append("Token","queen-"+Date.now());try{fetch(SCRIPT_URL,{method:"POST",body:form,mode:"no-cors",keepalive:true}).catch(()=>{})}catch(e){}const caution=fmt(currentCaution||calcCaution(currentTotal).amount)+' FCFA ('+(currentCautionPct||50)+'% du total)';const msg=[`Bonjour Queen Lounge`,`Pack: ${currentPack}`,`Paiement: ${currentPay} (acompte obligatoire)`,`Date: ${date}`,`Heure livraison: ${heure}`,`Nom: ${name}`,`Téléphone: ${phone}`,`Adresse: ${adresse}`,`Caution: ${caution}`,"Je confirme ma réservation."].join("\n");window.location.href=`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`;closeModal();btn.disabled=false;btn.textContent="Réserver sur WhatsApp";}
const modal=document.getElementById("modal");if(modal)modal.addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});
const d=document.getElementById("selDate");if(d){d.min=new Date().toISOString().split("T")[0];d.value=d.min;}

// --- CRÉE TON COMBO (nuevo) ---
const COMBO_PRICES={tableHaute:7000,chaise:4000,tableCube:9000,sofa:12000,fauteuil:6000,chicha:7000,jacuzzi:60000};
const COMBO_NAMES={tableHaute:"Table haute LED",chaise:"Chaise longue LED",tableCube:"Table cube LED",sofa:"Sofa LED",fauteuil:"Fauteuil / Sillón LED",chicha:"Chicha complète",jacuzzi:"Jacuzzi VIP"};
let comboQty={tableHaute:0,chaise:0,tableCube:0,sofa:0,fauteuil:0,chicha:0,jacuzzi:0};
const COMBO_MAX={tableHaute:2,chaise:4,tableCube:2,sofa:2,fauteuil:4,chicha:5,jacuzzi:1};
function toggleComboBuilder(){const b=document.getElementById("comboBuilder");if(!b)return;b.style.display=b.style.display==="none"?"block":"none";if(b.style.display==="block")b.scrollIntoView({behavior:"smooth",block:"start"})}
function changeQty(key,delta){const max=COMBO_MAX[key];let v=(comboQty[key]||0)+delta;if(v<0)v=0;if(v>max)v=max;comboQty[key]=v;const el=document.getElementById("qty-"+key);if(el)el.textContent=v;updateCombo()}
function updateCombo(){let total=0,lines=[];for(const k in comboQty){const q=comboQty[k];if(q>0){const sub=q*COMBO_PRICES[k];total+=sub;lines.push(`${q} x ${COMBO_NAMES[k]} = ${sub.toLocaleString("fr-FR")} FCFA`)}}const hasJac=comboQty.jacuzzi>0;const cc2=calcCaution(total);currentTotal=total;currentCaution=cc2.amount;currentCautionPct=cc2.pct;const caution=fmt(cc2.amount)+" ("+cc2.pct+"%)";const totalEl=document.getElementById("comboTotal");if(totalEl)totalEl.textContent=total.toLocaleString("fr-FR");const listEl=document.getElementById("comboList");if(listEl)listEl.innerHTML=lines.length?lines.map(l=>`<li>${l}</li>`).join(""):"<li style='color:#999'>Aucun élément sélectionné pour le moment.</li>";const cautEl=document.getElementById("comboCaution");if(cautEl)cautEl.textContent=caution;currentPack=lines.length?("Combo sur mesure: "+Object.keys(comboQty).filter(k=>comboQty[k]>0).map(k=>`${comboQty[k]} x ${COMBO_NAMES[k]}`).join(" + ")+` = ${total}F`):"";currentHasJacuzzi=hasJac;return hasJac}
function openComboModal(){updateCombo();if(!currentPack){alert("Choisissez au moins un élément pour créer votre combo.");return}openModal(currentPack,currentHasJacuzzi)}

// FIX Submenu Services: cerrado por defecto en móvil, abre solo con click
function toggleDropdown(el,ev){ if(ev) ev.stopPropagation(); const dd=el.closest('.dropdown'); if(dd) dd.classList.toggle('open'); }
document.addEventListener('click', function(e){
  const dd = e.target.closest('.dropdown');
  if(!dd){ document.querySelectorAll('.dropdown.open').forEach(d=>d.classList.remove('open')); return; }
  if(window.innerWidth <= 860 && e.target.closest('.dropdown > a')){ e.preventDefault(); dd.classList.toggle('open'); }
});

// QUEEN LOUNGE - JS compartido
const WHATSAPP_NUM="24162516457";
const SCRIPT_URL="https://script.google.com/macros/s/TON_SCRIPT_ID/exec";
let currentHasJacuzzi=false, currentPack="";
function toggleMenu(){document.getElementById("navLinks").classList.toggle("open")}
function openModal(pack,hasJac){currentPack=pack;currentHasJacuzzi=!!hasJac;const el=document.getElementById("selService");if(el)el.value=pack;document.getElementById("modal").classList.add("active");updateSecurite(hasJac)}
function updateSecurite(hasJac){const s=document.getElementById("securiteBox"),c=document.getElementById("cautionSimple");if(s)s.style.display=hasJac?"block":"none";if(c)c.style.display=hasJac?"none":"block"}
function closeModal(){document.getElementById("modal").classList.remove("active")}
function toggleBuilder(){const b=document.getElementById("builder");if(!b)return;b.style.display=b.style.display==="none"?"block":"none"}
function calcBuilder(pageHasJac){let t=0,names=[],has=false;document.querySelectorAll("#builder input[type=checkbox]:checked").forEach(c=>{t+=parseInt(c.dataset.price);names.push(c.dataset.name);if(c.dataset.jacuzzi)has=true});const tp=document.getElementById("totalPrice");if(tp)tp.textContent=t.toLocaleString("fr-FR");const withJac=has||pageHasJac;const cp=document.getElementById("cautionPrice");if(cp)cp.textContent=withJac?"50 000":"20 000";currentPack=names.length?"Sur mesure: "+names.join(" + ")+" = "+t+"F":"";return withJac}
function openModalFromBuilder(pageHasJac){const w=calcBuilder(pageHasJac);if(!currentPack){alert("Cochez au moins un élément.");return}openModal(currentPack,w)}
let currentPay="Payer tout maintenant";
function selectPay(el){document.querySelectorAll(".pay-opt").forEach(o=>o.classList.remove("active"));el.classList.add("active");currentPay=el.dataset.pay||el.querySelector("b")?.textContent||"Payer tout maintenant"}
async function sendWhatsApp(){const name=document.getElementById("selName").value.trim(),phone=document.getElementById("selPhone").value.trim(),adresse=document.getElementById("selAdresse").value.trim(),date=document.getElementById("selDate").value,heure=document.getElementById("selHeure").value,status=document.getElementById("reservationStatus");if(!name||name.split(" ").length<2){status.textContent="Entrez votre Nom & Prénom (2 mots minimum).";return}if(!phone||phone.length<8){status.textContent="Entrez votre Téléphone.";return}if(!adresse||adresse.length<5){status.textContent="Entrez votre adresse exacte / quartier.";return}if(!date){status.textContent="Choisissez une date.";return}const btn=document.getElementById("reserveBtn");btn.disabled=true;btn.textContent="ENREGISTREMENT...";const form=new URLSearchParams();form.append("Date",date);form.append("Service",currentPack);form.append("Nom",name);form.append("Telephone",phone);form.append("Adresse",adresse);form.append("Heure",heure);form.append("Token","queen-"+Date.now());try{await fetch(SCRIPT_URL,{method:"POST",body:form,mode:"no-cors"})}catch(e){}const caution=currentHasJacuzzi?"50 000 FCFA":"20 000 FCFA";const msg=[`Bonjour Queen Lounge`,`Pack: ${currentPack}`,`Paiement: ${currentPay} (acompte obligatoire)`,`Date: ${date}`,`Heure livraison: ${heure}`,`Nom: ${name}`,`Téléphone: ${phone}`,`Adresse: ${adresse}`,`Caution: ${caution}`,"Je confirme ma réservation."].join("\n");window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`,"_blank");closeModal();btn.disabled=false;btn.textContent="Réserver sur WhatsApp";}
const modal=document.getElementById("modal");if(modal)modal.addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});
const d=document.getElementById("selDate");if(d){d.min=new Date().toISOString().split("T")[0];d.value=d.min;}

// --- CRÉE TON COMBO (nuevo) ---
const COMBO_PRICES={tableHaute:7000,chaise:4000,tableCube:9000,sofa:12000,fauteuil:6000,chicha:7000,jacuzzi:60000};
const COMBO_NAMES={tableHaute:"Table haute LED",chaise:"Chaise longue LED",tableCube:"Table cube LED",sofa:"Sofa LED",fauteuil:"Fauteuil / Sillón LED",chicha:"Chicha complète",jacuzzi:"Jacuzzi VIP"};
let comboQty={tableHaute:0,chaise:0,tableCube:0,sofa:0,fauteuil:0,chicha:0,jacuzzi:0};
const COMBO_MAX={tableHaute:2,chaise:4,tableCube:2,sofa:2,fauteuil:4,chicha:5,jacuzzi:1};
function toggleComboBuilder(){const b=document.getElementById("comboBuilder");if(!b)return;b.style.display=b.style.display==="none"?"block":"none";if(b.style.display==="block")b.scrollIntoView({behavior:"smooth",block:"start"})}
function changeQty(key,delta){const max=COMBO_MAX[key];let v=(comboQty[key]||0)+delta;if(v<0)v=0;if(v>max)v=max;comboQty[key]=v;const el=document.getElementById("qty-"+key);if(el)el.textContent=v;updateCombo()}
function updateCombo(){let total=0,lines=[];for(const k in comboQty){const q=comboQty[k];if(q>0){const sub=q*COMBO_PRICES[k];total+=sub;lines.push(`${q} x ${COMBO_NAMES[k]} = ${sub.toLocaleString("fr-FR")} FCFA`)}}const hasJac=comboQty.jacuzzi>0;const caution=hasJac?"50 000":"20 000";const totalEl=document.getElementById("comboTotal");if(totalEl)totalEl.textContent=total.toLocaleString("fr-FR");const listEl=document.getElementById("comboList");if(listEl)listEl.innerHTML=lines.length?lines.map(l=>`<li>${l}</li>`).join(""):"<li style='color:#999'>Aucun élément sélectionné pour le moment.</li>";const cautEl=document.getElementById("comboCaution");if(cautEl)cautEl.textContent=caution;currentPack=lines.length?("Combo sur mesure: "+Object.keys(comboQty).filter(k=>comboQty[k]>0).map(k=>`${comboQty[k]} x ${COMBO_NAMES[k]}`).join(" + ")+` = ${total}F`):"";currentHasJacuzzi=hasJac;return hasJac}
function openComboModal(){updateCombo();if(!currentPack){alert("Choisissez au moins un élément pour créer votre combo.");return}openModal(currentPack,currentHasJacuzzi)}

// FIX Submenu Services: cerrado por defecto en móvil, abre solo con click
function toggleDropdown(el){ el.closest('.dropdown').classList.toggle('open'); }
document.addEventListener('click', function(e){
  const dd = e.target.closest('.dropdown');
  if(!dd){ document.querySelectorAll('.dropdown.open').forEach(d=>d.classList.remove('open')); return; }
  if(window.innerWidth <= 860 && e.target.closest('.dropdown > a')){ e.preventDefault(); dd.classList.toggle('open'); }
});

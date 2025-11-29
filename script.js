// Simple client-side demo AI for AgroService
const providers = [
  { id:1, name:'NurTraktor Servis', skills:['traktor','kombayn'], location:'Sirdaryo', rating:4.7, pricePerHectare:30, available:true },
  { id:2, name:'PaxtaPro', skills:['yer haydash','paxta ishlari'], location:'Farg‘ona', rating:4.3, pricePerHectare:25, available:true },
  { id:3, name:'Sug‘orish Master', skills:['sug‘orish tizimi'], location:'Andijon', rating:4.9, pricePerHectare:40, available:false },
  { id:4, name:'AgroTech', skills:['traktor','sug‘orish tizimi'], location:'Toshkent', rating:4.1, pricePerHectare:28, available:true },
  { id:5, name:'OltinMaydon', skills:['kombayn','paxta ishlari'], location:'Namangan', rating:3.9, pricePerHectare:22, available:true }
];

function scoreProvider(p, service, location){
  let score = 0;
  if (p.skills.some(s=>s.toLowerCase().includes(service.toLowerCase()) || service.toLowerCase().includes(s.toLowerCase()))) score += 50;
  if (p.location.toLowerCase() === (location||'').toLowerCase()) score += 20;
  score += Math.round((p.rating/5)*20);
  if (!p.available) score -= 30;
  const pricePenalty = Math.max(0, Math.min(10, Math.round((p.pricePerHectare - 20)/2)));
  score -= pricePenalty;
  return score;
}

function runMatch(service, location, hectares){
  const scored = providers.map(p => ({...p, score: scoreProvider(p, service, location)}));
  const sorted = scored.sort((a,b)=>b.score-a.score).slice(0,5);
  const avgPrice = Math.round(sorted.reduce((s,p)=>s+p.pricePerHectare,0)/sorted.length || 0);
  const fair = { min: Math.round(avgPrice*0.8), avg: avgPrice, max: Math.round(avgPrice*1.2) };
  return {matches: sorted, fair};
}

document.getElementById('btn-run').addEventListener('click', function(e){
  e.preventDefault();
  const service = document.getElementById('fld-service').value;
  const location = document.getElementById('fld-location').value;
  const hectares = parseInt(document.getElementById('fld-hectares').value || '1');
  const out = runMatch(service, location, hectares);
  const container = document.getElementById('demo-results');
  container.innerHTML = '';
  const fairDiv = document.createElement('div');
  fairDiv.innerHTML = '<strong>Adolatli narx (taxminiy):</strong> ' + out.fair.min + ' — ' + out.fair.avg + ' — ' + out.fair.max + ' (bir gektar uchun)';
  container.appendChild(fairDiv);
  const list = document.createElement('div');
  list.style.marginTop = '8px';
  out.matches.forEach(m=>{
    const d = document.createElement('div');
    d.style.padding = '8px';
    d.style.borderTop = '1px solid rgba(255,255,255,0.03)';
    d.innerHTML = '<strong>'+m.name+'</strong> — ' + m.skills.join(', ') + ' — ' + m.location + ' — Reyting: ' + m.rating + ' — Narx: ' + m.pricePerHectare + ' — ' + (m.available?'<span style="color:#9be7a6">Available</span>':'<span style="color:#f87171">Unavailable</span>');
    list.appendChild(d);
  });
  container.appendChild(list);
});

(() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const examples = [['Moradabad, India','Moradabad'],['Taj Mahal, Agra, India','Taj Mahal'],['New Delhi, India','New Delhi'],['Eiffel Tower, Paris','Eiffel Tower']];
  window.NEXUS_RENDER_MAPS = function renderMaps(items, query, info = {}) {
    const q = String(query || '').trim();
    if (!q) return '<section class="nexus-map-empty"><div class="nexus-map-empty-icon">⌖</div><h2>Explore with NEXUS Maps</h2><p>Search cities, places, landmarks and addresses. Free map and location data from OpenStreetMap.</p><div class="nexus-map-examples">' + examples.map(([value,label])=>'<button type="button" data-map-query="'+esc(value)+'">'+esc(label)+'</button>').join('') + '</div></section>';
    const rows = Array.isArray(items) ? items : [];
    if (!rows.length) return '<section class="nexus-map-empty"><div class="nexus-map-empty-icon">⌕</div><h2>'+(info.error?'Map search is temporarily unavailable':'No places found')+'</h2><p>'+esc(info.error || ('No matching places for “'+q+'”. Try a city, landmark or fuller address.'))+'</p><a href="https://www.openstreetmap.org/search?query='+encodeURIComponent(q)+'" target="_blank" rel="noopener noreferrer">Search directly on OpenStreetMap ↗</a></section>';
    const cards = rows.map((p,i)=>'<article class="nexus-map-place" data-map-card="'+i+'"><button type="button" class="nexus-map-card-button" data-map-index="'+i+'"><strong><span class="nexus-map-number">'+(i+1)+'</span>'+esc(p.name || p.displayName || 'Place')+'</strong><span class="place-address">'+esc(p.address || p.displayName || '')+'</span><span class="place-category">'+esc(p.category || 'Location')+'</span></button><a class="nexus-map-open" href="'+esc(p.url || '#')+'" target="_blank" rel="noopener noreferrer">Open in OpenStreetMap ↗</a></article>').join('');
    return '<section class="nexus-map-layout"><div class="nexus-map-list"><header class="nexus-map-head"><h2>Places</h2><p>Results for <b>'+esc(q)+'</b> · '+rows.length+' places</p></header>'+cards+'<div class="nexus-map-credit">Location search via Photon · © OpenStreetMap contributors</div></div><div class="nexus-map-panel"><div id="nexusMapCanvas" aria-label="Interactive map" role="application"></div><div class="nexus-map-credit">Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a></div></div></section>';
  };
  function leaflet() {
    if (window.L) return Promise.resolve();
    if (window.NEXUS_LEAFLET_PROMISE) return window.NEXUS_LEAFLET_PROMISE;
    window.NEXUS_LEAFLET_PROMISE = new Promise((resolve,reject)=>{
      if (!document.querySelector('link[data-nexus-leaflet]')) { const l=document.createElement('link'); l.rel='stylesheet'; l.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; l.dataset.nexusLeaflet='1'; document.head.appendChild(l); }
      const s=document.createElement('script'); s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.onload=resolve; s.onerror=()=>reject(new Error('Map library did not load. Check internet connection.')); document.head.appendChild(s);
    }); return window.NEXUS_LEAFLET_PROMISE;
  }
  window.NEXUS_MOUNT_MAP = async function mountMap(items) {
    const canvas=document.getElementById('nexusMapCanvas'); if (!canvas) return;
    try {
      await leaflet(); if (!document.getElementById('nexusMapCanvas')) return;
      if(window.NEXUS_MAP_INSTANCE){try{window.NEXUS_MAP_INSTANCE.remove()}catch{}window.NEXUS_MAP_INSTANCE=null;}
      const places=(items||[]).filter(p=>Number.isFinite(Number(p.lat))&&Number.isFinite(Number(p.lon))); if(!places.length)return;
      const map=L.map('nexusMapCanvas',{scrollWheelZoom:false}).setView([+places[0].lat,+places[0].lon],places.length>1?11:14); window.NEXUS_MAP_INSTANCE=map;
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',keepBuffer:2}).addTo(map);
      const icon=L.divIcon({className:'nexus-map-marker',html:'<span></span>',iconSize:[24,29],iconAnchor:[12,27]}); const markers=[],bounds=[];
      places.forEach((p,i)=>{const lat=+p.lat,lon=+p.lon,m=L.marker([lat,lon],{icon,title:p.name||'Place'}).addTo(map);m.bindPopup('<div class="nexus-map-popup"><b>'+esc(p.name||'Place')+'</b><small>'+esc(p.address||p.displayName||'')+'</small><a href="'+esc(p.url||'#')+'" target="_blank" rel="noopener noreferrer">Open map ↗</a></div>');markers[i]=m;bounds.push([lat,lon]);});
      if(bounds.length>1)map.fitBounds(bounds,{padding:[30,30],maxZoom:14}); else map.setView(bounds[0],14);
      document.querySelectorAll('[data-map-index]').forEach(btn=>btn.addEventListener('click',()=>{const i=Number(btn.dataset.mapIndex),m=markers[i];if(!m)return;document.querySelectorAll('[data-map-card]').forEach(c=>c.classList.toggle('selected',Number(c.dataset.mapCard)===i));map.setView(m.getLatLng(),15,{animate:true});m.openPopup();}));
      setTimeout(()=>map.invalidateSize(),180);
    } catch(e) { const panel=document.querySelector('.nexus-map-panel'); if(panel)panel.innerHTML='<div class="nexus-map-error">'+esc(e.message||'Unable to display map')+'</div>'; }
  };
})();

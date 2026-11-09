/* Loads data.json and rebuilds the video cards and photo stack.
   If data.json cannot be loaded, the original cards in index.html stay as they are. */
(function () {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const driveFix = u => { const m = u.match(/\/d\/([\w-]+)/) || u.match(/[?&]id=([\w-]+)/); return m && u.includes('drive.google.com') ? 'https://lh3.googleusercontent.com/d/' + m[1] : u; };
  const frameUrl = (url, s) => url.replace(/\/upload\/(?:[^\/]*\/)??(v\d+\/)/, '/upload/so_' + (parseFloat(s) > 0 ? parseFloat(s) : 0) + ',f_auto,q_auto/$1').replace(/\.(mp4|mov|webm|m4v)(\?.*)?$/i, '.jpg');
  const thumbOf = v => v.thumb ? driveFix(v.thumb) : frameUrl(v.url, v.sec || 0);

  function card(v) {
    const vert = v.aspect === '9/16';
    const badge = vert
      ? 'text-pink-300 border-pink-500/30"><i class="fa-solid fa-bolt text-pink-400"></i> Vertical Reel 9:16'
      : 'text-cyan-300 border-cyan-500/30"><i class="fa-solid fa-film text-cyan-400"></i> Video / 16:9';
    return `
    <div class="video-project-card group glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
         data-video-type="video" data-aspect="${vert ? '9/16' : '16/9'}" data-video-url="${esc(v.url)}" data-video-title="${esc(v.title)}">
      <div class="relative aspect-video overflow-hidden bg-brand-dark">
        <img src="${esc(thumbOf(v))}" alt="${esc(v.title)}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div class="absolute inset-0 bg-brand-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span class="w-12 h-12 rounded-full ${vert ? 'bg-pink-600' : 'bg-brand-violet'} text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform"><i class="fa-solid fa-play text-sm ml-0.5"></i></span>
        </div>
        <span class="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-[10px] font-mono px-2.5 py-1 rounded border ${badge}</span>
        ${v.duration ? `<span class="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-[11px] font-mono px-2 py-0.5 rounded text-gray-300">${esc(v.duration)}</span>` : ''}
      </div>
      <div class="p-5">
        <span class="text-xs font-mono ${vert ? 'text-pink-400' : 'text-brand-violet'} uppercase">${esc(v.label)}</span>
        <h3 class="font-headline text-2xl text-white ${vert ? 'group-hover:text-pink-400' : 'group-hover:text-brand-cyan'} transition-colors mt-0.5">${esc(v.title)}</h3>
        <p class="text-xs text-gray-400 mt-2 line-clamp-2">${esc(v.desc)}</p>
        <div class="flex items-center justify-between mt-4 pt-3 border-t border-brand-border/60 text-xs font-mono">
          <span class="text-gray-400">${esc(v.tools ? v.tools + ' • ' : '')}${vert ? '9:16' : '16:9'}</span>
          <span class="${vert ? 'text-pink-400' : 'text-brand-cyan'} group-hover:underline flex items-center gap-1">${vert ? 'Watch Reel' : 'Watch Video'} <i class="fa-solid fa-play text-[10px]"></i></span>
        </div>
      </div>
    </div>`;
  }

  fetch('data.json?t=' + Date.now())
    .then(r => r.json())
    .then(d => {
      const grid = document.getElementById('video-grid');
      if (grid && d.videos) {
        grid.innerHTML = d.videos.map(card).join('');
        initVideoCards();
      }
      if (d.photos) {
        photoStackData.length = 0;
        d.photos.forEach((p, i) => photoStackData.push({ id: i + 1, title: p.title, src: p.url, rot2D: (i % 2 ? 1 : -1) * (4 + (i % 3)) }));
        currentOrder = [...photoStackData.keys()];
        renderStack();
      }
    })
    .catch(e => console.warn('data.json not loaded, showing built-in content.', e));
})();

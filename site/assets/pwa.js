(()=>{
  const responsiveHref='/assets/styles-responsive-final.css?v=20260817-1';
  if(!document.querySelector(`link[href^="/assets/styles-responsive-final.css"]`)){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=responsiveHref;
    document.head.appendChild(link);
  }

  const productAssets={
    '/assets/media/iphone-17-pro-max-user-v1.webp':'/assets/media/iphone-17-pro-max-user-v3.b64',
    '/assets/media/apple-ecosystem-user-v1.webp':'/assets/media/apple-ecosystem-user-v3.b64'
  };

  const hydrateProductAssets=async()=>{
    const images=[...document.querySelectorAll('img')];
    await Promise.all(images.map(async img=>{
      let pathname='';
      try{pathname=new URL(img.getAttribute('src')||'',location.href).pathname;}catch{return;}
      const dataPath=productAssets[pathname];
      if(!dataPath) return;
      try{
        const response=await fetch(dataPath,{cache:'no-store'});
        if(!response.ok) throw new Error(`asset data ${response.status}`);
        const encoded=(await response.text()).replace(/\s+/g,'');
        if(!encoded.startsWith('UklGR')) throw new Error('invalid WebP payload');
        img.src=`data:image/webp;base64,${encoded}`;
        img.removeAttribute('loading');
      }catch(error){
        console.error('Sunset product asset failed to load',pathname,error);
      }
    }));
  };

  const initProductRail=()=>{
    const rail=document.querySelector('.product-choice-grid');
    const cards=rail?[...rail.querySelectorAll('.product-choice-card')]:[];
    const dots=[...document.querySelectorAll('.product-swipe-dots span')];
    if(!rail||cards.length<2||!dots.length) return;
    let ticking=false;
    const update=()=>{
      ticking=false;
      const center=rail.scrollLeft+(rail.clientWidth/2);
      let best=0,bestDistance=Infinity;
      cards.forEach((card,index)=>{
        const cardCenter=card.offsetLeft+(card.offsetWidth/2);
        const distance=Math.abs(cardCenter-center);
        if(distance<bestDistance){bestDistance=distance;best=index;}
      });
      dots.forEach((dot,index)=>dot.classList.toggle('active',index===best));
    };
    rail.addEventListener('scroll',()=>{
      if(ticking) return;
      ticking=true;
      requestAnimationFrame(update);
    },{passive:true});
    addEventListener('resize',update,{passive:true});
    update();
  };

  const start=()=>{
    hydrateProductAssets();
    initProductRail();
    createInstallButton();
  };

  if('serviceWorker' in navigator){
    addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
  }

  let deferredPrompt=null;
  function createInstallButton(){
    if(document.querySelector('[data-install-pwa]')) return;
    const panel=document.querySelector('.mobile-panel');
    if(!panel) return;
    const button=document.createElement('button');
    button.type='button';
    button.className='btn btn-secondary pwa-install';
    button.dataset.installPwa='';
    button.textContent='Instalar Sunset';
    button.hidden=true;
    const wa=panel.querySelector('[data-wa].btn');
    if(wa) panel.insertBefore(button,wa); else panel.appendChild(button);
    button.addEventListener('click',async()=>{
      if(!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt=null;
      button.hidden=true;
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();

  addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    deferredPrompt=event;
    createInstallButton();
    const button=document.querySelector('[data-install-pwa]');
    if(button) button.hidden=false;
  });
  addEventListener('appinstalled',()=>{
    deferredPrompt=null;
    const button=document.querySelector('[data-install-pwa]');
    if(button) button.hidden=true;
  });
})();

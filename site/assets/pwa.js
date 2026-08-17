(()=>{
  if('serviceWorker' in navigator){
    addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
  }

  let deferredPrompt=null;
  const createInstallButton=()=>{
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
  };

  document.addEventListener('DOMContentLoaded',createInstallButton);
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

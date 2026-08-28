(function(){
  'use strict';
  const w=window;
  const d=document;
  const $=id=>d.getElementById(id);
  const safe=(fn)=>async function(){try{return await fn.apply(this,arguments)}catch(e){if(typeof w.toast==='function')w.toast(e&&e.message?e.message:String(e),true);}};

  function addClearToken(){
    const token=$('token');
    const connect=token&&token.closest('.login-card')&&token.closest('.login-card').querySelector('button[onclick="connect()"]');
    if(!token||!connect||$('clearTokenBtn'))return;
    const b=d.createElement('button');
    b.id='clearTokenBtn';
    b.type='button';
    b.className='btn light full';
    b.style.marginTop='8px';
    b.textContent='Clear Token';
    b.addEventListener('click',function(){
      try{
        w.token='';
        if(typeof w.sessionStorage!=='undefined')sessionStorage.removeItem('kpa_token');
        token.value='';
        if($('loginStatus'))$('loginStatus').textContent='Token cleared. Enter a new token to connect.';
        if(typeof w.toast==='function')w.toast('Token cleared');
      }catch(e){if(typeof w.toast==='function')w.toast(e.message,true);}
    });
    connect.insertAdjacentElement('afterend',b);
  }

  function installReplaceButtons(){
    w.replaceOne=function(){
      const find=$('findText')?.value||'';
      const repl=$('replaceText')?.value||'';
      if(!find)return w.toast('Enter text to find.',true);
      const pos=w.indexText.indexOf(find);
      if(pos<0)return w.toast('Text not found.',true);
      w.indexText=w.indexText.slice(0,pos)+repl+w.indexText.slice(pos+find.length);
      if($('fullEditor'))$('fullEditor').value=w.indexText;
      if(typeof w.parseSections==='function')w.parseSections();
      if(typeof w.fillHome==='function')w.fillHome();
      if(typeof w.renderSections==='function')w.renderSections();
      w.toast('First match replaced locally. Click Publish Changes to make it live.');
    };
    w.replaceAll=function(){
      const find=$('findText')?.value||'';
      const repl=$('replaceText')?.value||'';
      if(!find)return w.toast('Enter text to find.',true);
      if(!w.indexText.includes(find))return w.toast('Text not found.',true);
      const count=w.indexText.split(find).length-1;
      w.indexText=w.indexText.split(find).join(repl);
      if($('fullEditor'))$('fullEditor').value=w.indexText;
      if(typeof w.parseSections==='function')w.parseSections();
      if(typeof w.fillHome==='function')w.fillHome();
      if(typeof w.renderSocial==='function')w.renderSocial();
      if(typeof w.renderSections==='function')w.renderSections();
      w.toast(count+' match'+(count===1?'':'es')+' replaced locally. Click Publish Changes to make it live.');
    };
  }

  function installSafeActions(){
    if(typeof w.saveCurrent==='function'){
      const original=w.saveCurrent;
      w.saveCurrent=safe(original);
    }
    if(typeof w.saveSections==='function'){
      const original=w.saveSections;
      w.saveSections=safe(original);
    }
    if(typeof w.saveHome==='function'){
      w.saveHome=async function(){
        try{
          w.replaceField(/(<h1 id="hero-name">)([\s\S]*?)(<\/h1>)/,$('homeName').value);
          w.replaceField(/(<div class="role" id="hero-role">)([\s\S]*?)(<\/div>)/,$('homeRole').value);
          w.replaceField(/(<div class="org" id="hero-org">)([\s\S]*?)(<\/div>)/,$('homeOrg').value);
          w.replaceField(/(<a href=")([^"]+)("[^>]*download[^>]*>Download CV<\/a>)/,$('homeCV').value.trim());
          await w.saveIndex('Update Home / Profile');
        }catch(e){w.toast(e.message,true);}
      };
    }
    if(typeof w.resetEditor==='function'){
      const original=w.resetEditor;
      w.resetEditor=safe(original);
    }
    if(typeof w.loadAll==='function'){
      const original=w.loadAll;
      w.loadAll=safe(original);
    }
    if(typeof w.uploadPhotos==='function'){
      const original=w.uploadPhotos;
      w.uploadPhotos=safe(original);
    }
    if(typeof w.uploadCV==='function'){
      const original=w.uploadCV;
      w.uploadCV=safe(original);
    }
    if(typeof w.createRepoBackup==='function'){
      const original=w.createRepoBackup;
      w.createRepoBackup=safe(original);
    }
    if(typeof w.exportPhotos==='function'){
      const original=w.exportPhotos;
      w.exportPhotos=safe(original);
    }
  }

  function init(){
    addClearToken();
    installReplaceButtons();
    installSafeActions();
    if(typeof w.renderActivity==='function')w.renderActivity();
  }

  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',()=>setTimeout(init,0));
  else setTimeout(init,0);
})();

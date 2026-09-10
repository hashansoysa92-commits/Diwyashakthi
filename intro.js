/* Diwyashakthi luxury first-load hero intro */
(function(){
  const html=document.documentElement;
  const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function finishImmediately(){
    html.classList.remove('intro-sequence','intro-revealing');
    html.classList.add('intro-complete');
  }

  function runIntro(){
    const hero=document.getElementById('heroSlider');
    const targetLogo=hero?.querySelector('.hero-logo');
    if(!hero||!targetLogo||reduceMotion){finishImmediately();return;}

    const overlay=document.createElement('div');
    overlay.className='site-intro';
    overlay.setAttribute('aria-hidden','true');

    const backdrop=document.createElement('div');
    backdrop.className='site-intro-backdrop';

    const logo=document.createElement('img');
    logo.className='site-intro-logo';
    logo.src=targetLogo.getAttribute('src')||'assets/logo.svg';
    logo.alt='';

    overlay.append(backdrop,logo);
    document.body.appendChild(overlay);

    const cleanup=()=>{
      overlay.remove();
      html.classList.remove('intro-sequence','intro-revealing');
      html.classList.add('intro-complete');
    };

    const startSequence=async()=>{
      try{
        await logo.animate([
          {opacity:0,transform:'translate(-50%,-50%) scale(.58)',filter:'drop-shadow(0 18px 42px rgba(0,0,0,.15))'},
          {opacity:1,transform:'translate(-50%,-50%) scale(1.13)',filter:'drop-shadow(0 24px 52px rgba(0,0,0,.42))',offset:.64},
          {opacity:1,transform:'translate(-50%,-50%) scale(1)',filter:'drop-shadow(0 20px 46px rgba(0,0,0,.38))'}
        ],{duration:920,easing:'cubic-bezier(.2,.9,.22,1)',fill:'forwards'}).finished;

        await new Promise(r=>setTimeout(r,260));

        const target=targetLogo.getBoundingClientRect();
        const targetCenterX=target.left+target.width/2;
        const targetCenterY=target.top+target.height/2;

        const move=logo.animate([
          {left:'50%',top:'50%',width:getComputedStyle(logo).width,opacity:1,transform:'translate(-50%,-50%) scale(1)'},
          {left:targetCenterX+'px',top:targetCenterY+'px',width:target.width+'px',opacity:1,transform:'translate(-50%,-50%) scale(1)'}
        ],{duration:980,easing:'cubic-bezier(.22,.84,.24,1)',fill:'forwards'});

        backdrop.animate([
          {opacity:1},
          {opacity:1,offset:.16},
          {opacity:0}
        ],{duration:900,easing:'ease',fill:'forwards'});

        await move.finished;

        html.classList.add('intro-revealing');
        targetLogo.style.opacity='1';
        logo.style.opacity='0';

        await new Promise(r=>setTimeout(r,1550));
        cleanup();
      }catch(err){
        cleanup();
      }
    };

    if(logo.complete){
      requestAnimationFrame(()=>requestAnimationFrame(startSequence));
    }else{
      logo.addEventListener('load',()=>requestAnimationFrame(()=>requestAnimationFrame(startSequence)),{once:true});
      logo.addEventListener('error',cleanup,{once:true});
    }

    window.setTimeout(()=>{
      if(document.body.contains(overlay)) cleanup();
    },6200);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',runIntro,{once:true});
  }else{
    runIntro();
  }
})();

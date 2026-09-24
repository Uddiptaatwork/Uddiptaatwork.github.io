// Banner: two-detector strain, inspiral chirp + ringdown, drawn once on load.
(function(){
  var A=document.getElementById('traceA'), B=document.getElementById('traceB');
  if(!A||!B) return;
  var W=1400, cy=150, xm=880, fmax=0.12, amax=74;
  function trace(shift, phi0, seed){
    var d='', phase=phi0;
    for(var x=0;x<=W;x+=0.5){
      var u=x-shift, f, a;
      if(u<0){ f=0.014; a=amax*Math.pow(f/fmax,0.66); }
      else if(u<xm){
        var tau=Math.max((xm-u)/xm,0.004);
        f=Math.min(0.014*Math.pow(tau,-0.375),fmax);
        a=amax*Math.pow(f/fmax,0.66);
      } else { f=fmax*0.85; a=amax*Math.exp(-(u-xm)/40); }
      phase+=2*Math.PI*f*0.5;
      var n=2.6*(Math.sin(x*0.21+seed)+Math.sin(x*0.077+seed*2.3)+Math.sin(x*0.53+seed*0.7))/3;
      d+=(x===0?'M':'L')+x.toFixed(1)+' '+(cy-a*Math.cos(phase)+n).toFixed(2);
    }
    return d;
  }
  A.setAttribute('d', trace(0,0,1.7));
  B.setAttribute('d', trace(22,0.9,4.1));
  var g=document.getElementById('grid');
  if(g){ var s=''; for(var gx=0; gx<=1400; gx+=100) s+='<line x1="'+gx+'" y1="0" x2="'+gx+'" y2="300"/>'; g.innerHTML=s; }
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  [A,B].forEach(function(p,i){
    var L=p.getTotalLength();
    p.style.strokeDasharray=L; p.style.strokeDashoffset=L;
    requestAnimationFrame(function(){
      p.style.transition='stroke-dashoffset 2.4s cubic-bezier(.2,.65,.3,1) '+(i*0.08)+'s';
      p.style.strokeDashoffset=0;
    });
  });
})();

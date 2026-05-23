'use client';

import Script from 'next/script';

export function MicrosoftClarity() {
  const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  if (!CLARITY_PROJECT_ID) {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              c[a].l=1*new Date();
              for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
              k=l.createElement('script');k.async=!0;k.src=r;t.setAttribute('data-clarity-sett',a);
              before=l.getElementsByTagName('script')[0];t.parentNode.insertBefore(k,t);
          })(window, document, "clarity", "script", "https://clarity.ms/tag/${CLARITY_PROJECT_ID}");
        `,
      }}
    />
  );
}

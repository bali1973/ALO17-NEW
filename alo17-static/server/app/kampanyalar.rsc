1:"$Sreact.fragment"
2:I[12926,["6874","static/chunks/6874-61b4c5756db3a422.js","626","static/chunks/626-3aa0c62565f2955b.js","7177","static/chunks/app/layout-9e92c9e7d319e911.js"],"default"]
3:I[61598,["6874","static/chunks/6874-61b4c5756db3a422.js","626","static/chunks/626-3aa0c62565f2955b.js","7177","static/chunks/app/layout-9e92c9e7d319e911.js"],"default"]
4:I[23853,["6874","static/chunks/6874-61b4c5756db3a422.js","626","static/chunks/626-3aa0c62565f2955b.js","7177","static/chunks/app/layout-9e92c9e7d319e911.js"],"default"]
5:I[87555,[],""]
6:I[51901,["6874","static/chunks/6874-61b4c5756db3a422.js","8039","static/chunks/app/error-e5cf910a4415b8e1.js"],"default"]
7:I[31295,[],""]
8:I[99543,["6874","static/chunks/6874-61b4c5756db3a422.js","4345","static/chunks/app/not-found-0560fa0c93fa38f4.js"],"default"]
f:I[28393,[],""]
:HL["/_next/static/css/6d445479b10540d6.css","style"]
9:Tdbe,
                // Performans optimizasyonları
                if (typeof window !== 'undefined') {
                  // Service Worker kaydet
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('/sw.js')
                      .then(registration => {
                        console.log('Service Worker registered:', registration);
                      })
                      .catch(error => {
                        console.error('Service Worker registration failed:', error);
                      });
                  }
                  
                  // Performans izleme başlat
                  try {
                    // Core Web Vitals izleme
                    if ('PerformanceObserver' in window) {
                      // LCP (Largest Contentful Paint)
                      new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        console.log('LCP:', lastEntry.startTime.toFixed(2) + 'ms');
                      }).observe({ entryTypes: ['largest-contentful-paint'] });

                      // FID (First Input Delay)
                      new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        entries.forEach((entry) => {
                          console.log('FID:', (entry.processingStart - entry.startTime).toFixed(2) + 'ms');
                        });
                      }).observe({ entryTypes: ['first-input'] });

                      // CLS (Cumulative Layout Shift)
                      new PerformanceObserver((list) => {
                        let clsValue = 0;
                        const entries = list.getEntries();
                        entries.forEach((entry) => {
                          if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                          }
                        });
                        console.log('CLS:', clsValue.toFixed(4));
                      }).observe({ entryTypes: ['layout-shift'] });
                    }
                  } catch (error) {
                    console.error('Performance monitoring error:', error);
                  }
                  
                  // Cache temizleme
                  if (typeof localStorage !== 'undefined') {
                    const lastCleanup = localStorage.getItem('last_cache_cleanup');
                    const now = Date.now();
                    
                    if (!lastCleanup || (now - parseInt(lastCleanup)) > 24 * 60 * 60 * 1000) {
                      const keys = Object.keys(localStorage);
                      keys.forEach(key => {
                        if (key.startsWith('cache_')) {
                          try {
                            const item = JSON.parse(localStorage.getItem(key) || '{}');
                            if (item.timestamp && (now - item.timestamp) > 24 * 60 * 60 * 1000) {
                              localStorage.removeItem(key);
                            }
                          } catch (e) {
                            localStorage.removeItem(key);
                          }
                        }
                      });
                      
                      localStorage.setItem('last_cache_cleanup', now.toString());
                    }
                  }
                }
              0:{"P":null,"b":"9U2IfD7RjG8jKqzTSRWo3","p":"","c":["","kampanyalar",""],"i":false,"f":[[["",{"children":["kampanyalar",{"children":["__PAGE__",{}]}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/6d445479b10540d6.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","html",null,{"lang":"tr","children":[["$","head",null,{"children":[["$","meta",null,{"name":"viewport","content":"width=device-width, initial-scale=1"}],["$","meta",null,{"name":"robots","content":"index, follow"}],["$","meta",null,{"name":"author","content":"Alo17"}],["$","meta",null,{"name":"copyright","content":"Alo17"}],["$","link",null,{"rel":"icon","href":"/favicon.ico"}],["$","link",null,{"rel":"apple-touch-icon","href":"/apple-icon.png"}],["$","link",null,{"rel":"manifest","href":"/manifest.json"}],""]}],["$","body",null,{"className":"font-sans","children":["$","$L2",null,{"children":[["$","$L3",null,{}],["$","$L4",null,{}],["$","$L5",null,{"parallelRouterKey":"children","error":"$6","errorStyles":[],"errorScripts":[],"template":["$","$L7",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[["$","$L8",null,{}],[]],"forbidden":"$undefined","unauthorized":"$undefined"}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"$9"}}],"$La"]}]}]]}]]}],{"children":["kampanyalar","$Lb",{"children":["__PAGE__","$Lc",{},null,false]},null,false]},["$Ld",[],[]],false],"$Le",false]],"m":"$undefined","G":["$f",[]],"s":false,"S":true}
10:I[6874,["6874","static/chunks/6874-61b4c5756db3a422.js","626","static/chunks/626-3aa0c62565f2955b.js","7177","static/chunks/app/layout-9e92c9e7d319e911.js"],""]
12:I[90894,[],"ClientPageRoot"]
13:I[14260,["8930","static/chunks/app/kampanyalar/page-fa4062d51c7f1cd6.js"],"default"]
16:I[59665,[],"OutletBoundary"]
18:I[74911,[],"AsyncMetadataOutlet"]
1a:I[59665,[],"ViewportBoundary"]
1c:I[59665,[],"MetadataBoundary"]
1d:"$Sreact.suspense"
a:["$","div",null,{"className":"w-full m-0 p-0","children":[["$","div",null,{"className":"bg-yellow-50 border-t-4 border-alo-orange p-1 pb-px mb-0 m-0 shadow flex flex-col gap-0 items-center rounded-none","children":[["$","div",null,{"className":"flex items-center gap-1 text-yellow-700 font-semibold text-base mt-0","children":[["$","span",null,{"role":"img","aria-label":"Uyarı","children":"⚠️"}],"Güvenlik Uyarısı"]}],["$","div",null,{"className":"text-xs text-gray-800 mt-0 text-left","children":[["$","span",null,{"children":"Siz de kendi güvenliğiniz ve diğer kullanıcıların daha sağlıklı alışveriş yapabilmeleri için, satın almak istediğiniz ürünü teslim almadan ön ödeme yapmamaya, avans ya da kapora ödememeye özen gösteriniz."}],["$","span",null,{"children":"İlan sahiplerinin ilanlarda belirttiği herhangi bir bilgi ya da görselin gerçeği yansıtmadığını düşünüyorsanız veya ilan sahiplerinin hesap profillerindeki bilgilerin doğru olmadığını düşünüyorsanız, lütfen ilanı bildiriniz."}],["$","span",null,{"children":"ALO17.TR'de yer alan kullanıcıların oluşturduğu tüm içerik, görüş ve bilgilerin doğruluğu, eksiksiz ve değişmez olduğu, yayınlanması ile ilgili yasal yükümlülükler içeriği oluşturan kullanıcıya aittir. Bu içeriğin, görüş ve bilgilerin yanlışlık, eksiklik veya yasalarla düzenlenmiş kurallara aykırılığından ALO17.TR hiçbir şekilde sorumlu değildir. Sorularınız için ilan sahibi ile irtibata geçebilirsiniz."}]]}]]}],["$","div",null,{"className":"w-full h-[3px] bg-alo-orange m-0 p-0"}],["$","footer",null,{"className":"bg-primary text-white mt-12","children":["$","div",null,{"className":"max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8","children":[["$","div",null,{"children":[["$","h3",null,{"className":"text-xl font-extrabold mb-3 tracking-tight","children":"Alo17"}],["$","p",null,{"className":"text-sm mb-2 opacity-90","children":"Türkiye'nin güvenilir ilan platformu."}],["$","p",null,{"className":"text-xs opacity-70","children":["© ",2025," Alo17. Tüm hakları saklıdır."]}]]}],["$","div",null,{"children":[["$","h4",null,{"className":"text-md font-semibold mb-3","children":"Hızlı Linkler"}],["$","ul",null,{"className":"space-y-2 text-sm","children":[["$","li",null,{"children":["$","$L10",null,{"href":"/","className":"hover:underline","children":"Ana Sayfa"}]}],["$","li",null,{"children":["$","$L10",null,{"href":"/ilan-ver","className":"hover:underline","children":"İlan Ver"}]}],["$","li",null,{"children":["$","$L10",null,{"href":"/tum-ilanlar","className":"hover:underline","children":"Tüm İlanlar"}]}],["$","li",null,{"children":["$","$L10",null,{"href":"/iletisim","className":"hover:underline","children":"İletişim"}]}],["$","li",null,{"children":["$","$L10",null,{"href":"/hakkimizda","className":"hover:underline","children":"Hakkımızda"}]}]]}]]}],["$","div",null,{"children":[["$","h4",null,{"className":"text-md font-semibold mb-3","children":"Yasal"}],["$","ul",null,{"className":"space-y-2 text-sm","children":[["$","li",null,{"children":["$","$L10",null,{"href":"/kvkk","className":"hover:underline","children":"KVKK"}]}],["$","li",null,{"children":["$","$L10",null,{"href":"/cerez-politikasi","className":"hover:underline","children":"Çerez Politikası"}]}],["$","li",null,{"children":["$","$L10",null,{"href":"/gizlilik-politikasi","className":"hover:underline","children":"Gizlilik Politikası"}]}],["$","li",null,{"children":["$","$L10",null,{"href":"/kullanim-kosullari","className":"hover:underline","children":"Kullanım Koşulları"}]}],["$","li",null,{"children":["$","$L10",null,{"href":"/iade-politikasi","className":"hover:underline","children":"İade Politikası"}]}],["$","li",null,{"children":["$","$L10",null,{"href":"/acik-riza","className":"hover:underline","children":"Açık Rıza Metni"}]}]]}]]}],["$","div",null,{"children":[["$","h4",null,{"className":"text-md font-semibold mb-3","children":"Bize Ulaşın"}],["$","ul",null,{"className":"space-y-2 text-sm","children":[["$","li",null,{"children":["$","a",null,{"href":"mailto:destek@alo17.tr","className":"hover:underline","children":"destek@alo17.tr"}]}],["$","li",null,{"children":["$","a",null,{"href":"tel:5414042404","className":"hover:underline","children":"541 404 24 04"}]}],["$","li",null,{"children":["$","$L10",null,{"href":"/bildirim-tercihleri","className":"hover:underline","children":"Yeni İlanlardan Haberdar Ol"}]}],"$L11"]}]]}]]}]}]]}]
b:["$","$1","c",{"children":[null,["$","$L5",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L7",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}]
c:["$","$1","c",{"children":[["$","$L12",null,{"Component":"$13","searchParams":{},"params":{},"promises":["$@14","$@15"]}],null,["$","$L16",null,{"children":["$L17",["$","$L18",null,{"promise":"$@19"}]]}]]}]
d:["$","div","l",{"className":"min-h-screen flex items-center justify-center bg-gray-50","children":["$","div",null,{"className":"text-center","children":[["$","div",null,{"className":"inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"}],["$","h2",null,{"className":"text-xl font-semibold text-gray-700 mb-2","children":"Yükleniyor..."}],["$","p",null,{"className":"text-gray-500","children":"Lütfen bekleyin, sayfa yükleniyor."}]]}]}]
e:["$","$1","h",{"children":[null,[["$","$L1a",null,{"children":"$L1b"}],null],["$","$L1c",null,{"children":["$","div",null,{"hidden":true,"children":["$","$1d",null,{"fallback":null,"children":"$L1e"}]}]}]]}]
11:["$","li",null,{"className":"flex gap-3 mt-2","children":[["$","a",null,{"href":"#","className":"hover:opacity-80","aria-label":"Instagram","children":["$","svg",null,{"width":"22","height":"22","fill":"currentColor","className":"text-white","children":[["$","circle",null,{"cx":"11","cy":"11","r":"10","stroke":"white","strokeWidth":"2","fill":"none"}],["$","rect",null,{"x":"6","y":"6","width":"10","height":"10","rx":"3","fill":"white","opacity":".2"}],["$","circle",null,{"cx":"11","cy":"11","r":"3","fill":"white","opacity":".7"}]]}]}],["$","a",null,{"href":"#","className":"hover:opacity-80","aria-label":"Twitter","children":["$","svg",null,{"width":"22","height":"22","fill":"currentColor","className":"text-white","children":[["$","circle",null,{"cx":"11","cy":"11","r":"10","stroke":"white","strokeWidth":"2","fill":"none"}],["$","path",null,{"d":"M7 13c2 1 4 1 6-1","stroke":"white","strokeWidth":"1.5","fill":"none"}]]}]}]]}]
14:{}
15:"$c:props:children:0:props:params"
1b:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}],["$","meta","2",{"name":"theme-color","content":"#ff6600"}]]
17:null
1f:I[38175,[],"IconMark"]
19:{"metadata":[["$","title","0",{"children":"Çanakkalenin ilk ilan sitesi al sat "}],["$","meta","1",{"name":"description","content":"Alo17 ile yeni ve ikinci el ürünler, hizmetler ve fırsatlar bir arada! Hemen ilan ver, fırsatları kaçırma."}],["$","meta","2",{"name":"keywords","content":"alo17,ilan,ikinci el,satılık,hizmet,elektronik,ev eşyası,giyim,araba,emlak,iş ilanı,premium ilan,ücretsiz ilan,Çanakkale,Türkiye"}],["$","meta","3",{"property":"og:title","content":"Çanakkalenin ilk ilan sitesi al sat "}],["$","meta","4",{"property":"og:description","content":"Alo17 ile yeni ve ikinci el ürünler, hizmetler ve fırsatlar bir arada! Hemen ilan ver, fırsatları kaçırma."}],["$","meta","5",{"property":"og:url","content":"https://alo17.com/"}],["$","meta","6",{"property":"og:site_name","content":"Çanakkalenin ilk ilan sitesi al sat "}],["$","meta","7",{"property":"og:locale","content":"tr_TR"}],["$","meta","8",{"property":"og:image","content":"https://alo17.com/images/og-image.jpg"}],["$","meta","9",{"property":"og:image:width","content":"1200"}],["$","meta","10",{"property":"og:image:height","content":"630"}],["$","meta","11",{"property":"og:image:alt","content":"Çanakkalenin ilk ilan sitesi al sat "}],["$","meta","12",{"property":"og:type","content":"website"}],["$","meta","13",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","14",{"name":"twitter:site","content":"@alo17tr"}],["$","meta","15",{"name":"twitter:title","content":"Çanakkalenin ilk ilan sitesi al sat "}],["$","meta","16",{"name":"twitter:description","content":"Alo17 ile yeni ve ikinci el ürünler, hizmetler ve fırsatlar bir arada! Hemen ilan ver, fırsatları kaçırma."}],["$","meta","17",{"name":"twitter:image","content":"https://alo17.com/images/og-image.jpg"}],["$","link","18",{"rel":"shortcut icon","href":"/icons/favicon-16x16.png"}],["$","link","19",{"rel":"icon","href":"/icons/favicon-32x32.png"}],["$","link","20",{"rel":"apple-touch-icon","href":"/icons/apple-touch-icon.png"}],["$","link","21",{"rel":"icon","href":"/icons/favicon.ico"}],["$","link","22",{"rel":"icon","href":"/icons/favicon-16x16.png","type":"image/png","sizes":"16x16"}],["$","link","23",{"rel":"icon","href":"/icons/favicon-32x32.png","type":"image/png","sizes":"32x32"}],["$","link","24",{"rel":"apple-touch-icon","href":"/icons/apple-touch-icon.png","sizes":"180x180"}],["$","link","25",{"rel":"manifest","href":"/manifest.json"}],["$","$L1f","26",{}]],"error":null,"digest":"$undefined"}
1e:"$19:metadata"

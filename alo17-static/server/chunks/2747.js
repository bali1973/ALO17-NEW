exports.id=2747,exports.ids=[2747],exports.modules={66719:(a,b,c)=>{"use strict";c.d(b,{J:()=>k});let d=c(49526).createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT)||587,secure:!1,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});async function e({to:a,subject:b,html:c}){return await d.sendMail({from:process.env.SMTP_FROM||process.env.SMTP_USER,to:a,subject:b,html:c})}let f={welcome:a=>({subject:"Alo17'e Hoş Geldiniz!",html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Alo17'e Hoş Geldiniz!</h2>
        <p>Merhaba ${a},</p>
        <p>Alo17 ailesine katıldığınız i\xe7in teşekk\xfcr ederiz. Artık ilanlarınızı yayınlayabilir ve diğer kullanıcılarla iletişime ge\xe7ebilirsiniz.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Başlamak i\xe7in:</h3>
          <ul>
            <li>Profilinizi tamamlayın</li>
            <li>İlk ilanınızı yayınlayın</li>
            <li>Diğer kullanıcıların ilanlarını keşfedin</li>
          </ul>
        </div>
        <p>Herhangi bir sorunuz olursa bizimle iletişime ge\xe7ebilirsiniz.</p>
        <p>Saygılarımızla,<br>Alo17 Ekibi</p>
      </div>
    `,text:`Alo17'e Hoş Geldiniz!

Merhaba ${a},

Alo17 ailesine katıldığınız i\xe7in teşekk\xfcr ederiz. Artık ilanlarınızı yayınlayabilir ve diğer kullanıcılarla iletişime ge\xe7ebilirsiniz.

Başlamak i\xe7in:
- Profilinizi tamamlayın
- İlk ilanınızı yayınlayın
- Diğer kullanıcıların ilanlarını keşfedin

Herhangi bir sorunuz olursa bizimle iletişime ge\xe7ebilirsiniz.

Saygılarımızla,
Alo17 Ekibi`}),listingApproved:(a,b)=>({subject:"İlanınız Onaylandı",html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">İlanınız Onaylandı!</h2>
        <p>Merhaba ${a},</p>
        <p><strong>"${b}"</strong> başlıklı ilanınız başarıyla onaylanmıştır ve artık yayındadır.</p>
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
          <p style="margin: 0;"><strong>İlan Detayları:</strong></p>
          <p style="margin: 10px 0 0 0;">Başlık: ${b}</p>
          <p style="margin: 5px 0;">Durum: Yayında</p>
        </div>
        <p>İlanınızı g\xf6r\xfcnt\xfclemek ve d\xfczenlemek i\xe7in profilinizi ziyaret edebilirsiniz.</p>
        <p>İyi satışlar dileriz!</p>
        <p>Saygılarımızla,<br>Alo17 Ekibi</p>
      </div>
    `,text:`İlanınız Onaylandı!

Merhaba ${a},

"${b}" başlıklı ilanınız başarıyla onaylanmıştır ve artık yayındadır.

İlan Detayları:
- Başlık: ${b}
- Durum: Yayında

İlanınızı g\xf6r\xfcnt\xfclemek ve d\xfczenlemek i\xe7in profilinizi ziyaret edebilirsiniz.

İyi satışlar dileriz!

Saygılarımızla,
Alo17 Ekibi`}),listingRejected:(a,b,c)=>({subject:"İlanınız Onaylanmadı",html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">İlanınız Onaylanmadı</h2>
        <p>Merhaba ${a},</p>
        <p><strong>"${b}"</strong> başlıklı ilanınız onay kriterlerimizi karşılamadığı i\xe7in onaylanmamıştır.</p>
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <p style="margin: 0;"><strong>Onaylanmama Nedeni:</strong></p>
          <p style="margin: 10px 0 0 0;">${c}</p>
        </div>
        <p>İlanınızı d\xfczenleyip tekrar g\xf6nderebilirsiniz. Sorularınız i\xe7in bizimle iletişime ge\xe7ebilirsiniz.</p>
        <p>Saygılarımızla,<br>Alo17 Ekibi</p>
      </div>
    `,text:`İlanınız Onaylanmadı

Merhaba ${a},

"${b}" başlıklı ilanınız onay kriterlerimizi karşılamadığı i\xe7in onaylanmamıştır.

Onaylanmama Nedeni:
${c}

İlanınızı d\xfczenleyip tekrar g\xf6nderebilirsiniz. Sorularınız i\xe7in bizimle iletişime ge\xe7ebilirsiniz.

Saygılarımızla,
Alo17 Ekibi`}),newMessage:(a,b,c)=>({subject:"Yeni Mesajınız Var",html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Yeni Mesajınız Var</h2>
        <p>Merhaba ${a},</p>
        <p><strong>${b}</strong> kullanıcısından yeni bir mesaj aldınız.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>İlan:</strong> ${c}</p>
          <p style="margin: 10px 0 0 0;"><strong>G\xf6nderen:</strong> ${b}</p>
        </div>
        <p>Mesajınızı okumak i\xe7in profilinizi ziyaret edebilirsiniz.</p>
        <p>Saygılarımızla,<br>Alo17 Ekibi</p>
      </div>
    `,text:`Yeni Mesajınız Var

Merhaba ${a},

${b} kullanıcısından yeni bir mesaj aldınız.

İlan: ${c}
G\xf6nderen: ${b}

Mesajınızı okumak i\xe7in profilinizi ziyaret edebilirsiniz.

Saygılarımızla,
Alo17 Ekibi`}),premiumExpiring:(a,b)=>({subject:"Premium \xdcyeliğiniz Yakında Sona Erecek",html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Premium \xdcyeliğiniz Yakında Sona Erecek</h2>
        <p>Merhaba ${a},</p>
        <p>Premium \xfcyeliğinizin ${b} g\xfcn sonra sona ereceğini hatırlatmak isteriz.</p>
        <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0;"><strong>Premium Avantajları:</strong></p>
          <ul style="margin: 10px 0 0 0;">
            <li>\xd6ncelikli ilan g\xf6sterimi</li>
            <li>Gelişmiş arama filtreleri</li>
            <li>İstatistikler ve analitikler</li>
            <li>\xd6ncelikli m\xfcşteri desteği</li>
          </ul>
        </div>
        <p>Premium avantajlarından yararlanmaya devam etmek i\xe7in \xfcyeliğinizi yenileyebilirsiniz.</p>
        <p>Saygılarımızla,<br>Alo17 Ekibi</p>
      </div>
    `,text:`Premium \xdcyeliğiniz Yakında Sona Erecek

Merhaba ${a},

Premium \xfcyeliğinizin ${b} g\xfcn sonra sona ereceğini hatırlatmak isteriz.

Premium Avantajları:
- \xd6ncelikli ilan g\xf6sterimi
- Gelişmiş arama filtreleri
- İstatistikler ve analitikler
- \xd6ncelikli m\xfcşteri desteği

Premium avantajlarından yararlanmaya devam etmek i\xe7in \xfcyeliğinizi yenileyebilirsiniz.

Saygılarımızla,
Alo17 Ekibi`}),passwordReset:(a,b)=>({subject:"Şifre Sıfırlama Talebi",html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Şifre Sıfırlama</h2>
        <p>Merhaba ${a},</p>
        <p>Hesabınız i\xe7in şifre sıfırlama talebinde bulundunuz.</p>
        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <a href="${b}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Şifremi Sıfırla
          </a>
        </div>
        <p>Bu bağlantı 1 saat s\xfcreyle ge\xe7erlidir. Eğer bu talebi siz yapmadıysanız, bu e-postayı g\xf6rmezden gelebilirsiniz.</p>
        <p>Saygılarımızla,<br>Alo17 Ekibi</p>
      </div>
    `,text:`Şifre Sıfırlama

Merhaba ${a},

Hesabınız i\xe7in şifre sıfırlama talebinde bulundunuz.

Şifrenizi sıfırlamak i\xe7in aşağıdaki bağlantıya tıklayın:
${b}

Bu bağlantı 1 saat s\xfcreyle ge\xe7erlidir. Eğer bu talebi siz yapmadıysanız, bu e-postayı g\xf6rmezden gelebilirsiniz.

Saygılarımızla,
Alo17 Ekibi`})};class g{constructor(){this.isEnabled=!0}static getInstance(){return g.instance||(g.instance=new g),g.instance}setEnabled(a){this.isEnabled=a}isEmailEnabled(){return this.isEnabled}async sendEmail(a){if(!this.isEnabled)return console.log("\uD83D\uDCE7 Email notifications disabled, skipping:",a.subject),!0;try{return console.log("\uD83D\uDCE7 Sending email to:",a.to,"Subject:",a.subject),await this.simulateEmailSending(a),console.log("✅ Email sent successfully to:",a.to),!0}catch(a){return console.error("❌ Email sending failed:",a),!1}}async sendWelcomeEmail(a,b){let c=f.welcome(b);return this.sendEmail({to:a,subject:c.subject,html:c.html,text:c.text})}async sendListingApprovedEmail(a,b,c){let d=f.listingApproved(b,c);return this.sendEmail({to:a,subject:d.subject,html:d.html,text:d.text})}async sendListingRejectedEmail(a,b,c,d){let e=f.listingRejected(b,c,d);return this.sendEmail({to:a,subject:e.subject,html:e.html,text:e.text})}async sendNewMessageEmail(a,b,c,d){let e=f.newMessage(b,c,d);return this.sendEmail({to:a,subject:e.subject,html:e.html,text:e.text})}async sendPremiumExpiringEmail(a,b,c){let d=f.premiumExpiring(b,c);return this.sendEmail({to:a,subject:d.subject,html:d.html,text:d.text})}async sendPasswordResetEmail(a,b,c){let d=f.passwordReset(b,c);return this.sendEmail({to:a,subject:d.subject,html:d.html,text:d.text})}async simulateEmailSending(a){await new Promise(a=>setTimeout(a,1e3)),console.log("\uD83D\uDCE7 Email Details:",{to:a.to,subject:a.subject,timestamp:new Date().toISOString()})}}g.getInstance();var h=c(29021),i=c(33873),j=c.n(i);class k{static async notifyNewListing(a){try{console.log(`Yeni ilan bildirimi g\xf6nderiliyor: ${a.title}`);let b=await this.findMatchingSubscriptions(a);for(let a of(console.log(`${b.length} eşleşen abonelik bulundu`),b))await this.sendNotification(a.subscription,a.listing);return{success:!0,notificationsSent:b.length}}catch(a){return console.error("Notification service error:",a),{success:!1,error:a instanceof Error?a.message:"Bilinmeyen hata"}}}static async findMatchingSubscriptions(a){let b=[];try{let c=j().join(process.cwd(),"public","notificationSubscriptions.json"),d=await h.promises.readFile(c,"utf-8");for(let c of JSON.parse(d))c.isActive&&this.matchesSubscription(a,c)&&b.push({subscription:c,listing:a})}catch(a){console.error("Abonelikler okunamadı:",a)}return b}static matchesSubscription(a,b){if(b.category&&a.category!==b.category||b.subcategory&&a.subcategory!==b.subcategory)return!1;if(b.keywords)try{let c=JSON.parse(b.keywords);if(c.length>0){let b=`${a.title} ${a.description}`.toLowerCase();if(!c.some(a=>b.includes(a.toLowerCase())))return!1}}catch(a){console.error("Keywords parse error:",a)}if(b.priceRange)try{let c=JSON.parse(b.priceRange);if(c.min&&a.price<c.min||c.max&&a.price>c.max)return!1}catch(a){console.error("Price range parse error:",a)}if(b.location&&a.location){let c=b.location.toLowerCase();if(!a.location.toLowerCase().includes(c))return!1}return!0}static async sendNotification(a,b){try{"instant"===a.frequency&&!1!==a.emailEnabled&&await this.sendInstantNotification(a,b),!1!==a.pushEnabled&&a.pushToken&&await this.sendPushNotification(a,b),await this.saveInAppNotification(a,b),await this.saveNotificationHistory(a,b),console.log(`Bildirim g\xf6nderildi: ${a.email} - ${b.title}`)}catch(a){console.error("Notification send error:",a)}}static async sendInstantNotification(a,b){let c=`Yeni İlan: ${b.title}`,d=`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Yeni İlan Bildirimi</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1e293b;">${b.title}</h3>
          <p style="margin: 0 0 10px 0; color: #64748b;">${b.description}</p>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
            <span style="font-size: 18px; font-weight: bold; color: #059669;">${b.price.toLocaleString("tr-TR")} ₺</span>
            <span style="color: #64748b;">${b.location}</span>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}/ilan/${b.id}" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            İlanı G\xf6r\xfcnt\xfcle
          </a>
        </div>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b;">
          <p>Bu e-posta, ${a.category||"t\xfcm kategoriler"} kategorisindeki yeni ilanlardan haberdar olmak i\xe7in abone olduğunuz i\xe7in g\xf6nderilmiştir.</p>
          <p>Aboneliği iptal etmek i\xe7in <a href="${process.env.NEXTAUTH_URL}/profil/bildirimler">profil sayfanızı</a> ziyaret edin.</p>
        </div>
      </div>
    `;await e({to:a.email,subject:c,html:d})}static async sendPushNotification(a,b){try{let c={title:"Yeni İlan",body:`${b.title} - ${b.price.toLocaleString("tr-TR")} ₺`,icon:"/icons/favicon-32x32.png",badge:"/icons/favicon-16x16.png",data:{url:`/ilan/${b.id}`,listingId:b.id,type:"new_listing"},actions:[{action:"view",title:"G\xf6r\xfcnt\xfcle",icon:"/icons/favicon-16x16.png"},{action:"dismiss",title:"Kapat"}]};a.pushToken&&await this.sendWebPushNotification(a.pushToken,c)}catch(a){console.error("Push notification error:",a)}}static async sendWebPushNotification(a,b){try{return process.env.VAPID_PUBLIC_KEY,process.env.VAPID_PRIVATE_KEY,console.log("Push notification g\xf6nderiliyor:",{token:a,notification:b}),!0}catch(a){return console.error("Web push notification error:",a),!1}}static async saveInAppNotification(a,b){try{let c=j().join(process.cwd(),"public","inAppNotifications.json"),d=[];try{let a=await h.promises.readFile(c,"utf-8");d=JSON.parse(a)}catch(a){d=[]}let e={id:Date.now().toString(),userId:a.userId,email:a.email,type:"new_listing",title:"Yeni İlan",message:`${b.title} - ${b.price.toLocaleString("tr-TR")} ₺`,data:{listingId:b.id,listingTitle:b.title,listingPrice:b.price,listingLocation:b.location},isRead:!1,createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+2592e6).toISOString()};d.unshift(e),d.length>100&&(d=d.slice(0,100)),await h.promises.writeFile(c,JSON.stringify(d,null,2))}catch(a){console.error("In-app notification save error:",a)}}static async saveNotificationHistory(a,b){try{let c=j().join(process.cwd(),"public","notificationHistory.json"),d=[];try{let a=await h.promises.readFile(c,"utf-8");d=JSON.parse(a)}catch(a){d=[]}let e={id:Date.now().toString(),subscriptionId:a.id,listingId:b.id,email:a.email,subject:`Yeni İlan: ${b.title}`,content:`Yeni ilan bildirimi g\xf6nderildi: ${b.title}`,sentAt:new Date().toISOString(),type:"email",status:"sent"};d.unshift(e),d.length>1e3&&(d=d.slice(0,1e3)),await h.promises.writeFile(c,JSON.stringify(d,null,2))}catch(a){console.error("Notification history save error:",a)}}static async sendDailyDigest(){try{let a=new Date;a.setDate(a.getDate()-1);let b=j().join(process.cwd(),"public","notificationSubscriptions.json"),c=await h.promises.readFile(b,"utf-8");for(let b of JSON.parse(c).filter(a=>"daily"===a.frequency&&a.isActive))await this.sendDigestNotification(b,"daily",a)}catch(a){console.error("Daily digest error:",a)}}static async sendWeeklyDigest(){try{let a=new Date;a.setDate(a.getDate()-7);let b=j().join(process.cwd(),"public","notificationSubscriptions.json"),c=await h.promises.readFile(b,"utf-8");for(let b of JSON.parse(c).filter(a=>"weekly"===a.frequency&&a.isActive))await this.sendDigestNotification(b,"weekly",a)}catch(a){console.error("Weekly digest error:",a)}}static async sendDigestNotification(a,b,c){try{let d=await this.findMatchingListings(a,c);if(0===d.length)return;let f="daily"===b?"G\xfcnl\xfck":"Haftalık",g=`${f} İlan \xd6zeti`,h=`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">${f} İlan \xd6zeti</h2>
          <p style="color: #64748b;">Son ${"daily"===b?"24 saat":"hafta"} i\xe7inde ${d.length} yeni ilan bulundu.</p>
          
          ${d.map(a=>`
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2563eb;">
              <h4 style="margin: 0 0 8px 0; color: #1e293b;">${a.title}</h4>
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">${a.description.substring(0,100)}...</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; color: #059669;">${a.price.toLocaleString("tr-TR")} ₺</span>
                <span style="color: #64748b; font-size: 12px;">${a.location}</span>
              </div>
              <a href="${process.env.NEXTAUTH_URL}/ilan/${a.id}" style="color: #2563eb; text-decoration: none; font-size: 12px;">İlanı G\xf6r\xfcnt\xfcle →</a>
            </div>
          `).join("")}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/tum-ilanlar" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              T\xfcm İlanları G\xf6r\xfcnt\xfcle
            </a>
          </div>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b;">
            <p>Bu e-posta, ${a.category||"t\xfcm kategoriler"} kategorisindeki ${b} \xf6zet aboneliğiniz i\xe7in g\xf6nderilmiştir.</p>
            <p>Aboneliği iptal etmek i\xe7in <a href="${process.env.NEXTAUTH_URL}/profil/bildirimler">profil sayfanızı</a> ziyaret edin.</p>
          </div>
        </div>
      `;await e({to:a.email,subject:g,html:h}),console.log(`${f} \xf6zet g\xf6nderildi: ${a.email}`)}catch(a){console.error("Digest notification error:",a)}}static async findMatchingListings(a,b){try{let c=j().join(process.cwd(),"public","listings.json"),d=await h.promises.readFile(c,"utf-8");return JSON.parse(d).filter(a=>new Date(a.createdAt)>=b&&"approved"===a.status).filter(b=>this.matchesSubscription(b,a)).sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).slice(0,10)}catch(a){return console.error("Listings read error:",a),[]}}static async getUserNotifications(a,b=20){try{let c=j().join(process.cwd(),"public","inAppNotifications.json"),d=await h.promises.readFile(c,"utf-8");return JSON.parse(d).filter(b=>b.userId===a).slice(0,b)}catch(a){return console.error("Get user notifications error:",a),[]}}static async markNotificationAsRead(a,b){try{let c=j().join(process.cwd(),"public","inAppNotifications.json"),d=await h.promises.readFile(c,"utf-8"),e=JSON.parse(d),f=e.findIndex(c=>c.id===a&&c.userId===b);if(-1!==f)return e[f].isRead=!0,await h.promises.writeFile(c,JSON.stringify(e,null,2)),!0;return!1}catch(a){return console.error("Mark notification as read error:",a),!1}}static async cleanupOldNotifications(){try{let a=j().join(process.cwd(),"public","inAppNotifications.json"),b=await h.promises.readFile(a,"utf-8"),c=JSON.parse(b),d=new Date,e=new Date(d.getTime()-2592e6),f=c.filter(a=>new Date(a.createdAt)>e);await h.promises.writeFile(a,JSON.stringify(f,null,2)),console.log("Eski bildirimler temizlendi")}catch(a){console.error("Cleanup notifications error:",a)}}}},78335:()=>{},96487:()=>{}};
// app.js 
console.log('🔧 app.js در حال اجرا');

// ثبت Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then(() => console.log('✅ Service Worker ثبت شد'))
    .catch(err => console.log('❌ خطا:', err));
}

// مخفی کردن دکمه‌های نصب
function hideInstallButtons() {
  console.log('⏳ جستجوی دکمه‌های نصب...');
  
  // همه دکمه‌ها را پیدا کن
  const buttons = document.getElementsByTagName('button');
  
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const text = button.textContent || button.innerText || '';
    
    // اگر دکمه نصب است
    if (text.includes('نصب') || text.includes('📲') || text.includes('اپ')) {
      console.log('🎯 دکمه نصب پیدا شد:', text.substring(0, 20));
      
      // بعد از ۵ ثانیه مخفی کن
      setTimeout(() => {
        console.log('👻 مخفی کردن دکمه');
        button.style.opacity = '0';
        button.style.transition = 'opacity 0.5s';
        button.style.pointerEvents = 'none';
        
        // بعد از انیمیشن، کاملاً پنهان کن
        setTimeout(() => {
          button.style.display = 'none';
          button.style.visibility = 'hidden';
        }, 500);
        
      }, 10000); // 10 ثانیه
    }
  }
}

// منتظر بمان تا صفحه کاملاً لود شود
window.addEventListener('load', () => {
  console.log('📄 صفحه کاملاً لود شد');
  setTimeout(hideInstallButtons, 1000); // ۱ ثانیه بعد از load
});

// قبل از install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  console.log('📱 دکمه نصب فعال است');
});

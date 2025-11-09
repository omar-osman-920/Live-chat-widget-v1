import { useState, useEffect } from 'react';
import { Globe, Code, X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export function TestWebsitePage() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [showEmbedModal, setShowEmbedModal] = useState(true);
  const [englishCode, setEnglishCode] = useState('');
  const [arabicCode, setArabicCode] = useState('');
  const [widgetsLoaded, setWidgetsLoaded] = useState(false);

  const content = {
    en: {
      hero: {
        title: 'Transform Your Business with Innovation',
        subtitle: 'Cutting-edge solutions for modern enterprises',
        cta: 'Get Started',
        ctaSecondary: 'Learn More'
      },
      features: {
        title: 'Why Choose Us',
        items: [
          { title: 'Fast & Reliable', desc: 'Lightning-fast performance with 99.9% uptime guarantee' },
          { title: 'Secure Platform', desc: 'Enterprise-grade security to protect your data' },
          { title: '24/7 Support', desc: 'Round-the-clock assistance whenever you need it' },
          { title: 'Easy Integration', desc: 'Seamless integration with your existing tools' },
        ]
      },
      services: {
        title: 'Our Services',
        items: [
          { title: 'Cloud Solutions', desc: 'Scalable cloud infrastructure for your business', price: '$99/mo' },
          { title: 'Data Analytics', desc: 'Turn data into actionable insights', price: '$149/mo' },
          { title: 'Consulting', desc: 'Expert guidance for digital transformation', price: '$199/mo' },
        ]
      },
      testimonials: {
        title: 'What Our Clients Say',
        items: [
          { name: 'John Smith', role: 'CEO, TechCorp', text: 'Exceptional service and outstanding results. Highly recommended!' },
          { name: 'Sarah Johnson', role: 'Director, InnovateLab', text: 'Their team went above and beyond our expectations.' },
        ]
      },
      cta: {
        title: 'Ready to Get Started?',
        subtitle: 'Join thousands of satisfied customers today',
        button: 'Contact Us'
      },
      footer: {
        company: 'Company',
        about: 'About Us',
        careers: 'Careers',
        contact: 'Contact',
        resources: 'Resources',
        blog: 'Blog',
        docs: 'Documentation',
        support: 'Support',
        rights: '© 2024 YourCompany. All rights reserved.'
      }
    },
    ar: {
      hero: {
        title: 'حوّل عملك مع الابتكار',
        subtitle: 'حلول متطورة للمؤسسات الحديثة',
        cta: 'ابدأ الآن',
        ctaSecondary: 'اعرف المزيد'
      },
      features: {
        title: 'لماذا تختارنا',
        items: [
          { title: 'سريع وموثوق', desc: 'أداء فائق السرعة مع ضمان 99.9٪ من وقت التشغيل' },
          { title: 'منصة آمنة', desc: 'أمان على مستوى المؤسسات لحماية بياناتك' },
          { title: 'دعم على مدار الساعة', desc: 'مساعدة على مدار الساعة طوال أيام الأسبوع' },
          { title: 'تكامل سهل', desc: 'تكامل سلس مع أدواتك الحالية' },
        ]
      },
      services: {
        title: 'خدماتنا',
        items: [
          { title: 'حلول السحابة', desc: 'بنية تحتية سحابية قابلة للتطوير لعملك', price: '99 دولار/شهر' },
          { title: 'تحليل البيانات', desc: 'حوّل البيانات إلى رؤى قابلة للتنفيذ', price: '149 دولار/شهر' },
          { title: 'الاستشارات', desc: 'إرشادات الخبراء للتحول الرقمي', price: '199 دولار/شهر' },
        ]
      },
      testimonials: {
        title: 'ماذا يقول عملاؤنا',
        items: [
          { name: 'أحمد محمد', role: 'الرئيس التنفيذي، شركة التقنية', text: 'خدمة استثنائية ونتائج رائعة. نوصي به بشدة!' },
          { name: 'سارة علي', role: 'مديرة، مختبر الابتكار', text: 'فريقهم تجاوز توقعاتنا بكثير.' },
        ]
      },
      cta: {
        title: 'هل أنت مستعد للبدء؟',
        subtitle: 'انضم إلى آلاف العملاء الراضين اليوم',
        button: 'اتصل بنا'
      },
      footer: {
        company: 'الشركة',
        about: 'من نحن',
        careers: 'الوظائف',
        contact: 'اتصل بنا',
        resources: 'الموارد',
        blog: 'المدونة',
        docs: 'التوثيق',
        support: 'الدعم',
        rights: '© 2024 شركتك. جميع الحقوق محفوظة.'
      }
    }
  };

  const t = content[language];
  const isRTL = language === 'ar';

  useEffect(() => {
    if (widgetsLoaded) {
      const script = document.createElement('div');
      script.id = 'widget-container-' + language;

      if (language === 'en' && englishCode) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = englishCode;
        const scriptTag = tempDiv.querySelector('script');
        if (scriptTag) {
          const newScript = document.createElement('script');
          Array.from(scriptTag.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          if (scriptTag.textContent) {
            newScript.textContent = scriptTag.textContent;
          }
          document.body.appendChild(newScript);
        }
      } else if (language === 'ar' && arabicCode) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = arabicCode;
        const scriptTag = tempDiv.querySelector('script');
        if (scriptTag) {
          const newScript = document.createElement('script');
          Array.from(scriptTag.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          if (scriptTag.textContent) {
            newScript.textContent = scriptTag.textContent;
          }
          document.body.appendChild(newScript);
        }
      }
    }

    return () => {
      const containers = document.querySelectorAll('[id^="live-chat-widget-"]');
      containers.forEach(container => container.remove());
      const scripts = document.querySelectorAll('script[data-widget-id]');
      scripts.forEach(script => script.remove());
    };
  }, [language, widgetsLoaded, englishCode, arabicCode]);

  const handleSaveWidgets = () => {
    setShowEmbedModal(false);
    setWidgetsLoaded(true);
  };

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Embed Widget Modal */}
      <Dialog open={showEmbedModal} onOpenChange={setShowEmbedModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Embed Your Chat Widgets
            </DialogTitle>
            <DialogDescription>
              Add your widget code snippets for both English and Arabic versions. The appropriate widget will load based on the selected language.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label htmlFor="english-widget" className="text-base font-semibold">
                English Widget Code
              </Label>
              <Textarea
                id="english-widget"
                placeholder='<script src="..." data-widget-id="..." data-language="english"></script>'
                value={englishCode}
                onChange={(e) => setEnglishCode(e.target.value)}
                className="font-mono text-sm h-32"
              />
              <p className="text-xs text-gray-500">
                Paste the embed code for your English chat widget
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="arabic-widget" className="text-base font-semibold">
                Arabic Widget Code
              </Label>
              <Textarea
                id="arabic-widget"
                placeholder='<script src="..." data-widget-id="..." data-language="arabic"></script>'
                value={arabicCode}
                onChange={(e) => setArabicCode(e.target.value)}
                className="font-mono text-sm h-32"
              />
              <p className="text-xs text-gray-500">
                Paste the embed code for your Arabic chat widget
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 text-sm mb-2">💡 Tips:</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>You can add one or both widget codes</li>
                <li>The widget will automatically switch when you change the language</li>
                <li>Make sure to use the correct language parameter in your widget code</li>
                <li>You can update the codes anytime by clicking the embed button again</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEmbedModal(false)}>
              Skip for Now
            </Button>
            <Button
              onClick={handleSaveWidgets}
              disabled={!englishCode && !arabicCode}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save & Load Widgets
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                YourCompany
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEmbedModal(true)}
                className="gap-2"
              >
                <Code className="w-4 h-4" />
                Embed Widget
              </Button>

              <div className="flex items-center gap-2 border-l pl-3">
                <Button
                  variant={language === 'en' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                  className={language === 'en' ? 'bg-blue-600' : ''}
                >
                  English
                </Button>
                <Button
                  variant={language === 'ar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLanguage('ar')}
                  className={language === 'ar' ? 'bg-blue-600' : ''}
                >
                  العربية
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-24">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg">
              {t.hero.cta}
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg">
              {t.hero.ctaSecondary}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            {t.features.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.items.map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{idx + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            {t.services.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {t.services.items.map((service, idx) => (
              <div key={idx} className="border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.desc}</p>
                <div className="text-3xl font-bold text-blue-600 mb-6">{service.price}</div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  {language === 'en' ? 'Choose Plan' : 'اختر الخطة'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            {t.testimonials.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {t.testimonials.items.map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-lg">
                <p className="text-gray-700 text-lg mb-6 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">{t.cta.title}</h2>
          <p className="text-xl mb-8 text-blue-100">{t.cta.subtitle}</p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-lg">
            {t.cta.button}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{t.footer.company}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.about}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.careers}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.contact}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">{t.footer.resources}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.blog}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.docs}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.support}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">{language === 'en' ? 'Connect' : 'تواصل معنا'}</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>{t.footer.rights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

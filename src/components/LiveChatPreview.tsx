import { ChatWidgetFormData } from './ChatWidgetWizard';
import { MessageCircle, X, Send, Smile } from 'lucide-react';
import { useState } from 'react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import maqsamLogo from 'figma:asset/3dd0af8f7f2bc81d7523e21cf13dfaaddd425eca.png';

interface LiveChatPreviewProps {
  formData: ChatWidgetFormData;
  selectedLanguage?: string;
}

export function LiveChatPreview({ formData, selectedLanguage }: LiveChatPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isDuringWorkingHours, setIsDuringWorkingHours] = useState(true);

  // Use the selected language if provided, otherwise default to English or first available
  const currentLanguage = selectedLanguage || 'English';

  // Detect RTL languages
  const RTL_LANGUAGES = ['Arabic'];
  const isRTL = RTL_LANGUAGES.includes(currentLanguage);

  // Language-specific translations
  const TRANSLATIONS: { [key: string]: { [key: string]: string } } = {
    'English': {
      online: 'Online',
      offline: 'Offline',
      justNow: 'Just now',
      replyPlaceholder: 'Reply ...',
      title: 'Live Chat',
      duringHoursPlaceholder: 'Hi! How can we help you today?',
      afterHoursPlaceholder: 'We\'re currently offline. Leave us a message!',
      taglinePlaceholder: 'Welcome! We\'re here to help.',
      poweredBy: 'Powered by Maqsam',
      preChatFormTitle: 'Please fill out the form to start chatting',
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      emailLabel: 'Email',
      emailPlaceholder: 'your@email.com',
      phoneLabel: 'Phone Number',
      phonePlaceholder: '+1 (555) 000-0000',
      startChat: 'Start Chat',
      iAgreeToThe: 'I agree to the',
      privacyPolicy: 'Privacy Policy',
      termsOfUse: 'Terms of Use',
      and: 'and',
      byClickingAgree: 'By clicking Agree, you accept our',
      agreeStartChat: 'Agree & Start Chat',
    },
    'Arabic': {
      online: 'متصل',
      offline: 'غير متصل',
      justNow: 'الآن',
      replyPlaceholder: 'الرد ...',
      title: 'محادثة مباشرة',
      duringHoursPlaceholder: 'مرحباً! كيف يمكننا مساعدتك اليوم؟',
      afterHoursPlaceholder: 'اترك رسالتك وسيرد عليك أحد أعضاء فريق الدعم لدينا!',
      taglinePlaceholder: 'مرحباً! نحن هنا للمساعدة.',
      poweredBy: 'مدعوم بواسطة مقسم',
      preChatFormTitle: 'يرجى ملء النموذج لبدء المحادثة',
      nameLabel: 'الاسم',
      namePlaceholder: 'اسمك',
      emailLabel: 'البريد الإلكتروني',
      emailPlaceholder: 'your@email.com',
      phoneLabel: 'رقم الهاتف',
      phonePlaceholder: '+1 (555) 000-0000',
      startChat: 'بدء المحادثة',
      iAgreeToThe: 'أوافق على',
      privacyPolicy: 'سياسة الخصوصية',
      termsOfUse: 'شروط الاستخدام',
      and: 'و',
      byClickingAgree: 'بالنقر على موافق، فإنك تقبل',
      agreeStartChat: 'موافق وبدء المحادثة',
    },
    'Spanish': {
      online: 'En línea',
      offline: 'Desconectado',
      justNow: 'Justo ahora',
      replyPlaceholder: 'Responder ...',
      title: 'Chat en vivo',
      duringHoursPlaceholder: '¡Hola! ¿Cómo podemos ayudarte hoy?',
      afterHoursPlaceholder: 'Actualmente estamos desconectados. ¡Déjanos un mensaje!',
      taglinePlaceholder: '¡Bienvenido! Estamos aquí para ayudar.',
      poweredBy: 'Desarrollado por Maqsam',
      preChatFormTitle: 'Por favor complete el formulario para comenzar a chatear',
      nameLabel: 'Nombre',
      namePlaceholder: 'Tu nombre',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'tu@email.com',
      phoneLabel: 'Número de teléfono',
      phonePlaceholder: '+34 600 000 000',
      startChat: 'Iniciar chat',
      iAgreeToThe: 'Acepto la',
      privacyPolicy: 'Política de privacidad',
      termsOfUse: 'Términos de uso',
      and: 'y',
      byClickingAgree: 'Al hacer clic en Aceptar, aceptas nuestra',
      agreeStartChat: 'Aceptar e iniciar chat',
    },
    'French': {
      online: 'En ligne',
      offline: 'Hors ligne',
      justNow: 'À l\'instant',
      replyPlaceholder: 'Répondre ...',
      title: 'Chat en direct',
      duringHoursPlaceholder: 'Bonjour! Comment pouvons-nous vous aider aujourd\'hui?',
      afterHoursPlaceholder: 'Nous sommes actuellement hors ligne. Laissez-nous un message!',
      taglinePlaceholder: 'Bienvenue! Nous sommes là pour vous aider.',
      poweredBy: 'Propulsé par Maqsam',
      preChatFormTitle: 'Veuillez remplir le formulaire pour commencer à discuter',
      nameLabel: 'Nom',
      namePlaceholder: 'Votre nom',
      emailLabel: 'E-mail',
      emailPlaceholder: 'votre@email.com',
      phoneLabel: 'Numéro de téléphone',
      phonePlaceholder: '+33 6 00 00 00 00',
      startChat: 'Démarrer le chat',
      iAgreeToThe: 'J\'accepte la',
      privacyPolicy: 'Politique de confidentialité',
      termsOfUse: 'Conditions d\'utilisation',
      and: 'et',
      byClickingAgree: 'En cliquant sur Accepter, vous acceptez notre',
      agreeStartChat: 'Accepter et démarrer le chat',
    },
    'German': {
      online: 'Online',
      offline: 'Offline',
      justNow: 'Gerade eben',
      replyPlaceholder: 'Antworten ...',
      title: 'Live-Chat',
      duringHoursPlaceholder: 'Hallo! Wie können wir Ihnen heute helfen?',
      afterHoursPlaceholder: 'Wir sind derzeit offline. Hinterlassen Sie uns eine Nachricht!',
      taglinePlaceholder: 'Willkommen! Wir sind hier, um zu helfen.',
      poweredBy: 'Bereitgestellt von Maqsam',
      preChatFormTitle: 'Bitte füllen Sie das Formular aus, um mit dem Chat zu beginnen',
      nameLabel: 'Name',
      namePlaceholder: 'Ihr Name',
      emailLabel: 'E-Mail',
      emailPlaceholder: 'ihre@email.com',
      phoneLabel: 'Telefonnummer',
      phonePlaceholder: '+49 000 0000000',
      startChat: 'Chat starten',
      iAgreeToThe: 'Ich stimme zu',
      privacyPolicy: 'Datenschutzrichtlinie',
      termsOfUse: 'Nutzungsbedingungen',
      and: 'und',
      byClickingAgree: 'Durch Klicken auf Akzeptieren akzeptieren Sie unsere',
      agreeStartChat: 'Akzeptieren und Chat starten',
    },
    'Italian': {
      online: 'Online',
      offline: 'Offline',
      justNow: 'Proprio ora',
      replyPlaceholder: 'Rispondi ...',
      title: 'Chat dal vivo',
      duringHoursPlaceholder: 'Ciao! Come possiamo aiutarti oggi?',
      afterHoursPlaceholder: 'Siamo attualmente offline. Lasciaci un messaggio!',
      taglinePlaceholder: 'Benvenuto! Siamo qui per aiutare.',
      poweredBy: 'Offerto da Maqsam',
      preChatFormTitle: 'Si prega di compilare il modulo per iniziare a chattare',
      nameLabel: 'Nome',
      namePlaceholder: 'Il tuo nome',
      emailLabel: 'Email',
      emailPlaceholder: 'tua@email.com',
      phoneLabel: 'Numero di telefono',
      phonePlaceholder: '+39 000 0000000',
      startChat: 'Inizia chat',
      iAgreeToThe: 'Accetto la',
      privacyPolicy: 'Informativa sulla privacy',
      termsOfUse: 'Termini di utilizzo',
      and: 'e',
      byClickingAgree: 'Facendo clic su Accetta, accetti la nostra',
      agreeStartChat: 'Accetta e inizia la chat',
    },
    'Portuguese': {
      online: 'Online',
      offline: 'Offline',
      justNow: 'Agora mesmo',
      replyPlaceholder: 'Responder ...',
      title: 'Chat ao vivo',
      duringHoursPlaceholder: 'Olá! Como podemos ajudá-lo hoje?',
      afterHoursPlaceholder: 'Estamos offline no momento. Deixe-nos uma mensagem!',
      taglinePlaceholder: 'Bem-vindo! Estamos aqui para ajudar.',
      poweredBy: 'Desenvolvido por Maqsam',
      preChatFormTitle: 'Por favor, preencha o formulário para começar a conversar',
      nameLabel: 'Nome',
      namePlaceholder: 'Seu nome',
      emailLabel: 'E-mail',
      emailPlaceholder: 'seu@email.com',
      phoneLabel: 'Número de telefone',
      phonePlaceholder: '+55 00 00000-0000',
      startChat: 'Iniciar chat',
      iAgreeToThe: 'Eu concordo com a',
      privacyPolicy: 'Política de Privacidade',
      termsOfUse: 'Termos de Uso',
      and: 'e',
      byClickingAgree: 'Ao clicar em Aceitar, você aceita nossa',
      agreeStartChat: 'Aceitar e iniciar chat',
    },
    'Russian': {
      online: 'Онлайн',
      offline: 'Оффлайн',
      justNow: 'Только что',
      replyPlaceholder: 'Ответить ...',
      title: 'Онлайн-чат',
      duringHoursPlaceholder: 'Здравствуйте! Как мы можем помочь вам сегодня?',
      afterHoursPlaceholder: 'Мы сейчас не в сети. Оставьте нам сообщение!',
      taglinePlaceholder: 'Добро пожаловать! Мы здесь, чтобы помочь.',
      poweredBy: 'Работает на Maqsam',
      preChatFormTitle: 'Пожалуйста, заполните форму, чтобы начать чат',
      nameLabel: 'Имя',
      namePlaceholder: 'Ваше имя',
      emailLabel: 'Электронная почта',
      emailPlaceholder: 'ваша@почта.com',
      phoneLabel: 'Номер телефона',
      phonePlaceholder: '+7 000 000-00-00',
      startChat: 'Начать чат',
      iAgreeToThe: 'Я согласен с',
      privacyPolicy: 'Политикой конфиденциальности',
      termsOfUse: 'Условиями использования',
      and: 'и',
      byClickingAgree: 'Нажимая Принять, вы принимаете нашу',
      agreeStartChat: 'Принять и начать чат',
    },
    'Chinese': {
      online: '在线',
      offline: '离线',
      justNow: '刚刚',
      replyPlaceholder: '回复 ...',
      title: '在线聊天',
      duringHoursPlaceholder: '您好！今天我们能为您做些什么？',
      afterHoursPlaceholder: '我们目前离线。给我们留言吧！',
      taglinePlaceholder: '欢迎！我们随时为您服务。',
      poweredBy: '技术支持 Maqsam',
      preChatFormTitle: '请填写表格开始聊天',
      nameLabel: '姓名',
      namePlaceholder: '您的姓名',
      emailLabel: '电子邮件',
      emailPlaceholder: 'your@email.com',
      phoneLabel: '电话号码',
      phonePlaceholder: '+86 000 0000 0000',
      startChat: '开始聊天',
      iAgreeToThe: '我同意',
      privacyPolicy: '隐私政策',
      termsOfUse: '使用条款',
      and: '和',
      byClickingAgree: '点击同意即表示您接受我们的',
      agreeStartChat: '同意并开始聊天',
    },
    'Japanese': {
      online: 'オンライン',
      offline: 'オフライン',
      justNow: 'たった今',
      replyPlaceholder: '返信 ...',
      title: 'ライブチャット',
      duringHoursPlaceholder: 'こんにちは！今日はどのようにお手伝いできますか？',
      afterHoursPlaceholder: '現在オフラインです。メッセージを残してください！',
      taglinePlaceholder: 'ようこそ！お手伝いします。',
      poweredBy: '提供 Maqsam',
      preChatFormTitle: 'チャットを開始するにはフォームに記入してください',
      nameLabel: '名前',
      namePlaceholder: 'お名前',
      emailLabel: 'メールアドレス',
      emailPlaceholder: 'your@email.com',
      phoneLabel: '電話番号',
      phonePlaceholder: '+81 00-0000-0000',
      startChat: 'チャットを開始',
      iAgreeToThe: '同意します',
      privacyPolicy: 'プライバシーポリシー',
      termsOfUse: '利用規約',
      and: 'と',
      byClickingAgree: '同意をクリックすることにより、当社の',
      agreeStartChat: '同意してチャットを開始',
    },
  };

  // Get translation for current language
  const getTranslation = (key: string): string => {
    return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['English'][key];
  };

  // Get text for the current language
  const getPreviewText = (textObj: { [language: string]: string }): string => {
    // Only return text if it exists for the current language, otherwise return empty string
    // This allows fallback to translated placeholders
    return textObj[currentLanguage] || '';
  };

  const previewTitle = getPreviewText(formData.title) || getTranslation('title');
  const previewHeading = getPreviewText(formData.welcomeHeading) || 'Hello! 👋';
  const previewTagline = getPreviewText(formData.welcomeTagline) || getTranslation('taglinePlaceholder');
  const previewDuringWorkingHoursMessage = getPreviewText(formData.duringWorkingHoursMessage) || getTranslation('duringHoursPlaceholder');
  const previewAfterWorkingHoursMessage = getPreviewText(formData.afterWorkingHoursMessage) || getTranslation('afterHoursPlaceholder');
  const displayMessage = isDuringWorkingHours ? previewDuringWorkingHoursMessage : previewAfterWorkingHoursMessage;

  return (
    <div className="relative h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">Live Chat Widget Preview</div>
        {/* Working Hours Toggle */}
        <div className="flex items-center gap-2">
          <Label htmlFor="working-hours-toggle" className="text-xs text-gray-600">
            {isDuringWorkingHours ? 'During Hours' : 'After Hours'}
          </Label>
          <Switch
            id="working-hours-toggle"
            checked={isDuringWorkingHours}
            onCheckedChange={setIsDuringWorkingHours}
          />
        </div>
      </div>
      
      {/* Preview Container */}
      <div className="relative bg-white rounded-lg shadow-lg h-[calc(100vh-200px)] min-h-[600px] overflow-hidden">
        {/* Simulated Website Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[16px] p-[0px] m-[0px]">
          <p className="text-gray-400 text-sm">Your Website</p>
        </div>

        {/* Chat Widget - Position based on configuration */}
        <div className={`absolute bottom-6 z-10 flex flex-col gap-3 pt-[0px] pb-[100px] ${formData.position === 'bottom-left' ? 'left-6 items-start' : 'right-6 items-end'}`}>
          {/* Chat Window */}
          {isExpanded && (
            <div className="w-80 bg-white rounded-lg shadow-2xl overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
              {/* Header */}
              <div
                className="p-4 text-white flex items-center justify-between"
                style={{ backgroundColor: formData.color }}
              >
                <div className="flex items-center gap-3">
                  {formData.displayPicture ? (
                    <img 
                      src={formData.displayPicture} 
                      alt="Logo" 
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                  )}
                  <div className={isRTL ? 'text-right' : ''}>
                    <div className="font-medium">{previewTitle}</div>
                    {formData.showStatus && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className={`w-2 h-2 rounded-full ${isDuringWorkingHours ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-xs opacity-90">{isDuringWorkingHours ? getTranslation('online') : getTranslation('offline')}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => setIsExpanded(false)} className="hover:bg-white/10 p-1 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {/* Pre-chat Form */}
                  {formData.preChatFormEnabled && formData.preChatFormFields.length > 0 ? (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className={`text-sm mb-3 ${isRTL ? 'text-right' : ''}`}>{getTranslation('preChatFormTitle')}</p>
                      <div className="space-y-3">
                        {formData.preChatFormFields.includes('name') && (
                          <div>
                            <label className={`text-xs text-gray-600 ${isRTL ? 'text-right block' : ''}`}>{getTranslation('nameLabel')}</label>
                            <input
                              type="text"
                              className={`w-full mt-1 px-2 py-1 text-xs border border-gray-300 rounded ${isRTL ? 'text-right' : ''}`}
                              placeholder={getTranslation('namePlaceholder')}
                              disabled
                            />
                          </div>
                        )}
                        {formData.preChatFormFields.includes('email') && (
                          <div>
                            <label className={`text-xs text-gray-600 ${isRTL ? 'text-right block' : ''}`}>{getTranslation('emailLabel')}</label>
                            <input
                              type="email"
                              className={`w-full mt-1 px-2 py-1 text-xs border border-gray-300 rounded ${isRTL ? 'text-right' : ''}`}
                              placeholder={getTranslation('emailPlaceholder')}
                              disabled
                            />
                          </div>
                        )}
                        {formData.preChatFormFields.includes('phone') && (
                          <div>
                            <label className={`text-xs text-gray-600 ${isRTL ? 'text-right block' : ''}`}>{getTranslation('phoneLabel')}</label>
                            <input
                              type="tel"
                              className={`w-full mt-1 px-2 py-1 text-xs border border-gray-300 rounded ${isRTL ? 'text-right' : ''}`}
                              placeholder={getTranslation('phonePlaceholder')}
                              disabled
                            />
                          </div>
                        )}
                        {formData.privacyPolicyEnabled && (formData.privacyPolicyUrl || formData.termsOfUseUrl) && (
                          <div className="flex items-start gap-2 pt-2">
                            <input
                              type="checkbox"
                              className="mt-0.5"
                              disabled
                            />
                            <label className="text-xs text-gray-600">
                              {getTranslation('iAgreeToThe')}{' '}
                              {formData.privacyPolicyUrl && (
                                <a href="#" className="hover:underline" style={{ color: formData.color }}>
                                  {getTranslation('privacyPolicy')}
                                </a>
                              )}
                              {formData.privacyPolicyUrl && formData.termsOfUseUrl && ' ' + getTranslation('and') + ' '}
                              {formData.termsOfUseUrl && (
                                <a href="#" className="hover:underline" style={{ color: formData.color }}>
                                  {getTranslation('termsOfUse')}
                                </a>
                              )}
                            </label>
                          </div>
                        )}
                        <button
                          className="px-6 py-1.5 text-xs text-white rounded mx-auto block"
                          style={{ backgroundColor: formData.color }}
                          disabled
                        >
                          {getTranslation('startChat')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Welcome Section */}
                      <div className="bg-white rounded-lg p-5 shadow-sm text-center">
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">{previewHeading}</h3>
                        <p className="text-sm text-gray-600">{previewTagline || displayMessage}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                {formData.privacyPolicyEnabled && (formData.privacyPolicyUrl || formData.termsOfUseUrl) && !(formData.preChatFormEnabled && formData.preChatFormFields.length > 0) && !hasAgreed ? (
                  <div className="space-y-3">
                    <div className="text-xs text-gray-600 text-center">
                      {getTranslation('byClickingAgree')}{' '}
                      {formData.privacyPolicyUrl && (
                        <a href="#" className="hover:underline" style={{ color: formData.color }}>
                          {getTranslation('privacyPolicy')}
                        </a>
                      )}
                      {formData.privacyPolicyUrl && formData.termsOfUseUrl && ' ' + getTranslation('and') + ' '}
                      {formData.termsOfUseUrl && (
                        <a href="#" className="hover:underline" style={{ color: formData.color }}>
                          {getTranslation('termsOfUse')}
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => setHasAgreed(true)}
                      className="w-full py-2 text-sm text-white rounded text-center"
                      style={{ backgroundColor: formData.color }}
                    >
                      {getTranslation('agreeStartChat')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 text-sm outline-none border border-gray-300 rounded-full px-4 py-2.5"
                    disabled
                  />
                    <button
                      className="p-2.5 rounded-full"
                      style={{ backgroundColor: formData.color }}
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
              </div>

              {/* Footer - Powered by Maqsam */}
              <div className="px-4 py-2 bg-[rgb(255,255,255)] border-t border-gray-200">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-xs text-gray-500">{getTranslation('poweredBy')}</span>
                  <img src={maqsamLogo} alt="Maqsam" className="h-3" />
                </div>
              </div>
            </div>
          )}

          {/* Floating Chat Icon - Always visible */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-[60px] h-[60px] rounded-full text-white shadow-2xl hover:scale-105 transition-transform flex items-center justify-center shrink-0"
            style={{ backgroundColor: formData.color }}
          >
            <MessageCircle className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
}
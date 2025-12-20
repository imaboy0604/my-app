// 面接対策アプリ - メインロジック
// セキュリティ対応版: APIキーを削除し、Vercel Serverless Functions経由に変更

// ==========================================
// ▼▼▼ 設定エリア ▼▼▼

// 1. Gemini APIキー (削除済み: サーバー側で管理)
// const GEMINI_API_KEY = "削除"; 

// 2. AIモデル名 (サーバー側で設定)
// const AI_MODEL_NAME = "gemini-2.5-flash";

// 3. Google Apps Script URL (最新版)
const GAS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwCCfT37DBDDbzCyflow2bNcJV4q4GGLp9JGBu3ab72CtkyPWAk6zn5Zu6jRHlHX2ZCvA/exec";

// ==========================================

const ICONS = {
    Target: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    Briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    User: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    Users: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    Zap: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    MessageCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    Lightbulb: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="17"/><path d="M5 12h14"/><path d="M12 5l7 7-7 7-7-7 7-7z"/></svg>`,
    Search: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    X: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    CheckCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    AlertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    Save: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
    PenTool: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`,
    Calculator: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="16" y1="18" x2="16" y2="18"/><line x1="12" y1="18" x2="12" y2="18"/><line x1="8" y1="18" x2="8" y2="18"/></svg>`,
    RefreshCw: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
    ChevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
    ChevronUp: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`,
    GraduationCap: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    Play: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    Pause: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
    RotateCcw: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`,
    Plus: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    Sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>`,
    Loader2: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
    Download: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    Send: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    History: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>`,
    Edit: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    Cloud: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19"/><path d="M20.61 15.75c1.6-1.13 2.39-2.95 1.67-4.84-.7-1.83-2.46-2.91-4.39-2.91H16c-.27-2.61-2.36-4.67-4.99-4.93-3.32-.33-6.01 2.33-6.01 5.65v.35c-2.46.24-4.33 2.33-4.33 4.92 0 2.76 2.24 5 5 5h2.5"/></svg>`,
    BookOpen: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    Lock: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
};

const STRATEGY_ADVICE = {
    title: "💡 攻略戦略アドバイス",
    content: "リクルートでの「営業×AI活用（エンジニアへの越境）」のエピソードは非常に強力です。これは【カテゴリ2：実績】と【カテゴリ4：PM適性】の最強の武器になります。一方で、【カテゴリ1：志望動機】の「なぜTSか」は論理武装が必須です。",
    highlights: ["営業×AI活用", "エンジニアへの越境", "論理的志望動機"]
};

const INITIAL_CATEGORIES = [
    { id: 1, title: "志望動機・キャリア軸", subtitle: "Why Now, Why TS?", icon: "Target", color: "bg-blue-600", description: "ここでの矛盾は致命傷。「なぜ本体ではなくシステムズか」の論理武装が鍵。", questions: [
        { no: "1-1", q: "自己紹介と、これまでの経歴を簡潔にお話しください。", intent: "プレゼン能力、要約力、第一印象。", important: true },
        { no: "1-2", q: "なぜ、今のタイミングで転職を考えたのですか？", intent: "逃げの転職ではないか？現状を変えるアクションを起こしたか？", important: false },
        { no: "1-3", q: "数あるIT企業の中で、なぜトヨタシステムズなのですか？", intent: "競合（NTTデータ、アクセンチュア等）との差別化ができているか。", important: true },
        { no: "1-4", q: "トヨタ自動車（本体）ではなく、なぜ当社なのですか？", intent: "TS固有の役割（内販、ユーザー系、現場実装まで担う）を理解しているか。", important: true }
    ]},
    { id: 2, title: "経験・実績・スキル", subtitle: "Can You Do It?", icon: "Briefcase", color: "bg-indigo-600", description: "リクルートでの「AI活用」「営業プロセス改善」の実績を再現性のあるスキルとして伝える。", questions: [
        { no: "2-1", q: "現職で最も成果を上げたプロジェクト（取り組み）は何ですか？", intent: "課題設定のレベル感、巻き込んだ範囲、定量的成果。", important: true },
        { no: "2-2", q: "その成果を上げる中で、最大の壁（困難）は何でしたか？", intent: "ストレス耐性、問題解決のアプローチ手法。", important: false },
        { no: "2-3", q: "AI活用や業務改善は、周囲をどう巻き込んで進めましたか？", intent: "PM適性（推進力）。抵抗勢力をどう説得したか。", important: true }
    ]},
    { id: 3, title: "行動特性・コンピテンシー", subtitle: "Toyota Way Fit", icon: "User", color: "bg-emerald-600", description: "トヨタが好む「泥臭さ」「現地現物」「Whyの追求」を持っているか。", questions: [
        { no: "3-1", q: "周囲と意見が対立した際、どのように解決しますか？", intent: "協調性と主張のバランス、合意形成力。", important: false },
        { no: "3-2", q: "「泥臭い」仕事や調整業務も多いですが、大丈夫ですか？", intent: "覚悟の確認。キラキラしたDXのイメージだけで来ていないか。", important: true },
        { no: "3-3", q: "失敗した経験と、そこから何を学んだか教えてください。", intent: "素直さ、内省力、カイゼン（再発防止）の思考回路。", important: false }
    ]},
    { id: 4, title: "PM適性・マネジメント", subtitle: "Potential", icon: "Users", color: "bg-orange-600", description: "PM候補・DX推進としての採用目線。技術力以上にここが見られる。", questions: [
        { no: "4-1", q: "チームで成果を出すために、あなたが大切にしていることは？", intent: "リーダーシップのスタイル、フォロワーシップ。", important: true },
        { no: "4-2", q: "納期遅れやトラブル発生時、まず最初に何をしますか？", intent: "危機管理能力、報告・連絡・相談（ホウレンソウ）の基本。", important: false },
        { no: "4-3", q: "ユーザー（顧客）の要望が技術的に難しい場合、どうしますか？", intent: "折衝力、代替案の提案力、顧客志向（御用聞きにならないか）。", important: true }
    ]},
    { id: 5, title: "キャリアビジョン", subtitle: "Future", icon: "Zap", color: "bg-purple-600", description: "長期的な視点と、会社への定着性・貢献イメージ。", questions: [
        { no: "5-1", q: "入社後、具体的にどのような業務に携わりたいですか？", intent: "配属希望（MI-1など）とのマッチング、業務理解度。", important: false },
        { no: "5-2", q: "5年後、どのような人材になっていたいですか？", intent: "成長意欲、長期就業の可能性。", important: false }
    ]},
    { id: 6, title: "逆質問", subtitle: "Engagement", icon: "MessageCircle", color: "bg-slate-600", description: "最後のチャンス。志望度の高さと地頭の良さをアピール。", questions: [
        { no: "6-1", q: "最後に、何か質問はありますか？", intent: "志望度の高さ、企業研究の深さ、地頭の良さ。", important: true }
    ]}
];

const EVALUATION_FIELDS = [
    { id: 'will', title: '分野A：Will (志望度・熱意)', color: 'text-blue-600', bgColor: 'bg-blue-600', lightBg: 'bg-blue-100', criteria: [ { id: 'logic', label: '志望動機・ロジック (Why TS)' }, { id: 'vision', label: 'キャリアビジョン・将来性' }, { id: 'passion', label: '熱意・逆質問の質' } ] },
    { id: 'can', title: '分野B：Can (能力・再現性)', color: 'text-indigo-600', bgColor: 'bg-indigo-600', lightBg: 'bg-indigo-100', criteria: [ { id: 'achievement', label: '業務実績・成果の再現性' }, { id: 'pm', label: 'PM適性・リーダーシップ' }, { id: 'logical', label: '論理的思考力・地頭の良さ' } ] },
    { id: 'culture', title: '分野C：Culture (人柄・印象)', color: 'text-emerald-600', bgColor: 'bg-emerald-600', lightBg: 'bg-emerald-100', criteria: [ { id: 'behavior', label: '行動特性・泥臭さへの耐性' }, { id: 'communication', label: '対話力・キャッチボール' }, { id: 'impression', label: '第一印象・マナー・表情' }, { id: 'sincerity', label: '素直さ・誠実さ (Toyota Way)' } ] }
];

// --- 安全なJSONパース関数 ---
const safeJSONParse = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.error(`Error parsing ${key}:`, e);
        return fallback;
    }
};

// --- 状態管理 ---
const state = {
    categories: safeJSONParse('interview_categories', INITIAL_CATEGORIES),
    feedback: safeJSONParse('interview_feedback', {}),
    scores: safeJSONParse('interview_scores', { logic: 5, vision: 5, passion: 5, achievement: 5, pm: 5, logical: 5, behavior: 5, communication: 5, impression: 5, sincerity: 5 }),
    history: safeJSONParse('interview_history_log', []),
    interviewerName: localStorage.getItem('interview_interviewer_name') || "",
    sessionCount: localStorage.getItem('interview_session_count') || "1",
    overallFeedback: localStorage.getItem('interview_overall_feedback') || "",
    answers: {},
    isCandidateMode: false,
    startupModalOpen: true,
    selectedCategory: null,
    selectedQuestion: null,
    timer: 0,
    timerActive: false,
    timerInterval: null,
    isScoringOpen: true,
    aiModalOpen: false,
    aiInput: "",
    aiLoading: false,
    aiError: null,
    sending: false,
    calculations: { total: 0, judgment: "", judgmentColor: "" },
    confirmModal: { isOpen: false, message: "", actionName: null },
    aiAnswerModal: { isOpen: false, questionText: "", qNo: null },
    bulkAnswerModal: { isOpen: false }, // 未回答一覧モーダル用
    editAnswerModal: { isOpen: false, questionText: "", currentAnswer: "", qNo: null, aiImproving: false, aiImproveError: null },
    errorLog: "",
    isLoadingSettings: false,
    // ミラーモード用
    mirrorMode: false,
    mirrorQuestions: [],
    currentQuestionIndex: 0,
    countdownTimer: 20,
    countdownActive: false,
    countdownInterval: null,
    cameraStream: null,
    showCheatSheet: false,
    mirrorPhase: 'waiting', // 'waiting', 'ready', 'question', 'review', 'complete'
    mirrorQuestionMode: 'random', // 'random' or 'manual'
    mirrorSelectedQuestions: [], // 手動選択モード用
    mirrorSelectionModalOpen: false, // 質問選択モーダル
    mirrorReviewData: {
        currentQuestionNo: null,
        aiAnswerInput: '',
        aiAnswerLoading: false,
        aiAnswerError: null,
        feedbackGood: '',
        feedbackMore: '',
        speechTranscription: '' // 文字起こし結果
    },
    speechRecognition: {
        isActive: false,
        isSupported: false,
        recognition: null,
        transcribedText: '',
        interimText: '',
        errorMessage: null
    }
};

// --- 初期化チェック ---
function initData() {
    if (!localStorage.getItem('interview_categories')) {
        localStorage.setItem('interview_categories', JSON.stringify(INITIAL_CATEGORIES));
    }
}
initData();

window.onerror = function(message, source, lineno, colno, error) {
    state.errorLog = `System Error: ${message}`;
    renderApp();
    return true;
};

function renderHeader() {
    return `
        <header class="neo-card sticky top-0 z-30 px-4 py-4 sm:px-6 sm:py-5 mb-4 sm:mb-6">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="flex items-center gap-3 w-full sm:w-auto">
                    <div class="neo-btn neo-card-inset p-2.5 text-red-500 font-bold tracking-tighter">TS</div>
                    <div>
                        <h1 class="text-xl font-extrabold text-slate-800">面接攻略地図 & 評価シート</h1>
                        <p class="text-xs text-slate-500 flex items-center gap-2 mt-1">
                            AI搭載・完全対策版 (V18 Concise)
                            ${state.isCandidateMode ? '<span class="neo-chip text-purple-700">今ボーイ</span>' : ''}
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button onclick="handleSaveImage()" class="neo-btn flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-bold text-slate-700 px-3 py-2.5 cursor-pointer">
                        ${ICONS.Download} スクショ保存
                      </button>
                      <button id="sendBtn" onclick="openConfirmModal('現在のフィードバックをスプレッドシートに送信しますか？\\n（送信後、データはリセットされ、履歴に保存されます）', 'send')" class="neo-btn-primary flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer">
                        ${state.sending ? ICONS.Loader2 : ICONS.Send} ${state.sending ? '送信中...' : 'シートへ送信'}
                      </button>
                </div>
            </div>
            ${state.interviewerName ? `
            <div class="flex flex-wrap sm:flex-nowrap justify-start sm:justify-end items-center gap-3 text-[11px] font-bold text-slate-600 pt-3 mt-3">
                <div class="neo-chip flex items-center gap-2">
                    ${ICONS.User} ${state.isCandidateMode ? '受験者' : '面接官'}: ${state.interviewerName}
                </div>
                <div class="neo-chip flex items-center gap-2">
                    ${ICONS.Briefcase} 第${state.sessionCount}回 練習
                </div>
                ${state.isLoadingSettings ? `<div class="neo-chip text-amber-600 animate-pulse">${ICONS.Cloud} 復元中...</div>` : `<div class="neo-chip text-emerald-600">${ICONS.CheckCircle} 準備OK</div>`}
            </div>
            ` : ''}
        </header>
    `;
}

function renderConfirmModal() {
    if (!state.confirmModal.isOpen) return '';
    return `
        <div class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onclick="closeConfirmModal()">
            <div class="neo-modal w-full max-w-sm p-6 text-center" onclick="event.stopPropagation()">
                <div class="neo-modal-header pb-3 mb-4 flex items-center justify-between">
                    <h3 class="font-bold text-lg text-slate-800">確認</h3>
                    <button class="neo-btn neo-close p-2" onclick="closeConfirmModal()">${ICONS.X}</button>
                </div>
                <p class="text-slate-600 mb-6 text-sm leading-relaxed whitespace-pre-wrap">${state.confirmModal.message}</p>
                <div class="flex gap-3 justify-center">
                    <button onclick="closeConfirmModal()" class="neo-btn px-5 py-3 font-bold text-slate-700 cursor-pointer">キャンセル</button>
                    <button onclick="executeConfirmAction()" class="neo-btn-primary px-5 py-3 font-bold cursor-pointer">OK</button>
                </div>
            </div>
        </div>
    `;
}

function renderStrategy() {
    return `
        <div class="neo-card relative overflow-hidden p-5 sm:p-6">
            <div class="absolute top-0 right-0 p-8 opacity-20 scale-150">${ICONS.Target}</div>
            <div class="relative z-10 space-y-3">
                <div class="neo-chip inline-flex items-center gap-2 text-amber-700">${ICONS.Lightbulb} 戦略メモ</div>
                <h3 class="text-lg font-bold text-slate-800">${STRATEGY_ADVICE.title}</h3>
                <p class="text-slate-700 leading-relaxed text-sm sm:text-base">${STRATEGY_ADVICE.content}</p>
                <div class="flex flex-wrap gap-2">
                    ${STRATEGY_ADVICE.highlights.map(tag => `<span class="neo-chip">#${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderMirrorModeButton() {
    return `
        <div class="neo-card overflow-hidden p-5 sm:p-6 mb-4 sm:mb-6">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <div class="neo-btn neo-card-inset p-2.5 text-purple-600">${ICONS.User}</div>
                        <h2 class="font-bold text-lg text-slate-800">一人ロープレ・ミラーモード</h2>
                    </div>
                    <p class="text-sm text-slate-600 leading-relaxed">自分の顔を鏡のように見ながら、20秒で端的に答える反復練習モード</p>
                </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
                <button onclick="openMirrorModeSelection('random')" class="neo-btn-primary flex-1 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
                    ${ICONS.Zap} ランダムモード
                </button>
                <button onclick="openMirrorModeSelection('manual')" class="neo-btn flex-1 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] text-slate-700">
                    ${ICONS.Target} 手動選択モード
                </button>
            </div>
        </div>
    `;
}

function renderMap() {
    const nodes = state.categories.map((cat) => {
        return `
            <div class="relative">
                <button onclick="openCategory(${cat.id})"
                    class="w-full flex flex-col items-start neo-card hover:shadow-xl transition-all duration-200 group text-left min-h-[120px] z-10 cursor-pointer active:scale-[0.99] p-4">
                    <div class="flex items-center gap-3 mb-3 w-full">
                        <div class="neo-btn neo-card-inset p-3 rounded-2xl text-slate-700 group-hover:scale-105 transition-transform shrink-0">
                            ${ICONS[cat.icon] || ICONS.Target}
                        </div>
                        <div class="flex-1">
                            <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">${cat.subtitle}</div>
                            <h3 class="font-bold text-slate-800 leading-snug text-lg">${cat.title}</h3>
                        </div>
                        <span class="neo-chip text-slate-600">
                            ${cat.questions.length}問
                        </span>
                    </div>
                    <p class="text-xs text-slate-500 leading-relaxed line-clamp-2">${cat.description}</p>
                </button>
            </div>
        `;
    }).join('');

    const aiButton = `
        <div class="floating-actions safe-area mt-4 sm:mt-6 rounded-3xl">
            <button onclick="openAiModal()" class="w-full neo-btn-primary p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.01] flex items-center justify-center gap-3 font-bold active:scale-[0.99]">
                <div class="neo-btn neo-card-inset p-2 rounded-full text-white/90 bg-white/10">${ICONS.Plus}</div>
                <div class="flex flex-col items-start text-white">
                    <span class="text-sm">AIを使って新しい質問を追加</span>
                    <span class="text-[11px] opacity-80">Gemini 2.5 Flash</span>
                </div>
                <span class="text-xs bg-white/20 px-2 py-1 rounded text-white/90 font-medium">Add</span>
            </button>
        </div>
    `;

    const candidateButton = state.isCandidateMode ? `
        <div class="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100 text-center">
            <p class="text-sm text-purple-800 font-bold mb-2">💡 未回答の質問がたくさんあります</p>
            <button onclick="openBulkAnswerModal()" class="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-bold shadow-md transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer">
                ${ICONS.Sparkles} AIで回答案を作成する (個別)
            </button>
        </div>
    ` : '';

    return `
        <div class="relative w-full">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                ${nodes}
            </div>
            ${candidateButton}
            ${aiButton}
        </div>
    `;
}

function renderOverallFeedbackInput() {
    return `
        <div class="neo-card overflow-hidden mt-4 sm:mt-6 p-5 sm:p-6">
            <div class="flex items-center gap-2 mb-4 text-slate-800">
                <span class="text-blue-600">${ICONS.Edit}</span>
                <h2 class="font-bold text-lg">総括フィードバック</h2>
            </div>
            <textarea
                id="overall-feedback"
                oninput="updateOverallFeedback(this.value)"
                class="w-full p-4 neo-card-inset border-none rounded-xl focus:ring-2 focus:ring-blue-400 outline-none min-h-[120px] text-sm text-slate-700 leading-relaxed appearance-none"
                placeholder="面接全体の感想、合否の決め手、次回へのアドバイスなどを記入してください...">${state.overallFeedback}</textarea>
        </div>
    `;
}

function renderScoringBoard() {
    let total = 0;
    const fieldScores = {};

    EVALUATION_FIELDS.forEach(field => {
        let fieldTotal = 0;
        let fieldMax = field.criteria.length * 10;
        field.criteria.forEach(c => fieldTotal += (state.scores[c.id] || 0));
        fieldScores[field.id] = { current: fieldTotal, max: fieldMax };
        total += fieldTotal;
    });

    let judgment = "C (要対策)", judgmentColor = "text-red-500";
    if (total >= 90) { judgment = "S (即内定)"; judgmentColor = "text-amber-500"; }
    else if (total >= 80) { judgment = "A (合格圏)"; judgmentColor = "text-green-600"; }
    else if (total >= 60) { judgment = "B (境界線)"; judgmentColor = "text-blue-600"; }

    state.calculations = { total, judgment, judgmentColor };

    const content = state.isScoringOpen ? `
        <div class="p-5 sm:p-6 bg-transparent animate-fade-in">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                <div class="lg:col-span-2 space-y-5 sm:space-y-6">
                    ${EVALUATION_FIELDS.map(field => `
                        <div class="neo-card p-4 sm:p-5">
                            <h3 class="font-bold mb-4 flex justify-between items-center ${field.color}">
                                ${field.title}
                                <span class="neo-chip text-slate-600">
                                    ${fieldScores[field.id].current} / ${fieldScores[field.id].max} pts
                                </span>
                            </h3>
                            <div class="space-y-4">
                                ${field.criteria.map(c => `
                                    <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                                        <label class="sm:col-span-5 text-sm font-medium text-slate-700 mb-1 sm:mb-0">${c.label}</label>
                                        <div class="sm:col-span-5 relative py-1.5 sm:py-0">
                                            <input type="range" min="0" max="10" value="${state.scores[c.id] || 0}"
                                                oninput="updateScore('${c.id}', this.value)"
                                                class="w-full rounded-lg cursor-pointer ${field.lightBg}" />
                                        </div>
                                        <div class="sm:col-span-2 text-right">
                                            <span class="font-bold text-lg w-10 inline-block text-center ${(state.scores[c.id] || 0) >= 8 ? 'text-green-600' : 'text-slate-600'}">
                                                ${state.scores[c.id] || 0}
                                            </span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="lg:col-span-1">
                    <div class="neo-card p-6 sticky top-4">
                        <h3 class="text-center text-slate-500 font-bold mb-2">総合スコア</h3>
                        <div class="text-center mb-6">
                            <span class="text-6xl font-black text-slate-800 tracking-tighter">${total}</span>
                            <span class="text-xl text-slate-400 font-medium">/100</span>
                        </div>
                        <div class="neo-card-inset text-center mb-8 p-4 rounded-xl">
                            <p class="text-xs text-slate-500 mb-1">判定レベル</p>
                            <p class="text-2xl font-bold ${judgmentColor}">${judgment}</p>
                        </div>
                        <button onclick="openConfirmModal('スコアをリセットしますか？', 'reset')" class="w-full py-3 flex items-center justify-center gap-2 text-slate-600 neo-btn text-sm font-medium cursor-pointer">
                            ${ICONS.RefreshCw} スコアをリセット
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ` : '';

    return `
        <div class="neo-card overflow-hidden mt-6 sm:mt-8">
            <div onclick="toggleScoring()" class="neo-card-inset p-4 sm:p-5 flex justify-between items-center cursor-pointer">
                <div class="flex items-center gap-2 sm:gap-3 text-slate-700">
                    <span class="text-amber-500">${ICONS.Calculator}</span>
                    <h2 class="font-bold text-lg">模擬面接 採点シート</h2>
                    <span class="neo-chip text-slate-600 ml-1 font-mono">100点満点</span>
                </div>
                ${state.isScoringOpen ? ICONS.ChevronUp : ICONS.ChevronDown}
            </div>
            ${content}
        </div>
    `;
}

function renderStartupModal() {
    if (!state.startupModalOpen && state.interviewerName) return '';
    return `
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div class="neo-modal w-full max-w-md p-6 text-center my-8">
                <div class="neo-modal-header pb-3 mb-4 flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-slate-800">面接練習を開始します</h2>
                    <button class="neo-btn neo-close p-2" onclick="state.startupModalOpen=false; renderApp();">${ICONS.X}</button>
                </div>
                <p class="text-slate-500 mb-6 text-sm">記録のために、担当者名と回数を入力してください。</p>
                <div class="space-y-4 text-left">
                    <div><label class="block text-sm font-bold text-slate-700 mb-2">面接官の名前</label><input type="text" id="start-name" value="${state.interviewerName}" class="w-full p-3 neo-card-inset rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例：山田 太郎"></div>
                    <div><label class="block text-sm font-bold text-slate-700 mb-2">今回の練習回数</label><div class="flex items-center gap-2"><input type="number" id="start-count" value="${state.sessionCount}" class="w-full p-3 neo-card-inset rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1"><span class="text-slate-500 font-bold">回目</span></div></div>
                </div>
                <button onclick="startSession()" class="w-full mt-8 neo-btn-primary font-bold py-3 px-6 rounded-xl transition-transform hover:scale-[1.01] cursor-pointer">始める</button>
            </div>
        </div>
    `;
}

function renderHistorySection() {
    const myHistory = state.history.filter(h => h.interviewer === state.interviewerName);

    if (myHistory.length === 0) return '';
    const listItems = myHistory.slice().reverse().map((item) => {
        const detailsHtml = item.feedbacks && item.feedbacks.length > 0
            ? item.feedbacks.map(fb => `
                <div class="mb-3 pb-3 border-b border-slate-100 last:border-0 last:mb-0 last:pb-0">
                    <p class="font-bold text-xs text-slate-700 mb-1">Q. ${fb.question}</p>
                    ${fb.good ? `<p class="text-xs text-green-700 bg-green-50 p-1.5 rounded mb-1">👍 ${fb.good}</p>` : ''}
                    ${fb.bad ? `<p class="text-xs text-orange-700 bg-orange-50 p-1.5 rounded">⚠️ ${fb.bad}</p>` : ''}
                </div>
            `).join('')
            : '<p class="text-xs text-slate-400">詳細なフィードバックはありません</p>';

        return `
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden card">
            <details class="group">
                <summary class="p-4 cursor-pointer hover:bg-slate-50 transition-colors select-none">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <div class="flex items-center gap-2 mb-1"><span class="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">第${item.session}回</span><span class="text-xs text-slate-400">${item.date}</span></div>
                            <div class="font-bold text-slate-700 flex items-center gap-2">${ICONS.User} <span class="text-sm">${item.interviewer}</span></div>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-black ${item.judgmentColor}">${item.score}</div>
                            <div class="text-xs font-bold ${item.judgmentColor}">${item.judgment}</div>
                        </div>
                    </div>
                    <div class="flex justify-between items-center text-xs text-slate-500">
                        <span>フィードバック数: ${item.feedbackCount}件</span>
                        <span class="text-blue-500 group-open:rotate-180 transition-transform duration-300">▼ 詳細を見る</span>
                    </div>
                </summary>
                <div class="p-4 bg-slate-50 border-t border-slate-100 text-sm animate-fade-in">
                    <div class="mb-4">
                        <h4 class="font-bold text-slate-800 mb-2 flex items-center gap-2">${ICONS.Edit} 総括フィードバック</h4>
                        <div class="bg-white p-3 rounded border border-slate-200 text-slate-700 whitespace-pre-wrap">${item.overallFeedback || 'なし'}</div>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800 mb-2">各質問へのフィードバック</h4>
                        <div class="bg-white p-3 rounded border border-slate-200">
                            ${detailsHtml}
                        </div>
                    </div>
                </div>
            </details>
        </div>
    `}).join('');
    return `<div class="mt-10 sm:mt-12 mb-6 sm:mb-8 border-t border-slate-200 pt-6 sm:pt-8"><h3 class="text-xl font-bold text-slate-700 flex items-center gap-2 mb-4 sm:mb-6">${ICONS.History} ${state.interviewerName}さんの練習履歴</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4">${listItems}</div></div>`;
}

function renderCategoryModal() {
    if (!state.selectedCategory) return '';
    const cat = state.selectedCategory;
    return `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in" onclick="closeCategory()">
            <div class="neo-modal w-full max-w-3xl" onclick="event.stopPropagation()">
                <div class="neo-modal-header p-6 flex justify-between items-start shrink-0">
                    <div class="flex gap-4 items-center">
                        <div class="neo-btn neo-card-inset p-3 rounded-xl">${ICONS[cat.icon]}</div>
                        <div>
                            <div class="text-sm font-medium text-slate-500 mb-1">${cat.subtitle}</div>
                            <h2 class="text-2xl font-bold text-slate-800">${cat.title}</h2>
                        </div>
                    </div>
                    <button onclick="closeCategory()" class="neo-btn neo-close p-2 rounded-full transition-colors">${ICONS.X}</button>
                </div>
                <div class="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    <p class="text-slate-600 font-medium mb-6 neo-card-inset p-4 rounded-lg flex items-start gap-3">
                        <span class="text-amber-500 shrink-0 mt-0.5">${ICONS.Lightbulb}</span>${cat.description}
                    </p>
                    <div class="space-y-4">
                        ${cat.questions.map((q) => {
                            const fb = state.feedback[q.no];
                            const hasFb = fb && (fb.good || fb.advice);
                            const hasAnswer = state.answers[q.q] && state.answers[q.q].trim().length > 0;
                            const badgePositions = [];
                            if (q.important) badgePositions.push('right-0');
                            if (hasFb) badgePositions.push(q.important ? 'right-28' : 'right-0');
                            if (!hasAnswer) badgePositions.push(hasFb ? (q.important ? 'right-56' : 'right-28') : (q.important ? 'right-28' : 'right-0'));
                            
                            return `
                                <div onclick="openQuestion('${q.no}')" class="group relative bg-white p-5 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer active:scale-[0.99] ${q.important ? 'border-red-100 ring-1 ring-red-100' : 'border-slate-100 hover:border-blue-200'}">
                                    ${q.important ? '<span class="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">最重要</span>' : ''}
                                    ${hasFb ? `<span class="absolute -top-3 ${q.important ? 'right-28' : '-right-3'} bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 z-10"><span class="w-3 h-3">${ICONS.CheckCircle}</span> 評価済</span>` : ''}
                                    ${!hasAnswer ? `<span class="absolute -top-3 ${hasFb ? (q.important ? 'right-56' : 'right-28') : (q.important ? 'right-28' : '-right-3')} bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">回答未記入</span>` : ''}
                                    <div class="flex gap-4 items-start">
                                        <div class="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm ${q.important ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}">${q.no}</div>
                                        <div class="flex-1">
                                            <h3 class="font-bold text-lg mb-2 ${q.important ? 'text-slate-800' : 'text-slate-700'} group-hover:text-blue-700 transition-colors">${q.q}</h3>
                                            <div class="flex items-start gap-2 text-sm text-slate-500 bg-slate-50 p-2 rounded mb-2">
                                                <span class="text-blue-400 w-4 mt-0.5">${ICONS.Search}</span><span>狙い：${q.intent}</span>
                                            </div>
                                            ${hasFb ? `
                                                <div class="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                                                    ${fb.good ? `<div class="text-green-700 bg-green-50 p-2 rounded"><span class="font-bold">Good:</span> ${fb.good.substring(0, 30)}...</div>` : ''}
                                                    ${fb.advice ? `<div class="text-orange-700 bg-orange-50 p-2 rounded"><span class="font-bold">More:</span> ${fb.advice.substring(0, 30)}...</div>` : ''}
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderQuestionModal() {
    if (!state.selectedQuestion || !state.selectedCategory) return '';
    const q = state.selectedQuestion;
    const cat = state.selectedCategory;
    const fb = state.feedback[q.no] || { good: '', advice: '' };

    let answerSection = '';
    if (state.isCandidateMode) {
        const answerText = state.answers[q.q];
        if (answerText) {
            answerSection = `
                <div class="mt-6 bg-purple-50 rounded-xl border border-purple-200 overflow-hidden">
                    <details class="group" open>
                        <summary class="p-3 bg-purple-100 cursor-pointer font-bold text-purple-800 flex justify-between items-center select-none">
                            <span class="flex items-center gap-2">${ICONS.BookOpen} PREP回答メモ</span>
                            <span class="text-xs group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div class="p-4">
                            <div class="text-sm text-slate-700 prep-memo-content animate-fade-in mb-3">${answerText}</div>
                            <button onclick="openEditAnswerModal('${q.no}', '${q.q.replace(/'/g, "\\'")}')" class="neo-btn flex items-center gap-2 px-4 py-2 text-sm font-bold text-purple-700 cursor-pointer">
                                ${ICONS.Edit} 編集する
                            </button>
                        </div>
                    </details>
                </div>
            `;
        } else {
            answerSection = `
                <div class="mt-6 bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
                    <p class="text-sm text-gray-500 mb-2">この質問の回答メモはまだありません</p>
                    <button onclick="openAiAnswerModal('${q.no}')" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-colors flex items-center gap-2 mx-auto cursor-pointer">
                        ${ICONS.Sparkles} AIで回答案を作成
                    </button>
                </div>
            `;
        }
    }

    const m = Math.floor(state.timer / 60);
    const s = state.timer % 60;
    const timeStr = `${m}:${s < 10 ? '0' : ''}${s}`;
    let timeColor = "text-slate-700 bg-slate-100";
    if (state.timer > 60) timeColor = "text-amber-600 bg-amber-50";
    if (state.timer > 120) timeColor = "text-red-600 bg-red-50";

    return `
        <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay animate-fade-in overflow-y-auto" onclick="closeQuestion()">
            <div class="neo-modal w-full max-w-2xl my-8" onclick="event.stopPropagation()">
                <div class="neo-modal-header p-4 flex justify-between items-center shrink-0">
                    <div class="flex items-center gap-2 text-slate-700"><span class="w-5 h-5">${ICONS.PenTool}</span><span class="font-bold">面接官ツール</span></div>
                    <button onclick="closeQuestion()" class="neo-btn neo-close p-2 rounded-full">${ICONS.X}</button>
                </div>
                <div class="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    <div class="mb-6 border-b pb-6">
                        <div class="flex justify-between items-start mb-4">
                            <div class="flex-1 pr-4">
                                <div class="flex items-center gap-2 mb-2">
                                    <span class="neo-chip text-slate-600">Q. ${q.no}</span>
                                    ${q.important ? '<span class="neo-chip text-red-600">最重要</span>' : ''}
                                </div>
                                <h3 class="text-xl font-bold text-slate-800 leading-snug">${q.q}</h3>
                            </div>
                            <div class="shrink-0">
                                <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg border ${timeColor}">
                                    <span class="font-mono font-bold text-lg w-12 text-center">${timeStr}</span>
                                    <div class="flex gap-1 border-l pl-1 border-slate-300">
                                        <button onclick="toggleTimer()" class="p-1 hover:bg-black/10 rounded">${state.timerActive ? ICONS.Pause : ICONS.Play}</button>
                                        <button onclick="resetTimer()" class="p-1 hover:bg-black/10 rounded">${ICONS.RotateCcw}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="neo-card-inset p-4 rounded-xl mb-4">
                            <div class="flex items-center gap-2 mb-1 text-blue-700 font-bold text-sm"><span class="w-4 h-4">${ICONS.Target}</span><span>狙い・チェックポイント</span></div>
                            <p class="text-slate-700 text-sm leading-relaxed">${q.intent}</p>
                        </div>
                        ${answerSection}
                    </div>
                    <div class="space-y-4">
                        <div>
                            <label class="flex items-center gap-2 font-bold text-green-700 mb-2"><span class="w-4 h-4">${ICONS.CheckCircle}</span> Good Point</label>
                            <textarea id="fb-good" class="w-full p-3 neo-card-inset rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[60px] text-sm appearance-none" placeholder="例：結論ファーストで分かりやすかった。">${fb.good}</textarea>
                        </div>
                        <div>
                            <label class="flex items-center gap-2 font-bold text-orange-700 mb-2"><span class="w-4 h-4">${ICONS.AlertCircle}</span> More / 改善点</label>
                            <textarea id="fb-advice" class="w-full p-3 neo-card-inset rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[60px] text-sm appearance-none" placeholder="例：話が長すぎる。具体性に欠ける。">${fb.advice}</textarea>
                        </div>
                    </div>
                </div>
                <div class="p-4 neo-card-inset flex justify-end items-center shrink-0">
                    <button onclick="saveFeedback()" class="flex items-center gap-2 px-6 py-3 neo-btn-primary rounded-lg font-bold cursor-pointer">
                        <span class="w-4 h-4">${ICONS.Save}</span> 保存して戻る
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderAiModal() {
    if (!state.aiModalOpen) return '';
    return `
        <div class="fixed inset-0 z-[70] flex items-center justify-center p-4 modal-overlay animate-fade-in overflow-y-auto" onclick="closeAiModal()">
            <div class="neo-modal w-full max-w-lg p-6 my-8" onclick="event.stopPropagation()">
                <div class="neo-modal-header flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold flex items-center gap-2 text-slate-800"><span class="text-purple-500">${ICONS.Sparkles}</span> AI質問生成・追加</h3>
                    <button onclick="closeAiModal()" class="neo-btn neo-close p-2 rounded-full">${ICONS.X}</button>
                </div>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">追加したい質問のキーワード</label>
                        <textarea id="ai-input" class="w-full p-3 neo-card-inset rounded-lg h-24 focus:ring-2 focus:ring-purple-500 appearance-none" placeholder="例：挫折経験について聞かれたら？ / 最新ニュース">${state.aiInput}</textarea>
                    </div>
                    ${state.aiError ? `<div class="neo-card-inset text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">${ICONS.AlertCircle} ${state.aiError}</div>` : ''}
                    <button onclick="runAiGeneration()" ${state.aiLoading ? 'disabled' : ''} class="w-full py-3 neo-btn-primary rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
                        ${state.aiLoading ? ICONS.Loader2 : ICONS.Sparkles} ${state.aiLoading ? '生成中...' : 'AIで追加'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderAiAnswerModal() {
    if (!state.aiAnswerModal.isOpen) return '';
    const qText = state.aiAnswerModal.questionText;

    return `
        <div class="fixed inset-0 z-[80] flex items-center justify-center p-4 modal-overlay animate-fade-in" onclick="closeAiAnswerModal()">
            <div class="neo-modal w-full max-w-lg p-6" onclick="event.stopPropagation()">
                <div class="neo-modal-header flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold flex items-center gap-2 text-slate-800">
                        <span class="text-purple-500">${ICONS.Sparkles}</span> AI回答作成
                    </h3>
                    <button onclick="closeAiAnswerModal()" class="neo-btn neo-close p-2 rounded-full">${ICONS.X}</button>
                </div>

                <div class="mb-4 neo-card-inset p-4 rounded-lg">
                    <p class="text-xs text-slate-500 font-bold mb-1">対象の質問</p>
                    <p class="text-slate-800 font-bold">${qText}</p>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-bold text-slate-700 mb-2">回答のメモ・キーワードを入力</label>
                    <textarea id="ai-answer-input" class="w-full p-3 neo-card-inset rounded-lg h-32 focus:ring-2 focus:ring-purple-500 appearance-none text-sm" placeholder="・結論：〇〇です&#10;・理由：なぜなら〜&#10;・具体例：例えば〜"></textarea>
                    <p class="text-xs text-slate-400 mt-1">※箇条書きやキーワードだけでOK。AIがPREP法に整えます。</p>
                </div>

                ${state.aiError ? `<div class="neo-card-inset text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">${ICONS.AlertCircle} ${state.aiError}</div>` : ''}

                <button onclick="runAiAnswerGeneration()" ${state.aiLoading ? 'disabled' : ''} class="w-full py-3 neo-btn-primary rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
                    ${state.aiLoading ? ICONS.Loader2 : ICONS.Sparkles} ${state.aiLoading ? '生成中...' : 'AIで回答を作成する'}
                </button>
            </div>
        </div>
    `;
}

function renderEditAnswerModal() {
    if (!state.editAnswerModal.isOpen) return '';
    const modal = state.editAnswerModal;
    
    return `
        <div class="fixed inset-0 z-[75] flex items-center justify-center p-4 modal-overlay animate-fade-in overflow-y-auto" onclick="closeEditAnswerModal()">
            <div class="neo-modal w-full max-w-2xl my-8" onclick="event.stopPropagation()">
                <div class="neo-modal-header p-6 flex justify-between items-center shrink-0">
                    <h3 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span class="text-purple-500">${ICONS.Edit}</span> PREP回答メモを編集
                    </h3>
                    <button onclick="closeEditAnswerModal()" class="neo-btn neo-close p-2 rounded-full">${ICONS.X}</button>
                </div>
                <div class="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    <div class="mb-4 neo-card-inset p-4 rounded-lg">
                        <p class="text-xs text-slate-500 font-bold mb-1">対象の質問</p>
                        <p class="text-slate-800 font-bold">${modal.questionText}</p>
                    </div>
                    
                    <div class="mb-6">
                        <label class="block text-sm font-bold text-slate-700 mb-2">回答メモ（編集可能）</label>
                        <textarea id="edit-answer-input" class="w-full p-4 neo-card-inset rounded-lg min-h-[200px] focus:ring-2 focus:ring-purple-500 appearance-none text-sm prep-memo-content">${modal.currentAnswer}</textarea>
                    </div>
                    
                    <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p class="text-xs text-blue-800 font-bold mb-2 flex items-center gap-2">
                            ${ICONS.Lightbulb} 編集方法
                        </p>
                        <ul class="text-xs text-blue-700 space-y-1 list-disc list-inside">
                            <li><strong>手動編集：</strong>上記のテキストエリアを直接編集して「保存」ボタンをクリック</li>
                            <li><strong>AI修正：</strong>「AIで改善する」ボタンで、現在の内容を元にAIが改善版を生成</li>
                        </ul>
                    </div>
                    
                    ${modal.aiImproveError ? `
                        <div class="neo-card-inset text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
                            ${ICONS.AlertCircle} ${modal.aiImproveError}
                        </div>
                    ` : ''}
                    
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button 
                            onclick="runAiAnswerImprovement()" 
                            ${modal.aiImproving ? 'disabled' : ''} 
                            class="flex-1 py-3 neo-btn-primary rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
                            ${modal.aiImproving ? ICONS.Loader2 : ICONS.Sparkles} 
                            ${modal.aiImproving ? '改善中...' : 'AIで改善する'}
                        </button>
                        <button 
                            onclick="saveEditedAnswer()" 
                            class="flex-1 py-3 neo-btn-primary rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer">
                            ${ICONS.Save} 保存
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderBulkAnswerModal() {
    if (!state.bulkAnswerModal.isOpen) return '';

    const unansweredQuestions = [];
    state.categories.forEach(cat => {
        cat.questions.forEach(q => {
            if (!state.answers[q.q]) {
                unansweredQuestions.push({ category: cat.title, question: q.q, no: q.no });
            }
        });
    });

    const listContent = unansweredQuestions.length > 0
        ? unansweredQuestions.map(q => `
            <div class="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 flex justify-between items-center group">
                <div>
                    <span class="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded mr-2">${q.category}</span>
                    <span class="text-slate-800 font-bold text-sm">${q.question}</span>
                </div>
                <button onclick="openAiAnswerModal('${q.no}')" class="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-200 transition-colors whitespace-nowrap">
                    回答作成
                </button>
            </div>
        `).join('')
        : '<div class="p-8 text-center text-slate-500">すべての質問に回答済みです！🎉</div>';

    return `
        <div class="fixed inset-0 z-[75] flex items-center justify-center p-4 modal-overlay animate-fade-in" onclick="closeBulkAnswerModal()">
            <div class="neo-modal w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]" onclick="event.stopPropagation()">
                <div class="neo-modal-header p-6 flex justify-between items-center">
                    <h3 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span class="text-purple-500">${ICONS.Sparkles}</span> 未回答の質問リスト
                    </h3>
                    <button onclick="closeBulkAnswerModal()" class="neo-btn neo-close p-2 rounded-full">${ICONS.X}</button>
                </div>
                <div class="flex-1 overflow-y-auto custom-scrollbar p-1">
                    ${listContent}
                </div>
            </div>
        </div>
    `;
}

function renderErrorLog() {
    if (!state.errorLog) return '';
    return `
        <div class="fixed bottom-0 left-0 w-full bg-red-600 text-white p-4 z-[9999] font-mono text-xs flex justify-between items-center">
            <span>⚠️ ${state.errorLog}</span>
            <button onclick="state.errorLog=''; renderApp();" class="underline">閉じる</button>
        </div>
    `;
}

function renderApp() {
    const root = document.getElementById('app-root');
    
    // ミラーモードの場合は専用UIを表示
    if (state.mirrorMode) {
        root.innerHTML = renderMirrorMode() + renderErrorLog();
        // カメラストリームを設定（既に開始されている場合）
        if (state.cameraStream) {
            setTimeout(() => {
                const video = document.getElementById('mirror-video');
                if (video) {
                    // 既にストリームが設定されている場合は再設定しない
                    if (!video.srcObject) {
                        video.srcObject = state.cameraStream;
                    }
                    // 再生状態を確認
                    if (video.paused) {
                        video.play().catch(e => console.error('Video play error:', e));
                    }
                }
            }, 50);
        }
        return;
    }
    
    // 通常モード
    root.innerHTML = `
        ${renderStartupModal()}
        ${renderHeader()}
        ${renderMirrorModeButton()}
        ${renderStrategy()}
        ${renderMap()}
        ${renderScoringBoard()}
        ${renderOverallFeedbackInput()}
        ${renderHistorySection()}
        ${renderCategoryModal()}
        ${renderQuestionModal()}
        ${renderAiModal()}
        ${renderAiAnswerModal()}
        ${renderEditAnswerModal()}
        ${renderBulkAnswerModal()}
        ${renderConfirmModal()}
        ${renderMirrorSelectionModal()}
        ${renderErrorLog()}
    `;
}

// --- 4. Window Actions ---
window.startSession = () => {
    const name = document.getElementById('start-name').value;
    const count = document.getElementById('start-count').value;
    if (!name || !count) { alert("名前と回数を入力してください"); return; }
    state.interviewerName = name;
    state.sessionCount = count;
    state.startupModalOpen = false;

    if (name === "今ボーイ") {
        state.isCandidateMode = true;
        loadAnswers(name);
    } else {
        state.isCandidateMode = false;
    }

    localStorage.setItem('interview_interviewer_name', name);
    localStorage.setItem('interview_session_count', count);
    loadUserData(name);
    renderApp();
};

window.loadUserData = async (name) => {
    state.isLoadingSettings = true;
    renderApp();

    const fetchUrl = `${GAS_SCRIPT_URL}?user=${encodeURIComponent(name)}`;

    try {
        const res = await fetch(fetchUrl, { method: "GET", redirect: "follow" });
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();

        if (data.result === 'success' && data.categories) {
            state.categories = data.categories;
            localStorage.setItem('interview_categories', JSON.stringify(state.categories));
            console.log("User data loaded successfully");
        } else {
            console.log("No previous data found or error, using default.");
        }
    } catch (err) {
        console.warn("Failed to load settings from cloud (using local):", err);
    } finally {
        state.isLoadingSettings = false;
        renderApp();
    }
};

window.loadAnswers = async (name) => {
    const fetchUrl = `${GAS_SCRIPT_URL}?action=get_answers&user=${encodeURIComponent(name)}`;

    try {
        const res = await fetch(fetchUrl, { method: "GET", redirect: "follow" });
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();

        if (data.result === 'success' && data.answers) {
            state.answers = data.answers;
        }
    } catch (err) {
         console.warn("Failed to load answers from cloud:", err);
    }
};

window.saveAnswer = (qText, aText) => {
    const payload = {
        action: 'save_answer',
        user: state.interviewerName,
        question: qText,
        answer: aText
    };

    fetch(GAS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(e => console.warn("Failed to save answer to cloud", e));

    state.answers[qText] = aText;
    renderApp();
};

// --- モーダル制御 ---
window.openAiAnswerModal = (qNo) => {
    let questionText = "";
    state.categories.forEach(cat => {
        const q = cat.questions.find(q => q.no === qNo);
        if(q) questionText = q.q;
    });

    if (!questionText) { alert("質問が見つかりませんでした"); return; }

    state.aiAnswerModal = { isOpen: true, questionText: questionText, qNo: qNo };
    renderApp();
};

window.closeAiAnswerModal = () => {
    state.aiAnswerModal = { isOpen: false, questionText: "", qNo: null };
    renderApp();
};

window.openEditAnswerModal = (qNo) => {
    let questionText = "";
    state.categories.forEach(cat => {
        const q = cat.questions.find(q => q.no === qNo);
        if(q) questionText = q.q;
    });
    
    if (!questionText) { 
        alert("質問が見つかりませんでした"); 
        return; 
    }
    
    const currentAnswer = state.answers[questionText] || "";
    state.editAnswerModal = { 
        isOpen: true, 
        questionText: questionText, 
        currentAnswer: currentAnswer,
        qNo: qNo,
        aiImproving: false,
        aiImproveError: null
    };
    renderApp();
};

window.closeEditAnswerModal = () => {
    state.editAnswerModal = { 
        isOpen: false, 
        questionText: "", 
        currentAnswer: "",
        qNo: null,
        aiImproving: false,
        aiImproveError: null
    };
    renderApp();
};

window.runAiAnswerImprovement = async () => {
    const modal = state.editAnswerModal;
    const currentAnswer = document.getElementById('edit-answer-input').value;
    
    if (!currentAnswer || !currentAnswer.trim()) {
        alert("編集する内容を入力してください");
        return;
    }
    
    state.editAnswerModal.aiImproving = true;
    state.editAnswerModal.aiImproveError = null;
    renderApp();
    
    try {
        const prompt = `あなたは就活生のメンターです。
以下の「質問」と「現在のPREP回答メモ」を確認し、より良い「PREP構成メモ」に改善してください。

【制約事項】
・**文章（台本）は禁止**です。
・「〜です/〜ます」は使わず、体言止めや単語で端的に記述してください。
・各項目は1行〜2行で短くまとめてください。
・要点のみを箇条書きにしてください。
・現在の内容の良い点は活かしつつ、より分かりやすく、面接で使いやすい形に改善してください。

質問: "${modal.questionText}"
現在のPREP回答メモ:
${currentAnswer}

出力フォーマット:
・結論：(要点のみ)
・理由：(要点のみ)
・具体例：(要点のみ)
・まとめ：(要点のみ)`;

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Server Error');
        }

        const data = await response.json();
        const improvedAnswer = data.candidates[0].content.parts[0].text;
        
        // テキストエリアに改善された内容を反映
        const inputElement = document.getElementById('edit-answer-input');
        if (inputElement) {
            inputElement.value = improvedAnswer;
        }
        state.editAnswerModal.currentAnswer = improvedAnswer;
        
    } catch (e) {
        state.editAnswerModal.aiImproveError = "改善エラー: " + e.message;
    } finally {
        state.editAnswerModal.aiImproving = false;
        renderApp();
    }
};

window.saveEditedAnswer = () => {
    const modal = state.editAnswerModal;
    const editedAnswer = document.getElementById('edit-answer-input').value;
    
    if (!editedAnswer || !editedAnswer.trim()) {
        alert("回答メモを入力してください");
        return;
    }
    
    saveAnswer(modal.questionText, editedAnswer);
    closeEditAnswerModal();
    closeQuestion(); // 質問モーダルも閉じる
    renderApp();
};

window.openBulkAnswerModal = () => {
    state.bulkAnswerModal.isOpen = true;
    renderApp();
};

window.closeBulkAnswerModal = () => {
    state.bulkAnswerModal.isOpen = false;
    renderApp();
};

window.runAiAnswerGeneration = async () => {
    // APIキーチェック削除（サーバー側で処理）

    const qNo = state.aiAnswerModal.qNo;
    const questionText = state.aiAnswerModal.questionText;
    const userInput = document.getElementById('ai-answer-input').value;

    if (!userInput) { alert("回答のメモを入力してください"); return; }

    state.aiLoading = true;
    renderApp();

    try {
        const prompt = `あなたは就活生のメンターです。
以下の「質問」に対し、ユーザーが入力した「回答メモ」を元に、面接中にチラッと見て内容を思い出せる「PREP構成メモ」を作成してください。

【制約事項】
・**文章（台本）は禁止**です。
・「〜です/〜ます」は使わず、体言止めや単語で端的に記述してください。
・各項目は1行〜2行で短くまとめてください。
・要点のみを箇条書きにしてください。

質問: "${questionText}"
回答メモ: "${userInput}"

出力フォーマット:
・結論：(要点のみ)
・理由：(要点のみ)
・具体例：(要点のみ)
・まとめ：(要点のみ)`;

        // Vercel Serverless Function経由で呼び出し
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Server Error');
        }

        const data = await response.json();
        const answerText = data.candidates[0].content.parts[0].text;

        saveAnswer(questionText, answerText);
        closeAiAnswerModal();

    } catch (e) {
        state.aiError = "回答生成エラー: " + e.message;
    } finally {
        state.aiLoading = false;
        renderApp();
    }
};

// 回答有無チェック関数
function hasAnswer(questionText) {
    const answer = state.answers[questionText];
    return answer && answer.trim().length > 0;
}

// ミラーモード用AI回答生成
window.runAiAnswerGenerationForMirror = async () => {
    const currentQuestion = state.mirrorQuestions[state.currentQuestionIndex];
    const questionText = currentQuestion.q;
    const hasExistingAnswer = hasAnswer(questionText);
    // 音声認識結果は無効化中
    // const speechText = state.mirrorReviewData.speechTranscription || '';
    
    // テキストボックスから取得（手動入力のみ、音声認識は無効化中）
    let userInput = document.getElementById('mirror-ai-answer-input').value.trim();

    // 入力が空の場合は音声認識結果を使用（無効化中）
    // if (!userInput && speechText) {
    //     userInput = speechText;
    //     // テキストボックスにもセット
    //     document.getElementById('mirror-ai-answer-input').value = speechText;
    // }

    if (!userInput) {
        state.mirrorReviewData.aiAnswerError = "回答のメモを入力してください";
        renderApp();
        return;
    }

    // 回答済みの質問で、音声認識結果のみの場合は確認（無効化中）
    // if (hasExistingAnswer && userInput === speechText && speechText) {
    //     const confirmMessage = `既存の回答があります。\n\n既存回答:\n${state.answers[questionText].substring(0, 100)}...\n\n音声認識結果で上書きしますか？\n（キャンセルすると既存回答を保持します）`;
    //     const shouldOverwrite = confirm(confirmMessage);
    //     if (!shouldOverwrite) {
    //         // 既存回答をテキストボックスに表示
    //         document.getElementById('mirror-ai-answer-input').value = state.answers[questionText];
    //         state.mirrorReviewData.aiAnswerInput = state.answers[questionText];
    //         renderApp();
    //         return;
    //     }
    // }

    state.mirrorReviewData.aiAnswerLoading = true;
    state.mirrorReviewData.aiAnswerError = null;
    renderApp();

    try {
        const prompt = `あなたは就活生のメンターです。
以下の「質問」に対し、ユーザーが入力した「回答メモ」を元に、面接中にチラッと見て内容を思い出せる「PREP構成メモ」を作成してください。

【制約事項】
・**文章（台本）は禁止**です。
・「〜です/〜ます」は使わず、体言止めや単語で端的に記述してください。
・各項目は1行〜2行で短くまとめてください。
・要点のみを箇条書きにしてください。

質問: "${questionText}"
回答メモ: "${userInput}"

出力フォーマット:
・結論：(要点のみ)
・理由：(要点のみ)
・具体例：(要点のみ)
・まとめ：(要点のみ)`;

        // Vercel Serverless Function経由で呼び出し
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Server Error');
        }

        const data = await response.json();
        const answerText = data.candidates[0].content.parts[0].text;

        // 保存
        saveAnswer(questionText, answerText);
        state.mirrorReviewData.aiAnswerInput = '';
        state.mirrorReviewData.speechTranscription = ''; // 使用後はクリア
        renderApp();

    } catch (e) {
        state.mirrorReviewData.aiAnswerError = "回答生成エラー: " + e.message;
    } finally {
        state.mirrorReviewData.aiAnswerLoading = false;
        renderApp();
    }
};

window.saveSettings = () => {
    if (!state.interviewerName) return;
    const payload = { action: 'save_settings', user: state.interviewerName, categories: state.categories };
    fetch(GAS_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(e => console.warn("Failed to save settings to cloud", e));
};

window.openCategory = (id) => { state.selectedCategory = state.categories.find(c => c.id === id); renderApp(); };
window.closeCategory = () => { state.selectedCategory = null; renderApp(); };
window.toggleScoring = () => { state.isScoringOpen = !state.isScoringOpen; renderApp(); };
window.updateScore = (id, val) => { state.scores[id] = parseInt(val); localStorage.setItem('interview_scores', JSON.stringify(state.scores)); renderApp(); };

window.updateOverallFeedback = (val) => {
    state.overallFeedback = val;
    localStorage.setItem('interview_overall_feedback', val);
};

window.openConfirmModal = (message, actionName) => {
    state.confirmModal = { isOpen: true, message: message, actionName: actionName };
    renderApp();
};

window.closeConfirmModal = () => {
    state.confirmModal = { isOpen: false, message: "", actionName: null };
    renderApp();
};

window.executeConfirmAction = () => {
    const action = state.confirmModal.actionName;
    closeConfirmModal();
    if (action === 'reset') window.performReset();
    if (action === 'send') window.performSend();
};

window.performReset = () => {
    state.scores = { logic: 5, vision: 5, passion: 5, achievement: 5, pm: 5, logical: 5, behavior: 5, communication: 5, impression: 5, sincerity: 5 };
    state.feedback = {};
    state.overallFeedback = "";
    localStorage.setItem('interview_scores', JSON.stringify(state.scores));
    localStorage.setItem('interview_feedback', JSON.stringify(state.feedback));
    localStorage.setItem('interview_overall_feedback', "");
    renderApp();
};

window.resetScores = () => { window.openConfirmModal('スコアをリセットしますか？', 'reset'); };
window.openQuestion = (no) => { state.selectedQuestion = state.selectedCategory.questions.find(q => q.no === no); state.timer = 0; state.timerActive = false; clearInterval(state.timerInterval); renderApp(); };
window.closeQuestion = () => { state.selectedQuestion = null; state.timer = 0; state.timerActive = false; clearInterval(state.timerInterval); renderApp(); };
window.toggleTimer = () => { state.timerActive = !state.timerActive; if (state.timerActive) { state.timerInterval = setInterval(() => { state.timer++; renderApp(); }, 1000); } else { clearInterval(state.timerInterval); } renderApp(); };
window.resetTimer = () => { state.timer = 0; state.timerActive = false; clearInterval(state.timerInterval); renderApp(); };
window.saveFeedback = () => { const good = document.getElementById('fb-good').value; const advice = document.getElementById('fb-advice').value; state.feedback[state.selectedQuestion.no] = { good, advice }; localStorage.setItem('interview_feedback', JSON.stringify(state.feedback)); closeQuestion(); };

// ミラーモード用フィードバック保存
window.saveMirrorFeedback = () => {
    const currentQuestion = state.mirrorQuestions[state.currentQuestionIndex];
    const good = document.getElementById('mirror-fb-good').value;
    const advice = document.getElementById('mirror-fb-more').value;
    
    state.feedback[currentQuestion.no] = { good, advice };
    localStorage.setItem('interview_feedback', JSON.stringify(state.feedback));
    
    // レビューデータも更新
    state.mirrorReviewData.feedbackGood = good;
    state.mirrorReviewData.feedbackMore = advice;
    
    renderApp();
};
window.openAiModal = () => { state.aiModalOpen = true; state.aiError = null; renderApp(); };
window.closeAiModal = () => { state.aiModalOpen = false; renderApp(); };

window.runAiGeneration = async () => {
    const input = document.getElementById('ai-input').value;
    state.aiInput = input;
    // APIキーチェック削除（サーバー側で処理）
    
    if (!input) { state.aiError = "キーワードを入力してください。"; renderApp(); return; }
    state.aiLoading = true; renderApp();
    try {
        const prompt = `あなたはトヨタシステムズの面接官です。ユーザー入力「${input}」を元に、最適なカテゴリ(1-6)を選択し、JSON形式 {"categoryId": number, "questionText": "質問文", "intent": "意図", "important": boolean} で返してください。Markdown不要。`;
        
        // Vercel Serverless Function経由で呼び出し
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Server Error');
        }

        const data = await response.json();
        
        const text = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(text);
        state.categories = state.categories.map(cat => { if (cat.id === result.categoryId) { const newNo = `${cat.id}-${cat.questions.length + 1}`; return { ...cat, questions: [...cat.questions, { no: newNo, q: result.questionText, intent: result.intent, important: result.important }] }; } return cat; });

        localStorage.setItem('interview_categories', JSON.stringify(state.categories));
        saveSettings();

        alert(`質問を追加しました！`);
        state.aiModalOpen = false;
        state.aiInput = "";
    } catch (e) { state.aiError = `生成エラー: ` + e.message; } finally { state.aiLoading = false; renderApp(); }
};

window.handleSaveImage = () => {
    const target = document.body;
    html2canvas(target).then(canvas => { const link = document.createElement('a'); link.href = canvas.toDataURL('image/png'); const date = new Date(); link.download = `面接結果_${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}.png`; link.click(); });
};

window.handleSendToGAS = () => {
    window.openConfirmModal('現在のフィードバックをスプレッドシートに送信しますか？\\n（送信後、データはリセットされ、履歴に保存されます）', 'send');
};

window.performSend = () => {
    if (!GAS_SCRIPT_URL) { alert("GASのURLが設定されていません。コードを確認してください。"); return; }

    state.sending = true;
    renderApp();

    const feedbacksToSend = [];
    Object.entries(state.feedback).forEach(([qNo, fb]) => {
        let catTitle = "不明"; let qText = "不明";
        state.categories.forEach(cat => { const foundQ = cat.questions.find(q => q.no === qNo); if (foundQ) { catTitle = cat.title; qText = foundQ.q; } });
        feedbacksToSend.push({ category: catTitle, question: qText, good: fb.good, bad: fb.advice });
    });

    // ミラーモードでの音声認識データを収集（無効化中）
    const mirrorAnswers = [];
    if (state.mirrorMode && state.mirrorQuestions.length > 0) {
        state.mirrorQuestions.forEach((q, index) => {
            const answerText = state.answers[q.q];
            // const speechText = state.speechRecognition.transcribedText; // 最後の音声認識結果（無効化中）
            if (answerText) { // speechText の条件を削除
                mirrorAnswers.push({
                    questionNo: q.no,
                    question: q.q,
                    answer: answerText || ''
                    // speechTranscription: index === state.currentQuestionIndex ? speechText : null（無効化中）
                });
            }
        });
    }
    
    const meta = {
        timestamp: new Date().toLocaleString(),
        interviewer: state.interviewerName,
        sessionCount: state.sessionCount,
        totalScore: state.calculations.total,
        judgment: state.calculations.judgment,
        overallFeedback: state.overallFeedback,
        // 音声認識データを追加（ミラーモードの場合）
        mirrorAnswers: mirrorAnswers.length > 0 ? mirrorAnswers : null
    };

    fetch(GAS_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbacks: feedbacksToSend, metadata: meta })
    })
    .then(() => {
        alert("送信完了しました！\n履歴に保存し、入力データをリセットします。");

        state.history.push({
            date: meta.timestamp,
            interviewer: meta.interviewer,
            session: meta.sessionCount,
            score: meta.totalScore,
            judgment: meta.judgment,
            judgmentColor: state.calculations.judgmentColor,
            feedbackCount: feedbacksToSend.length,
            feedbacks: feedbacksToSend,
            overallFeedback: meta.overallFeedback
        });
        localStorage.setItem('interview_history_log', JSON.stringify(state.history));

        const nextCount = parseInt(state.sessionCount) + 1;
        state.sessionCount = nextCount;
        localStorage.setItem('interview_session_count', nextCount);

        window.performReset();
    })
    .catch(err => {
        console.error(err);
        state.errorLog = "送信エラー: " + err.message;
        renderApp();
    })
    .finally(() => { state.sending = false; renderApp(); });
};

// ==========================================
// ▼▼▼ ミラーモード機能 ▼▼▼
// ==========================================

// ==========================================
// ▼▼▼ 音声認識機能 ▼▼▼
// ==========================================

// 音声認識初期化
function initSpeechRecognition() {
    // 既に初期化済みの場合はそれを返す
    if (state.speechRecognition.recognition) {
        return state.speechRecognition.recognition;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        state.speechRecognition.isSupported = false;
        return null;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = true; // 連続認識
    recognition.interimResults = true; // 途中結果も取得
    
    recognition.onresult = (event) => {
        let interimText = '';
        let finalText = '';
        
        // 全ての結果を処理
        for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalText += transcript;
            } else {
                interimText += transcript;
            }
        }
        
        // 既存の確定テキストに追加
        const previousFinal = state.speechRecognition.transcribedText || '';
        state.speechRecognition.transcribedText = previousFinal + finalText;
        state.speechRecognition.interimText = interimText;
        
        // ミラーモードのレビューフェーズの場合のみテキストボックスに自動入力（無効化中）
        // if (state.mirrorMode && state.mirrorPhase === 'review') {
        //     const inputElement = document.getElementById('mirror-ai-answer-input');
        //     if (inputElement) {
        //         // レビューフェーズでは確定テキスト + 途中テキストを表示
        //         inputElement.value = state.speechRecognition.transcribedText + interimText;
        //     }
        // }
        
        // 質問フェーズ中はリアルタイム表示を更新（無効化中）
        // if (state.mirrorMode && state.mirrorPhase === 'question' && state.countdownActive) {
        //     const liveTextElement = document.getElementById('mirror-live-transcription');
        //     if (liveTextElement) {
        //         const displayText = state.speechRecognition.transcribedText + interimText;
        //         liveTextElement.textContent = displayText;
        //         // テキストがある場合は表示、ない場合は非表示
        //         if (displayText.trim()) {
        //             liveTextElement.style.display = 'block';
        //         } else {
        //             liveTextElement.style.display = 'none';
        //         }
        //     }
        // }
        
        renderApp();
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        // no-speechエラーは無視（無音状態は正常）
        if (event.error === 'no-speech') {
            // 無音状態はエラーとして扱わない
            return;
        }
        
        state.speechRecognition.isActive = false;
        
        let errorMessage = '';
        if (event.error === 'not-allowed') {
            errorMessage = 'マイクの権限が拒否されました。ブラウザの設定でマイクへのアクセスを許可してください。';
        } else if (event.error === 'network') {
            errorMessage = 'ネットワークエラーが発生しました。インターネット接続を確認してください。';
        } else if (event.error === 'aborted') {
            // 手動で停止した場合はエラーとして表示しない
            return;
        } else if (event.error === 'audio-capture') {
            errorMessage = 'マイクが検出されませんでした。マイクが接続されているか確認してください。';
        } else if (event.error === 'service-not-allowed') {
            errorMessage = '音声認識サービスが利用できません。HTTPS接続でアクセスしているか確認してください。';
        } else {
            errorMessage = `音声認識エラー: ${event.error}`;
        }
        
        // エラーメッセージがある場合のみ表示
        if (errorMessage) {
            state.speechRecognition.errorMessage = errorMessage;
            renderApp();
        }
    };
    
    recognition.onend = () => {
        state.speechRecognition.isActive = false;
        renderApp();
    };
    
    state.speechRecognition.recognition = recognition;
    state.speechRecognition.isSupported = true;
    return recognition;
}

// 録音開始
window.startSpeechRecognition = () => {
    // ブラウザ対応チェック（初回のみ）
    if (state.speechRecognition.recognition === null && !state.speechRecognition.isSupported) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            state.speechRecognition.isSupported = false;
            alert('お使いのブラウザでは音声認識に対応していません。ChromeまたはEdgeをご利用ください。');
            return;
        }
    }
    
    if (!state.speechRecognition.recognition) {
        const recognition = initSpeechRecognition();
        if (!recognition) {
            alert('お使いのブラウザでは音声認識に対応していません。ChromeまたはEdgeをご利用ください。');
            return;
        }
    }
    
    try {
        state.speechRecognition.recognition.start();
        state.speechRecognition.isActive = true;
        state.speechRecognition.transcribedText = '';
        state.speechRecognition.interimText = '';
        state.speechRecognition.errorMessage = null;
        renderApp();
    } catch (e) {
        console.error('Failed to start speech recognition:', e);
        if (e.name === 'InvalidStateError') {
            // 既に開始されている場合は無視
            state.speechRecognition.isActive = true;
            renderApp();
        } else {
            // エラーメッセージを設定（アラートは表示しない）
            state.speechRecognition.isActive = false;
            state.speechRecognition.errorMessage = '音声認識を開始できませんでした。マイクの権限を確認してください。';
            renderApp();
        }
    }
};

// 録音停止
window.stopSpeechRecognition = () => {
    if (state.speechRecognition.recognition && state.speechRecognition.isActive) {
        state.speechRecognition.recognition.stop();
        state.speechRecognition.isActive = false;
        
        // 最終的な文字起こし結果をテキストボックスにセット
        const inputElement = document.getElementById('mirror-ai-answer-input');
        if (inputElement) {
            // 既存のテキストがある場合は追記、ない場合は置き換え
            const currentValue = inputElement.value || '';
            const newText = state.speechRecognition.transcribedText;
            if (currentValue && newText) {
                // 既存テキストに追記（改行を追加）
                inputElement.value = currentValue + (currentValue.endsWith('\n') ? '' : '\n') + newText;
            } else if (newText) {
                inputElement.value = newText;
            }
        }
        
        renderApp();
    }
};

// ==========================================
// ▼▼▼ ミラーモード機能（続き） ▼▼▼
// ==========================================

// ユーティリティ: 配列をシャッフル
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 質問セット生成（ランダムモード）
function generateMirrorQuestions() {
    const allQuestions = state.categories.flatMap(cat => 
        cat.questions.map(q => ({ ...q, categoryTitle: cat.title }))
    );
    const shuffled = shuffleArray(allQuestions);
    state.mirrorQuestions = shuffled.slice(0, 5);
    state.currentQuestionIndex = 0;
}

// 手動選択モード用の質問セット設定
function setManualMirrorQuestions(selectedQuestions) {
    state.mirrorQuestions = selectedQuestions;
    state.currentQuestionIndex = 0;
}

// カメラ開始
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false 
        });
        state.cameraStream = stream;
        const video = document.getElementById('mirror-video');
        if (video) {
            video.srcObject = stream;
            video.play();
        }
        return true;
    } catch (error) {
        console.error('カメラエラー:', error);
        state.errorLog = `カメラエラー: ${error.message}`;
        renderApp();
        return false;
    }
}

// カメラ停止
function stopCamera() {
    if (state.cameraStream) {
        state.cameraStream.getTracks().forEach(track => track.stop());
        state.cameraStream = null;
    }
}

// ミラーモード選択画面を開く
window.openMirrorModeSelection = (mode) => {
    state.mirrorQuestionMode = mode;
    if (mode === 'random') {
        // ランダムモードは直接開始
        startMirrorMode();
    } else {
        // 手動選択モードは選択画面を表示
        state.mirrorSelectionModalOpen = true;
        renderApp();
    }
};

// 手動選択モードの質問選択画面を閉じる
window.closeMirrorSelectionModal = () => {
    state.mirrorSelectionModalOpen = false;
    state.mirrorSelectedQuestions = [];
    renderApp();
};

// 質問を選択/解除
window.toggleMirrorQuestion = (categoryId, questionNo) => {
    const category = state.categories.find(c => c.id === categoryId);
    if (!category) return;
    const question = category.questions.find(q => q.no === questionNo);
    if (!question) return;
    
    const questionWithCategory = { ...question, categoryTitle: category.title };
    const index = state.mirrorSelectedQuestions.findIndex(q => q.no === questionNo);
    if (index >= 0) {
        state.mirrorSelectedQuestions.splice(index, 1);
    } else {
        state.mirrorSelectedQuestions.push(questionWithCategory);
    }
    renderApp();
};

// 手動選択モードで開始
window.startManualMirrorMode = () => {
    if (state.mirrorSelectedQuestions.length === 0) {
        alert('少なくとも1問を選択してください');
        return;
    }
    state.mirrorSelectionModalOpen = false;
    setManualMirrorQuestions([...state.mirrorSelectedQuestions]);
    state.mirrorSelectedQuestions = [];
    startMirrorMode();
};

// ミラーモード開始（共通処理）
async function startMirrorMode() {
    state.mirrorMode = true;
    state.mirrorPhase = 'waiting';
    
    // 質問セットが未設定の場合はランダム生成
    if (state.mirrorQuestions.length === 0) {
        generateMirrorQuestions();
    }
    
    renderApp();
    
    // カメラ許可を待つ
    const success = await startCamera();
    if (success) {
        state.mirrorPhase = 'ready';
        renderApp();
        // renderApp()後にvideo要素にストリームを設定
        setTimeout(() => {
            const video = document.getElementById('mirror-video');
            if (video && state.cameraStream) {
                video.srcObject = state.cameraStream;
                video.play().catch(e => console.error('Video play error:', e));
            }
        }, 100);
    } else {
        // カメラエラーの場合はモードを終了
        state.mirrorMode = false;
        renderApp();
    }
}

// ミラーモード終了
window.exitMirrorMode = () => {
    stopCamera();
    // 音声認識も停止
    if (state.speechRecognition.recognition && state.speechRecognition.isActive) {
        stopSpeechRecognition();
    }
    if (state.countdownInterval) {
        clearInterval(state.countdownInterval);
        state.countdownInterval = null;
    }
    state.mirrorMode = false;
    state.mirrorPhase = 'waiting';
    state.currentQuestionIndex = 0;
    state.countdownTimer = 20;
    state.countdownActive = false;
    state.showCheatSheet = false;
    state.mirrorQuestions = [];
    state.mirrorSelectedQuestions = [];
    state.mirrorSelectionModalOpen = false;
    // レビューデータをリセット
    state.mirrorReviewData = {
        currentQuestionNo: null,
        aiAnswerInput: '',
        aiAnswerLoading: false,
        aiAnswerError: null,
        feedbackGood: '',
        feedbackMore: ''
    };
    // 音声認識データをリセット
    state.speechRecognition.isActive = false;
    state.speechRecognition.transcribedText = '';
    state.speechRecognition.interimText = '';
    state.speechRecognition.errorMessage = null;
    renderApp();
};

// タイマー表示のみ更新（質問BOXは再レンダリングしない）
function updateTimerDisplay() {
    const timerElement = document.getElementById('mirror-timer-number');
    const timerCircle = document.getElementById('mirror-timer-circle');
    
    if (!timerElement || !timerCircle) return; // 要素が存在しない場合は何もしない
    
    const progress = state.countdownTimer / 20;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference * (1 - progress);
    
    // タイマー数字を更新
    timerElement.textContent = state.countdownTimer;
    const colorClass = state.countdownTimer <= 5 ? 'text-red-600' : state.countdownTimer <= 10 ? 'text-amber-600' : 'text-blue-600';
    timerElement.className = `text-3xl font-black ${colorClass}`;
    
    // 円形プログレスバーを更新
    const color = state.countdownTimer <= 5 ? '#ef4444' : state.countdownTimer <= 10 ? '#f59e0b' : '#4d7cff';
    timerCircle.setAttribute('stroke', color);
    timerCircle.setAttribute('stroke-dashoffset', offset);
}

// カウントダウン開始
function startCountdown() {
    if (state.countdownInterval) {
        clearInterval(state.countdownInterval);
    }
    state.countdownActive = true;
    state.countdownTimer = 20;
    
    // 初期表示はrenderApp()で行う
    renderApp();
    
    // 少し遅延してからタイマー更新を開始（DOM要素が確実に存在するように）
    setTimeout(() => {
        updateTimerDisplay();
    }, 100);
    
    // カウントダウン開始と同時に音声認識を自動開始
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        setTimeout(() => {
            if (!state.speechRecognition.isActive) {
                // 音声認識が初期化されていない場合は初期化
                if (!state.speechRecognition.recognition) {
                    initSpeechRecognition();
                }
                // 音声認識を開始
                try {
                    if (state.speechRecognition.recognition) {
                        state.speechRecognition.recognition.start();
                        state.speechRecognition.isActive = true;
                        state.speechRecognition.transcribedText = '';
                        state.speechRecognition.interimText = '';
                        state.speechRecognition.errorMessage = null;
                        renderApp();
                    }
                } catch (e) {
                    // 既に開始されている場合は無視
                    if (e.name === 'InvalidStateError') {
                        // 既に開始されている場合は状態を更新
                        state.speechRecognition.isActive = true;
                        renderApp();
                    } else {
                        console.warn('音声認識の自動開始に失敗:', e);
                        // エラーメッセージを設定
                        state.speechRecognition.errorMessage = '音声認識の自動開始に失敗しました。手動で開始してください。';
                        renderApp();
                    }
                }
            }
        }, 500); // UI更新を待つ
    }
    
    state.countdownInterval = setInterval(() => {
        state.countdownTimer--;
        updateTimerDisplay(); // タイマー部分だけ更新（質問BOXは点滅しない）
        
        if (state.countdownTimer <= 0) {
            clearInterval(state.countdownInterval);
            state.countdownInterval = null;
            state.countdownActive = false;
            // 音声認識を停止
            if (state.speechRecognition.recognition && state.speechRecognition.isActive) {
                stopSpeechRecognition();
            }
            // 自動で次の質問へ進まず、レビューフェーズへ
            const currentQuestion = state.mirrorQuestions[state.currentQuestionIndex];
            state.mirrorPhase = 'review';
            state.mirrorReviewData.currentQuestionNo = currentQuestion.no;
            // 文字起こし結果を保存（無効化中）
            state.mirrorReviewData.speechTranscription = '';
            // 既存のフィードバックがあれば読み込む
            const existingFb = state.feedback[currentQuestion.no] || {};
            state.mirrorReviewData.feedbackGood = existingFb.good || '';
            state.mirrorReviewData.feedbackMore = existingFb.advice || '';
            state.mirrorReviewData.aiAnswerInput = '';
            state.mirrorReviewData.aiAnswerError = null;
            renderApp();
        }
    }, 1000);
}

// 次の質問へ（レビューフェーズから呼び出される）
function nextQuestion() {
    // 音声認識を停止
    if (state.speechRecognition.recognition && state.speechRecognition.isActive) {
        stopSpeechRecognition();
    }
    state.countdownTimer = 20;
    state.countdownActive = false;
    state.showCheatSheet = false;
    // レビューデータをリセット
    state.mirrorReviewData.currentQuestionNo = null;
    state.mirrorReviewData.aiAnswerInput = '';
    state.mirrorReviewData.feedbackGood = '';
    state.mirrorReviewData.feedbackMore = '';
    state.mirrorReviewData.aiAnswerError = null;
    // 音声認識データをリセット
    state.speechRecognition.transcribedText = '';
    state.speechRecognition.interimText = '';
    state.speechRecognition.errorMessage = null;
    
    if (state.currentQuestionIndex < state.mirrorQuestions.length - 1) {
        state.currentQuestionIndex++;
        state.mirrorPhase = 'question';
        renderApp();
    } else {
        // 全問終了
        state.mirrorPhase = 'complete';
        renderApp();
    }
}

// 回答開始ボタン
window.startAnswer = () => {
    state.mirrorPhase = 'question';
    renderApp();
    // 少し遅延してからタイマー開始（UI更新を待つ）
    setTimeout(() => {
        startCountdown();
    }, 300);
};

// カンペ機能: 長押し検知
let longPressTimer = null;

window.handleCheatSheetStart = (event) => {
    event.preventDefault();
    longPressTimer = setTimeout(() => {
        state.showCheatSheet = true;
        renderApp();
    }, 500); // 500ms長押し
};

window.handleCheatSheetEnd = () => {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
    state.showCheatSheet = false;
    renderApp();
};

// ミラーモード再開
window.restartMirrorMode = () => {
    generateMirrorQuestions();
    state.mirrorPhase = 'ready';
    state.currentQuestionIndex = 0;
    state.countdownTimer = 20;
    state.countdownActive = false;
    state.showCheatSheet = false;
    renderApp();
};

// 同じ質問に再挑戦
window.retryMirrorQuestion = () => {
    // 音声認識を停止
    if (state.speechRecognition.recognition && state.speechRecognition.isActive) {
        stopSpeechRecognition();
    }
    // 文字起こし結果をリセット（再挑戦時は新しい録音を開始）
    state.speechRecognition.transcribedText = '';
    state.speechRecognition.interimText = '';
    state.mirrorReviewData.speechTranscription = '';
    state.mirrorPhase = 'question';
    state.countdownTimer = 20;
    state.countdownActive = false;
    state.showCheatSheet = false;
    // レビューデータは保持（フィードバック等）
    renderApp();
};

// ミラーモードUIレンダリング
function renderMirrorMode() {
    const currentQuestion = state.mirrorQuestions[state.currentQuestionIndex];
    const questionNumber = state.currentQuestionIndex + 1;
    const totalQuestions = state.mirrorQuestions.length;
    const answerMemo = currentQuestion ? (state.answers[currentQuestion.q] || null) : null;
    
    // カウントダウンの進捗率（0-1）
    const progress = state.countdownTimer / 20;
    const circumference = 2 * Math.PI * 45; // 半径45の円周
    const offset = circumference * (1 - progress);
    
    if (state.mirrorPhase === 'waiting') {
        return `
            <div class="mirror-container fixed inset-0 bg-slate-900 flex items-center justify-center">
                <div class="neo-modal w-full max-w-md p-6 text-center">
                    <div class="mb-6">
                        <div class="neo-btn neo-card-inset p-4 rounded-full inline-block mb-4 text-purple-600">
                            ${ICONS.User}
                        </div>
                        <h2 class="text-2xl font-bold text-slate-800 mb-2">一人ロープレ・ミラーモード</h2>
                        <p class="text-slate-600 text-sm">カメラへのアクセスを許可してください</p>
                    </div>
                    <button onclick="exitMirrorMode()" class="neo-btn px-6 py-3 font-bold text-slate-700 cursor-pointer">
                        キャンセル
                    </button>
                </div>
            </div>
        `;
    }
    
    if (state.mirrorPhase === 'ready') {
        return `
            <div class="mirror-container fixed inset-0 bg-slate-900">
                <video id="mirror-video" class="mirror-video" autoplay playsinline></video>
                <div class="mirror-overlay fixed inset-0 flex items-center justify-center p-4">
                    <div class="neo-modal w-full max-w-2xl p-6 text-center">
                        <div class="mb-6">
                            <div class="neo-btn neo-card-inset p-4 rounded-full inline-block mb-4 text-purple-600">
                                ${ICONS.User}
                            </div>
                            <h2 class="text-2xl font-bold text-slate-800 mb-2">準備完了</h2>
                            <p class="text-slate-600 mb-4">${state.mirrorQuestions.length}問の質問に20秒で答える練習を開始します</p>
                            <p class="text-sm text-slate-500">${state.mirrorQuestionMode === 'random' ? '質問はランダムに選ばれました' : '選択した質問で練習します'}</p>
                        </div>
                        <div class="flex gap-3 justify-center">
                            <button onclick="exitMirrorMode()" class="neo-btn px-6 py-3 font-bold text-slate-700 cursor-pointer">
                                キャンセル
                            </button>
                            <button onclick="startAnswer()" class="neo-btn-primary px-8 py-3 font-bold cursor-pointer">
                                ${ICONS.Play} 開始
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    if (state.mirrorPhase === 'review') {
        const reviewQuestion = currentQuestion;
        const existingAnswer = state.answers[reviewQuestion.q] || null;
        const hasExistingAnswer = hasAnswer(reviewQuestion.q);
        // 音声認識結果は無効化中（常に空文字列）
        // const speechText = state.mirrorReviewData.speechTranscription || '';
        // テキストボックスの初期値：既存の入力値があればそれを使用、なければ空
        const initialInputValue = state.mirrorReviewData.aiAnswerInput || '';
        
        return `
            <div class="mirror-container fixed inset-0 bg-slate-900">
                <video id="mirror-video" class="mirror-video" autoplay playsinline></video>
                <div class="mirror-overlay fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
                    <div class="mirror-review-card neo-card w-full max-w-4xl p-6 sm:p-8 my-8 animate-fade-in">
                        <!-- 質問表示（再確認用） -->
                        <div class="mb-6 pb-6 border-b border-slate-200">
                            <div class="flex items-center gap-2 mb-3">
                                <span class="neo-chip text-slate-600">Q. ${reviewQuestion.no}</span>
                                <span class="text-xs text-slate-500">質問 ${questionNumber} / ${totalQuestions}</span>
                                ${!hasExistingAnswer ? '<span class="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">回答未記入</span>' : ''}
                            </div>
                            <h3 class="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">${reviewQuestion.q}</h3>
                        </div>
                        
                        <!-- AI回答作成セクション -->
                        <div class="mb-6 pb-6 border-b border-slate-200">
                            <div class="flex items-center gap-2 mb-4">
                                <span class="text-purple-600">${ICONS.Sparkles}</span>
                                <h4 class="font-bold text-lg text-slate-800">AIで回答案を作成</h4>
                            </div>
                            <!-- 音声認識結果表示（完全に削除） -->
                            <div class="space-y-3">
                                <textarea 
                                    id="mirror-ai-answer-input"
                                    class="w-full p-3 neo-card-inset rounded-lg h-32 focus:ring-2 focus:ring-purple-500 appearance-none text-sm"
                                    placeholder="回答のメモ・キーワードを入力（例：結論：〇〇です&#10;理由：なぜなら〜&#10;具体例：例えば〜）">${initialInputValue}</textarea>
                                <p class="text-xs text-slate-400">※箇条書きやキーワードだけでOK。AIがPREP法に整えます。</p>
                                
                                <!-- 音声認識ボタン（無効化中） -->
                                <!-- ${(window.SpeechRecognition || window.webkitSpeechRecognition) ? `
                                    <div class="flex gap-2">
                                        ${state.speechRecognition.isActive ? `
                                            <button 
                                                onclick="stopSpeechRecognition()" 
                                                class="flex-1 py-3 neo-btn-warn rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer">
                                                <span class="w-4 h-4 rounded-full bg-red-500 speech-recording-indicator"></span>
                                                録音停止
                                            </button>
                                        ` : `
                                            <button 
                                                onclick="startSpeechRecognition()" 
                                                class="flex-1 py-3 neo-btn rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer speech-recognition-button">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                                    <line x1="12" y1="19" x2="12" y2="23"/>
                                                    <line x1="8" y1="23" x2="16" y2="23"/>
                                                </svg>
                                                音声入力
                                            </button>
                                        `}
                                    </div>
                                ` : `
                                    <div class="neo-card-inset p-3 rounded-lg text-xs text-slate-500 text-center">
                                        音声認識機能はChromeまたはEdgeでのみ利用可能です
                                    </div>
                                `}
                                
                                ${state.speechRecognition.isActive ? `
                                    <div class="neo-card-inset p-3 rounded-lg text-sm text-slate-600">
                                        <div class="flex items-center gap-2 mb-1">
                                            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                            <span class="font-bold">録音中...</span>
                                        </div>
                                        ${state.speechRecognition.interimText ? `
                                            <div class="text-xs text-slate-500 mt-1 italic">${state.speechRecognition.interimText}</div>
                                        ` : ''}
                                    </div>
                                ` : ''}
                                
                                ${state.speechRecognition.errorMessage ? `
                                    <div class="neo-card-inset text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                                        ${ICONS.AlertCircle} ${state.speechRecognition.errorMessage}
                                    </div>
                                ` : ''} -->
                                
                                ${state.mirrorReviewData.aiAnswerError ? `
                                    <div class="neo-card-inset text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                                        ${ICONS.AlertCircle} ${state.mirrorReviewData.aiAnswerError}
                                    </div>
                                ` : ''}
                                <button 
                                    onclick="runAiAnswerGenerationForMirror()" 
                                    ${state.mirrorReviewData.aiAnswerLoading ? 'disabled' : ''} 
                                    class="w-full py-3 neo-btn-primary rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
                                    ${state.mirrorReviewData.aiAnswerLoading ? ICONS.Loader2 : ICONS.Sparkles} 
                                    ${state.mirrorReviewData.aiAnswerLoading ? '生成中...' : 'AIで回答を作成する'}
                                </button>
                                ${existingAnswer ? `
                                    <div class="mt-4 neo-card-inset p-4 rounded-lg">
                                        <div class="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2">
                                            ${ICONS.BookOpen} 保存済み回答メモ
                                        </div>
                                        <div class="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">${existingAnswer}</div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <!-- フィードバック入力セクション -->
                        <div class="mb-6 pb-6 border-b border-slate-200">
                            <div class="flex items-center gap-2 mb-4">
                                <span class="text-blue-600">${ICONS.Edit}</span>
                                <h4 class="font-bold text-lg text-slate-800">フィードバック</h4>
                            </div>
                            <div class="space-y-4">
                                <div>
                                    <label class="flex items-center gap-2 font-bold text-green-700 mb-2">
                                        ${ICONS.CheckCircle} Good Point
                                    </label>
                                    <textarea 
                                        id="mirror-fb-good"
                                        class="w-full p-3 neo-card-inset rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[80px] text-sm appearance-none"
                                        placeholder="例：結論ファーストで分かりやすかった。">${state.mirrorReviewData.feedbackGood}</textarea>
                                </div>
                                <div>
                                    <label class="flex items-center gap-2 font-bold text-orange-700 mb-2">
                                        ${ICONS.AlertCircle} More / 改善点
                                    </label>
                                    <textarea 
                                        id="mirror-fb-more"
                                        class="w-full p-3 neo-card-inset rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[80px] text-sm appearance-none"
                                        placeholder="例：話が長すぎる。具体性に欠ける。">${state.mirrorReviewData.feedbackMore}</textarea>
                                </div>
                                <button 
                                    onclick="saveMirrorFeedback()" 
                                    class="w-full py-3 neo-btn-primary rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer">
                                    ${ICONS.Save} フィードバックを保存
                                </button>
                            </div>
                        </div>
                        
                        <!-- アクションボタン -->
                        <div class="flex flex-col sm:flex-row gap-3">
                            <button onclick="retryMirrorQuestion()" class="flex-1 neo-btn px-6 py-3 font-bold text-slate-700 cursor-pointer flex items-center justify-center gap-2">
                                ${ICONS.RefreshCw} もう一度挑戦
                            </button>
                            <button onclick="nextQuestion()" class="flex-1 neo-btn-primary px-6 py-3 font-bold cursor-pointer flex items-center justify-center gap-2">
                                ${ICONS.ChevronDown} 次へ進む
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    if (state.mirrorPhase === 'complete') {
        return `
            <div class="mirror-container fixed inset-0 bg-slate-900">
                <video id="mirror-video" class="mirror-video" autoplay playsinline></video>
                <div class="mirror-overlay fixed inset-0 flex items-center justify-center p-4">
                    <div class="neo-modal w-full max-w-md p-6 text-center">
                        <div class="mb-6">
                            <div class="neo-btn neo-card-inset p-4 rounded-full inline-block mb-4 text-green-600">
                                ${ICONS.CheckCircle}
                            </div>
                            <h2 class="text-2xl font-bold text-slate-800 mb-2">練習完了！</h2>
                            <p class="text-slate-600">${state.mirrorQuestions.length}問すべての練習が終わりました</p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <button onclick="restartMirrorMode()" class="neo-btn-primary w-full py-3 font-bold cursor-pointer">
                                ${ICONS.RefreshCw} もう一度練習
                            </button>
                            <button onclick="exitMirrorMode()" class="neo-btn w-full py-3 font-bold text-slate-700 cursor-pointer">
                                メインページに戻る
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 質問表示中
    // リアルタイム文字起こし表示（無効化中 - 完全に削除）
    
    return `
        <div class="mirror-container fixed inset-0 bg-slate-900">
            <video id="mirror-video" class="mirror-video" autoplay playsinline></video>
            <div class="mirror-overlay fixed inset-0 flex flex-col items-center p-4 overflow-hidden">
                
                <!-- コンテンツエリア（中央配置、画面内に収まるように） -->
                <div class="mirror-content-area w-full max-w-3xl flex flex-col items-center justify-center flex-1 min-h-0">
                    <!-- 質問カード -->
                    <div class="mirror-question-card neo-card w-full p-6 sm:p-8 mb-4 sm:mb-6 animate-fade-in flex-shrink-0">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-3">
                                <div class="neo-btn neo-card-inset p-3 rounded-xl text-purple-600">
                                    ${ICONS.User}
                                </div>
                                <div>
                                    <div class="text-xs font-bold text-slate-500 mb-1">質問 ${questionNumber} / ${totalQuestions}</div>
                                    <h3 class="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">${currentQuestion.q}</h3>
                                </div>
                            </div>
                        </div>
                        
                        ${!state.countdownActive ? `
                            <button onclick="startAnswer()" class="neo-btn-primary w-full py-4 font-bold text-lg cursor-pointer mt-4">
                                ${ICONS.Play} 回答開始
                            </button>
                        ` : ''}
                    </div>
                    
                    <!-- タイマー -->
                    ${state.countdownActive ? `
                        <div class="mirror-timer-container relative flex-shrink-0">
                            <svg class="mirror-timer-circle" width="120" height="120">
                                <circle cx="60" cy="60" r="45" stroke="#e0e5ec" stroke-width="8" fill="none"/>
                                <circle id="mirror-timer-circle" cx="60" cy="60" r="45" 
                                    stroke="${state.countdownTimer <= 5 ? '#ef4444' : state.countdownTimer <= 10 ? '#f59e0b' : '#4d7cff'}" 
                                    stroke-width="8" 
                                    fill="none"
                                    stroke-dasharray="${circumference}"
                                    stroke-dashoffset="${offset}"
                                    stroke-linecap="round"
                                    transform="rotate(-90 60 60)"
                                    class="transition-all duration-300"/>
                            </svg>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <span id="mirror-timer-number" class="text-3xl font-black ${state.countdownTimer <= 5 ? 'text-red-600' : state.countdownTimer <= 10 ? 'text-amber-600' : 'text-blue-600'}">
                                    ${state.countdownTimer}
                                </span>
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- カンペボタン -->
                    ${state.countdownActive && answerMemo ? `
                        <button 
                            onmousedown="handleCheatSheetStart(event)"
                            onmouseup="handleCheatSheetEnd()"
                            onmouseleave="handleCheatSheetEnd()"
                            ontouchstart="handleCheatSheetStart(event)"
                            ontouchend="handleCheatSheetEnd()"
                            class="neo-btn px-6 py-3 font-bold text-slate-700 cursor-pointer mt-4 flex-shrink-0">
                            ${ICONS.BookOpen} 回答ヒント（長押し）
                        </button>
                    ` : ''}
                    
                    <!-- カンペ表示 -->
                    ${state.showCheatSheet && answerMemo ? `
                        <div class="mirror-cheatsheet neo-card-inset w-full p-6 mt-4 animate-fade-in flex-shrink-0">
                            <div class="text-xs font-bold text-slate-500 mb-2">回答メモ</div>
                            <div class="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap opacity-80">${answerMemo}</div>
                        </div>
                    ` : ''}
                    
                    <!-- 終了ボタン -->
                    <button onclick="exitMirrorMode()" class="neo-btn mt-6 px-6 py-2 font-bold text-slate-600 cursor-pointer text-sm flex-shrink-0">
                        ${ICONS.X} 終了
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 質問選択モーダル
function renderMirrorSelectionModal() {
    if (!state.mirrorSelectionModalOpen) return '';
    
    const allQuestions = state.categories.flatMap(cat => 
        cat.questions.map(q => ({ ...q, categoryTitle: cat.title, categoryId: cat.id }))
    );
    
    const selectedCount = state.mirrorSelectedQuestions.length;
    
    return `
        <div class="fixed inset-0 z-[90] flex items-center justify-center p-4 modal-overlay animate-fade-in" onclick="closeMirrorSelectionModal()">
            <div class="neo-modal w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col" onclick="event.stopPropagation()">
                <div class="neo-modal-header p-6 flex justify-between items-center shrink-0">
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                            ${ICONS.Target} 質問を選択
                        </h3>
                        <p class="text-sm text-slate-600 mt-1">練習したい質問を選択してください（${selectedCount}問選択中）</p>
                    </div>
                    <button onclick="closeMirrorSelectionModal()" class="neo-btn neo-close p-2 rounded-full">${ICONS.X}</button>
                </div>
                <div class="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <div class="space-y-4">
                        ${state.categories.map(cat => `
                            <div class="mb-6">
                                <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    ${ICONS[cat.icon] || ICONS.Target}
                                    ${cat.title}
                                </h4>
                                <div class="space-y-2">
                                    ${cat.questions.map(q => {
                                        const isSelected = state.mirrorSelectedQuestions.some(sq => sq.no === q.no);
                                        const hasAnswer = state.answers[q.q] && state.answers[q.q].trim().length > 0;
                                        return `
                                            <button 
                                                onclick="toggleMirrorQuestion(${cat.id}, '${q.no}')"
                                                class="w-full text-left p-4 rounded-xl border-2 transition-all relative ${
                                                    isSelected 
                                                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                                                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                                                } cursor-pointer">
                                                <div class="flex items-start gap-3">
                                                    <div class="shrink-0 mt-1">
                                                        ${isSelected ? `
                                                            <div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                                                <span class="text-white text-xs font-bold">✓</span>
                                                            </div>
                                                        ` : `
                                                            <div class="w-6 h-6 rounded-full border-2 border-slate-300"></div>
                                                        `}
                                                    </div>
                                                    <div class="flex-1">
                                                        <div class="flex items-center gap-2 mb-1">
                                                            <span class="text-xs font-bold text-slate-500">${q.no}</span>
                                                            ${q.important ? '<span class="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">最重要</span>' : ''}
                                                            ${!hasAnswer ? '<span class="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">回答未記入</span>' : ''}
                                                        </div>
                                                        <p class="font-bold text-slate-800 text-sm">${q.q}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="p-6 neo-card-inset flex justify-between items-center shrink-0">
                    <div class="text-sm text-slate-600">
                        <span class="font-bold">${selectedCount}問</span> 選択中
                    </div>
                    <div class="flex gap-3">
                        <button onclick="closeMirrorSelectionModal()" class="neo-btn px-6 py-3 font-bold text-slate-700 cursor-pointer">
                            キャンセル
                        </button>
                        <button onclick="startManualMirrorMode()" ${selectedCount === 0 ? 'disabled' : ''} class="neo-btn-primary px-8 py-3 font-bold cursor-pointer ${selectedCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}">
                            ${ICONS.Play} 開始 (${selectedCount}問)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- 5. 初期描画 ---
renderApp();
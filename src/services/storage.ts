import {
  Draft,
  SavedItem,
  CommunityPrompt,
  CommunityEssay,
  EssayPrompt,
  WebsiteFeedback,
  EssayComment,
  ThemeSettings,
} from '../types';
import { countVietnameseWords, toNFC } from '../utils/text';

const STORAGE_KEYS = {
  DRAFTS: 'van_nghi_luan_drafts_v1',
  ACTIVE_DRAFT_ID: 'van_nghi_luan_active_draft_id_v1',
  SAVED_ITEMS: 'van_nghi_luan_saved_items_v1',
  COMMUNITY_PROMPTS: 'van_nghi_luan_comm_prompts_v1',
  COMMUNITY_ESSAYS: 'van_nghi_luan_comm_essays_v1',
  FEEDBACK: 'van_nghi_luan_feedback_v1',
  COMMENTS: 'van_nghi_luan_essay_comments_v1',
  THEME_SETTINGS: 'van_nghi_luan_theme_settings_v1',
  AUDIO_PREFS: 'van_nghi_luan_audio_prefs_v1',
  INTRO_SEEN: 'van_nghi_luan_intro_seen_session_v1',
};

// Initial pre-seeded demo community prompts
const INITIAL_COMMUNITY_PROMPTS: CommunityPrompt[] = [
  {
    id: 'cp-01',
    title: 'Sống chậm lại để lắng nghe tiếng nói bên trong',
    content: 'Trước guồng quay gấp gáp của thời đại số, bạn suy nghĩ gì về giá trị của những khoảng lặng để tái tạo tâm hồn?',
    topic: 'Lối sống tích cực',
    difficulty: 'Trung bình',
    authorDisplayName: 'Thảo Linh (THPT Yên Lãng)',
    createdAt: '2026-10-12T09:30:00Z',
    keywords: ['sống chậm', 'khoảng lặng', 'lắng nghe chính mình'],
    suggestedOutline: 'Mở bài giới thiệu nhịp sống vội; Thân bài giải thích sống chậm không phải thụ động mà là tỉnh thức; Dẫn chứng thiền định và lối sống xanh; Phản biện tránh lười biếng; Kết bài rút ra hành động.',
  },
  {
    id: 'cp-02',
    title: 'Trí tuệ nhân tạo có làm cùn mòn tư duy viết văn của học sinh?',
    content: 'Nhiều bạn học sinh hiện nay có thói quen copy bài làm từ ChatGPT. Hãy bàn luận về tính liêm chính và sự tự giác khi học môn Ngữ Văn.',
    topic: 'Trí tuệ nhân tạo và con người',
    difficulty: 'Nâng cao',
    authorDisplayName: 'Anh Tuấn (Lớp 12A2)',
    createdAt: '2026-10-14T14:15:00Z',
    keywords: ['AI và viết văn', 'ChatGPT', 'liêm chính học thuật', 'tự học'],
    suggestedOutline: 'Mở bài: AI bùng nổ; Thân bài: Phân tích 2 mặt - AI gợi mở từ vựng vs làm teo tóp tư duy cảm xúc; Dẫn chứng thực tế trường lớp; Lời khuyên cho bạn cùng lớp 12.',
  },
];

// Initial pre-seeded demo community essays
const INITIAL_COMMUNITY_ESSAYS: CommunityEssay[] = [
  {
    id: 'ce-01',
    title: 'Khi ta biết cho đi, trái tim sẽ không bao giờ nghèo khó',
    promptId: 'de-01',
    promptTitle: 'Sức mạnh của sự sẻ chia trong thử thách',
    topic: 'Lòng nhân ái và sự sẻ chia',
    authorDisplayName: 'Ánh Chinh (THPT Yên Lãng)',
    createdAt: '2026-10-13T10:00:00Z',
    visibility: 'public',
    likes: 42,
    wordCount: 645,
    content: `Trong guồng quay hối hả của cuộc sống hiện đại, có những lúc con người ta dễ dàng bị cuốn vào vòng xoáy của danh vọng và những toan tính cá nhân. Thế nhưng, điều thực sự neo giữ phẩm giá và làm nên vẻ đẹp của một kiếp người lại không nằm ở những gì ta nắm giữ trong tay, mà ở những yêu thương ta đã mở lòng trao tặng. Ý kiến "Cho đi yêu thương là điều duy nhất ta giữ lại được trọn vẹn" chính là một lời nhắc nhở sâu sắc về lẽ sống vị tha và sức mạnh kỳ diệu của lòng nhân ái.

"Cho đi yêu thương" không đơn thuần là việc san sẻ của cải vật chất khi ta dư dả, mà là sự thấu cảm, sự lắng nghe và sẵn sàng chia sớt một phần hơi ấm tâm hồn cho những mảnh đời bất hạnh. Ngược lại, "giữ lại trọn vẹn" là một nghịch lý tuyệt đẹp: khi ta buông bỏ sự ích kỷ để nâng đỡ tha nhân, tài sản có thể vơi đi, nhưng sự thanh thản, lòng tự trọng và sự kính yêu của cộng đồng sẽ ở lại vĩnh hằng trong tâm khảm.

Thực tế cuộc sống đã chứng minh, sự sẻ chia chính là ngọn lửa sưởi ấm những mùa đông buốt giá nhất của đời người. Nhìn lại những đợt bão lũ lịch sử càn quét qua dải đất miền Trung hay cơn bão số 3 tàn phá miền Bắc vừa qua, ta mới thấm thía thế nào là nghĩa đồng bào. Những chuyến xe cứu trợ xuyên đêm từ mọi miền Tổ quốc, những chiếc bánh chưng gói vội còn thơm mùi lá dong, những giọt mồ hôi của các chiến sĩ dầm mình trong dòng nước siết để cứu từng em nhỏ... Đó không chỉ là sự tương trợ cơ học, mà là hiện thân rực rỡ của tinh thần "lá lành đùm lá rách". Khi trao đi một chiếc áo phao hay một gói mì tôm, người cho đâu hề tính toán thiệt hơn; cái họ nhận lại là ánh mắt rạng ngời hy vọng của người gặp nạn và sự ấm áp lan tỏa trong chính trái tim mình.

Hơn thế nữa, cho đi còn là phương thuốc diệu kỳ chữa lành chính tâm hồn chúng ta. Một dự án như "Nuôi em" của anh Hoàng Hoa Trung đã kết nối hàng ngàn bạn trẻ với các em nhỏ vùng cao Tây Bắc. Chỉ với một khoản tiền nhỏ mỗi tháng, các em có bữa cơm có thịt để kiên trì bám lớp, còn người nuôi lại tìm thấy niềm an vui, thoát khỏi những âu lo vụn vặt của đời thường. Đúng như triết gia Rabindranath Tagore từng chiêm nghiệm: "Tôi ngủ và mơ thấy cuộc đời là niềm vui. Tôi thức dậy và thấy cuộc đời là bổn phận. Tôi hành động và thấy bổn phận chính là niềm vui."

Tuy nhiên, sẻ chia không đồng nghĩa với sự ban phát trịch thượng hay lòng tốt mù quáng. Cho đi cần sự chân thành và tinh tế để không làm tổn thương lòng tự trọng của người nhận. Bên cạnh đó, cũng cần lên án những kẻ lợi dụng danh nghĩa từ thiện để trục lợi hay đánh bóng tên tuổi trên không gian mạng.

Là một học sinh lớp 12 đang đứng trước ngưỡng cửa trưởng thành, em nhận thức sâu sắc rằng học cách sẻ chia không phải điều gì quá xa vời. Đó là chia sẻ một mẩu giấy nháp, một phương pháp giải bài cho bạn bè cùng tiến bộ; là sự hiếu thảo đỡ đần cha mẹ sau những giờ học căng thẳng. Hãy sống như một dòng sông luôn mang phù sa bồi đắp đôi bờ, để khi nhìn lại, ta tự hào vì đã không sống một cuộc đời hoài phí.`,
  },
  {
    id: 'ce-02',
    title: 'Bản lĩnh trước nghịch cảnh: Khi thử thách tôi luyện nên kim cương',
    promptId: 'de-04',
    promptTitle: 'Bản lĩnh đối diện và vượt qua nghịch cảnh',
    topic: 'Ý chí, nghị lực và bản lĩnh',
    authorDisplayName: 'Nguyễn Anh Tuấn (12A2)',
    createdAt: '2026-10-14T11:20:00Z',
    visibility: 'public',
    likes: 38,
    wordCount: 680,
    content: `Cuộc sống chưa bao giờ là một tấm thảm nhung trải dài hoa hồng êm ái. Nó là sự đan xen của những ngày nắng rực rỡ và những cơn dông bão bất chợt. Trước những sóng gió khôn lường ấy, sự khác biệt lớn nhất giữa một kẻ tầm thường và một người phi thường nằm ở chữ "bản lĩnh". Đúng như danh ngôn từng đúc kết: "Cây sồi trở nên vững chãi chính nhờ những cơn gió ngược, và kim cương sáng lấp lánh bởi chịu được áp lực khổng lồ dưới lòng đất."

Bản lĩnh trước nghịch cảnh không phải là sự liều lĩnh mù quáng hay thái độ bất cần, mà là sự điềm tĩnh đón nhận biến cố, là ý chí kiên định không chịu khuất phục và năng lực tìm kiếm giải pháp ngay trong lúc cùng cực nhất. Người có bản lĩnh coi nghịch cảnh không phải là dấu chấm hết, mà là một bài kiểm tra nghiêm khắc để nhận diện sức mạnh tiềm ẩn của chính mình.

Lịch sử và cuộc đời đã chứng kiến biết bao tấm gương sáng ngời về bản lĩnh thép. Hãy nhớ về thầy giáo Nguyễn Ngọc Ký, người đã biến đôi chân run rẩy vì số phận nghiệt ngã thành cây bút vẽ nên cuộc đời diệu kỳ. Hay câu chuyện truyền cảm hứng toàn cầu của Nick Vujicic — một chàng trai sinh ra không tay không chân nhưng lại đi khắp thế giới để truyền ngọn lửa tin yêu cho hàng triệu con người. Họ không chọn được số phận khi sinh ra, nhưng họ đã chọn cách đứng vững kiêu hãnh trước sóng gió.

Nghịch cảnh còn là chiếc phễu lọc giúp con người trưởng thành nhanh nhất. Nó đánh thức lòng can đảm ngủ quên, gột rửa những ảo tưởng ngây thơ và rèn giũa cho ta đức tính kiên nhẫn. Một người chỉ quen sống trong nhung lụa bình yên sẽ rất dễ gục ngã khi gặp biến cố đầu tiên của cuộc đời. Ngược lại, người từng kinh qua sương gió sẽ sở hữu một nội tâm vững vàng như ngọn hải đăng giữa biển động.

Tuy vậy, có bản lĩnh không có nghĩa là tự cô lập mình hay gồng mình chịu đựng trong tuyệt vọng mà không dám tìm kiếm sự trợ giúp. Bản lĩnh đích thực luôn đi kèm với sự khiêm nhường và trí tuệ để biết khi nào cần kiên định, khi nào cần lắng nghe và học hỏi.

Đứng trước năm học cuối cấp với bao áp lực thi cử và những ngã rẽ cuộc đời, mỗi học sinh lớp 12 chúng ta cần trui rèn cho mình bản lĩnh ấy. Đừng hoảng sợ trước một điểm số chưa như ý, đừng thoái lui trước một bài toán khó hay một đề văn hóc búa. Hãy mỉm cười đón nhận thử thách, bởi chính những đêm thức trắng ôn bài hôm nay sẽ kết tinh thành đôi cánh nâng ta bay vào tương lai.`,
  },
  {
    id: 'ce-03',
    title: 'Thức tỉnh trước chiếc màn hình: Tìm lại thời gian thực cho tuổi trẻ',
    promptId: 'de-16',
    promptTitle: 'Thực trạng nghiện mạng xã hội ở giới trẻ hiện nay',
    topic: 'Công nghệ và thế hệ trẻ',
    authorDisplayName: 'Võ Thị Mỹ Ngà (GV Hướng dẫn)',
    createdAt: '2026-10-15T08:00:00Z',
    visibility: 'public',
    likes: 56,
    wordCount: 695,
    content: `Trong thế kỷ XXI, chỉ cần một cú chạm nhẹ vào màn hình cảm ứng, cả thế giới dường như đã thu nhỏ lại trong lòng bàn tay. Mạng xã hội đã mở ra những chân trời giao lưu vô tận, xóa nhòa mọi khoảng cách địa lý. Thế nhưng, giữa dòng xoáy công nghệ ấy, một nghịch lý đau lòng đang diễn ra: con người kết nối với nhau nhiều hơn qua thế giới ảo, nhưng lại dần xa cách nhau trong thế giới thực; chúng ta mải miết "lướt" màn hình mà vô tình "lướt" qua chính tuổi trẻ của mình.

Chiếc điện thoại thông minh vốn sinh ra như một công cụ đắc lực để phục vụ đời sống, nhưng giờ đây nó đang có nguy cơ biến thành "kẻ cai trị" vô hình. Hội chứng sợ bỏ lỡ (FOMO), thói quen kiểm tra thông báo mỗi phút, hay cơn nghiện những đoạn video ngắn (Shorts/TikTok) dài vài chục giây đang âm thầm bào mòn khả năng tập trung sâu của thế hệ trẻ. Nhiều bạn trẻ dành tới 6 đến 8 tiếng mỗi ngày chỉ để xem cuộc sống của người khác qua những bức ảnh đã qua chỉnh sửa, rồi tự dằn vặt bản thân bằng những so sánh vô nghĩa.

Cái giá phải trả cho sự nghiện ngập công nghệ này là vô cùng đắt đỏ. Đó là sự suy giảm thị lực, là giấc ngủ chập chờn, là sự cùn mòn của năng lực tư duy phản biện và khả năng cảm thụ văn chương sâu sắc. Nguy hiểm hơn, nó làm teo tóp những tương tác người - người ấm áp. Còn gì buồn hơn bữa cơm gia đình mà mỗi thành viên đều cúi gằm mặt vào chiếc điện thoại riêng, hay những cuộc gặp gỡ bạn bè mà chẳng ai chịu lắng nghe nhau bằng mắt và bằng trái tim?

Tuy nhiên, chúng ta không thể bài xích công nghệ theo lối cực đoan, bởi mạng xã hội là xu thế tất yếu của thời đại và mang lại vô vàn tri thức nếu biết khai thác đúng cách. Vấn đề không nằm ở thuật toán hay màn hình, mà nằm ở bản lĩnh và khả năng tự chủ của người cầm máy.

Hỡi những người bạn trẻ đang chuẩn bị bước vào ngưỡng cửa đại học, hãy dũng cảm đặt chiếc điện thoại xuống! Hãy ngẩng đầu lên để ngắm nhìn vòm trời xanh, để đọc trọn vẹn một cuốn sách hay, để lắng nghe tiếng thở dài nhọc nhằn của cha mẹ và nở một nụ cười ấm áp với người bên cạnh. Hãy làm chủ công nghệ, đừng để công nghệ biến bạn thành một nô lệ vô hồn giữa cuộc đời tươi đẹp này.`,
  },
];

// Initial pre-seeded demo feedback for "Góc góp ý"
const INITIAL_FEEDBACK: WebsiteFeedback[] = [
  {
    id: 'fb-01',
    authorName: 'Minh Thư (Lớp 12 Văn)',
    content: 'Giao diện màu giấy sách rất ấm và dịu mắt, mình học bài buổi tối không bị mỏi mắt. Kho 100 đề có phân loại chủ đề rất tiện cho việc ôn thi tốt nghiệp!',
    rating: 5,
    category: 'Giao diện',
    createdAt: '2026-10-14T15:20:00Z',
  },
  {
    id: 'fb-02',
    authorName: 'Trần Hoàng Long (12A1)',
    content: 'Tính năng dàn ý 7 phần (A đến G) rất logic và chuẩn mực sư phạm. Phần phản biện và mở rộng giúp bài viết của mình sâu sắc hơn hẳn thay vì chỉ viết một chiều.',
    rating: 5,
    category: 'Dàn ý',
    createdAt: '2026-10-15T09:10:00Z',
  },
  {
    id: 'fb-03',
    authorName: 'Bảo Trâm (Học sinh lớp 12)',
    content: 'Kho dẫn chứng cập nhật cả các sự kiện gần gũi như dự án Nuôi Em và bão Yagi kèm hướng dẫn cách đưa vào bài rất thiết thực, tránh bị sáo rỗng.',
    rating: 5,
    category: 'Kho dẫn chứng',
    createdAt: '2026-10-15T18:45:00Z',
  },
];

// Initial pre-seeded demo essay comments
const INITIAL_COMMENTS: EssayComment[] = [
  {
    id: 'cm-01',
    essayId: 'ce-01',
    authorName: 'Khánh Linh (12D1)',
    content: 'Bài viết hành văn rất mượt mà và cảm xúc! Mình rất thích đoạn phân tích dẫn chứng về dự án Nuôi Em kết hợp câu danh ngôn của Tagore.',
    createdAt: '2026-10-14T08:30:00Z',
  },
  {
    id: 'cm-02',
    essayId: 'ce-01',
    authorName: 'Hoàng Bách (THPT Yên Lãng)',
    content: 'Đoạn lật ngược vấn đề về việc từ thiện không được ban phát trịch thượng rất sắc sảo, đúng tính chất phản biện của học sinh lớp 12.',
    createdAt: '2026-10-14T11:20:00Z',
  },
];

// Initial demo draft
const INITIAL_DEFAULT_DRAFT: Draft = {
  id: 'draft-sample-01',
  title: 'Bản lĩnh tuổi trẻ trước áp lực đồng trang lứa',
  promptId: 'de-08',
  promptTitle: 'Sức mạnh kiên định trước áp lực đồng trang lứa (Peer pressure)',
  content: `Áp lực đồng trang lứa (peer pressure) dường như đã trở thành một người bạn đồng hành bất đắc dĩ của thế hệ học sinh chúng em. Khi nhìn sang bạn bè xung quanh với những bảng điểm xuất sắc, những giải thưởng quốc tế hay những bộ trang phục hàng hiệu lộng lẫy, không ít lần em cảm thấy mình thật nhỏ bé và lạc lõng.

Thế nhưng, hành trình trưởng thành không phải là một cuộc chạy đua xem ai về đích trước, mà là một cuộc leo núi để khám phá giới hạn của chính mình. Mỗi người đều có một múi giờ phát triển riêng biệt: bông hoa sen không thể nở cùng mùa với hoa mai, và cây sồi cổ thụ cũng không thể lớn nhanh như một bụi cỏ dại.

Bản lĩnh của người trẻ thể hiện ở chỗ: ta biết ngưỡng mộ thành công của người khác nhưng không lấy đó làm thước đo tự ti để hạ thấp giá trị bản thân. Thay vì mải miết sao chép cuộc đời của ai đó, em chọn cách tập trung vào sự tiến bộ 1% của chính mình mỗi ngày...`,
  wordCount: 168,
  characterCount: 1120,
  createdAt: '2026-10-15T08:00:00Z',
  updatedAt: '2026-10-16T05:30:00Z',
  targetWordCount: 600,
  status: 'Đang viết',
};

// Safe LocalStorage helpers
function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

export const StorageService = {
  // --- DRAFTS ---
  getDrafts(): Draft[] {
    const drafts = safeGetItem<Draft[]>(STORAGE_KEYS.DRAFTS, []);
    if (drafts.length === 0) {
      safeSetItem(STORAGE_KEYS.DRAFTS, [INITIAL_DEFAULT_DRAFT]);
      return [INITIAL_DEFAULT_DRAFT];
    }
    return drafts;
  },

  getDraftById(id: string): Draft | null {
    const drafts = this.getDrafts();
    return drafts.find((d) => d.id === id) || null;
  },

  getActiveDraftId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_DRAFT_ID);
  },

  setActiveDraftId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_DRAFT_ID, id);
  },

  saveDraft(draft: Omit<Draft, 'wordCount' | 'characterCount' | 'updatedAt'> & { content: string }): Draft {
    const drafts = this.getDrafts();
    const now = new Date().toISOString();
    const normalizedContent = toNFC(draft.content);
    const wordCount = countVietnameseWords(normalizedContent);
    const characterCount = normalizedContent.length;

    const fullDraft: Draft = {
      ...draft,
      content: normalizedContent,
      wordCount,
      characterCount,
      updatedAt: now,
      createdAt: draft.createdAt || now,
      targetWordCount: draft.targetWordCount || 600,
      status: draft.status || 'Đang viết',
    };

    const index = drafts.findIndex((d) => d.id === draft.id);
    if (index >= 0) {
      drafts[index] = fullDraft;
    } else {
      drafts.unshift(fullDraft);
    }

    safeSetItem(STORAGE_KEYS.DRAFTS, drafts);
    this.setActiveDraftId(fullDraft.id);
    return fullDraft;
  },

  createNewDraft(prompt?: EssayPrompt): Draft {
    const newDraft: Draft = {
      id: 'draft-' + Date.now(),
      title: prompt ? `Bài viết: ${prompt.title}` : 'Bản nháp mới ' + new Date().toLocaleDateString('vi-VN'),
      promptId: prompt?.id,
      promptTitle: prompt?.title,
      content: '',
      wordCount: 0,
      characterCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetWordCount: 600,
      status: 'Đang viết',
    };

    const drafts = this.getDrafts();
    drafts.unshift(newDraft);
    safeSetItem(STORAGE_KEYS.DRAFTS, drafts);
    this.setActiveDraftId(newDraft.id);
    return newDraft;
  },

  deleteDraft(id: string): void {
    const drafts = this.getDrafts().filter((d) => d.id !== id);
    safeSetItem(STORAGE_KEYS.DRAFTS, drafts);
    if (this.getActiveDraftId() === id) {
      if (drafts.length > 0) {
        this.setActiveDraftId(drafts[0].id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_DRAFT_ID);
      }
    }
  },

  renameDraft(id: string, newTitle: string): void {
    const drafts = this.getDrafts();
    const draft = drafts.find((d) => d.id === id);
    if (draft) {
      draft.title = toNFC(newTitle);
      draft.updatedAt = new Date().toISOString();
      safeSetItem(STORAGE_KEYS.DRAFTS, drafts);
    }
  },

  // --- SAVED ITEMS (BOOKMARKS) ---
  getSavedItems(): SavedItem[] {
    return safeGetItem<SavedItem[]>(STORAGE_KEYS.SAVED_ITEMS, []);
  },

  isItemSaved(itemId: string): boolean {
    const items = this.getSavedItems();
    return items.some((i) => i.itemId === itemId);
  },

  toggleSaveItem(item: Omit<SavedItem, 'id' | 'savedAt'>): boolean {
    const items = this.getSavedItems();
    const existingIndex = items.findIndex((i) => i.itemId === item.itemId);

    if (existingIndex >= 0) {
      items.splice(existingIndex, 1);
      safeSetItem(STORAGE_KEYS.SAVED_ITEMS, items);
      return false; // Removed
    } else {
      const newItem: SavedItem = {
        ...item,
        id: 'saved-' + Date.now(),
        savedAt: new Date().toISOString(),
      };
      items.unshift(newItem);
      safeSetItem(STORAGE_KEYS.SAVED_ITEMS, items);
      return true; // Added
    }
  },

  removeSavedItem(itemId: string): void {
    const items = this.getSavedItems().filter((i) => i.itemId !== itemId);
    safeSetItem(STORAGE_KEYS.SAVED_ITEMS, items);
  },

  // --- COMMUNITY PROMPTS & ESSAYS ---
  getCommunityPrompts(): CommunityPrompt[] {
    return safeGetItem<CommunityPrompt[]>(STORAGE_KEYS.COMMUNITY_PROMPTS, INITIAL_COMMUNITY_PROMPTS);
  },

  addCommunityPrompt(promptData: Omit<CommunityPrompt, 'id' | 'createdAt'>): CommunityPrompt {
    const prompts = this.getCommunityPrompts();
    const newPrompt: CommunityPrompt = {
      ...promptData,
      id: 'cp-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    prompts.unshift(newPrompt);
    safeSetItem(STORAGE_KEYS.COMMUNITY_PROMPTS, prompts);
    return newPrompt;
  },

  getCommunityEssays(): CommunityEssay[] {
    return safeGetItem<CommunityEssay[]>(STORAGE_KEYS.COMMUNITY_ESSAYS, INITIAL_COMMUNITY_ESSAYS);
  },

  addCommunityEssay(essayData: Omit<CommunityEssay, 'id' | 'createdAt' | 'likes' | 'wordCount'>): CommunityEssay {
    const essays = this.getCommunityEssays();
    const normalizedContent = toNFC(essayData.content);
    const newEssay: CommunityEssay = {
      ...essayData,
      content: normalizedContent,
      id: 'ce-' + Date.now(),
      createdAt: new Date().toISOString(),
      likes: 0,
      wordCount: countVietnameseWords(normalizedContent),
    };
    essays.unshift(newEssay);
    safeSetItem(STORAGE_KEYS.COMMUNITY_ESSAYS, essays);
    return newEssay;
  },

  likeCommunityEssay(id: string): void {
    const essays = this.getCommunityEssays();
    const essay = essays.find((e) => e.id === id);
    if (essay) {
      essay.likes = (essay.likes || 0) + 1;
      safeSetItem(STORAGE_KEYS.COMMUNITY_ESSAYS, essays);
    }
  },

  // --- WEBSITE FEEDBACK ("Góc góp ý") ---
  getFeedback(): WebsiteFeedback[] {
    return safeGetItem<WebsiteFeedback[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
  },

  addFeedback(feedbackData: Omit<WebsiteFeedback, 'id' | 'createdAt'>): WebsiteFeedback {
    const list = this.getFeedback();
    const newFeedback: WebsiteFeedback = {
      ...feedbackData,
      authorName: toNFC(feedbackData.authorName.trim() || 'Học sinh ẩn danh'),
      content: toNFC(feedbackData.content.trim()),
      id: 'fb-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    list.unshift(newFeedback);
    safeSetItem(STORAGE_KEYS.FEEDBACK, list);
    return newFeedback;
  },

  // --- ESSAY COMMENTS ---
  getComments(essayId?: string): EssayComment[] {
    const all = safeGetItem<EssayComment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    if (!essayId) return all;
    return all.filter((c) => c.essayId === essayId);
  },

  addComment(commentData: Omit<EssayComment, 'id' | 'createdAt'>): EssayComment {
    const all = safeGetItem<EssayComment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    const newComment: EssayComment = {
      ...commentData,
      authorName: toNFC(commentData.authorName.trim() || 'Bạn học'),
      content: toNFC(commentData.content.trim()),
      id: 'cm-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    all.unshift(newComment);
    safeSetItem(STORAGE_KEYS.COMMENTS, all);
    return newComment;
  },

  deleteComment(commentId: string): void {
    const all = safeGetItem<EssayComment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    const updated = all.filter((c) => c.id !== commentId);
    safeSetItem(STORAGE_KEYS.COMMENTS, updated);
  },

  // --- THEME & READING PREFERENCES ---
  getThemeSettings(): ThemeSettings {
    return safeGetItem<ThemeSettings>(STORAGE_KEYS.THEME_SETTINGS, {
      themeMode: 'light',
      fontSize: 'medium',
      lineHeight: 'normal',
      reducedMotion: false,
    });
  },

  saveThemeSettings(settings: ThemeSettings): void {
    safeSetItem(STORAGE_KEYS.THEME_SETTINGS, settings);
  },

  // --- AUDIO / TTS PREFERENCES ---
  getAudioPrefs(): { voiceName?: string; rate: number; volume: number } {
    return safeGetItem(STORAGE_KEYS.AUDIO_PREFS, {
      rate: 0.95,
      volume: 1.0,
    });
  },

  saveAudioPrefs(prefs: { voiceName?: string; rate: number; volume: number }): void {
    safeSetItem(STORAGE_KEYS.AUDIO_PREFS, prefs);
  },

  // --- SESSION STORAGE INTRO MODAL ---
  isIntroSeenInSession(): boolean {
    return sessionStorage.getItem(STORAGE_KEYS.INTRO_SEEN) === 'true';
  },

  setIntroSeenInSession(): void {
    sessionStorage.setItem(STORAGE_KEYS.INTRO_SEEN, 'true');
  },
};

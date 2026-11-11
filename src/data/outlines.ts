import { Outline, EssayPrompt } from '../types';

export const FLAGSHIP_OUTLINES: Record<string, Outline> = {
  'ol-01': {
    id: 'ol-01',
    promptId: 'de-01',
    promptTitle: 'Sức mạnh của sự sẻ chia trong thử thách',
    introduction: {
      leadIn: 'Trong hành trình nhân sinh, con người không thể tồn tại như một ốc đảo biệt lập giữa đại dương cuộc đời.',
      problemStatement: 'Ý kiến "Cho đi yêu thương là điều duy nhất ta giữ lại được trọn vẹn" đã khẳng định chân lý muôn đời về giá trị của sự sẻ chia.',
      thesis: 'Sự sẻ chia không làm ta vơi cạn của cải hay tình cảm, mà trái lại nhân lên gấp bội niềm hạnh phúc và ý nghĩa sống.',
    },
    explanations: {
      keyTerms: '"Cho đi yêu thương" là sự san sẻ vật chất, thời gian, sự thấu cảm và tình người không toan tính vụ lợi. "Giữ lại trọn vẹn" là sự lưu giữ vĩnh cửu trong ký ức, tâm hồn và sự kính trọng của cộng đồng.',
      centralIssue: 'Khẳng định giá trị nhân văn cao quý của lối sống vị tha, tương thân tương ái trong một xã hội văn minh.',
    },
    arguments: [
      {
        id: 'arg-1',
        title: 'Sự sẻ chia xoa dịu những nỗi đau và tiếp thêm niềm tin sống cho người khó khăn',
        reasoning: 'Một giọt máu cho đi, một củ khoai sẻ nửa trong cơn hoạn nạn có thể cứu sống một số phận hoặc vực dậy một tâm hồn bên bờ tuyệt vọng.',
        elaboration: 'Khi nhận được sự nâng đỡ đúng lúc, người yếu thế cảm thấy mình không bị bỏ rơi, từ đó nhen nhóm lại ý chí chiến đấu với số phận.',
        suggestedEvidence: 'Các mô hình bếp ăn 0 đồng, ATM gạo trong đại dịch hay các đội cứu hộ cứu trợ đồng bào vùng bão lũ.',
      },
      {
        id: 'arg-2',
        title: 'Sự sẻ chia thanh lọc tâm hồn và bồi đắp nhân cách của chính người cho đi',
        reasoning: 'Hạnh phúc chân thực không đo bằng việc ta tích lũy được bao nhiêu tài sản, mà bằng việc ta đã sưởi ấm được bao nhiêu mảnh đời.',
        elaboration: 'Khi mở rộng lòng mình, ta thoát khỏi cái tôi hạn hẹp, ích kỷ; tâm hồn trở nên an nhiên, rộng lượng và giàu có về mặt tinh thần.',
        suggestedEvidence: 'Lời tâm sự của những tình nguyện viên hiến máu hoặc giáo viên vùng cao: niềm vui nhìn thấy nụ cười của tha nhân là phần thưởng vô giá.',
      },
      {
        id: 'arg-3',
        title: 'Sự sẻ chia gắn kết cộng đồng và tạo dựng một xã hội nhân bản bền vững',
        reasoning: 'Lòng nhân ái là chất keo kết dính những cá nhân xa lạ thành một khối thống nhất giàu tình người.',
        elaboration: 'Một xã hội mà mọi người biết nhường cơm sẻ áo sẽ giảm bớt xung đột, bất bình đẳng và gia tăng niềm tin xã hội.',
        suggestedEvidence: 'Chiến dịch "Nuôi em" kết nối hàng vạn mạnh thường quân khắp cả nước hỗ trợ bữa trưa có thịt cho trẻ em mầm non và tiểu học bản cao.',
      },
    ],
    evidence: [
      {
        title: 'Dự án "Nuôi em" của Hoàng Hoa Trung',
        description: 'Kết nối hàng trăm ngàn bữa ăn trưa đủ dinh dưỡng cho trẻ em vùng cao Tây Bắc, giúp giảm tỷ lệ bỏ học một cách ngoạn mục.',
        applicationNote: 'Dùng làm dẫn chứng cho tinh thần chia sẻ có phương pháp khoa học, minh bạch và đem lại hiệu quả xã hội lâu dài.',
      },
      {
        title: 'Hình ảnh nhân dân cả nước hướng về đồng bào bão lũ miền Bắc (bão Yagi 2024)',
        description: 'Hàng ngàn chuyến xe cứu trợ, xuồng máy xuyên đêm đưa nhu yếu phẩm, bà con gói bánh chưng gửi lên vùng lũ lụt sạt lở.',
        applicationNote: 'Khắc họa sức mạnh truyền thống tương thân tương ái "lá lành đùm lá rách" của dân tộc Việt Nam trong thử thách khốc liệt.',
      },
    ],
    counterargument: {
      oppositeView: 'Vẫn còn những người sống ích kỷ, thờ ơ trước nỗi đau của kẻ khác; hoặc ngược lại, lợi dụng từ thiện để trục lợi, đánh bóng tên tuổi.',
      critique: 'Lối sống bàng quan làm tâm hồn chai sạn, còn lòng từ thiện vụ lợi sẽ làm hoen ố vẻ đẹp thiêng liêng của sự tử tế.',
      boundary: 'Sẻ chia cần đi liền với sự tỉnh táo, đúng nơi đúng lúc, bảo đảm lòng tốt trao đi bảo vệ được phẩm giá của người nhận thay vì biến họ thành kẻ ỷ lại.',
    },
    lessons: {
      selfAwareness: 'Nhận thức sâu sắc rằng yêu thương trao đi là yêu thương còn mãi, không chờ khi giàu sang mới học cách sẻ chia.',
      concreteAction: 'Tích cực tham gia các phong trào quyên góp sách vở, hiến máu nhân đạo hoặc đơn giản là lắng nghe và động viên một người bạn đang gặp khủng hoảng.',
      highSchoolContext: 'Là học sinh lớp 12, xây dựng tinh thần giúp đỡ bạn bè cùng tiến trong học tập, tránh đố kỵ ghen ghét điểm số.',
    },
    conclusion: {
      synthesis: 'Sự sẻ chia chính là ngọn lửa sưởi ấm thế giới này qua những mùa đông buốt giá nhất của đời người.',
      finalMessage: 'Hãy sống như một dòng sông luôn mang phù sa bồi đắp đôi bờ, để mỗi ngày trôi qua đều đọng lại hương hoa của lòng nhân ái.',
    },
  },
  'ol-06': {
    id: 'ol-06',
    promptId: 'de-06',
    promptTitle: 'Ý chí vượt qua nghịch cảnh của tuổi trẻ',
    introduction: {
      leadIn: 'Đời người như một chuyến hải trình vượt qua muôn trùng bão tố, không có con đường nào chỉ trải toàn hoa hồng.',
      problemStatement: 'Ý kiến của văn hào Lỗ Tấn: "Kỳ thực trên mặt đất vốn làm gì có đường, người ta đi mãi thì thành đường thôi" là bài ca bất diệt về ý chí.',
      thesis: 'Nghịch cảnh không phải là rào cản ngăn bước, mà là lò lửa tôi luyện nên bản lĩnh kiên cường của người trẻ.',
    },
    explanations: {
      keyTerms: '"Đường" là hướng đi, cơ hội và thành công. "Đi mãi thành đường" tượng trưng cho sự kiên trì mở lối, vượt qua gian khổ để tạo dựng thành tựu.',
      centralIssue: 'Khẳng định vai trò quyết định của ý chí, sự dấn thân và nghị lực tự thân trước những khó khăn thử thách của thời cuộc.',
    },
    arguments: [
      {
        id: 'arg-1',
        title: 'Nghịch cảnh là quy luật tất yếu của cuộc sống và là thước đo phẩm giá con người',
        reasoning: 'Không có thử thách thì không có sự trưởng thành; hạt mầm phải phá vỡ lớp vỏ đen tối mới có thể vươn lên đón ánh mặt trời.',
        elaboration: 'Khi đối diện với thất bại hay thiếu thốn, người có ý chí sẽ xem đó là cơ hội rèn giũa năng lực thích ứng và khả năng chịu đựng áp lực.',
        suggestedEvidence: 'Thầy giáo Nguyễn Ngọc Ký bị liệt cả hai tay từ nhỏ đã kiên trì tập viết bằng chân để trở thành nhà giáo ưu tú.',
      },
      {
        id: 'arg-2',
        title: 'Ý chí kiên định giúp con người biến điều không thể thành có thể',
        reasoning: 'Vũ khí mạnh nhất của con người không nằm ở cơ bắp hay hoàn cảnh xuất thân, mà ở ngọn lửa tinh thần không chịu khuất phục.',
        elaboration: 'Khi ta không lùi bước, từng bước đi gian lao sẽ dần tích lũy thành kinh nghiệm, mở ra con đường sáng tạo mà trước đó chưa ai dám bước.',
        suggestedEvidence: 'Nick Vujicic sinh ra không có tay chân nhưng đã trở thành diễn giả truyền cảm hứng toàn cầu, truyền lửa cho hàng triệu số phận.',
      },
      {
        id: 'arg-3',
        title: 'Người mở đường kiến tạo giá trị mới cho cả cộng đồng',
        reasoning: 'Dám đi trên con đường chưa có sẵn không chỉ giúp cá nhân chạm tới ước mơ mà còn mở lối cho những người đi sau.',
        elaboration: 'Mỗi phát kiến khoa học hay cuộc cách mạng xã hội đều bắt đầu từ những cá nhân dũng cảm đi ngược dòng dư luận để tìm chân lý.',
        suggestedEvidence: 'Các nhà khoa học phát triển vắc-xin công nghệ mRNA trong đại dịch, kiên trì theo đuổi hàng chục năm dù từng bị cắt ngân sách nghiên cứu.',
      },
    ],
    evidence: [
      {
        title: 'Thầy giáo Nguyễn Ngọc Ký',
        description: 'Bị bại liệt hai tay từ năm 4 tuổi, thầy vượt qua đau đớn thể xác để tập viết bằng hai bàn chân, tốt nghiệp đại học và viết nên hàng chục cuốn sách quý.',
        applicationNote: 'Minh chứng xuất sắc cho ý chí quật cường, biến nghịch cảnh thành bàn đạp để tỏa sáng rực rỡ.',
      },
      {
        title: 'Nick Vujicic — Cuộc sống không giới hạn',
        description: 'Vượt qua mặc cảm tật nguyền bẩm sinh để tốt nghiệp đại học kép, bơi lội, chơi golf và trở thành diễn giả truyền cảm hứng nghị lực số 1 hành tinh.',
        applicationNote: 'Chứng minh tinh thần: không có hoàn cảnh nào tước đoạt được quyền sống có ý nghĩa nếu ta còn giữ vững ý chí.',
      },
    ],
    counterargument: {
      oppositeView: 'Một bộ phận giới trẻ hiện nay có tâm lý "dễ nản, chóng từ bỏ", ỷ lại vào gia đình hoặc sa vào lối sống an phận, sợ khó sợ khổ.',
      critique: 'Sống thiếu ý chí như cái cây non yếu trước gió, dễ dàng gục ngã trước những biến cố nhỏ nhất của cuộc đời.',
      boundary: 'Kiên trì không đồng nghĩa với cố chấp, mù quáng; kiên định phải đi kèm với sự linh hoạt điều chỉnh phương pháp khi nhận ra hướng đi sai lầm.',
    },
    lessons: {
      selfAwareness: 'Hiểu rằng khó khăn chỉ là phép thử của sự kiên tâm; không bao giờ than thân trách phận trước nghịch cảnh.',
      concreteAction: 'Rèn luyện thói quen kiên trì giải quyết bài tập khó, duy trì kỷ luật thể dục thể thao và tự đứng dậy sau mỗi lần thi thử chưa đạt như ý.',
      highSchoolContext: 'Giai đoạn ôn thi lớp 12 đầy cam go là lúc bản lĩnh phải lên tiếng; kiên trì đến cùng với mục tiêu đại học đã đề ra.',
    },
    conclusion: {
      synthesis: 'Con đường tương lai không được trải sẵn mà được tạo nên bởi từng dấu chân nhọc nhằn và kiên định hôm nay.',
      finalMessage: 'Hãy là người cầm lái can trường trước giông bão, bởi vì "Kim cương chỉ hình thành dưới áp lực cực lớn".',
    },
  },
  'ol-51': {
    id: 'ol-51',
    promptId: 'de-51',
    promptTitle: 'AI và bài toán định vị giá trị con người',
    introduction: {
      leadIn: 'Thế kỷ 21 chứng kiến bước nhảy vọt thần kỳ của công nghệ trí tuệ nhân tạo (AI), làm thay đổi sâu sắc diện mạo thế giới.',
      problemStatement: 'Khi cỗ máy có thể sáng tác nhạc, viết luận và phân tích dữ liệu vượt xa con người, câu hỏi muôn thuở lại vang lên: Điều gì thực sự định vị giá trị người?',
      thesis: 'Giá trị con người không nằm ở tốc độ xử lý dữ liệu, mà ở trái tim rung cảm, lương tri đạo đức và khả năng kiến tạo tình thương.',
    },
    explanations: {
      keyTerms: '"AI (Trí tuệ nhân tạo)" là sản phẩm của thuật toán mô phỏng năng lực nhận thức con người. "Giá trị con người" là tổng hòa của cảm xúc, ý thức tự thân, lương tâm đạo đức và tính bản sắc độc nhất.',
      centralIssue: 'Khẳng định vị thế chủ thể bất biến của con người trước làn sóng tự động hóa, từ đó tìm kiếm lối ứng xử văn minh với công nghệ mới.',
    },
    arguments: [
      {
        id: 'arg-1',
        title: 'AI là cỗ máy tính toán siêu việt nhưng tuyệt đối thiếu vắng cảm xúc và sự thấu cảm',
        reasoning: 'Máy móc xử lý thông tin dựa trên thống kê xác suất; nó không biết khóc trước một nỗi đau, không cảm nhận được vẻ đẹp của một buổi hoàng hôn.',
        elaboration: 'Tình yêu thương, sự trắc ẩn và những giọt nước mắt đồng cảm là đặc quyền thiêng liêng mà không thuật toán nào có thể tái tạo trọn vẹn.',
        suggestedEvidence: 'Trong y tế, AI chẩn đoán hình ảnh chính xác nhưng ánh mắt an ủi của người bác sĩ mới là liều thuốc xoa dịu nỗi sợ của bệnh nhân.',
      },
      {
        id: 'arg-2',
        title: 'Con người sở hữu năng lực phán đoán đạo đức và tinh thần trách nhiệm',
        reasoning: 'Mọi thuật toán đều là công cụ trung tính; chỉ con người mới có lương tâm để quyết định ranh giới giữa cái thiện và cái ác.',
        elaboration: 'Khi đưa ra các quyết định sinh tử hoặc các chính sách công, trực giác đạo đức của con người là màng lọc bảo vệ xã hội khỏi sự tàn nhẫn thuần túy cơ học.',
        suggestedEvidence: 'Các cuộc tranh luận toàn cầu về việc cấm vũ khí tự hành và các tiêu chuẩn đạo đức bắt buộc trong nghiên cứu phát triển mô hình sinh học tổng hợp.',
      },
      {
        id: 'arg-3',
        title: 'Sự sáng tạo của con người bắt nguồn từ trải nghiệm sống và những vết thương nội tâm',
        reasoning: 'Nghệ thuật đỉnh cao không chỉ là sự ghép nối từ ngữ hay gam màu, mà là sự thăng hoa từ nỗi cô đơn, khát vọng và đau đớn hiện sinh.',
        elaboration: 'AI chỉ tái tạo lại những gì nhân loại đã tạo ra; chỉ con người mới có khả năng nhảy vọt tư duy để tạo ra những chân trời nhận thức hoàn toàn mới.',
        suggestedEvidence: 'Những áng văn chương lay động như "Truyện Kiều" của Nguyễn Du hay thơ của Hàn Mặc Tử ra đời từ chính bi kịch số phận và nỗi đau nhân thế.',
      },
    ],
    evidence: [
      {
        title: 'Bức thư ngỏ của hàng ngàn chuyên gia công nghệ và giải Turing cảnh báo về rủi ro AI',
        description: 'Các nhà khoa học hàng đầu như Geoffrey Hinton, Yoshua Bengio kêu gọi nhân loại phải ưu tiên bảo vệ phẩm giá và an toàn con người trước sự phát triển mất kiểm soát của AI.',
        applicationNote: 'Dùng để nhấn mạnh: công nghệ phải phục vụ sự thăng hoa của con người chứ không được biến con người thành nô lệ cho máy tính.',
      },
      {
        title: 'Nghệ thuật đích thực từ trải nghiệm sống',
        description: 'Những tuyệt phẩm hội họa của Van Gogh hay âm nhạc của Beethoven khi ông bị điếc hoàn toàn — điều mà không một AI mô phỏng nào thấu cảm được nguồn cơn.',
        applicationNote: 'Minh chứng cho việc chiều sâu tâm hồn con người là bất khả thay thế bởi máy móc.',
      },
    ],
    counterargument: {
      oppositeView: 'Hai thái cực sai lầm: hoặc sợ hãi bài trừ công nghệ, hoặc quá tôn sùng AI đến mức lười suy nghĩ, phó mặc bài vở và tư duy cho chatbot.',
      critique: 'Sự bài xích biến ta thành kẻ tụt hậu, nhưng sự lười biếng sẽ làm teo tóp cơ bắp não bộ và đánh mất căn cước tư duy của chính mình.',
      boundary: 'Cần biến AI thành cánh tay nối dài cho trí tuệ nhân loại, sử dụng AI như một trợ thủ đắc lực nhưng giữ vững vai trò thuyền trưởng điều hướng.',
    },
    lessons: {
      selfAwareness: 'Hiểu rằng giá trị của bản thân không nằm ở việc ghi nhớ máy móc mà ở tư duy độc lập, lòng trắc ẩn và sự thấu cảm xã hội.',
      concreteAction: 'Tận dụng AI để tra cứu thông tin, học ngoại ngữ nhưng luôn tự mình viết bài, suy ngẫm sâu và kiểm chứng sự thật.',
      highSchoolContext: 'Là học sinh THPT, rèn luyện kỹ năng đặt câu hỏi thông minh, tư duy phản biện và khả năng giao tiếp giàu cảm xúc giữa người với người.',
    },
    conclusion: {
      synthesis: 'AI có thể trả lời vạn câu hỏi bằng dữ liệu, nhưng chỉ trái tim con người mới biết rung động trước tiếng thở dài của tha nhân.',
      finalMessage: 'Hãy để công nghệ là đôi cánh nâng tầm tri thức, còn ngọn lửa nhân bản sẽ mãi là ngọn hải đăng soi sáng con đường ta đi.',
    },
  },
};

/**
 * Dynamically synthesizes a high-fidelity 7-part outline for any prompt
 * if a handcrafted static one is not explicitly defined in FLAGSHIP_OUTLINES
 */
export function getOutlineForPrompt(prompt: EssayPrompt): Outline {
  if (FLAGSHIP_OUTLINES[prompt.outlineId || prompt.id]) {
    return FLAGSHIP_OUTLINES[prompt.outlineId || prompt.id];
  }

  // Generate standardized 7-part outline tailored to prompt title and topic
  return {
    id: `ol-${prompt.id}`,
    promptId: prompt.id,
    promptTitle: prompt.title,
    introduction: {
      leadIn: `Trong hành trình xây dựng nhân cách và định vị bản thân giữa cuộc đời rộng lớn, vấn đề "${prompt.title.toLowerCase()}" luôn giữ một ý nghĩa đặc biệt đối với mỗi chúng ta.`,
      problemStatement: `Đề bài đặt ra yêu cầu nhìn nhận sâu sắc về "${prompt.title}", gợi mở cho chúng ta nhiều bài học nhân sinh quý giá.`,
      thesis: `Hiểu đúng và thực hành đúng giá trị này chính là nền tảng để người trẻ tự tin vững bước và cống hiến cho xã hội.`,
    },
    explanations: {
      keyTerms: `Giải thích các từ khóa then chốt: ${prompt.keywords.slice(0, 3).join(', ')}. Đây là những phẩm chất, thái độ sống hoặc hiện tượng xã hội đòi hỏi sự thức nhận tỉnh táo.`,
      centralIssue: `Thực chất đề bài yêu cầu người viết bàn luận về vai trò, ý nghĩa cũng như cách tiếp cận đúng đắn đối với chủ đề "${prompt.topic}".`,
    },
    arguments: [
      {
        id: 'arg-1',
        title: `Ý nghĩa nền tảng đối với sự phát triển và hoàn thiện nhân cách cá nhân`,
        reasoning: `Khi thấu hiểu và rèn luyện giá trị này, con người xây dựng được nội lực vững vàng, không bị chao đảo trước những biến cố thử thách.`,
        elaboration: `Nó giúp ta nhìn nhận bản thân trung thực hơn, giải phóng năng lượng sáng tạo và tìm thấy niềm vui sống đích thực từ sâu bên trong.`,
        suggestedEvidence: `Những tấm gương điển hình trong lịch sử và đời sống thực tế đã bền bỉ vượt qua nghịch cảnh nhờ phẩm chất này.`,
      },
      {
        id: 'arg-2',
        title: `Tác động tích cực trong việc xây dựng mối quan hệ tốt đẹp với tha nhân`,
        reasoning: `Không ai là một hòn đảo biệt lập; thái độ sống đúng đắn tạo nên sự gắn kết, thấu hiểu và tin cậy giữa các thành viên trong gia đình và xã hội.`,
        elaboration: `Nó xua tan đi sự ích kỷ, đố kỵ và giảm thiểu những bất đồng không đáng có trong ứng xử cộng đồng.`,
        suggestedEvidence: `Các phong trào thiện nguyện, sự tương trợ của bà con lối xóm trong đời sống thường nhật.`,
      },
      {
        id: 'arg-3',
        title: `Động lực thúc đẩy sự tiến bộ văn minh và phát triển bền vững của cộng đồng`,
        reasoning: `Một xã hội giàu lòng nhân ái, thượng tôn kỷ luật và không ngừng tự học hỏi sẽ luôn có sức đề kháng mãnh liệt trước mọi khủng hoảng thời đại.`,
        elaboration: `Thế hệ trẻ chính là rường cột kiến tạo nên diện mạo tương lai của đất nước thông qua những hành động thiết thực mỗi ngày.`,
        suggestedEvidence: `Sự chuyển mình của các quốc gia văn minh nhờ đầu tư vào giáo dục nhân cách và tinh thần phụng sự công dân.`,
      },
    ],
    evidence: [
      {
        title: `Tấm gương vượt khó và rèn luyện bền bỉ của thế hệ đi trước`,
        description: `Những nhân vật kiệt xuất luôn bắt đầu từ những việc nhỏ với sự kiên trì phi thường và lòng tận tụy với công việc.`,
        applicationNote: `Phân tích sâu vào quá trình nỗ lực và bài học rút ra, tránh chỉ liệt kê tên tuổi một cách sơ sài.`,
      },
      {
        title: `Hiện tượng tích cực trong đời sống học đường và thanh niên hiện nay`,
        description: `Các nhóm học sinh, sinh viên chủ động sáng lập các câu lạc bộ đọc sách, bảo vệ môi trường hay dạy học tình nguyện cho trẻ em nghèo.`,
        applicationNote: `Đưa vào bài viết để tạo sự gần gũi, chứng minh vấn đề có tính thời sự nóng hổi với lứa tuổi THPT.`,
      },
    ],
    counterargument: {
      oppositeView: `Vẫn còn một bộ phận có cái nhìn lệch lạc, phiến diện hoặc sống ngược lại với những chuẩn mực tốt đẹp này.`,
      critique: `Lối sống thờ ơ, buông thả hoặc thái cực cực đoan sẽ dẫn đến sự suy thoái đạo đức và cô lập chính mình khỏi cộng đồng.`,
      boundary: `Cần phân biệt rõ giữa kiên định tích cực và sự bảo thủ, giữa bao dung và sự thỏa hiệp dung dưỡng cái xấu.`,
    },
    lessons: {
      selfAwareness: `Nhận thức rõ ràng tầm quan trọng của việc tự giáo dục và rèn giũa đạo đức lối sống mỗi ngày.`,
      concreteAction: `Bắt đầu từ những việc giản dị: trung thực trong thi cử, có trách nhiệm với gia đình, biết nói lời cảm ơn và xin lỗi chân thành.`,
      highSchoolContext: 'Là học sinh THPT chuẩn bị bước vào ngưỡng cửa đại học và trường đời, cần chủ động trang bị bản lĩnh và tri thức vững vàng.',
    },
    conclusion: {
      synthesis: `Khẳng định lại: "${prompt.title}" là bài học vô giá đồng hành cùng ta trên suốt hành trình trưởng thành.`,
      finalMessage: `Hãy mở lòng đón nhận và biến nhận thức thành hành động cụ thể, để cuộc đời mỗi chúng ta là một đóa hoa tỏa ngát hương thơm cho đời.`,
    },
  };
}

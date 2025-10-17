// 타입 정의
type Word = {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word: string;
};

type Sentence = {
  text: string;
  start: number;
  end: number;
};

type Paragraph = {
  sentences: Sentence[];
  num_words: number;
  start: number;
  end: number;
};

type TranscriptionResult = {
  results?: {
    channels?: Array<{
      alternatives?: Array<{
        words: Word[];
        paragraphs?: {
          paragraphs: Paragraph[];
        };
      }>;
    }>;
  };
};

export const convertToSRT = (result: TranscriptionResult, language: string) => {
  if (!result.results || !result.results.channels || !result.results.channels[0]?.alternatives?.[0]) {
    return "";
  }

  const words = result.results.channels[0].alternatives[0].words;
  const paragraphs = result.results.channels[0].alternatives[0].paragraphs;
  const isKorean = typeof language === "string" && language.toLowerCase() === "korean";

  if (!paragraphs || !paragraphs.paragraphs || paragraphs.paragraphs.length === 0) {
    // 문장 정보가 없는 경우, 단어 정보를 사용하여 SRT 생성
    return isKorean ? convertFromWordsKorean(words) : convertFromWords(words);
  }

  // 문장 정보가 있는 경우, 문장을 더 작은 단위로 분할하여 처리
  return isKorean
    ? convertWithSentencesKorean(words, paragraphs.paragraphs)
    : convertWithSentences(words, paragraphs.paragraphs);
};

// 문장 정보를 활용하여 더 자연스럽게 자막을 분할하는 함수
const convertWithSentences = (words: Word[], paragraphs: Paragraph[]) => {
  let srtContent = "";
  let subtitleIndex = 1;

  // 문장별로 처리
  paragraphs.forEach((paragraph) => {
    paragraph.sentences.forEach((sentence) => {
      // 이 문장에 포함된 단어들 찾기
      const sentenceWords = words.filter((word) => word.start >= sentence.start && word.end <= sentence.end);

      // 문장이 너무 길면 분할하기
      if (sentenceWords.length > 7 || sentence.end - sentence.start > 3) {
        // 문장 분할 처리
        let currentSegment = "";
        let segmentWords: Word[] = [];
        let startTime = sentenceWords[0]?.start || sentence.start;
        let endTime = startTime;
        let wordCount = 0;

        sentenceWords.forEach((word, index) => {
          currentSegment += (word.punctuated_word || word.word) + " ";
          segmentWords.push(word);
          endTime = word.end;
          wordCount++;

          // 분할 기준: 7단어 또는 3초 또는 문장 부호
          const isPunctuated =
            word.punctuated_word &&
            (word.punctuated_word.endsWith(",") ||
              word.punctuated_word.endsWith(";") ||
              word.punctuated_word.endsWith(":") ||
              word.punctuated_word.endsWith("-"));

          // 문장의 마지막 단어이거나 분할 조건 충족 시 새 자막 생성
          if (wordCount >= 7 || endTime - startTime > 3 || isPunctuated || index === sentenceWords.length - 1) {
            const formattedStartTime = formatSRTTime(startTime);
            const formattedEndTime = formatSRTTime(endTime);

            srtContent += `${subtitleIndex}\n${formattedStartTime} --> ${formattedEndTime}\n${currentSegment.trim()}\n\n`;

            subtitleIndex++;
            currentSegment = "";
            segmentWords = [];
            wordCount = 0;
            startTime = endTime;
          }
        });
      } else {
        // 문장이 충분히 짧으면 그대로 사용
        const formattedStartTime = formatSRTTime(sentence.start);
        const formattedEndTime = formatSRTTime(sentence.end);

        srtContent += `${subtitleIndex}\n${formattedStartTime} --> ${formattedEndTime}\n${sentence.text}\n\n`;
        subtitleIndex++;
      }
    });
  });

  return srtContent.trim();
};

// 한국어 분할을 위한 보조 상수/함수들
const EPS = 0.02; // 타이밍 비교 허용 오차(초)
const MIN_SEGMENT_DURATION = 0.8; // 세그먼트 최소 길이(초)
const MAX_SEGMENT_DURATION = 4.5; // 세그먼트 최대 길이(초)
const MIN_SEGMENT_CHARS = 6; // 세그먼트 최소 문자수(가독성 가드)

// 담화 표지(전환/인과/구조/예시 등)
const SOFT_BOUNDARY_MARKERS = new Set<string>([
  "그리고",
  "또한",
  "게다가",
  "더불어",
  "뿐만 아니라",
  "하지만",
  "그러나",
  "반면에",
  "다만",
  "그럼에도",
  "오히려",
  "그래서",
  "따라서",
  "그러므로",
  "결과적으로",
  "결국",
  "이로써",
  "즉",
  "다시 말해",
  "말하자면",
  "요컨대",
  "쉽게 말해",
  "예를 들어",
  "예컨대",
  "이를테면",
  "먼저",
  "다음으로",
  "이어서",
  "한편",
  "마지막으로",
  "요약하면",
  "결론적으로",
  "그렇다면",
  "그러면",
  "이제",
  "자",
  "특히",
  "무엇보다",
  "바로",
  "핵심은",
  "첫째",
  "둘째",
  "셋째",
]);

const stripRightQuotes = (s: string) => s.replace(/[\)"'”’\]\}]+$/u, "");
const getTokenText = (w: Word) => (w.punctuated_word ?? w.word ?? "").trim();
const hasHardPunctuation = (t: string) => /[.?!…‽]$|[，。、]$/u.test(stripRightQuotes(t));
const isEndingEomi = (t: string) => /(다|요|니다|네요|군요|죠|랍니다|일까요|할게요)$/.test(stripRightQuotes(t));

const isSemanticBoundaryKorean = (curr: Word, next?: Word) => {
  const token = getTokenText(curr);
  const base = stripRightQuotes(token);
  const gap = next ? next.start - curr.end : 0;

  // 콤마는 과분절 방지를 위해 최소 간격 필요
  const commaBoundary = /[,，]$/.test(token) && gap >= 0.2;
  const soft = SOFT_BOUNDARY_MARKERS.has(base) && gap >= 0.3; // 담화 표지는 말간격이 있을 때만 분할

  return hasHardPunctuation(token) || isEndingEomi(base) || commaBoundary || soft;
};

// (Korean) 문장 정보를 활용하여 '.' 또는 ',' 기준으로만 분할하는 함수
const convertWithSentencesKorean = (words: Word[], paragraphs: Paragraph[]) => {
  let srtContent = "";
  let subtitleIndex = 1;

  paragraphs.forEach((paragraph) => {
    paragraph.sentences.forEach((sentence) => {
      // 허용 오차를 둔 매핑 + 정렬 안정화
      const sentenceWords = words
        .filter((word) => word.start >= sentence.start - EPS && word.end <= sentence.end + EPS)
        .sort((a, b) => a.start - b.start);

      if (!sentenceWords || sentenceWords.length === 0) {
        // 단어 매핑이 없으면 문장 전체를 하나로 처리
        const formattedStartTime = formatSRTTime(sentence.start);
        const formattedEndTime = formatSRTTime(sentence.end);
        srtContent += `${subtitleIndex}\n${formattedStartTime} --> ${formattedEndTime}\n${sentence.text}\n\n`;
        subtitleIndex++;
        return;
      }

      let currentSegment = "";
      let startTime = sentenceWords[0].start;
      let endTime = startTime;

      sentenceWords.forEach((word, index) => {
        currentSegment += (word.punctuated_word || word.word) + " ";
        endTime = word.end;

        const nextWord = sentenceWords[index + 1];
        const isBoundary = isSemanticBoundaryKorean(word, nextWord);
        const isLast = index === sentenceWords.length - 1;
        const duration = endTime - startTime;

        // 너무 길면 강제 분할, 너무 짧으면 보류(마지막은 항상 분할)
        let shouldSplit = false;
        if (isBoundary || isLast || duration > MAX_SEGMENT_DURATION) {
          if (!isLast && (duration < MIN_SEGMENT_DURATION || currentSegment.trim().length < MIN_SEGMENT_CHARS)) {
            shouldSplit = false;
          } else {
            shouldSplit = true;
          }
        }

        if (shouldSplit) {
          const safeEnd = endTime <= startTime ? startTime + EPS : endTime;
          const formattedStartTime = formatSRTTime(startTime);
          const formattedEndTime = formatSRTTime(safeEnd);
          srtContent += `${subtitleIndex}\n${formattedStartTime} --> ${formattedEndTime}\n${currentSegment.trim()}\n\n`;
          subtitleIndex++;
          currentSegment = "";
          startTime = safeEnd;
        }
      });
    });
  });

  return srtContent.trim();
};

// 단어 정보를 사용하여 SRT 포맷으로 변환하는 보조 함수
const convertFromWords = (words: Word[]) => {
  if (!words || words.length === 0) {
    return "";
  }

  let srtContent = "";
  let subtitleIndex = 1;
  let currentSegment = "";
  let startTime = words[0].start;
  let endTime = 0;
  let wordCount = 0;

  // 자막 길이 조정: 약 3초 또는 7단어마다 새 자막 생성
  words.forEach((word, index) => {
    currentSegment += (word.punctuated_word || word.word) + " ";
    endTime = word.end;
    wordCount++;

    // 문장 분할 기준 조정: 3초 또는 7단어마다 또는 문장 부호에서 자막 분할
    const isPunctuated =
      word.punctuated_word &&
      (word.punctuated_word.endsWith(".") ||
        word.punctuated_word.endsWith("?") ||
        word.punctuated_word.endsWith("!") ||
        word.punctuated_word.endsWith(",") ||
        word.punctuated_word.endsWith(";") ||
        word.punctuated_word.endsWith(":") ||
        word.punctuated_word.endsWith("-"));

    // 특정 접속사에서 분할하지 않도록 방지
    const nextWord = index < words.length - 1 ? words[index + 1].word.toLowerCase() : "";
    const isConnectionWord = ["and", "or", "but", "so", "because", "if", "when", "while", "although"].includes(
      nextWord
    );

    if (
      // 다음 단어가 접속사가 아니고, 단어 수 또는 시간 조건을 만족할 때만 분할
      ((wordCount >= 7 || endTime - startTime > 3) && !isConnectionWord) ||
      // 문장 부호나 마지막 단어는 항상 분할
      isPunctuated ||
      index === words.length - 1
    ) {
      const formattedStartTime = formatSRTTime(startTime);
      const formattedEndTime = formatSRTTime(endTime);

      srtContent += `${subtitleIndex}\n${formattedStartTime} --> ${formattedEndTime}\n${currentSegment.trim()}\n\n`;

      subtitleIndex++;
      currentSegment = "";
      wordCount = 0;
      startTime = endTime;
    }
  });

  return srtContent.trim();
};

// (Korean) 단어 정보를 사용하여 '.' 또는 ',' 기준으로만 분할하는 보조 함수
const convertFromWordsKorean = (words: Word[]) => {
  if (!words || words.length === 0) {
    return "";
  }

  let srtContent = "";
  let subtitleIndex = 1;
  let currentSegment = "";
  let startTime = words[0].start;
  let endTime = 0;

  words.forEach((word, index) => {
    currentSegment += (word.punctuated_word || word.word) + " ";
    endTime = word.end;

    const punct = word.punctuated_word || "";
    const isBoundary = punct.endsWith(".") || punct.endsWith(",");
    const isLast = index === words.length - 1;

    if (isBoundary || isLast) {
      const formattedStartTime = formatSRTTime(startTime);
      const formattedEndTime = formatSRTTime(endTime);
      srtContent += `${subtitleIndex}\n${formattedStartTime} --> ${formattedEndTime}\n${currentSegment.trim()}\n\n`;
      subtitleIndex++;
      currentSegment = "";
      startTime = endTime;
    }
  });

  return srtContent.trim();
};

// 초를 SRT 시간 형식으로 변환하는 함수 (HH:MM:SS,mmm)
const formatSRTTime = (seconds: number) => {
  const totalMs = Math.floor(seconds * 1000);
  const ms = totalMs % 1000;
  const totalSeconds = Math.floor(totalMs / 1000);
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);

  // 시:분:초,밀리초 형식으로 포맷팅 (SRT 표준)
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(
    ms
  ).padStart(3, "0")}`;
};

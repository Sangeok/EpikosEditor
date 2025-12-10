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

// 문장 정보를 활용하여 더 자연스럽게(더 짧게) 자막을 분할하는 함수 (영어)
const convertWithSentences = (words: Word[], paragraphs: Paragraph[]) => {
  let srtContent = "";
  let subtitleIndex = 1;

  paragraphs.forEach((paragraph) => {
    paragraph.sentences.forEach((sentence) => {
      // 허용 오차를 둔 단어 매핑 + 정렬
      const sentenceWords = words
        .filter((word) => word.start >= sentence.start - EPS && word.end <= sentence.end + EPS)
        .sort((a, b) => a.start - b.start);

      if (!sentenceWords || sentenceWords.length === 0) {
        // 단어 매핑이 없으면 문장 전체를 하나의 자막으로 사용
        const formattedStartTime = formatSRTTime(sentence.start);
        const formattedEndTime = formatSRTTime(sentence.end);

        srtContent += `${subtitleIndex}\n${formattedStartTime} --> ${formattedEndTime}\n${sentence.text}\n\n`;
        subtitleIndex++;
        return;
      }

      const segments = segmentEnglishWords(sentenceWords);

      segments.forEach((segment) => {
        const formattedStartTime = formatSRTTime(segment.start);
        const formattedEndTime = formatSRTTime(segment.end);

        srtContent += `${subtitleIndex}\n${formattedStartTime} --> ${formattedEndTime}\n${segment.text}\n\n`;
        subtitleIndex++;
      });
    });
  });

  return srtContent.trim();
};

// 영어 분할을 위한 보조 상수/함수들
type EnglishSegment = {
  text: string;
  start: number;
  end: number;
};

// YouTube Shorts용: 더 잘게, 짧게 자르기 위한 튜닝
const EN_MIN_SEGMENT_DURATION = 0.5; // 세그먼트 최소 길이(초) - 약간 더 짧은 자막도 허용
const EN_MAX_SEGMENT_DURATION = 1.8; // 세그먼트 최대 길이(초) - 한 세그먼트가 너무 길지 않게
const EN_MAX_SEGMENT_WORDS = 4; // 세그먼트 최대 단어 수 - 2~4 단어 정도로 제한
const EN_MAX_SEGMENT_CHARS = 28; // 세그먼트 최대 문자 수 - Shorts 화면 폭 기준으로 축소
const EN_MIN_SEGMENT_CHARS = 4; // 세그먼트 최소 문자 수 - "Yes." 같은 짧은 자막 허용

// 접속사 세트는 조금 줄여, 과한 길이 유지를 방지
const EN_CONNECTION_WORDS = new Set<string>(["and", "or", "but", "so"]);

const getEnglishToken = (w: Word) => (w.punctuated_word || w.word || "").trim();
const isStrongPunctuationEn = (token: string) => /[.?!]$/.test(token);
const isWeakPunctuationEn = (token: string) => /[,:;]$/.test(token);

const segmentEnglishWords = (words: Word[]): EnglishSegment[] => {
  const segments: EnglishSegment[] = [];
  if (!words || words.length === 0) {
    return segments;
  }

  let currentSegment = "";
  let startTime = words[0].start;
  let endTime = startTime;
  let wordCount = 0;
  let charCount = 0;

  const flushSegment = () => {
    if (!currentSegment.trim()) return;
    const safeEnd = endTime <= startTime ? startTime + EPS : endTime;
    segments.push({
      text: currentSegment.trim(),
      start: startTime,
      end: safeEnd,
    });
  };

  words.forEach((word, index) => {
    const token = getEnglishToken(word);
    const isLast = index === words.length - 1;
    const nextWord = !isLast ? words[index + 1] : undefined;
    const nextRaw = nextWord?.word?.toLowerCase() ?? "";
    const nextIsConnector = nextRaw ? EN_CONNECTION_WORDS.has(nextRaw) : false;

    if (!currentSegment && token) {
      startTime = word.start;
      endTime = word.end;
      currentSegment = token;
      wordCount = 1;
      charCount = currentSegment.length;
    } else if (token) {
      currentSegment += (currentSegment ? " " : "") + token;
      endTime = word.end;
      wordCount++;
      charCount = currentSegment.length;
    } else {
      // 토큰은 없지만 타이밍은 갱신
      endTime = word.end;
    }

    const duration = endTime - startTime;
    let shouldSplit = false;

    const strongPunc = token ? isStrongPunctuationEn(token) : false;
    const weakPunc = token ? isWeakPunctuationEn(token) : false;
    const punctTriggered = strongPunc || weakPunc;

    if (!isLast) {
      const lengthTriggered =
        wordCount >= EN_MAX_SEGMENT_WORDS || duration >= EN_MAX_SEGMENT_DURATION || charCount >= EN_MAX_SEGMENT_CHARS;

      if (lengthTriggered || punctTriggered) {
        shouldSplit = true;
      }

      // Shorts용:
      // - 단지 구두점 때문만으로 끊으려는 상황에서는, 다음 단어가 접속사면 한 번 정도 붙여본다.
      // - 하지만 길이 조건(lengthTriggered)이 이미 걸렸다면 과감하게 분할.
      if (shouldSplit && nextIsConnector && !lengthTriggered) {
        shouldSplit = false;
      }

      // 너무 짧은 세그먼트는 분할 보류.
      // 단, 강한 구두점(., ?, !)에서 끊으려는 경우에는 짧아도 끊어서 리듬을 살린다.
      if (shouldSplit && !strongPunc && (duration < EN_MIN_SEGMENT_DURATION || charCount < EN_MIN_SEGMENT_CHARS)) {
        shouldSplit = false;
      }
    } else {
      // 마지막 단어는 항상 플러시
      shouldSplit = true;
    }

    if (shouldSplit && currentSegment.trim()) {
      flushSegment();

      if (!isLast && nextWord) {
        currentSegment = "";
        wordCount = 0;
        charCount = 0;
        startTime = nextWord.start;
        endTime = startTime;
      }
    }
  });

  return segments;
};

// 한국어 분할을 위한 보조 상수/함수들
const EPS = 0.02; // 타이밍 비교 허용 오차(초)

// Shorts 스타일: 영어와 비슷하게 짧게 끊기 위한 튜닝 값 (약간 더 짧게 조정)
const MIN_SEGMENT_DURATION = 0.4; // 세그먼트 최소 길이(초) - 조금 더 짧은 자막 허용
const MAX_SEGMENT_DURATION = 1.7; // 세그먼트 최대 길이(초) - 최대 길이 축소
const MIN_SEGMENT_CHARS = 3; // 세그먼트 최소 문자수 - 살짝 완화
const MAX_SEGMENT_CHARS = 14; // 세그먼트 최대 문자수 - 한 세그먼트 글자 수 축소
const MAX_SEGMENT_TOKENS = 5; // 세그먼트 최대 토큰(단어) 수 감소

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

/**
 * 세그먼트 내부에서, 여기서 끊어도 비교적 덜 어색한 "약한 내부 경계"
 * 조사/연결어/조건형 어미/주제 표지 등을 기준으로 한다.
 * 예: "순수한 지성으로 | 왕이 되었습니다", "신라는 | 끊임없이 위협받았습니다"
 */
const isWeakInternalBoundaryKorean = (token: string) => {
  const base = stripRightQuotes(token);
  return /(으로|로|에게|에서|까지|부터|하고|하며|면서|지만|고|다면|면|라면|는|은|도|만)$/u.test(base);
};

const isSemanticBoundaryKorean = (curr: Word, next?: Word) => {
  const token = getTokenText(curr);
  const base = stripRightQuotes(token);
  const gap = next ? next.start - curr.end : 0;

  // 콤마는 과분절 방지를 위해 최소 간격 필요
  const commaBoundary = /[,，]$/.test(token) && gap >= 0.2;
  const soft = SOFT_BOUNDARY_MARKERS.has(base) && gap >= 0.3; // 담화 표지는 말간격이 있을 때만 분할

  return hasHardPunctuation(token) || isEndingEomi(base) || commaBoundary || soft;
};

// (Korean) 문장 정보를 활용하여 의미/길이 기준 + 약한 내부 경계로 짧게 분할하는 함수
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
      let tokenCount = 0;
      let charCount = 0;

      sentenceWords.forEach((word, index) => {
        const token = getTokenText(word);

        if (token) {
          currentSegment += (currentSegment ? " " : "") + token;
          tokenCount++;
          // 공백 제거 후 글자 수 기준
          charCount = currentSegment.replace(/\s+/g, "").length;
        }

        endTime = word.end;

        const nextWord = sentenceWords[index + 1];
        const isLast = index === sentenceWords.length - 1;
        const duration = endTime - startTime;

        const semanticBoundary = isSemanticBoundaryKorean(word, nextWord);
        const lengthTriggered =
          duration >= MAX_SEGMENT_DURATION || charCount >= MAX_SEGMENT_CHARS || tokenCount >= MAX_SEGMENT_TOKENS;

        // 세그먼트 내부에서, 의미 경계가 아니더라도 약한 내부 경계 토큰이면 한 번 더 잘라 줌
        const weakInternalBoundary = !semanticBoundary && token && isWeakInternalBoundaryKorean(token);

        const boundaryTriggered = semanticBoundary || weakInternalBoundary;

        // 너무 길면 강제 분할, 너무 짧으면 보류(마지막은 항상 분할)
        let shouldSplit = false;

        if (!isLast) {
          if (boundaryTriggered || lengthTriggered) {
            shouldSplit = true;
          }

          // semantic/weak 경계 없이 길이만으로 끊으려는 경우에만 최소 길이 가드 적용
          if (shouldSplit && !boundaryTriggered && (duration < MIN_SEGMENT_DURATION || charCount < MIN_SEGMENT_CHARS)) {
            shouldSplit = false;
          }
        } else {
          // 마지막 단어는 항상 플러시
          shouldSplit = true;
        }

        if (shouldSplit && currentSegment.trim()) {
          const safeEnd = endTime <= startTime ? startTime + EPS : endTime;
          const formattedStartTime = formatSRTTime(startTime);
          const formattedEndTime = formatSRTTime(safeEnd);
          srtContent += `${subtitleIndex}\n${formattedStartTime} --> ${formattedEndTime}\n${currentSegment.trim()}\n\n`;
          subtitleIndex++;

          // 다음 세그먼트를 위해 초기화
          currentSegment = "";
          startTime = safeEnd;
          endTime = safeEnd;
          tokenCount = 0;
          charCount = 0;
        }
      });
    });
  });

  return srtContent.trim();
};

// 단어 정보를 사용하여 SRT 포맷으로 변환하는 보조 함수 (영어, 더 짧은 세그먼트 위주)
const convertFromWords = (words: Word[]) => {
  if (!words || words.length === 0) {
    return "";
  }

  const segments = segmentEnglishWords(words);
  if (!segments || segments.length === 0) {
    return "";
  }

  let srtContent = "";
  let subtitleIndex = 1;

  segments.forEach((segment) => {
    const formattedStartTime = formatSRTTime(segment.start);
    const formattedEndTime = formatSRTTime(segment.end);

    srtContent += `${subtitleIndex}\n${formattedStartTime} --> ${formattedEndTime}\n${segment.text}\n\n`;
    subtitleIndex++;
  });

  return srtContent.trim();
};

// (Korean) 단어 정보를 사용하여 구두점/길이 기준 + 약한 내부 경계로 짧게 분할하는 보조 함수
const convertFromWordsKorean = (words: Word[]) => {
  if (!words || words.length === 0) {
    return "";
  }

  let srtContent = "";
  let subtitleIndex = 1;
  let currentSegment = "";
  let startTime = words[0].start;
  let endTime = startTime;
  let tokenCount = 0;
  let charCount = 0;

  words.forEach((word, index) => {
    const token = getTokenText(word);

    if (token) {
      currentSegment += (currentSegment ? " " : "") + token;
      tokenCount++;
      charCount = currentSegment.replace(/\s+/g, "").length;
    }

    endTime = word.end;

    const punct = word.punctuated_word || "";
    const isPunctBoundary = punct.endsWith(".") || punct.endsWith(",");
    const isLast = index === words.length - 1;
    const duration = endTime - startTime;

    const lengthTriggered =
      duration >= MAX_SEGMENT_DURATION || charCount >= MAX_SEGMENT_CHARS || tokenCount >= MAX_SEGMENT_TOKENS;

    // 세그먼트 내부에서, 의미 경계가 아니더라도 약한 내부 경계 토큰이면 한 번 더 잘라 줌
    const weakInternalBoundary = !isPunctBoundary && token && isWeakInternalBoundaryKorean(token);

    let shouldSplit = false;

    if (!isLast) {
      if (isPunctBoundary || lengthTriggered || weakInternalBoundary) {
        shouldSplit = true;
      }

      // 구두점/약한 내부 경계 없이 길이만으로 끊으려는 경우에만 최소 길이 가드 적용
      if (
        shouldSplit &&
        !isPunctBoundary &&
        !weakInternalBoundary &&
        (duration < MIN_SEGMENT_DURATION || charCount < MIN_SEGMENT_CHARS)
      ) {
        shouldSplit = false;
      }
    } else {
      // 마지막 단어는 항상 플러시
      shouldSplit = true;
    }

    if (shouldSplit && currentSegment.trim()) {
      const safeEnd = endTime <= startTime ? startTime + EPS : endTime;
      const formattedStartTime = formatSRTTime(startTime);
      const formattedEndTime = formatSRTTime(safeEnd);
      srtContent += `${subtitleIndex}\n${formattedStartTime} --> ${formattedEndTime}\n${currentSegment.trim()}\n\n`;
      subtitleIndex++;

      currentSegment = "";
      startTime = safeEnd;
      endTime = safeEnd;
      tokenCount = 0;
      charCount = 0;
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

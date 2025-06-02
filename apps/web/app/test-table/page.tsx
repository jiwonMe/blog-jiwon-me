import { MarkdownRenderer } from "../../components/markdown-renderer";

export default function TestTablePage() {
  const testTableMarkdown = `
# 테이블 테스트

다음은 한국어 테이블 예시입니다:

| 제목 1 | 제목 2 | 제목 3 |
| --- | --- | --- |
| 내용 1 | 내용 2 | 내용 3 |
| 내용 4 | 내용 5 | 내용 6 |

## 더 복잡한 테이블

| 이름 | 나이 | 직업 | 거주지 |
| :--- | :---: | :---: | ---: |
| 김철수 | 30 | 개발자 | 서울 |
| 이영희 | 25 | 디자이너 | 부산 |
| 박민수 | 35 | 기획자 | 대구 |

## 빈 셀이 있는 테이블

| 항목 | 값 | 비고 |
| --- | --- | --- |
| 첫 번째 |  | 빈 값 |
| 두 번째 | 값 있음 |  |
|  | 빈 항목 | 테스트 |
`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 font-wanted">테이블 렌더링 테스트</h1>
          
          <div className="notion-content">
            <MarkdownRenderer 
              content={testTableMarkdown}
              className="text-base md:text-lg leading-7 md:leading-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 
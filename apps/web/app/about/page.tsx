import { Button } from "@jiwonme/jds";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">소개</h1>
          <p className="text-xl text-muted-foreground">
            안녕하세요, 프론트엔드 개발자 지원입니다.
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-12">
          {/* About section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">About Me</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed mb-4">
                안녕하세요! 저는 사용자 경험을 중시하는 프론트엔드 개발자 지원입니다. 
                웹 기술의 빠른 발전에 발맞춰 지속적으로 학습하고, 배운 것들을 실제 프로젝트에 적용하며 성장하고 있습니다.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                특히 React와 TypeScript를 활용한 모던 웹 개발에 관심이 많으며, 
                사용자가 직관적으로 사용할 수 있는 인터페이스를 만드는 것을 좋아합니다. 
                또한 성능 최적화와 접근성을 고려한 웹 애플리케이션 개발에도 관심이 있습니다.
              </p>
              <p className="text-lg leading-relaxed">
                이 블로그는 개발하면서 배운 것들과 경험을 기록하고 공유하기 위해 만들었습니다. 
                같은 길을 걷는 개발자들에게 도움이 되는 콘텐츠를 만들어가고 싶습니다.
              </p>
            </div>
          </section>

          {/* Skills section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">기술 스택</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold mb-4">Frontend</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>React</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>TypeScript</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Next.js</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tailwind CSS</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Tools & Others</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Git</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Node.js</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Figma</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Vercel</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Experience section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">경험</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-semibold">프론트엔드 개발자</h3>
                <p className="text-muted-foreground mb-2">2022 - 현재</p>
                <p>
                  React와 TypeScript를 활용한 웹 애플리케이션 개발을 담당하고 있습니다. 
                  사용자 경험 개선과 성능 최적화에 중점을 두고 개발하고 있습니다.
                </p>
              </div>
              
              <div className="border-l-4 border-secondary pl-6">
                <h3 className="text-xl font-semibold">개인 프로젝트</h3>
                <p className="text-muted-foreground mb-2">2021 - 현재</p>
                <p>
                  다양한 개인 프로젝트를 통해 새로운 기술을 학습하고 적용해보고 있습니다. 
                  특히 모던 웹 기술 스택을 활용한 프로젝트들을 진행하고 있습니다.
                </p>
              </div>
            </div>
          </section>

          {/* Interests section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">관심사</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">🚀 성능 최적화</h3>
                <p className="text-sm text-muted-foreground">
                  웹 애플리케이션의 로딩 속도와 사용자 경험 개선에 관심이 많습니다.
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">♿ 웹 접근성</h3>
                <p className="text-sm text-muted-foreground">
                  모든 사용자가 편리하게 사용할 수 있는 웹사이트 제작을 지향합니다.
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">🎨 디자인 시스템</h3>
                <p className="text-sm text-muted-foreground">
                  일관성 있고 확장 가능한 디자인 시스템 구축에 관심이 있습니다.
                </p>
              </div>
            </div>
          </section>

          {/* Contact section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">연락처</h2>
            <div className="bg-muted p-6 rounded-lg">
              <p className="mb-4">
                궁금한 점이 있거나 함께 프로젝트를 진행하고 싶으시다면 언제든 연락해주세요!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <a href="mailto:contact@jiwon.dev">이메일 보내기</a>
                </Button>
                <Button variant="outline" asChild>
                  <a 
                    href="https://github.com/jiwonme" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    GitHub 보기
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/blog">블로그 보기</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 
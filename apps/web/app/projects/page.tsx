import { Button } from "@jiwonme/jds";
import Link from "next/link";

// 프로젝트 데이터
const projects = [
  {
    id: 1,
    title: "개발 블로그",
    description: "Next.js 14와 App Router를 사용하여 구축한 개인 개발 블로그입니다. Turborepo 모노레포 구조로 관리되며, 커스텀 디자인 시스템을 적용했습니다.",
    image: "/api/placeholder/600/400",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Turborepo"],
    liveUrl: "https://jiwon.dev",
    githubUrl: "https://github.com/jiwonme/blog",
    status: "완료",
    featured: true,
  },
  {
    id: 2,
    title: "React 컴포넌트 라이브러리",
    description: "재사용 가능한 React 컴포넌트들을 모아놓은 라이브러리입니다. TypeScript로 작성되었으며, Storybook을 통해 문서화되어 있습니다.",
    image: "/api/placeholder/600/400",
    technologies: ["React", "TypeScript", "Storybook", "Rollup"],
    liveUrl: "https://jiwonme-ui.vercel.app",
    githubUrl: "https://github.com/jiwonme/ui-library",
    status: "진행중",
    featured: true,
  },
  {
    id: 3,
    title: "할일 관리 앱",
    description: "React와 TypeScript로 만든 할일 관리 애플리케이션입니다. 드래그 앤 드롭, 카테고리 분류, 마감일 알림 등의 기능을 제공합니다.",
    image: "/api/placeholder/600/400",
    technologies: ["React", "TypeScript", "Zustand", "React DnD"],
    liveUrl: "https://todo-jiwon.vercel.app",
    githubUrl: "https://github.com/jiwonme/todo-app",
    status: "완료",
    featured: false,
  },
  {
    id: 4,
    title: "날씨 대시보드",
    description: "OpenWeatherMap API를 활용한 날씨 정보 대시보드입니다. 현재 날씨와 5일 예보를 제공하며, 반응형 디자인으로 구현되었습니다.",
    image: "/api/placeholder/600/400",
    technologies: ["React", "TypeScript", "Chart.js", "OpenWeatherMap API"],
    liveUrl: "https://weather-jiwon.vercel.app",
    githubUrl: "https://github.com/jiwonme/weather-dashboard",
    status: "완료",
    featured: false,
  },
  {
    id: 5,
    title: "포트폴리오 사이트",
    description: "개인 포트폴리오를 위한 정적 사이트입니다. Gatsby를 사용하여 빠른 로딩 속도를 구현했으며, 다크 모드를 지원합니다.",
    image: "/api/placeholder/600/400",
    technologies: ["Gatsby", "React", "GraphQL", "Styled Components"],
    liveUrl: "https://portfolio-jiwon.vercel.app",
    githubUrl: "https://github.com/jiwonme/portfolio",
    status: "완료",
    featured: false,
  },
  {
    id: 6,
    title: "마크다운 에디터",
    description: "실시간 미리보기를 지원하는 마크다운 에디터입니다. 코드 하이라이팅, 테이블 편집, 파일 내보내기 기능을 제공합니다.",
    image: "/api/placeholder/600/400",
    technologies: ["React", "TypeScript", "CodeMirror", "Remark"],
    liveUrl: "https://markdown-editor-jiwon.vercel.app",
    githubUrl: "https://github.com/jiwonme/markdown-editor",
    status: "진행중",
    featured: false,
  },
];

export default function ProjectsPage() {
  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">프로젝트</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            지금까지 작업한 프로젝트들을 소개합니다. 각 프로젝트를 통해 새로운 기술을 학습하고 적용해보았습니다.
          </p>
        </div>

        {/* Featured Projects */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">주요 프로젝트</h2>
          <div className="grid gap-8 lg:grid-cols-2">
            {featuredProjects.map((project) => (
              <div key={project.id} className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">프로젝트 이미지</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === '완료' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button size="sm" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        라이브 보기
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Other Projects */}
        <section>
          <h2 className="text-3xl font-bold mb-8">기타 프로젝트</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherProjects.map((project) => (
              <div key={project.id} className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">프로젝트 이미지</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === '완료' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        보기
                      </a>
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <div className="bg-muted p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">함께 프로젝트를 진행해보세요!</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              새로운 프로젝트나 협업 기회가 있으시다면 언제든 연락해주세요. 
              함께 멋진 것을 만들어보고 싶습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <a href="mailto:contact@jiwon.dev">프로젝트 문의하기</a>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/about">더 자세한 소개 보기</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 
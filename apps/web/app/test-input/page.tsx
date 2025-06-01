import { Input } from "@jiwonme/jds";

export default function TestInputPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Input 컴포넌트 테스트</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              기본 Input
            </label>
            <Input placeholder="여기에 입력하세요..." />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              이메일 Input
            </label>
            <Input type="email" placeholder="email@example.com" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              비밀번호 Input
            </label>
            <Input type="password" placeholder="비밀번호를 입력하세요" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              비활성화된 Input
            </label>
            <Input disabled placeholder="비활성화된 입력 필드" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              커스텀 스타일 Input
            </label>
            <Input 
              className="border-primary focus-visible:ring-primary" 
              placeholder="커스텀 스타일이 적용된 입력 필드" 
            />
          </div>
        </div>
      </div>
    </div>
  );
} 
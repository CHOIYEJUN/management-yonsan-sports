import type { ComponentProps } from "react";
import { Icon, ArrowLeft, Building2, Building, School, Dumbbell as DumbbellIcon, Waves } from "lucide-react";
import { tennisBall } from "@lucide/lab";

const TennisBallIcon = (props: Omit<ComponentProps<typeof Icon>, "iconNode">) => (
  <Icon {...props} iconNode={tennisBall} />
);
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Instructor } from "../../lib/firebase-mock";

interface CategoryOverviewProps {
  instructors: Instructor[];
  centers: string[];
  categories: string[];
  onBack: () => void;
  onInstructorClick: (instructor: Instructor) => void;
}

const centerIconMap: Record<string, any> = {
  꿈나무종합타운: Building2,
  용산청소년센터: School,
  원효로다목적체육관: Building,
  문화체육센터: Building2,
  이태원초등학교수영장: Waves,
  한강로피트니스센터: DumbbellIcon,
  "한남 테니스장": TennisBallIcon,
};

export function CategoryOverview({
  instructors,
  centers,
  categories,
  onBack,
  onInstructorClick,
}: CategoryOverviewProps) {
  // 근무센터 기준으로 그룹화
  const instructorsByCenter = centers
    .map((center) => ({
      center,
      categoryGroups: categories
        .map((category) => ({
          category,
          instructors: instructors.filter(
            (inst) => inst.currentCenter === center && inst.category === category
          ),
        }))
        .filter((group) => group.instructors.length > 0),
    }))
    .filter((centerGroup) => centerGroup.categoryGroups.length > 0);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb & Back Button - sticky below header */}
      <div className="sticky top-16 z-30 w-full py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="hover:bg-primary/10">
            <ArrowLeft className="h-4 w-4" />
            뒤로가기
          </Button>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>홈</span>
            <span>›</span>
            <span className="font-medium text-primary">종목별 강사 찾기</span>
          </div>
        </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="mb-3 text-3xl">종목별 강사 찾기</h2>
          <p className="text-muted-foreground">근무센터별로 분류된 전체 강사 명단입니다</p>
        </div>

        <div className="space-y-12 max-w-7xl mx-auto">
          {instructorsByCenter.map((centerGroup) => {
            const CenterIcon = centerIconMap[centerGroup.center] || Building2;
            
            return (
              <div key={centerGroup.center} className="space-y-6">
                {/* 근무센터 기준 섹션 */}
                <div className="flex items-center gap-4 pb-4 border-b-2 border-primary/20">
                  <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-4 flex-shrink-0">
                    <CenterIcon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground mb-0.5">근무센터</p>
                    <h3 className="text-2xl font-semibold break-words">{centerGroup.center}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {centerGroup.categoryGroups.reduce(
                        (sum, group) => sum + group.instructors.length,
                        0
                      )}
                      명의 강사
                    </p>
                  </div>
                </div>

                {/* Categories within Center */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {centerGroup.categoryGroups.map((categoryGroup) => (
                    <Card
                      key={categoryGroup.category}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between gap-2 min-w-0">
                          <span className="break-words">{categoryGroup.category}</span>
                          <Badge variant="secondary" className="ml-2">
                            {categoryGroup.instructors.length}명
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {categoryGroup.instructors.map((instructor) => (
                          <div
                            key={instructor.id}
                            className="p-3 rounded-lg border hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer"
                            onClick={() => onInstructorClick(instructor)}
                          >
                            <p className="font-medium">{instructor.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {instructor.position}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

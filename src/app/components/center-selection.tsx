import { Building2, Building, School, Dumbbell, Waves, Bike, User, Users, BookOpen, Activity, CircleDot } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Center, Category } from "../../lib/firebase-mock";
import { Button } from "./ui/button";

interface CenterSelectionProps {
  centers: Center[];
  categories: Category[];
  onSelectCenter: (centerId: string) => void;
  onSelectCategoryDirect: (categoryId: string) => void;
}

const centerIconMap: Record<string, any> = {
  "building-2": Building2,
  building: Building,
  school: School,
  dumbbell: Dumbbell,
  waves: Waves,
  users: Users,
};

const categoryIconMap: Record<string, any> = {
  waves: Waves,
  dumbbell: Dumbbell,
  bike: Bike,
  user: User,
  "circle-dot": CircleDot,
  "book-open": BookOpen,
  activity: Activity,
};

export function CenterSelection({ centers, categories, onSelectCenter, onSelectCategoryDirect }: CenterSelectionProps) {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="mb-3">시설 선택</h2>
          <p className="text-muted-foreground">원하시는 시설을 선택해주세요</p>
        </div>
        <div className="grid grid-cols-4 gap-4 md:gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {centers.map((center) => {
            const Icon = centerIconMap[center.icon] || Building2;
            return (
              <Card
                key={center.id}
                className="cursor-pointer transition-all hover:shadow-2xl hover:scale-105 hover:border-primary/50 group"
                onClick={() => onSelectCenter(center.id)}
              >
                <CardContent className="flex flex-col items-center justify-center p-16">
                  <div className="mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                    <Icon className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="text-center text-xl whitespace-nowrap min-w-0 overflow-hidden text-ellipsis max-w-full px-1" title={center.name}>
                    {center.name}
                  </h3>
                  {center.address && (
                    <p className="text-xs text-muted-foreground mt-2 text-center max-w-full truncate px-1" title={center.address}>
                      {center.address}
                    </p>
                  )}
                  {center.phone && (
                    <p className="text-xs text-muted-foreground mt-1 text-center" title={center.phone}>
                      전화) {center.phone}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 종목별 강사 찾기 섹션 */}
      <section className="container mx-auto px-4 py-16 bg-slate-50/50 border-t">
        <div className="text-center mb-12">
          <h2 className="mb-3">종목별 강사 찾기</h2>
          <p className="text-muted-foreground">원하시는 종목을 선택해주세요</p>
        </div>
        <div className="grid grid-cols-4 gap-4 md:gap-6 md:grid-cols-4 max-w-5xl mx-auto">
          {categories.map((category) => {
            const Icon = categoryIconMap[category.icon] || User;
            return (
              <Card
                key={category.id}
                className="cursor-pointer transition-all hover:shadow-xl hover:scale-105 hover:border-primary/50 group"
                onClick={() => onSelectCategoryDirect(category.id)}
              >
                <CardContent className="flex flex-col items-center justify-center p-10">
                  <div className="mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                    <Icon className="h-10 w-10 text-primary" />
                  </div>
                  <p className="text-center font-semibold text-lg whitespace-nowrap min-w-0 overflow-hidden text-ellipsis max-w-full px-1">{category.name}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
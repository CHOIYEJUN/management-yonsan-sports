import { Waves, Dumbbell, Bike, User, BookOpen, Activity, CircleDot, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Category } from "../../lib/firebase-mock";
import { Button } from "./ui/button";

interface CategorySelectionProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  onBack: () => void;
  selectedCenter: string;
}

const iconMap: Record<string, any> = {
  waves: Waves,
  dumbbell: Dumbbell,
  bike: Bike,
  user: User,
  "circle-dot": CircleDot,
  "book-open": BookOpen,
  activity: Activity,
};

export function CategorySelection({ categories, onSelectCategory, onBack, selectedCenter }: CategorySelectionProps) {
  return (
    <div className="min-h-screen">
      {/* Breadcrumb & Back Button */}
      <div className="container mx-auto px-4 py-6 border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="hover:bg-primary/10">
            <ArrowLeft className="h-4 w-4" />
            뒤로가기
          </Button>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>홈</span>
            <span>›</span>
            <span className="font-medium text-primary whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] sm:max-w-none">{selectedCenter}</span>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="mb-3">종목 선택</h2>
          <p className="text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-2">{selectedCenter}에서 원하시는 종목을 선택해주세요</p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 max-w-5xl mx-auto">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || User;
            return (
              <Card
                key={category.id}
                className="cursor-pointer transition-all hover:shadow-xl hover:scale-105 hover:border-primary/50 group"
                onClick={() => onSelectCategory(category.id)}
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
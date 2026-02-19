import type { ComponentProps } from "react";
import { Icon, Waves, Dumbbell, Bike, User, BookOpen, Activity, CircleDot, ArrowLeft } from "lucide-react";
import { tennisBall } from "@lucide/lab";
import { Card, CardContent } from "./ui/card";
import { Category } from "../../lib/firebase-mock";
import { Button } from "./ui/button";

const TennisBallIcon = (props: Omit<ComponentProps<typeof Icon>, "iconNode">) => (
  <Icon {...props} iconNode={tennisBall} />
);

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
  "tennis-ball": TennisBallIcon,
};

export function CategorySelection({ categories, onSelectCategory, onBack, selectedCenter }: CategorySelectionProps) {
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
            <span className="font-medium text-primary break-words">{selectedCenter}</span>
          </div>
        </div>
        </div>
      </div>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="mb-3">종목 선택</h2>
          <p className="text-muted-foreground break-words px-2">{selectedCenter}에서 원하시는 종목을 선택해주세요</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-6 md:grid-cols-4 max-w-5xl mx-auto">
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
                  <p className="text-center font-semibold text-lg break-words px-1">{category.name}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
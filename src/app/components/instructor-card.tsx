import { User } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Instructor } from "../../lib/firebase-mock";

interface InstructorCardProps {
  instructor: Instructor;
  onViewDetails: (instructor: Instructor) => void;
}

export function InstructorCard({ instructor, onViewDetails }: InstructorCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] border-l-4 border-l-primary/30 hover:border-l-primary">
      <CardContent className="p-6">
        <div className="flex items-start gap-5">
          <Avatar className="h-20 w-20 border-4 border-primary/10">
            <AvatarImage src={instructor.imageUrl} alt={instructor.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="min-w-0 flex-1">
              <h3 className="mb-1.5 text-lg break-words">{instructor.name} 강사</h3>
              <p className="text-sm text-muted-foreground mb-2 break-keep">{instructor.position}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {instructor.gender && (
                <Badge variant="secondary" className="text-xs px-3 py-1 whitespace-nowrap">
                  {instructor.gender === "male" ? "남자" : "여자"}
                </Badge>
              )}
              <Badge className="bg-primary/90 hover:bg-primary text-xs px-3 py-1 break-words">
                📍 {instructor.currentCenter}
              </Badge>
              <Badge variant="outline" className="text-xs px-3 py-1 border-primary/30 whitespace-nowrap">
                {instructor.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0">
        <Button 
          className="w-full hover:bg-primary/90" 
          onClick={() => onViewDetails(instructor)}
        >
          상세보기
        </Button>
      </CardFooter>
    </Card>
  );
}
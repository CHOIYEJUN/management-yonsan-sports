import { CheckCircle2, Edit, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Instructor } from "../../lib/firebase-mock";

interface InstructorDetailModalProps {
  instructor: Instructor | null;
  open: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  onEdit?: (instructor: Instructor) => void;
}

export function InstructorDetailModal({
  instructor,
  open,
  onClose,
  isAdmin = false,
  onEdit,
}: InstructorDetailModalProps) {
  if (!instructor) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">강사 상세 정보</DialogTitle>
        </DialogHeader>

        {/* Profile Header */}
        <div className="flex items-start gap-6 border-b pb-8 flex-shrink-0">
          <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-lg flex-shrink-0">
            <AvatarImage src={instructor.imageUrl} alt={instructor.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-primary">
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3 min-w-0">
            <div>
              <h3 className="text-3xl mb-2 break-words">{instructor.name}</h3>
              <p className="text-muted-foreground text-lg mb-3 break-keep">{instructor.position}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {instructor.gender && (
                <Badge variant="secondary" className="text-sm px-4 py-1.5 whitespace-nowrap">
                  {instructor.gender === "male" ? "남자" : "여자"}
                </Badge>
              )}
              <Badge className="bg-primary text-primary-foreground text-sm px-4 py-1.5 break-words">
                📍 {instructor.currentCenter}
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-1.5 border-primary/40 whitespace-nowrap">
                {instructor.category}
              </Badge>
            </div>
          </div>

          {isAdmin && onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(instructor)}
              className="hover:bg-primary/10 flex-shrink-0"
            >
              <Edit className="h-4 w-4" />
              수정
            </Button>
          )}
        </div>

        {/* 주요 자격 & 경력 사항 - 세로로 한 페이지에 표시 */}
        <div className="flex flex-col gap-10 pt-4 overflow-y-auto min-h-0">
          {instructor.assignedClasses && instructor.assignedClasses.length > 0 && (
            <section>
              <h4 className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-primary/20">
                담당 강습
              </h4>
              <ul className="space-y-2 list-disc list-inside text-base">
                {instructor.assignedClasses.map((cls, index) => (
                  <li key={index} className="break-keep">
                    {cls}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h4 className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-primary/20">주요 자격</h4>
            <div className="space-y-3">
              {instructor.licenses.length > 0 ? (
                instructor.licenses.map((license, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-l-primary/50"
                  >
                    <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-base break-keep">{license}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm py-2">등록된 자격이 없습니다.</p>
              )}
            </div>
          </section>

          <section>
            <h4 className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-primary/20">경력 사항</h4>
            <div className="space-y-6 pl-2">
              {instructor.career.length > 0 ? (
                instructor.career.map((item, index) => (
                  <div key={index} className="flex gap-5">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="h-4 w-4 rounded-full bg-primary shadow-md" />
                      {index < instructor.career.length - 1 && (
                        <div className="w-0.5 flex-1 min-h-[1.5rem] bg-primary/30 mt-2" />
                      )}
                    </div>
                    <p className="text-base break-keep flex-1 pt-0">{item}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm py-2">등록된 경력이 없습니다.</p>
              )}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
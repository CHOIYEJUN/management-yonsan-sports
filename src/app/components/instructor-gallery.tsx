import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { InstructorCard } from "./instructor-card";
import { Instructor } from "../../lib/firebase-mock";
import { getTimetableUrl } from "../../lib/timetable-url-service";

interface InstructorGalleryProps {
  instructors: Instructor[];
  onBack: () => void;
  onViewDetails: (instructor: Instructor) => void;
  filterCenter?: string;
  filterCategory?: string;
}

export function InstructorGallery({
  instructors,
  onBack,
  onViewDetails,
  filterCenter,
  filterCategory,
}: InstructorGalleryProps) {
  const [timetableUrl, setTimetableUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!filterCenter || !filterCategory) {
      setTimetableUrl(null);
      return;
    }
    let cancelled = false;
    getTimetableUrl(filterCenter, filterCategory).then((url) => {
      if (!cancelled) setTimetableUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [filterCenter, filterCategory]);

  const filteredInstructors = instructors
    .filter((inst) => {
      if (filterCenter && inst.currentCenter !== filterCenter) return false;
      if (filterCategory && inst.category !== filterCategory) return false;
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name, "ko"));

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Breadcrumb & Back Button - sticky below header */}
      <div className="sticky top-16 z-30 -mx-4 px-4 -mt-8 pt-8 mb-8 pb-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button variant="outline" size="sm" onClick={onBack} className="hover:bg-primary/10">
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </Button>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span>홈</span>
          {filterCenter && (
            <>
              <span>›</span>
              <span className="font-medium text-primary whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px] sm:max-w-none">{filterCenter}</span>
            </>
          )}
          {filterCategory && (
            <>
              <span>›</span>
              <span className="font-medium text-primary whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] sm:max-w-none">{filterCategory}</span>
            </>
          )}
        </div>
      </div>

      {/* Header & Sort */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-xl border">
        <div>
          <h2 className="mb-2 text-2xl">강사 명단</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              {filteredInstructors.length}
            </span>
            명의 전문 강사
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {filterCenter && filterCategory && timetableUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(timetableUrl!, "_blank")}
            >
              시간표 / 리플렛 보기
            </Button>
          )}
        </div>
      </div>

      {/* Instructor Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInstructors.map((instructor) => (
          <InstructorCard
            key={instructor.id}
            instructor={instructor}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {filteredInstructors.length === 0 && (
        <div className="py-20 text-center">
          <div className="mx-auto w-20 h-20 mb-6 rounded-full bg-muted flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <p className="text-muted-foreground text-lg">해당 조건의 강사가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { InstructorCard } from "./instructor-card";
import { InstructorDetailModal } from "./instructor-detail-modal";
import type { Instructor } from "../../lib/types";
import { fetchInstructors } from "../../lib/instructor-service";

function filterBySearch(instructors: Instructor[], term: string): Instructor[] {
  const t = term.trim().toLowerCase();
  if (!t) return instructors;
  return instructors.filter((inst) => {
    const genderLabel =
      inst.gender === "male" ? "남자" : inst.gender === "female" ? "여자" : "";
    const assigned = (inst.assignedClasses || []).join(" ");
    const haystack = [
      inst.name,
      inst.position,
      inst.category,
      genderLabel,
      inst.currentCenter,
      assigned,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(t);
  });
}

interface SearchPageProps {
  query: string;
  onClose: () => void;
}

export function SearchPage({ query, onClose }: SearchPageProps) {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await fetchInstructors();
        if (!cancelled) setInstructors(list);
      } catch (_) {
        if (!cancelled) setInstructors([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = filterBySearch(instructors, query).sort((a, b) =>
    a.name.localeCompare(b.name, "ko")
  );
  const hasQuery = query.trim().length > 0;

  const handleViewDetails = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-primary">
                강사 통합 검색
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
              {hasQuery ? (
                <>검색어: &quot;{query}&quot; — {filtered.length}명</>
              ) : (
                <>전체 강사 명단 — {filtered.length}명</>
              )}
            </p>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              닫기
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">
            불러오는 중…
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-primary/5 border p-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                {filtered.length}
              </span>
              <span className="text-sm text-muted-foreground">
                명의 강사
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((instructor) => (
                <InstructorCard
                  key={instructor.id}
                  instructor={instructor}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-20 text-center">
                <div className="mx-auto w-20 h-20 mb-6 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-4xl">🔍</span>
                </div>
                <p className="text-muted-foreground text-lg">
                  검색 조건에 맞는 강사가 없습니다.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <InstructorDetailModal
        instructor={selectedInstructor}
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  );
}

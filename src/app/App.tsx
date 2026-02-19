import { useState, useEffect } from "react";
import { Navbar } from "./components/navbar";
import { CenterSelection } from "./components/center-selection";
import { CategorySelection } from "./components/category-selection";
import { CategoryOverview } from "./components/category-overview";
import { InstructorGallery } from "./components/instructor-gallery";
import { InstructorDetailModal } from "./components/instructor-detail-modal";
import { AdminDashboard } from "./components/admin-dashboard";
import { LoginDialog } from "./components/login-dialog";
import { SearchPage } from "./components/search-page";
import { mockCenters, mockCategories, getCategoriesForCenter } from "../lib/firebase-mock";
import type { Instructor } from "../lib/types";
import { useAuth } from "../lib/auth-context";
import {
  fetchInstructors,
  saveInstructor as saveInstructorToFirestore,
  deleteInstructor as deleteInstructorFromFirestore,
} from "../lib/instructor-service";

type PageStep = "center" | "category" | "categoryOverview" | "gallery" | "detail";

function getSearchQueryFromHash(): string {
  if (typeof window === "undefined") return "";
  const match = window.location.hash.match(/#search\?q=([^&]*)/);
  return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : "";
}

export default function App() {
  const { isAdmin } = useAuth();
  const [searchView, setSearchView] = useState<{ active: boolean; query: string }>({ active: false, query: "" });
  const [currentStep, setCurrentStep] = useState<PageStep>("center");
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [instructorsLoading, setInstructorsLoading] = useState(true);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  useEffect(() => {
    const check = () => {
      const isSearch = typeof window !== "undefined" && window.location.hash.startsWith("#search");
      setSearchView({ active: isSearch, query: isSearch ? getSearchQueryFromHash() : "" });
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setInstructorsLoading(true);
      try {
        const list = await fetchInstructors();
        if (!cancelled) setInstructors(list);
      } catch (_) {
        if (!cancelled) setInstructors([]);
      } finally {
        if (!cancelled) setInstructorsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "용산구시설관리공단 지도자 현황";
    }
  }, []);

  const handleCenterSelect = (centerId: string) => {
    const center = mockCenters.find((c) => c.id === centerId);
    setSelectedCenter(center?.name || "");
    setCurrentStep("category");
  };

  const handleCategoryOverview = () => {
    setCurrentStep("categoryOverview");
  };

  const handleCategorySelect = (categoryId: string) => {
    const category = mockCategories.find((c) => c.id === categoryId);
    setSelectedCategory(category?.name || "");
    setCurrentStep("gallery");
  };

  const handleCategoryDirectSelect = (categoryId: string) => {
    const category = mockCategories.find((c) => c.id === categoryId);
    setSelectedCategory(category?.name || "");
    setSelectedCenter(""); // 센터 필터 없이 종목만 필터
    setCurrentStep("gallery");
  };

  const handleViewDetails = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setShowDetailModal(true);
  };

  const handleBackFromCategory = () => {
    setCurrentStep("center");
    setSelectedCenter("");
    setSelectedCategory("");
  };

  const handleBackFromCategoryOverview = () => {
    setCurrentStep("center");
  };

  const handleBackFromGallery = () => {
    if (selectedCenter) {
      // 센터를 통해 들어온 경우
      setCurrentStep("category");
      setSelectedCategory("");
    } else {
      // 종목별 강사 찾기를 통해 들어온 경우
      setCurrentStep("center");
      setSelectedCategory("");
    }
  };

  const handleSaveInstructor = async (instructor: Instructor) => {
    await saveInstructorToFirestore(instructor);
    const existingIndex = instructors.findIndex((i) => i.id === instructor.id);
    if (existingIndex >= 0) {
      const updated = [...instructors];
      updated[existingIndex] = instructor;
      setInstructors(updated);
    } else {
      setInstructors([...instructors, instructor]);
    }
  };

  const handleDeleteInstructor = async (instructorId: string) => {
    await deleteInstructorFromFirestore(instructorId);
    setInstructors(instructors.filter((i) => i.id !== instructorId));
  };

  const handleEditFromDetail = (instructor: Instructor) => {
    if (!isAdmin) return;
    setSelectedInstructor(instructor);
    setShowDetailModal(false);
    setEditingInstructor(instructor);
    setShowAdminDashboard(true);
  };

  if (searchView.active) {
    return (
      <SearchPage
        query={searchView.query}
        onClose={() => {
          window.location.hash = "";
          setSearchView({ active: false, query: "" });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onAdminClick={() => setShowAdminDashboard(true)}
        onLoginClick={() => setShowLoginDialog(true)}
      />

      {/* Step 1: Center Selection (메인 홈) */}
      {currentStep === "center" && (
        <CenterSelection
          centers={mockCenters}
          categories={mockCategories}
          onSelectCenter={handleCenterSelect}
          onSelectCategoryDirect={handleCategoryDirectSelect}
        />
      )}

      {/* Step 2a: Category Selection (센터 선택 후 해당 시설 종목만 표시) */}
      {currentStep === "category" && (
        <CategorySelection
          categories={getCategoriesForCenter(selectedCenter)}
          onSelectCategory={handleCategorySelect}
          onBack={handleBackFromCategory}
          selectedCenter={selectedCenter}
        />
      )}

      {/* Step 2b: Category Overview (종목별 강사 찾기) */}
      {currentStep === "categoryOverview" && (
        <CategoryOverview
          instructors={instructors}
          centers={mockCenters.map((c) => c.name)}
          categories={mockCategories.map((c) => c.name)}
          onBack={handleBackFromCategoryOverview}
          onInstructorClick={handleViewDetails}
        />
      )}

      {/* Step 3: Instructor Gallery */}
      {currentStep === "gallery" && (
        <InstructorGallery
          instructors={instructors}
          onBack={handleBackFromGallery}
          onViewDetails={handleViewDetails}
          filterCenter={selectedCenter}
          filterCategory={selectedCategory}
        />
      )}

      {/* Step 4: Instructor Detail Modal */}
      <InstructorDetailModal
        instructor={selectedInstructor}
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        isAdmin={isAdmin}
        onEdit={handleEditFromDetail}
      />

      <AdminDashboard
        open={showAdminDashboard}
        onClose={() => {
          setShowAdminDashboard(false);
          setEditingInstructor(null);
        }}
        instructors={instructors}
        onSave={handleSaveInstructor}
        onDelete={handleDeleteInstructor}
        editingInstructor={editingInstructor || undefined}
      />

      <LoginDialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </div>
  );
}
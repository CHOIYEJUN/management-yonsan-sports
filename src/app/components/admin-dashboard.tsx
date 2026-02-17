import { useState } from "react";
import { Trash2, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import type { Instructor } from "../../lib/types";
import { mockCenters, mockCategories } from "../../lib/firebase-mock";
import React from "react";

interface AdminDashboardProps {
  open: boolean;
  onClose: () => void;
  instructors: Instructor[];
  onSave: (instructor: Instructor) => void | Promise<void>;
  onDelete: (instructorId: string) => void | Promise<void>;
  editingInstructor?: Instructor | null;
}

export function AdminDashboard({
  open,
  onClose,
  instructors,
  onSave,
  onDelete,
  editingInstructor,
}: AdminDashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Instructor>>(
    editingInstructor || {
      name: "",
      currentCenter: "",
      category: "",
      position: "",
      gender: undefined,
      licenses: [],
      career: [],
    }
  );
  const [newLicense, setNewLicense] = useState("");
  const [newCareer, setNewCareer] = useState("");

  const handleStartEdit = (instructor?: Instructor) => {
    if (instructor) {
      setFormData(instructor);
    } else {
      setFormData({
        name: "",
        currentCenter: "",
        category: "",
        position: "",
        gender: undefined,
        licenses: [],
        career: [],
      });
    }
    setIsEditing(true);
  };

  const handleAddLicense = () => {
    if (newLicense.trim()) {
      setFormData({
        ...formData,
        licenses: [...(formData.licenses || []), newLicense.trim()],
      });
      setNewLicense("");
    }
  };

  const handleRemoveLicense = (index: number) => {
    setFormData({
      ...formData,
      licenses: formData.licenses?.filter((_, i) => i !== index) || [],
    });
  };

  const handleAddCareer = () => {
    if (newCareer.trim()) {
      setFormData({
        ...formData,
        career: [...(formData.career || []), newCareer.trim()],
      });
      setNewCareer("");
    }
  };

  const handleRemoveCareer = (index: number) => {
    setFormData({
      ...formData,
      career: formData.career?.filter((_, i) => i !== index) || [],
    });
  };

  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.currentCenter ||
      !formData.category ||
      !formData.position
    ) {
      return;
    }
    setSaveError(null);
    setSaving(true);
    try {
      const instructor: Instructor = {
        id: formData.id || `inst${Date.now()}`,
        name: formData.name,
        currentCenter: formData.currentCenter,
        category: formData.category,
        position: formData.position,
        gender: formData.gender,
        licenses: formData.licenses || [],
        career: formData.career || [],
      };
      await onSave(instructor);
      setIsEditing(false);
      setFormData({
        name: "",
        currentCenter: "",
        category: "",
        position: "",
        gender: undefined,
        licenses: [],
        career: [],
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "저장에 실패했습니다.";
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>관리자 대시보드</DialogTitle>
        </DialogHeader>

        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3>강사 목록 관리</h3>
              <Button onClick={() => handleStartEdit()}>
                <Plus className="h-4 w-4" />
                새 강사 추가
              </Button>
            </div>

            <div className="space-y-2">
              {instructors.map((instructor) => (
                <div
                  key={instructor.id}
                  className="flex items-center justify-between rounded-lg border p-4 gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">{instructor.name}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
                        {instructor.currentCenter}
                      </Badge>
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        {instructor.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartEdit(instructor)}
                    >
                      수정
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm(`${instructor.name} 강사를 삭제하시겠습니까?`)) {
                          onDelete(instructor.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3>{formData.id ? "강사 정보 수정" : "새 강사 등록"}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="text-sm mb-2 block">강사 이름</label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="강사 이름을 입력하세요"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-2 block">근무 센터</label>
                  <Select
                    value={formData.currentCenter || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, currentCenter: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="센터 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCenters.map((center) => (
                        <SelectItem key={center.id} value={center.name}>
                          {center.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm mb-2 block">종목</label>
                  <Select
                    value={formData.category || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="종목 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm mb-2 block">직책</label>
                <Input
                  value={formData.position || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  placeholder="예: 수영 전문 지도자"
                />
              </div>

              <div>
                <label className="text-sm mb-2 block">성별</label>
                <Select
                  value={formData.gender ?? "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      gender: value === "male" || value === "female" ? value : undefined,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">선택</SelectItem>
                    <SelectItem value="male">남자</SelectItem>
                    <SelectItem value="female">여자</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-2 block">자격증</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newLicense}
                    onChange={(e) => setNewLicense(e.target.value)}
                    placeholder="자격증 추가"
                    onKeyPress={(e) => e.key === "Enter" && handleAddLicense()}
                  />
                  <Button type="button" onClick={handleAddLicense}>
                    추가
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.licenses?.map((license, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <span className="text-sm">{license}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLicense(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm mb-2 block">경력</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newCareer}
                    onChange={(e) => setNewCareer(e.target.value)}
                    placeholder="경력 추가 (예: 2020-현재: 한강로피트니스센터 강사)"
                    onKeyPress={(e) => e.key === "Enter" && handleAddCareer()}
                  />
                  <Button type="button" onClick={handleAddCareer}>
                    추가
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.career?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <span className="text-sm">{item}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCareer(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {saveError && (
              <p className="text-sm text-destructive">{saveError}</p>
            )}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                취소
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "저장 중..." : "저장하기"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

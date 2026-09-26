"use client";

import { useState } from "react";
import { characterSchema, type Character } from "@/lib/characters/schema";
import { lockCharacter, unlockCharacter } from "@/lib/characters/continuity";

const emptyCharacter: Character = {
  name: "",
  description: null,
  appearance: {
    gender: null,
    age: null,
    ethnicity: null,
    height: null,
    bodyType: null,
    face: null,
    hair: null,
    eyes: null,
  },
  wardrobe: {
    outfit: null,
    shoes: null,
    accessories: null,
  },
  personality: null,
  voice: null,
  behavior: null,
  status: "UNLOCKED",
};

function Field({
  label,
  value,
  disabled,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  type?: "text" | "number";
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <textarea
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      />
    </label>
  );
}

export default function CharacterPage() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isLocked = character?.status === "LOCKED";

  function createCharacter() {
    setCharacter({ ...emptyCharacter });
    setMessage("");
    setError("");
  }

  function updateCharacter(patch: Partial<Character>) {
    if (!character || isLocked) return;
    setCharacter({ ...character, ...patch });
  }

  function updateAppearance(
    patch: Partial<Character["appearance"]>,
  ) {
    if (!character || isLocked) return;
    setCharacter({
      ...character,
      appearance: {
        ...character.appearance,
        ...patch,
      },
    });
  }

  function updateWardrobe(
    patch: Partial<Character["wardrobe"]>,
  ) {
    if (!character || isLocked) return;
    setCharacter({
      ...character,
      wardrobe: {
        ...character.wardrobe,
        ...patch,
      },
    });
  }

  function saveCharacter() {
    if (!character) return;

    setError("");
    setMessage("");

    const result = characterSchema.safeParse(character);

    if (!result.success) {
      setError("Hồ sơ nhân vật chưa hợp lệ. Vui lòng kiểm tra các trường bắt buộc.");
      return;
    }

    setCharacter(result.data);
    setMessage("Đã lưu hồ sơ nhân vật.");
  }

  function toggleLock() {
    if (!character) return;

    setError("");
    setMessage("");

    if (character.status === "LOCKED") {
      setCharacter(unlockCharacter(character));
      setMessage("Nhân vật đã được mở khóa.");
    } else {
      setCharacter(lockCharacter(character));
      setMessage("Nhân vật đã được khóa để bảo vệ continuity.");
    }
  }

  if (!character) {
    return (
      <section>
        <p className="text-sm font-semibold text-indigo-600">CHARACTER</p>

        <div className="mt-1 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Character Master
            </h1>
            <p className="mt-2 text-slate-600">
              Tạo hồ sơ nhân vật gốc để giữ continuity xuyên suốt các video.
            </p>
          </div>

          <button
            type="button"
            onClick={createCharacter}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700"
          >
            + TẠO NHÂN VẬT
          </button>
        </div>

        <div className="mt-7 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-2xl">
            👤
          </div>
          <p className="mt-4 font-semibold text-slate-900">
            Chưa có Character Master
          </p>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
            Hãy tạo nhân vật gốc. Sau khi hoàn thiện hồ sơ, bạn có thể LOCKED
            nhân vật để bảo vệ ngoại hình, trang phục và đặc điểm xuyên suốt
            quá trình tạo video.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-indigo-600">CHARACTER</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Character Master
          </h1>
          <p className="mt-2 text-slate-600">
            Hồ sơ gốc dùng để duy trì character continuity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isLocked
                ? "bg-amber-100 text-amber-800"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {character.status}
          </span>

          <button
            type="button"
            onClick={toggleLock}
            className={`rounded-lg px-4 py-2 font-semibold text-white transition ${
              isLocked
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {isLocked ? "MỞ KHÓA" : "KHÓA NHÂN VẬT"}
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Hồ sơ nhân vật
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isLocked
                ? "Nhân vật đang LOCKED. Không thể chỉnh sửa."
                : "Nhân vật đang UNLOCKED và có thể chỉnh sửa."}
            </p>
          </div>

          {!isLocked && (
            <button
              type="button"
              onClick={saveCharacter}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              LƯU NHÂN VẬT
            </button>
          )}
        </div>

        {message && (
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-8">
          <div>
            <h3 className="text-base font-bold text-slate-900">Thông tin cơ bản</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <Field
                label="Tên nhân vật *"
                value={character.name}
                disabled={isLocked}
                onChange={(value) => updateCharacter({ name: value })}
              />

              <TextArea
                label="Mô tả"
                value={character.description ?? ""}
                disabled={isLocked}
                onChange={(value) =>
                  updateCharacter({ description: value || null })
                }
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-base font-bold text-slate-900">Appearance</h3>
            <p className="mt-1 text-sm text-slate-500">
              Các đặc điểm nhận diện quan trọng để giữ hình ảnh nhân vật nhất quán.
            </p>

            <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Field
                label="Giới tính"
                value={character.appearance.gender ?? ""}
                disabled={isLocked}
                onChange={(value) => updateAppearance({ gender: value || null })}
              />
              <Field
                label="Tuổi"
                type="number"
                value={
                  character.appearance.age === null
                    ? ""
                    : String(character.appearance.age)
                }
                disabled={isLocked}
                onChange={(value) =>
                  updateAppearance({
                    age: value === "" ? null : Number(value),
                  })
                }
              />
              <Field
                label="Ethnicity"
                value={character.appearance.ethnicity ?? ""}
                disabled={isLocked}
                onChange={(value) =>
                  updateAppearance({ ethnicity: value || null })
                }
              />
              <Field
                label="Chiều cao"
                value={character.appearance.height ?? ""}
                disabled={isLocked}
                onChange={(value) => updateAppearance({ height: value || null })}
              />
              <Field
                label="Body type"
                value={character.appearance.bodyType ?? ""}
                disabled={isLocked}
                onChange={(value) =>
                  updateAppearance({ bodyType: value || null })
                }
              />
              <Field
                label="Gương mặt"
                value={character.appearance.face ?? ""}
                disabled={isLocked}
                onChange={(value) => updateAppearance({ face: value || null })}
              />
              <Field
                label="Tóc"
                value={character.appearance.hair ?? ""}
                disabled={isLocked}
                onChange={(value) => updateAppearance({ hair: value || null })}
              />
              <Field
                label="Mắt"
                value={character.appearance.eyes ?? ""}
                disabled={isLocked}
                onChange={(value) => updateAppearance({ eyes: value || null })}
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-base font-bold text-slate-900">Wardrobe</h3>
            <p className="mt-1 text-sm text-slate-500">
              Trang phục cố định giúp tránh thay đổi nhân vật giữa các cảnh.
            </p>

            <div className="mt-4 grid gap-5 md:grid-cols-3">
              <TextArea
                label="Trang phục"
                value={character.wardrobe.outfit ?? ""}
                disabled={isLocked}
                onChange={(value) =>
                  updateWardrobe({ outfit: value || null })
                }
              />
              <TextArea
                label="Giày"
                value={character.wardrobe.shoes ?? ""}
                disabled={isLocked}
                onChange={(value) => updateWardrobe({ shoes: value || null })}
              />
              <TextArea
                label="Phụ kiện"
                value={character.wardrobe.accessories ?? ""}
                disabled={isLocked}
                onChange={(value) =>
                  updateWardrobe({ accessories: value || null })
                }
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-base font-bold text-slate-900">
              Personality & Voice
            </h3>

            <div className="mt-4 grid gap-5 md:grid-cols-3">
              <TextArea
                label="Personality"
                value={character.personality ?? ""}
                disabled={isLocked}
                onChange={(value) =>
                  updateCharacter({ personality: value || null })
                }
              />
              <TextArea
                label="Voice"
                value={character.voice ?? ""}
                disabled={isLocked}
                onChange={(value) => updateCharacter({ voice: value || null })}
              />
              <TextArea
                label="Behavior"
                value={character.behavior ?? ""}
                disabled={isLocked}
                onChange={(value) =>
                  updateCharacter({ behavior: value || null })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

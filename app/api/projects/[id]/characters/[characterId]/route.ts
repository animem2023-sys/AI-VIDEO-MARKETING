import { NextResponse } from "next/server";
import { characterUpdateRequestSchema } from "@/lib/characters/request-schema";
import {
  CharacterNotFoundError,
  CharacterProjectMismatchError,
  deleteProjectCharacter,
  updateProjectCharacter,
} from "@/lib/characters/api-service";
import { getCharacterRepository } from "@/lib/characters/repository-provider";
import { toCharacterResponse } from "@/lib/characters/mapper";
import { CharacterLockedError } from "@/lib/characters/continuity";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string; characterId: string }>;
  },
) {
  const { id, characterId } = await params;

  if (!id || !characterId) {
    return NextResponse.json(
      { error: "Project ID hoặc Character ID không hợp lệ." },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const validation = characterUpdateRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dữ liệu cập nhật nhân vật không hợp lệ." },
        { status: 400 },
      );
    }

    const repository = getCharacterRepository();

    const updatedCharacter = await updateProjectCharacter(
      repository,
      id,
      characterId,
      validation.data,
    );

    return NextResponse.json({
      character: toCharacterResponse(updatedCharacter),
    });
  } catch (error) {
    if (error instanceof CharacterNotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 },
      );
    }

    if (error instanceof CharacterProjectMismatchError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 },
      );
    }

    if (error instanceof CharacterLockedError) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Không thể cập nhật nhân vật." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string; characterId: string }>;
  },
) {
  const { id, characterId } = await params;

  if (!id || !characterId) {
    return NextResponse.json(
      { error: "Project ID hoặc Character ID không hợp lệ." },
      { status: 400 },
    );
  }

  try {
    const repository = getCharacterRepository();

    await deleteProjectCharacter(repository, id, characterId);

    return NextResponse.json({
      projectId: id,
      characterId,
      deleted: true,
    });
  } catch (error) {
    if (error instanceof CharacterNotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 },
      );
    }

    if (error instanceof CharacterProjectMismatchError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Không thể xóa nhân vật." },
      { status: 500 },
    );
  }
}
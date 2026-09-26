import { NextResponse } from "next/server";
import { characterCreateRequestSchema } from "@/lib/characters/request-schema";
import {
  createProjectCharacter,
  listProjectCharacters,
} from "@/lib/characters/api-service";
import { getCharacterRepository } from "@/lib/characters/repository-provider";
import { toCharacterResponse } from "@/lib/characters/mapper";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Project ID không hợp lệ." },
      { status: 400 },
    );
  }

  try {
    const repository = getCharacterRepository();
    const characters = await listProjectCharacters(repository, id);

    return NextResponse.json({
      characters: characters.map(toCharacterResponse),
    });
  } catch {
    return NextResponse.json(
      { error: "Không thể tải danh sách nhân vật." },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Project ID không hợp lệ." },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const validation = characterCreateRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dữ liệu nhân vật không hợp lệ." },
        { status: 400 },
      );
    }

    const repository = getCharacterRepository();
    const character = await createProjectCharacter(
      repository,
      id,
      validation.data,
    );

    return NextResponse.json(
      { character: toCharacterResponse(character) },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Không thể tạo nhân vật." },
      { status: 500 },
    );
  }
}
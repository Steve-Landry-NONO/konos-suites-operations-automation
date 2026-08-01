import { NextRequest, NextResponse } from "next/server";
import { uploadTaskPhoto } from "../../../../../lib/task-photos";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ taskId: string }>;
};

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { taskId } = await context.params;
    const formData = await request.formData();
    const file = formData.get("photo");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Aucune photo valide nâ€™a Ã©tÃ© reÃ§ue." },
        { status: 400 },
      );
    }

    const result = await uploadTaskPhoto(taskId, file);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur inconnue pendant lâ€™envoi de la photo.";

    console.error("Envoi de photo impossible :", error);

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}



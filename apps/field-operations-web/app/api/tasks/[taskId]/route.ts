import { NextRequest, NextResponse } from "next/server";
import {
  TASK_STATUSES,
  TaskStatus,
  updateFieldTask,
} from "../../../../lib/notion";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ taskId: string }>;
};

function isTaskStatus(value: unknown): value is TaskStatus {
  return (
    typeof value === "string" &&
    TASK_STATUSES.includes(value as TaskStatus)
  );
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { taskId } = await context.params;
    const body = await request.json();

    if (!isTaskStatus(body?.status)) {
      return NextResponse.json(
        { error: "Statut invalide." },
        { status: 400 },
      );
    }

    const comment =
      typeof body.comment === "string" ? body.comment : "";
    const completedBy =
      typeof body.completedBy === "string" ? body.completedBy : "";

    if (
      body.status === "Problème" &&
      comment.trim().length < 5
    ) {
      return NextResponse.json(
        {
          error:
            "Un commentaire d’au moins 5 caractères est obligatoire pour signaler un problème.",
        },
        { status: 400 },
      );
    }

    const task = await updateFieldTask(taskId, {
      status: body.status,
      comment,
      completedBy,
    });

    return NextResponse.json({
      task,
      incidentCreated: body.status === "Problème",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur inconnue pendant la mise à jour.";

    console.error("Mise à jour de tâche impossible :", error);

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}

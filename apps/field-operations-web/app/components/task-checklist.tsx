"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { FieldTask, TaskStatus } from "../../lib/notion";

type Props = {
  initialTasks: FieldTask[];
  checklistVersion: string;
};

const STATUS_LABELS: TaskStatus[] = [
  "À faire",
  "En cours",
  "Fait",
  "Problème",
  "Non applicable",
];

function isDone(status: TaskStatus): boolean {
  return status === "Fait" || status === "Non applicable";
}

export default function TaskChecklist({
  initialTasks,
  checklistVersion,
}: Props) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [openedTaskId, setOpenedTaskId] = useState<string | null>(null);
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>(
    Object.fromEntries(initialTasks.map((task) => [task.id, task.comment])),
  );
  const [completedBy, setCompletedBy] = useState<Record<string, string>>(
    Object.fromEntries(
      initialTasks.map((task) => [task.id, task.completedBy]),
    ),
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const completedCount = useMemo(
    () => tasks.filter((task) => isDone(task.status)).length,
    [tasks],
  );

  const progress =
    tasks.length > 0
      ? Math.round((completedCount / tasks.length) * 100)
      : 0;

  const blockingRequiredTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.required &&
          task.automationId.split(":").at(-1) !== "mission-complete" &&
          !isDone(task.status),
      ),
    [tasks],
  );

  async function updateTask(task: FieldTask, status: TaskStatus) {
    setError("");
    setSuccess("");

    const comment = comments[task.id] ?? "";

    if (status === "Problème" && comment.trim().length < 5) {
      setError(
        "Ajoutez un commentaire d’au moins 5 caractères avant de signaler un problème.",
      );
      return;
    }

    setBusyTaskId(task.id);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          comment,
          completedBy: completedBy[task.id] ?? "",
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? "Mise à jour impossible.");
      }

      setTasks((current) =>
        current.map((item) =>
          item.id === task.id ? payload.task : item,
        ),
      );

      if (status === "Problème") {
        setSuccess(
          "Problème enregistré et incident signalé sur l’intervention.",
        );
      } else {
        setSuccess("Tâche mise à jour dans Notion.");
      }

      if (status === "Fait" || status === "Non applicable") {
        setOpenedTaskId(null);
      }

      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Mise à jour impossible.",
      );
    } finally {
      setBusyTaskId(null);
    }
  }

  return (
    <>
      <section className="card">
        <div className="row">
          <strong>Checklist {checklistVersion || "MVP-1.0"}</strong>
          <span>
            {completedCount} / {tasks.length}
          </span>
        </div>
        <div className="progress">
          <div style={{ width: `${progress}%` }} />
        </div>
      </section>

      {error && (
        <section className="card inline-error" role="alert">
          <strong>Action impossible</strong>
          <p>{error}</p>
        </section>
      )}

      {success && (
        <section className="card inline-success" role="status">
          <strong>Enregistré</strong>
          <p>{success}</p>
        </section>
      )}

      <section>
        {tasks.map((task, index) => {
          const isOpen = openedTaskId === task.id;
          const isBusy = busyTaskId === task.id;
          const isMissionComplete =
            task.automationId.split(":").at(-1) === "mission-complete";
          const missionBlocked =
            isMissionComplete && blockingRequiredTasks.length > 0;

          return (
            <article
              className={`task task-${task.status
                .toLowerCase()
                .replaceAll(" ", "-")
                .replaceAll("è", "e")
                .replaceAll("à", "a")}`}
              key={task.id}
            >
              <button
                className="task-summary"
                type="button"
                onClick={() =>
                  setOpenedTaskId(isOpen ? null : task.id)
                }
                aria-expanded={isOpen}
              >
                <span className="index">{index + 1}</span>
                <span className="task-main">
                  <small>{task.section || "Sans section"}</small>
                  <strong>{task.title || "Tâche sans titre"}</strong>
                  <span>{task.instruction || "Aucune instruction."}</span>

                  <span className="task-meta">
                    {task.required && <span>Obligatoire</span>}
                    {task.photoRequired && <span>Photo requise</span>}
                    <span>{task.status}</span>
                  </span>
                </span>
                <span className="chevron">{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen && (
                <div className="task-actions">
                  {task.condition && (
                    <p className="condition">
                      Condition : {task.condition}
                    </p>
                  )}

                  <label>
                    Commentaire
                    <textarea
                      value={comments[task.id] ?? ""}
                      onChange={(event) =>
                        setComments((current) => ({
                          ...current,
                          [task.id]: event.target.value,
                        }))
                      }
                      placeholder="Obligatoire pour signaler un problème…"
                      rows={3}
                    />
                  </label>

                  <label>
                    Réalisé par
                    <input
                      value={completedBy[task.id] ?? ""}
                      onChange={(event) =>
                        setCompletedBy((current) => ({
                          ...current,
                          [task.id]: event.target.value,
                        }))
                      }
                      placeholder="Prénom de l’intervenant"
                    />
                  </label>

                  {missionBlocked && (
                    <p className="blocking-message">
                      Clôture bloquée : {blockingRequiredTasks.length} tâche(s)
                      obligatoire(s) restent à terminer.
                    </p>
                  )}

                  <div className="status-buttons">
                    {STATUS_LABELS.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={
                          isBusy ||
                          (missionBlocked && status === "Fait")
                        }
                        className={
                          task.status === status ? "active-status" : ""
                        }
                        onClick={() => updateTask(task, status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </section>
    </>
  );
}

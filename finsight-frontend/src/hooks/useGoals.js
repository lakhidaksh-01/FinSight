/*
 * useGoals
 * --------
 * Goal list, progress maths and the summary shown above the goal grid.
 *
 *   const {
 *     goals, summary, loading, saving, error,
 *     createGoal, updateGoal, deleteGoal, addProgress,
 *   } = useGoals();
 *
 * The Goal document stores name, targetAmount, currentAmount, targetDate and
 * description only, so everything the cards present as a percentage, a status
 * or a "days left" label is derived here from those fields. `deadline` is the
 * name the components use and goalService maps it to `targetDate`.
 *
 * Status rules
 *   completed : currentAmount >= targetAmount
 *   overdue   : deadline passed while the target is still open
 *   at-risk   : less than 30 days left and under 50% funded
 *   otherwise : in-progress
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { goalService } from "../services/goalService";
import { sumBy } from "../utils/calculations";
import { daysUntil, parseDate } from "../utils/formatDate";

const AT_RISK_WINDOW_DAYS = 30;
const AT_RISK_PROGRESS = 50;

const decorate = (goal) => {
  const targetAmount = Number(goal.targetAmount) || 0;
  const currentAmount = Number(goal.currentAmount) || 0;
  const percentage =
    targetAmount > 0
      ? Number(Math.min((currentAmount / targetAmount) * 100, 100).toFixed(1))
      : 0;
  const remaining = Math.max(targetAmount - currentAmount, 0);
  const daysLeft = goal.deadline ? daysUntil(goal.deadline) : null;
  const monthsLeft = daysLeft === null ? null : Math.max(Math.ceil(daysLeft / 30), 0);
  const monthlyNeeded =
    remaining > 0 && monthsLeft !== null && monthsLeft > 0
      ? Number((remaining / monthsLeft).toFixed(2))
      : remaining > 0
        ? remaining
        : 0;

  let status = "in-progress";

  if (targetAmount > 0 && currentAmount >= targetAmount) {
    status = "completed";
  } else if (daysLeft !== null && daysLeft < 0) {
    status = "overdue";
  } else if (
    daysLeft !== null &&
    daysLeft <= AT_RISK_WINDOW_DAYS &&
    percentage < AT_RISK_PROGRESS
  ) {
    status = "at-risk";
  }

  return {
    ...goal,
    targetAmount,
    currentAmount,
    percentage: targetAmount > 0 && currentAmount >= targetAmount ? 100 : percentage,
    remaining,
    daysLeft,
    monthsLeft,
    monthlyNeeded,
    status,
    isCompleted: status === "completed",
    isOverdue: status === "overdue",
  };
};

export function useGoals() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);
  const requestId = useRef(0);

  useEffect(() => {
    let active = true;
    const currentRequest = requestId.current + 1;

    requestId.current = currentRequest;
    setLoading(true);
    setError(null);

    goalService
      .getGoals()
      .then((data) => {
        if (!active || requestId.current !== currentRequest) {
          return;
        }

        setRecords(data);
      })
      .catch((loadError) => {
        if (!active || requestId.current !== currentRequest) {
          return;
        }

        setRecords([]);
        setError(loadError?.message || "Unable to load your goals right now.");
      })
      .finally(() => {
        if (active && requestId.current === currentRequest) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [version]);

  const goals = useMemo(
    () =>
      records
        .map(decorate)
        .sort((a, b) => {
          if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted ? 1 : -1;
          }

          const dateA = parseDate(a.deadline)?.getTime() ?? Number.MAX_SAFE_INTEGER;
          const dateB = parseDate(b.deadline)?.getTime() ?? Number.MAX_SAFE_INTEGER;

          return dateA - dateB;
        }),
    [records]
  );

  const summary = useMemo(() => {
    const totalTarget = sumBy(goals, "targetAmount");
    const totalSaved = sumBy(goals, "currentAmount");

    return {
      count: goals.length,
      totalTarget,
      totalSaved,
      totalRemaining: Math.max(totalTarget - totalSaved, 0),
      progress:
        totalTarget > 0
          ? Number(((totalSaved / totalTarget) * 100).toFixed(1))
          : 0,
      completed: goals.filter((goal) => goal.isCompleted),
      atRisk: goals.filter(
        (goal) => goal.status === "at-risk" || goal.status === "overdue"
      ),
      active: goals.filter((goal) => !goal.isCompleted),
    };
  }, [goals]);

  const refresh = useCallback(() => {
    setVersion((previous) => previous + 1);
  }, []);

  const mutate = useCallback(async (action) => {
    setSaving(true);
    setError(null);

    try {
      const result = await action();

      setVersion((previous) => previous + 1);

      return result;
    } catch (mutationError) {
      setError(mutationError?.message || "Your change could not be saved.");

      throw mutationError;
    } finally {
      setSaving(false);
    }
  }, []);

  const createGoal = useCallback(
    (values) => mutate(() => goalService.createGoal(values)),
    [mutate]
  );

  const updateGoal = useCallback(
    (id, values) => mutate(() => goalService.updateGoal(id, values)),
    [mutate]
  );

  const addProgress = useCallback(
    (id, amount) => mutate(() => goalService.addProgress(id, amount)),
    [mutate]
  );

  const deleteGoal = useCallback(
    async (id) => {
      setRecords((previous) => previous.filter((item) => item.id !== id));

      return mutate(() => goalService.deleteGoal(id));
    },
    [mutate]
  );

  return {
    goals,
    records,
    loading,
    saving,
    error,
    refresh,
    createGoal,
    updateGoal,
    addProgress,
    deleteGoal,
    summary,
  };
}

export default useGoals;
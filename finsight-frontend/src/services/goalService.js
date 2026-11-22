/*
 * goalService
 * -----------
 * Talks to /api/goals.
 *
 * Mapping between the interface and the Goal document:
 *
 *   UI  { name, targetAmount, currentAmount, deadline, category, description }
 *   API { name, targetAmount, currentAmount, targetDate, description }
 *
 * - `deadline` is the name every goal component uses, the schema calls the
 *   same value `targetDate`
 * - `targetDate` is required by the API while the form leaves it optional, so
 *   an empty deadline becomes a 12 month horizon rather than a rejected request
 * - category is persisted on the Goal document
 */

import api, { toApiDate, unwrap } from "./api";

const RESOURCE = "/goals";

const DEFAULT_HORIZON_MONTHS = 12;

const defaultTargetDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + DEFAULT_HORIZON_MONTHS);

  return date.toISOString();
};

const toApiPayload = ({
  name,
  targetAmount,
  currentAmount,
  deadline,
  targetDate,
  category,
  description,
}) => {
  const payload = {
    name: String(name ?? "").trim().slice(0, 100),
    targetAmount: Number(targetAmount) || 0,
    targetDate: deadline || targetDate
      ? toApiDate(deadline || targetDate)
      : defaultTargetDate(),
  };

  if (currentAmount !== undefined && currentAmount !== null && currentAmount !== "") {
    payload.currentAmount = Number(currentAmount) || 0;
  }

  const text = String(description ?? "").trim();

  if (text) {
    payload.description = text.slice(0, 500);
  }

  if (category) {
    payload.category = category;
  }

  return payload;
};

const fromApiRecord = (record) => {
  if (!record) {
    return null;
  }

  const id = record._id || record.id;

  return {
    ...record,
    id,
    targetAmount: Number(record.targetAmount) || 0,
    currentAmount: Number(record.currentAmount) || 0,
    deadline: record.targetDate || record.deadline || null,
    category: record.category || "Savings",
  };
};

export const goalService = {
  async getGoals() {
    const response = await api.get(RESOURCE);

    const data = unwrap(response);
    return (Array.isArray(data) ? data : data?.items || []).map(fromApiRecord);
  },

  async getGoal(id) {
    const response = await api.get(`${RESOURCE}/${id}`);

    return fromApiRecord(unwrap(response));
  },

  async createGoal(payload) {
    const response = await api.post(RESOURCE, toApiPayload(payload));
    const record = unwrap(response);

    return fromApiRecord(record);
  },

  async updateGoal(id, payload) {
    const response = await api.put(`${RESOURCE}/${id}`, toApiPayload(payload));

    return fromApiRecord(unwrap(response));
  },

  /*
   * Adds money to a goal. Read-modify-write because the API only accepts a
   * full replacement value for currentAmount.
   */
  async addProgress(id, amount) {
    const goal = await goalService.getGoal(id);

    const currentAmount =
      (Number(goal?.currentAmount) || 0) + (Number(amount) || 0);

    return goalService.updateGoal(id, {
      name: goal?.name,
      targetAmount: goal?.targetAmount,
      currentAmount: Math.max(currentAmount, 0),
      deadline: goal?.deadline,
      description: goal?.description,
      category: goal?.category,
    });
  },

  async deleteGoal(id) {
    const response = await api.delete(`${RESOURCE}/${id}`);

    return unwrap(response) || { deleted: true, id };
  },
};

export default goalService;
import { createRedemption as createRewardRedemption, createReward as createCatalogReward, loadDataAplikasi } from "./client";

export function getRewards() {
  return loadDataAplikasi().then((data) => data.rewards);
}

export function createRedemption(userId: string, rewardId: string) {
  return createRewardRedemption(userId, rewardId);
}

export const createReward = createCatalogReward;

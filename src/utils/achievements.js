// Achievement definitions
export const ACHIEVEMENTS = [
  { id: 'first-merge',   name: '初试锋芒',   desc: '完成第一次合并',     reward: 10 },
  { id: 'reach-128',     name: '小有所成',   desc: '达到 128',          reward: 10 },
  { id: 'reach-512',     name: '中级目标',   desc: '达到 512',          reward: 10 },
  { id: 'reach-1024',    name: '达成目标',   desc: '达到 1024',         reward: 10 },
  { id: 'reach-2048',    name: '登峰造极',   desc: '达到 2048',         reward: 10 },
  { id: 'reach-4096',    name: '超越极限',   desc: '达到 4096',         reward: 10 },
  { id: 'combo-3',       name: '三连击',     desc: '连续3次合并',       reward: 10 },
  { id: 'no-dead-50',    name: '步步为营',   desc: '前50步无死亡',       reward: 10 },
  { id: 'daily-3',       name: '连续三日',   desc: '完成3天每日挑战',     reward: 10 },
  { id: 'all-skins',     name: '皮肤收集者', desc: '使用过全部皮肤',      reward: 10 },
];

export function getAchievementById(id) {
  return ACHIEVEMENTS.find(a => a.id === id);
}

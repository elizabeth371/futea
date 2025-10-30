export function saveUserData(data) {
  localStorage.setItem('futea_user_data', JSON.stringify(data));
}

export function loadUserData() {
  const saved = localStorage.getItem('futea_user_data');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    tree: { stage: 'seed', plantedAt: null, growthProgress: 0 },
    resources: { water: 10, nutrient: 5, sun: 85, fungus: 25 },
    inventory: { leaves: 0, cakes: 0 }
  };
}
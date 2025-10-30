import { loadUserData, saveUserData } from './api.js';

const STAGES = ['seed', 'sprout', 'young', 'mature', 'ready'];
const STAGE_NAMES = ['种子阶段', '幼苗阶段', '生长期', '成熟期', '可采摘'];

let userData = loadUserData();

export function initGarden() {
  updateDisplay();
  setupEventListeners();
  startGrowthLoop();
}

function updateDisplay() {
  const { stage, growthProgress } = userData.tree;
  const { water, nutrient } = userData.resources;
  const { leaves, cakes } = userData.inventory;

  document.getElementById('tea-tree-img').src = getTreeImage(stage);
  document.getElementById('tree-stage').textContent = STAGE_NAMES[STAGES.indexOf(stage)];
  document.getElementById('growth-bar').style.width = `${growthProgress}%`;
  document.getElementById('progress-text').textContent = `${Math.round(growthProgress)}%`;

  document.getElementById('water-count').textContent = water;
  document.getElementById('nutrient-count').textContent = nutrient;
  document.getElementById('leaves-count').textContent = leaves;
  document.getElementById('cakes-count').textContent = cakes;

  document.getElementById('harvest-btn').disabled = stage !== 'ready';
  document.getElementById('pan-fry-btn').disabled = leaves < 3;
  document.getElementById('press-cake-btn').disabled = leaves < 5;
}

function setupEventListeners() {
  document.getElementById('plant-btn').addEventListener('click', plantTree);
  document.getElementById('water-btn').addEventListener('click', waterTree);
  document.getElementById('fertilize-btn').addEventListener('click', fertilizeTree);
  document.getElementById('harvest-btn').addEventListener('click', harvestLeaves);
  document.getElementById('pan-fry-btn').addEventListener('click', panFryTea);
  document.getElementById('press-cake-btn').addEventListener('click', pressTeaCake);

  // 点击茶树图片也可以浇水
  document.getElementById('tea-tree-img').addEventListener('click', waterTree);
}

function plantTree() {
  if (userData.tree.plantedAt) {
    showMessage('茶树已种植，请先采摘', 'error');
    return;
  }
  userData.tree.stage = 'seed';
  userData.tree.plantedAt = Date.now();
  userData.tree.growthProgress = 0;
  showMessage('茶树苗已种下！', 'success');
  saveUserData();
  updateDisplay();
}

function waterTree() {
  if (userData.resources.water <= 0) {
    showMessage('水不足！', 'error');
    return;
  }
  userData.resources.water -= 1;
  userData.tree.growthProgress = Math.min(userData.tree.growthProgress + 10, 100);
  showMessage('浇水成功！🌧️', 'success');
  saveUserData();
  updateDisplay();
}

function fertilizeTree() {
  if (userData.resources.nutrient <= 0) {
    showMessage('肥料不足！', 'error');
    return;
  }
  userData.resources.nutrient -= 1;
  userData.tree.growthProgress = Math.min(userData.tree.growthProgress + 15, 100);
  showMessage('施肥成功！🌿', 'success');
  saveUserData();
  updateDisplay();
}

function harvestLeaves() {
  if (userData.tree.stage !== 'ready') {
    showMessage('还未成熟！', 'error');
    return;
  }
  userData.inventory.leaves += 5;
  userData.tree.stage = 'seed';
  userData.tree.plantedAt = Date.now();
  userData.tree.growthProgress = 0;
  showMessage('采摘成功！+5茶叶 🍃', 'success');
  saveUserData();
  updateDisplay();
}

function panFryTea() {
  if (userData.inventory.leaves < 3) {
    showMessage('茶叶不足3份！', 'error');
    return;
  }
  userData.inventory.leaves -= 3;
  userData.inventory.cakes += 1;
  showMessage('炒茶成功！+1茶饼 🍵', 'success');
  saveUserData();
  updateDisplay();
}

function pressTeaCake() {
  if (userData.inventory.leaves < 5) {
    showMessage('茶叶不足5份！', 'error');
    return;
  }
  userData.inventory.leaves -= 5;
  userData.inventory.cakes += 1;
  showMessage('茶饼压制成功！🎉', 'success');
  saveUserData();
  updateDisplay();
}

function showMessage(text, type) {
  const msg = document.getElementById('message');
  msg.textContent = text;
  msg.className = `message ${type}`;
  setTimeout(() => {
    msg.textContent = '';
    msg.className = 'message';
  }, 3000);
}

function startGrowthLoop() {
  setInterval(() => {
    if (!userData.tree.plantedAt || userData.tree.stage === 'ready') return;

    const elapsed = (Date.now() - userData.tree.plantedAt) / 1000;
    const stage = userData.tree.stage;
    let totalTime = { seed: 30, sprout: 60, young: 90, mature: 120 }[stage];

    const progress = (elapsed / totalTime) * 100;
    if (progress >= 100) {
      const idx = STAGES.indexOf(stage);
      if (idx < STAGES.length - 1) {
        userData.tree.stage = STAGES[idx + 1];
        showMessage(`${STAGE_NAMES[idx]}完成！`, 'info');
      } else {
        userData.tree.stage = 'ready';
      }
    }
    userData.tree.growthProgress = Math.min(progress, 100);
    updateDisplay();
    saveUserData();
  }, 1000);
}

function getTreeImage(stage) {
  const images = {
    seed: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyMCIgZmlsbD0iIzUyMzA3ZiIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNDUiIHI9IjEwIiBmaWxsPSIjZmZkNTAwIi8+PGNpcmNsZSBjeD0iNjAiIGN5PSI0NSIgcj0iMTAiIGZpbGw9IiNmZmQ1MDAiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjY1IiByPSIxMCIgZmlsbD0iI2ZmZDUwMCIvPjwvc3ZnPg==",
    sprout: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI0NSIgeT0iNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIzMCIgZmlsbD0iIzQ2bWEyIi8+PGNpcmNsZSBjeD0iNTUiIGN5PSI1MCIgcj0iMTUiIGZpbGw9IiMwMGJiMDAiLz48Y2lyY2xlIGN4PSI0NSIgY3k9IjQwIiByPSI4IiBmaWxsPSIjZmZkNTAwIi8+PGNpcmNsZSBjeD0iNjAiIGN5PSI0NSIgcj0iOCIgZmlsbD0iI2ZmZDUwMCIvPjwvc3ZnPg==",
    young: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI0NSIgeT0iNjAiIHdpZHRoPSIxNSIgaGVpZ2h0PSI0MCIgZmlsbD0iIzQ2bWEyIi8+PHBhdGggZD0iTTMwLDUwIEMzNSwzNSA2NSwzNSA3MCw1MCBDNjUsNDAgNTUsMzAgNDUsNDAgQzM1LDMwIDI1LDQwIDMwLDUweiIgZmlsbD0iIzAwYWIwMCIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNDUiIHI9IjYiIGZpbGw9IiNmZmQ1MDAiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjQ1IiByPSI2IiBmaWxsPSIjZmZkNTAwIi8+PC9zdmc+",
    mature: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI0NSIgeT0iNjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzQ2bWEyIi8+PHBhdGggZD0iTTIwLDQwIEMzMCwyMCA3MCwyMCA4MCw0MCBDNzAsMzAgNTAsMjAgNDUsMzAgQzM1LDIwIDI1LDMwIDIwLDQweiBNMTUsNTAgQzI1LDM1IDc1LDM1IDg1LDUwIEM3NSw0MCA1NSwzNSAzNSw0MCAgQzI1LDM1IDE1LDQwIDE1LDUweiIgZmlsbD0iIzAwYWIwMCIvPjwvc3ZnPg==",
    ready: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI0NSIgeT0iNjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzQ2bWEyIi8+PHBhdGggZD0iTTIwLDQwIEMzMCwyMCA3MCwyMCA4MCw0MCBDNzAsMzAgNTAsMjAgNDUsMzAgQzM1LDIwIDI1LDMwIDIwLDQweiBNMTUsNTAgQzI1LDM1IDc1LDM1IDg1LDUwIEM3NSw0MCA1NSwzNSAzNSw0MCAgQzI1LDM1IDE1LDQwIDE1LDUweiIgZmlsbD0iIzAwYWIwMCIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjciIGZpbGw9IiNmZjY2NjYiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjMwIiByPSI3IiBmaWxsPSIjZmY2NjY2Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSIyNSIgcj0iNyIgZmlsbD0iI2ZmNjY2NiIvPjwvc3ZnPg=="
  };
  return images[stage] || images.seed;
}
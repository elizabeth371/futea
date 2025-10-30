const USER_ID = 'futea_user_001';
const PAGES = {
  home: 'home-template',
  farm: 'pages/farm.html',
  process: 'pages/process.html',
  generate: 'pages/generate.html',
  address: 'pages/address.html'
};

document.addEventListener('DOMContentLoaded', () => {
  loadPage('home');
  setupNavigation();
});

function setupNavigation() {
  document.querySelectorAll('.navbar a, .hero a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.target.getAttribute('data-page');
      if (page) {
        loadPage(page);
      }
    });
  });
}

async function loadPage(page) {
  const contentEl = document.getElementById('content');
  
  if (page === 'home') {
    const template = document.getElementById('home-template');
    contentEl.innerHTML = template.innerHTML;
    // 重新绑定主页上的链接事件
    setupNavigation();
    return;
  }

  try {
    const response = await fetch(PAGES[page]);
    contentEl.innerHTML = await response.text();

    if (page === 'farm') {
      if (typeof initGarden === 'function') {
        initGarden();
      }
    }
    if (page === 'process') {
      if (typeof initProcess === 'function') {
        initProcess();
      }
    }
    if (page === 'generate') {
      if (typeof initGenerate === 'function') {
        initGenerate();
      }
    }
    if (page === 'address') {
      if (typeof initAddress === 'function') {
        initAddress();
      }
    }
  } catch (err) {
    contentEl.innerHTML = `<div class="error">页面加载失败: ${page}</div>`;
    console.error('页面加载失败:', err);
  }
}

// 地址页面初始化函数
function initAddress() {
  // 省市区联动逻辑
  const cityData = {
    "咸阳市": ["秦都区", "杨陵区", "渭城区", "三原县", "泾阳县", "乾县", "礼泉县", "永寿县", "彬州市", "长武县", "旬邑县", "淳化县", "武功县"],
    "西安市": ["新城区", "碑林区", "莲湖区", "灞桥区", "未央区", "雁塔区", "阎良区", "临潼区", "长安区", "高陵区", "鄠邑区", "蓝田县", "周至县"],
    // 可以添加更多城市数据
  };

  const citySelect = document.getElementById('city-select');
  const districtSelect = document.getElementById('district-select');

  if (citySelect && districtSelect) {
    citySelect.addEventListener('change', function() {
      const city = this.value;
      districtSelect.innerHTML = '<option value="">请选择区/县</option>';
      if (city && cityData[city]) {
        cityData[city].forEach(district => {
          const option = document.createElement('option');
          option.value = district;
          option.textContent = district;
          districtSelect.appendChild(option);
        });
      }
    });
  }

  // 表单提交处理
  const addressForm = document.querySelector('.address-form');
  if (addressForm) {
    addressForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 获取表单数据
      const formData = new FormData(this);
      const addressData = {
        name: this.querySelector('input[type="text"]').value,
        phone: this.querySelector('input[type="tel"]').value,
        province: this.querySelector('#province-select').value,
        city: this.querySelector('#city-select').value,
        district: this.querySelector('#district-select').value,
        detail: this.querySelector('textarea').value,
        postcode: this.querySelector('input[type="text"][placeholder="请输入邮政编码"]').value,
        isDefault: this.querySelector('input[type="checkbox"]').checked
      };
      
      // 显示成功消息
      showMessage('地址保存成功！', 'success');
      
      // 这里可以添加保存到localStorage或发送到服务器的代码
      console.log('保存的地址数据:', addressData);
    });
  }
}

function showMessage(text, type) {
  // 创建消息元素
  const msg = document.createElement('div');
  msg.textContent = text;
  msg.className = `message ${type}`;
  
  // 添加到页面中
  document.body.appendChild(msg);
  
  // 3秒后移除消息
  setTimeout(() => {
    if (msg.parentNode) {
      msg.parentNode.removeChild(msg);
    }
  }, 3000);
}
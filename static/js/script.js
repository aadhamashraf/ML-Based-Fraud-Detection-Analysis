let chart = null;

// ML-related functions
const standardizeData = (data, columns) => {
  const matrix = new ML.Matrix(data.map(row => 
    columns.map(col => parseFloat(row[col]) || 0)
  ));
  
  // Calculate mean and std for each column
  const means = matrix.mean('column');
  const stds = matrix.std('column');
  
  // Standardize the data
  return matrix.subRowVector(means).divRowVector(stds);
};

const sigmoid = (x) => 1 / (1 + Math.exp(-x));

const predictFraud = (data) => {
  // Simplified ML model using basic features
  const features = ['amount', 'time', 'v1', 'v2', 'v3', 'v4', 'v5'].filter(f => data[0].hasOwnProperty(f));
  
  // Standardize the features
  const X = standardizeData(data, features);
  
  // Simple fraud detection rules (mimicking a basic ML model)
  return data.map((transaction, i) => {
    const row = X.getRow(i);
    
    // Calculate weighted sum of standardized features
    const weighted_sum = row.reduce((sum, val) => sum + val, 0);
    
    // Apply sigmoid activation
    const probability = sigmoid(weighted_sum);
    
    // Classify as fraud if probability > 0.5
    return probability > 0.5 ? 1 : 0;
  });
};

// UI update functions
const updateChart = (fraudCount, normalCount) => {
  const ctx = document.getElementById('riskChart').getContext('2d');
  
  if (chart) {
    chart.destroy();
  }
  
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Fraudulent', 'Normal'],
      datasets: [{
        data: [fraudCount, normalCount],
        backgroundColor: ['#dc2626', '#16a34a'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 2000,
        easing: 'easeInOutQuart'
      }
    }
  });
};

const updateStats = (total, fraud, normal) => {
  const animateValue = (element, start, end, duration) => {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const animate = () => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        element.textContent = Math.round(end);
        return;
      }
      element.textContent = Math.round(current);
      requestAnimationFrame(animate);
    };
    
    animate();
  };

  animateValue(document.getElementById('totalTransactions'), 0, total, 1000);
  animateValue(document.getElementById('fraudCount'), 0, fraud, 1000);
  animateValue(document.getElementById('normalCount'), 0, normal, 1000);
};

const updateTable = (data, predictions) => {
  const tbody = document.getElementById('transactionsBody');
  tbody.innerHTML = '';
  
  data.forEach((transaction, index) => {
    const row = document.createElement('tr');
    const isFraud = predictions[index] === 1;
    
    row.style.animationDelay = `${index * 100}ms`;
    
    row.innerHTML = `
      <td>${transaction.id || transaction.transaction_id || `TXN${index + 1}`}</td>
      <td>${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(transaction.amount)}</td>
      <td>${predictions[index]}</td>
      <td><span class="status-badge status-${isFraud ? 'high' : 'low'}">${isFraud ? 'Fraudulent' : 'Normal'}</span></td>
    `;
    
    tbody.appendChild(row);
  });
};

// File processing
const processData = async (data) => {
  document.getElementById('processingOverlay').classList.add('visible');
  
  // Simulate ML processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const predictions = predictFraud(data);
  
  const fraudCount = predictions.filter(p => p === 1).length;
  const normalCount = predictions.filter(p => p === 0).length;
  
  document.getElementById('processingOverlay').classList.remove('visible');
  
  const results = document.getElementById('results');
  results.classList.remove('hidden');
  setTimeout(() => results.classList.add('visible'), 100);
  
  updateStats(data.length, fraudCount, normalCount);
  updateChart(fraudCount, normalCount);
  updateTable(data, predictions);
};

const handleFile = (file) => {
  Papa.parse(file, {
    header: true,
    complete: (results) => {
      processData(results.data);
    }
  });
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  
  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
  });
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    handleFile(file);
  });
  
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFile(file);
  });
});
/**
 * Carbon Components - Client-side hydration for WebC components
 * Handles styling and interactivity for carbon-intensity and power-mix elements
 */

export class CarbonIntensityComponent {

  constructor(element) {
    this.element = element;
    this.currentIntensity = parseInt(element.getAttribute('current-intensity')) || 150;
    this.init();
  }

  init() {
    this.setLevel();
    this.render();
  }

  setLevel() {
    if (this.currentIntensity < 100) {
      this.level = 'low';
    } else if (this.currentIntensity <= 250) {
      this.level = 'moderate';
    } else {
      this.level = 'high';
    }
  }

  render() {
    this.element.innerHTML = `
      <div class="carbon-intensity-bar dgwltd-body-xs" data-level="${this.level}">
        <div class="carbon-intensity-content">
          <span class="carbon-intensity-value">Grid intensity: ${this.currentIntensity}</span>
          <span class="carbon-intensity-unit">gCO2/kWh</span>
          <span class="carbon-intensity-level">(${this.level})</span>
        </div>
        <div class="carbon-intensity-indicator" style="--intensity-value: ${this.currentIntensity}"></div>
      </div>
    `;

    // Set data attributes for styling
    this.element.setAttribute('data-gaw-level', this.level);
    this.element.setAttribute('data-gaw-location', 'GB');
    this.element.setAttribute('data-gaw-intensity', this.currentIntensity);
  }
}

export class PowerMixComponent {
  constructor(element) {
    this.element = element;
    this.generationData = this.parseGenerationData(element.getAttribute('generation-data'));
    this.init();
  }

  init() {
    this.processData();
    this.render();
  }

  parseGenerationData(dataString) {
    try {
      // The data comes HTML-escaped, so we need to decode it
      const decodedData = dataString
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      
      return JSON.parse(decodedData);
    } catch (e) {
      console.warn('Failed to parse generation data:', e);
      return [];
    }
  }

  processData() {
    // Filter out zero values and sort by percentage
    this.filteredMix = this.generationData
      .filter(fuel => fuel.perc > 0)
      .sort((a, b) => b.perc - a.perc);

    // Calculate renewable percentage
    const renewableFuels = ['wind', 'solar', 'hydro'];
    this.renewablePercentage = this.filteredMix
      .filter(fuel => renewableFuels.includes(fuel.fuel))
      .reduce((sum, fuel) => sum + fuel.perc, 0);

    // Create mix data string
    this.mixData = this.filteredMix
      .map(fuel => `${fuel.fuel}:${fuel.perc}`)
      .join(',');
  }

  render() {
  const fuelColors = {
    'wind': '#9bdb5e',
    'solar': '#eedc30', 
    'nuclear': '#189aca',
    'gas': '#ec994d',
    'coal': '#000000',
    'biomass': '#8b4513',
    'hydro': '#0066cc',
    'imports': '#555555',
    'other': '#cccccc'
  };

  let cumulativePerc = 0;
  const fuelSpans = this.filteredMix.map((fuel, index) => {
    
    // Generate Chartwell format content
    const content = index === 0 
      ? `${fuel.perc}+` 
      : `${fuel.perc}_${cumulativePerc.toFixed(1)}+`;

    const span = `<span data-fuel="${fuel.fuel}" aria-label="${fuel.fuel}: ${fuel.perc}%" style="--fuel-color: ${fuelColors[fuel.fuel] || '#cccccc'}; --fuel-percentage: ${fuel.perc}; --cumulative-percentage: ${cumulativePerc}">${content}</span>`;
    
    cumulativePerc += fuel.perc;
    return span;
  }).join('');

  this.element.innerHTML = `
    <div class="power-mix-container">
      <div class="dgwltd-chart" role="img" aria-label="UK power generation mix">
        ${fuelSpans}<span class="chart-ring">+x20</span>
      </div>
      <div class="dgwltd-body-xs">
        <span class="renewable-percentage">${Math.round(this.renewablePercentage)}% renewable</span>
      </div>
    </div>
  `;

  // Set data attributes
  this.element.setAttribute('data-gaw-location', 'UK');
  this.element.setAttribute('data-gaw-mix', this.mixData);
  this.element.setAttribute('data-renewable-percentage', Math.round(this.renewablePercentage));
}

}

// Auto-initialization function
export function initializeCarbonComponents() {
  // Initialize carbon intensity components
  document.querySelectorAll('carbon-intensity').forEach(element => {
    new CarbonIntensityComponent(element);
  });

  // Initialize power mix components
  document.querySelectorAll('power-mix').forEach(element => {
    new PowerMixComponent(element);
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeCarbonComponents);

// Also export for manual initialization
export { initializeCarbonComponents as init };
/**
 * Carbon Components - Web Components for carbon data visualization
 * Handles styling and interactivity for carbon-intensity and power-mix elements
 */

class CarbonIntensityComponent extends HTMLElement {

  connectedCallback() {
    this.currentIntensity = parseInt(this.getAttribute('data-gaw-intensity')) || 150;
    this.level = this.getAttribute('data-gaw-level') || 'unknown';
    this.location = this.getAttribute('data-gaw-location') || 'GB';
    
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
    this.innerHTML = `
      <div class="carbon-intensity-bar" data-level="${this.level}">
        <div class="carbon-intensity-content">
          <span class="carbon-intensity-location">${this.location}</span>
          <span class="carbon-intensity-value">${this.currentIntensity}</span>
          <span class="carbon-intensity-unit">gCO2/kWh</span>
          <span class="carbon-intensity-level">(${this.level})</span>
        </div>
        <div class="carbon-intensity-indicator" style="--intensity-value: ${this.currentIntensity}"></div>
      </div>
    `;

    // Set CSS custom properties for styling
    this.style.setProperty('--intensity-level', this.level);
    this.style.setProperty('--intensity-value', this.currentIntensity);
  }
}

class PowerMixComponent extends HTMLElement {

  connectedCallback() {
    this.location = this.getAttribute('data-gaw-location') || 'UK';
    this.mixData = this.getAttribute('data-gaw-mix') || '';
    this.renewablePercentage = parseInt(this.getAttribute('data-renewable-percentage')) || 0;
    
    this.init();
  }

  init() {
    this.parseExistingData();
    this.enhanceComponent();
    this.addEventListeners();
  }

  parseExistingData() {
    // Parse the chartwell format from existing spans
    this.chartSpans = Array.from(this.querySelectorAll('span:not(.chart-ring):not(.renewable-text)'));
    this.chartRing = this.querySelector('.chart-ring');
    this.renewableText = this.querySelector('.renewable-text');
    
    this.fuelData = this.chartSpans.map(span => ({
      fuel: span.getAttribute('data-fuel'),
      percentage: parseFloat(span.getAttribute('aria-label')?.match(/(\d+\.?\d*)%/)?.[1] || 0),
      color: span.style.getPropertyValue('--fuel-color'),
      chartContent: span.textContent
    }));
  }

  enhanceComponent() {
    // Add interactive elements while preserving chartwell spans
    const interactiveHTML = `
      <div class="power-mix-interactive">
        <div class="power-mix-legend">
          ${this.fuelData.map(fuel => `
            <div class="fuel-legend-item" data-fuel="${fuel.fuel}">
              <span class="fuel-color" style="background-color: ${fuel.color}"></span>
              <span class="fuel-name">${fuel.fuel}</span>
              <span class="fuel-percentage">${fuel.percentage}%</span>
            </div>
          `).join('')}
        </div>
        <div class="power-mix-summary">
          <div class="renewable-stat" style="--renewable-percentage: ${this.renewablePercentage}">
            <span class="renewable-icon">🌱</span>
            <span class="renewable-value">${this.renewablePercentage}%</span>
            <span class="renewable-label">renewable</span>
          </div>
          <div class="location-stat">
            <span class="location-text">${this.location}</span>
          </div>
        </div>
      </div>
    `;

    // Insert after existing chartwell content
    this.insertAdjacentHTML('beforeend', interactiveHTML);
    this.addStyles();
  }

  addStyles() {
    this.style.setProperty('--renewable-percentage', this.renewablePercentage);
    
    // Set renewable color based on percentage
    let renewableColor = '#ef4444'; // Red for low
    if (this.renewablePercentage >= 70) renewableColor = '#22c55e'; // Green for high
    else if (this.renewablePercentage >= 40) renewableColor = '#f59e0b'; // Orange for medium
    
    this.style.setProperty('--renewable-color', renewableColor);

    // Add fuel-specific CSS properties
    this.fuelData.forEach(fuel => {
      this.style.setProperty(`--${fuel.fuel}-percentage`, fuel.percentage);
      this.style.setProperty(`--${fuel.fuel}-color`, fuel.color);
    });
  }

  addEventListeners() {
    // Add hover effects for legend items
    const chartSpans = this.querySelectorAll('span[data-fuel]');

    // Add click handler for chartwell spans
    chartSpans.forEach(span => {
      span.addEventListener('click', () => {
        const fuel = span.getAttribute('data-fuel');
        this.showFuelDetails(fuel);
      });
    });
  }


  showFuelDetails(fuel) {
    const fuelInfo = this.fuelData.find(f => f.fuel === fuel);
    if (fuelInfo) {
      const isRenewable = ['wind', 'solar', 'hydro', 'biomass'].includes(fuel);
      
      const details = {
        fuel,
        percentage: fuelInfo.percentage,
        renewable: isRenewable,
        color: fuelInfo.color,
        timestamp: new Date().toLocaleTimeString()
      };
      
      console.log('Fuel Details:', details);
      
      // Dispatch custom event for external handling
      this.dispatchEvent(new CustomEvent('fuel-selected', {
        detail: details,
        bubbles: true
      }));
    }
  }
}

// Define the custom elements
customElements.define('dgw-gaw-info-bar', CarbonIntensityComponent);
customElements.define('dgw-gaw-power-mix', PowerMixComponent);

// Export classes and functions
export { CarbonIntensityComponent, PowerMixComponent, initializeCarbonComponents as init };
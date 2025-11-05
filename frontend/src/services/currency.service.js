// Currency formatting service
class CurrencyService {
  // Default currency (India - INR)
  static defaultCurrency = {
    name: "India",
    currency: "INR",
    symbol: "₹"
  };

  // Get the currently selected currency from localStorage
  static getSelectedCurrency() {
    try {
      const storedCurrency = localStorage.getItem('selectedCurrency');
      return storedCurrency ? JSON.parse(storedCurrency) : this.defaultCurrency;
    } catch (error) {
      console.error('Error parsing currency from localStorage:', error);
      return this.defaultCurrency;
    }
  }

  // Format amount based on selected currency
  static formatCurrency(amount) {
    const selectedCurrency = this.getSelectedCurrency();
    
    // Currency formatting options
    const currencyOptions = {
      'INR': {
        locale: 'en-IN',
        currency: 'INR'
      },
      'USD': {
        locale: 'en-US',
        currency: 'USD'
      },
      'GBP': {
        locale: 'en-GB',
        currency: 'GBP'
      },
      'CAD': {
        locale: 'en-CA',
        currency: 'CAD'
      },
      'AUD': {
        locale: 'en-AU',
        currency: 'AUD'
      },
      'EUR': {
        locale: 'de-DE',
        currency: 'EUR'
      },
      'JPY': {
        locale: 'ja-JP',
        currency: 'JPY'
      },
      'BRL': {
        locale: 'pt-BR',
        currency: 'BRL'
      },
      'MXN': {
        locale: 'es-MX',
        currency: 'MXN'
      }
    };

    const options = currencyOptions[selectedCurrency.currency] || currencyOptions['INR'];
    
    try {
      return new Intl.NumberFormat(options.locale, {
        style: 'currency',
        currency: options.currency,
        minimumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      // Fallback to default formatting
      return `${selectedCurrency.symbol}${amount.toFixed(2)}`;
    }
  }

  // Convert amount from INR to selected currency (simplified conversion)
  static convertFromINR(amountINR) {
    const selectedCurrency = this.getSelectedCurrency();
    
    // Simplified exchange rates (for demonstration purposes)
    const exchangeRates = {
      'INR': 1,
      'USD': 0.012,
      'GBP': 0.0095,
      'CAD': 0.016,
      'AUD': 0.018,
      'EUR': 0.011,
      'JPY': 1.8,
      'BRL': 0.060,
      'MXN': 0.21
    };

    const rate = exchangeRates[selectedCurrency.currency] || 1;
    return amountINR * rate;
  }
}

export default CurrencyService;
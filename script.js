document.addEventListener("DOMContentLoaded", function () {
    const riskCalculatorForm = document.getElementById("riskCalculatorForm");
    const resultElement = document.getElementById("result");
    const accountSizeInput = document.getElementById("accountSize");
    const riskPercentageInput = document.getElementById("riskPercentage");
    const riskAmountInput = document.getElementById("riskAmount");

    // Add event listeners for automatic risk amount calculation
    accountSizeInput.addEventListener("input", calculateRiskAmount);
    riskPercentageInput.addEventListener("input", calculateRiskAmount);
    riskAmountInput.addEventListener("input", function() {
        // Clear account size and risk percentage when user manually enters risk amount
        accountSizeInput.value = "";
        riskPercentageInput.value = "";
    });

    function calculateRiskAmount() {
        const accountSize = parseFloat(accountSizeInput.value) || 0;
        const riskPercentage = parseFloat(riskPercentageInput.value) || 0;
        
        if (accountSize > 0 && riskPercentage > 0) {
            const calculatedRiskAmount = (accountSize * riskPercentage) / 100;
            riskAmountInput.value = calculatedRiskAmount.toFixed(2);
        }
    }

    riskCalculatorForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const currencyPair = document.getElementById("currencyPair").value;
        const riskAmount = parseFloat(document.getElementById("riskAmount").value);
        const stopLoss = parseFloat(document.getElementById("stopLoss").value);

        // Define pip values for USD, CAD, and JPY quote currencies
        const pipValues = {
            USD: 1,
            CAD: 0.74,
            JPY: 0.69,
        };

        // Extract quote currency from the currency pair (e.g., USD from AUD/USD)
        const quoteCurrency = currencyPair.substr(3);

        // Validate the fields
        if (!currencyPair || riskAmount === null || riskAmount === undefined || stopLoss === null || stopLoss === undefined || isNaN(riskAmount) || isNaN(stopLoss)) {
            showError("Please fill in all fields with valid values before calculating the lot size.");
            return;
        }

        // Calculate lot size based on the provided formula
        const lotSize = (0.1 * riskAmount) / (stopLoss * pipValues[quoteCurrency]);

        // Display the calculated lot size with enhanced formatting
        showResult(lotSize, currencyPair, riskAmount, stopLoss);
    });

    function showError(message) {
        resultElement.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-circle mr-2"></i>${message}
            </div>
        `;
    }

    function showResult(lotSize, currencyPair, riskAmount, stopLoss) {
        const accountSize = parseFloat(accountSizeInput.value) || 0;
        const riskPercentage = parseFloat(riskPercentageInput.value) || 0;
        
        resultElement.innerHTML = `
            <div class="result-card">
                <h4 class="mb-4"><i class="fas fa-chart-pie mr-2"></i>Calculation Results</h4>
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Currency Pair:</strong> ${currencyPair}</p>
                        ${accountSize > 0 ? `<p><strong>Account Size:</strong> $${accountSize.toFixed(2)}</p>` : ''}
                        ${riskPercentage > 0 ? `<p><strong>Risk Percentage:</strong> ${riskPercentage}%</p>` : ''}
                        <p><strong>Risk Amount:</strong> $${riskAmount.toFixed(2)}</p>
                        <p><strong>Stop Loss:</strong> ${stopLoss} pips</p>
                    </div>
                    <div class="col-md-6">
                        <div class="lot-size-display">
                            <h5>Recommended Lot Size</h5>
                            <h3 class="text-primary">${lotSize.toFixed(2)}</h3>
                            <small class="text-muted">Standard Lots</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
});

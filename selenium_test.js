const { Builder, By } = require("selenium-webdriver");
const path = require("path");

async function runTests() {
    let driver;
    // We try to instantiate Chrome
    try {
        driver = await new Builder().forBrowser("chrome").build();
    } catch (e) {
        console.error("Failed to start chrome driver:", e);
        return;
    }

    const testAppUrl = "file://" + path.join(__dirname, "test_app.html");

    // Test Cases array
    const testCases = [
        // Black-box: Equivalence Partitioning (EP)
        { id: "TC_EP_01", desc: "EP: Valid Age (18-65)", input: "35", expected: "Eligible to Register" },
        { id: "TC_EP_02", desc: "EP: Invalid Age (< 18)", input: "15", expected: "Ineligible: Too young" },
        { id: "TC_EP_03", desc: "EP: Invalid Age (> 65)", input: "75", expected: "Ineligible: Too old" },
        { id: "TC_EP_04", desc: "EP: Invalid Format", input: "abc", expected: "Error: Invalid Input" },

        // Black-box: Boundary Value Analysis (BVA)
        { id: "TC_BVA_01", desc: "BVA: Lower Bound - 1", input: "17", expected: "Ineligible: Too young" },
        { id: "TC_BVA_02", desc: "BVA: Lower Bound", input: "18", expected: "Eligible to Register" },
        { id: "TC_BVA_03", desc: "BVA: Upper Bound", input: "65", expected: "Eligible to Register" },
        { id: "TC_BVA_04", desc: "BVA: Upper Bound + 1", input: "66", expected: "Ineligible: Too old" },

        // White-box: Basis Path Testing
        // The script has 4 main branches/paths mapping to Cyclomatic Complexity = 4
        { id: "TC_WB_01", desc: "Path 1 (Invalid Format): isNaN(ageStr) == true", input: "", expected: "Error: Invalid Input" },
        { id: "TC_WB_02", desc: "Path 2 (Condition 1): age < 18", input: "12", expected: "Ineligible: Too young" },
        { id: "TC_WB_03", desc: "Path 3 (Condition 2): age >= 18 && age <= 65", input: "30", expected: "Eligible to Register" },
        { id: "TC_WB_04", desc: "Path 4 (Condition 3/Else): age > 65", input: "99", expected: "Ineligible: Too old" }
    ];

    console.log("=========================================");
    console.log("SELENIUM AUTOMATED TEST EXECUTION");
    console.log("=========================================\n");

    try {
        await driver.get(testAppUrl);

        for (const tc of testCases) {
            const inputField = await driver.findElement(By.id("ageInput"));
            const submitBtn = await driver.findElement(By.id("submitBtn"));
            const resultElement = await driver.findElement(By.id("result"));

            // Clear input and send new value
            await inputField.clear();
            await inputField.sendKeys(tc.input);
            await submitBtn.click();

            // Fetch output
            const actualOutput = await resultElement.getText();

            // Verify
            const status = (actualOutput === tc.expected) ? "✅ PASS" : "❌ FAIL";
            console.log(`[${tc.id}] ${tc.desc}`);
            console.log(`   Input: "${tc.input}" | Expected: "${tc.expected}" | Actual: "${actualOutput}"`);
            console.log(`   Result: ${status}\n`);
        }
    } catch (err) {
        console.error("Test execution failed:", err);
    } finally {
        await driver.quit();
        console.log("=========================================");
        console.log("TEST EXECUTION COMPLETED");
        console.log("=========================================");
    }
}

runTests();
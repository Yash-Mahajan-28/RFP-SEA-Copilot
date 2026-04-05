# Software Testing Experiment: Black-Box & White-Box Testing (RFP-Copilot)

## 1. Application Under Test (AUT)
**Module:** Authentication Flow (Login & Registration Forms) -> `app/api/auth/register` & `app/login/page.tsx`
**Logic Validations:**
1. All fields are required (Name, Email, Password, Account Type).
2. Email must follow the pattern `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
3. Password length must be `>= 6` characters.
4. Accounts must not duplicate `Email already registered`.

## 2. Test Cases Sheet

### Black-Box Testing: Equivalence Partitioning (EP)
*Focus: Email Field Format Validation*

| Test Case ID | Testing Type | Test Description | Input (Email/Pass) | Expected Output | Actual Output | Status |
|---|---|---|---|---|---|---|
| TC_EP_01 | Regression | Valid Email Format | `user@company.com`, `pass123` | Success | Success | ✅ PASS |
| TC_EP_02 | Negative | Invalid Email Form | `invalid-email`, `pass123` | `Invalid email format` | `Invalid email format` | ✅ PASS |
| TC_EP_03 | Negative | Blank Mandatory Field | ``, `pass123` | `All fields are required` | Form validation halted submission | ✅ PASS |

### Black-Box Testing: Boundary Value Analysis (BVA)
*Focus: Password Minimum Length Constraint (6 characters)*

| Test Case ID | Test Description | Input (Password Size) | Expected Output | Actual Output | Status |
|---|---|---|---|---|---|
| TC_BVA_01 | Lower Bound - 1 (5 chars) | `12345` | `Password must be at least 6 characters` | `Password must be at least 6 characters` | ✅ PASS |
| TC_BVA_02 | Lower Bound (6 chars) | `123456` | Registration Successful | Registration Successful | ✅ PASS |
| TC_BVA_03 | Lower Bound + 1 (7 chars) | `1234567` | Registration Successful | Registration Successful | ✅ PASS |

### White-Box Testing: Basis Path Testing
*Cyclomatic Complexity of Registration API Branching (`route.ts`) maps to different Return Responses (400, 401, 409, 201) based on Condition execution paths.*

| Node Path | Description | Input Setup | Expected Output | Actual Output | Status |
|---|---|---|---|---|---|
| **Path 1** | Invalid Inputs (Regex fails or Missing) | Name blank | `400 Bad Request` | `All fields are required` | ✅ PASS |
| **Path 2** | Password condition fails (`pass.length < 6`) | Password: `short` | `400 Bad Request` | `Password must be at least 6 characters` | ✅ PASS |
| **Path 3** | Email already exists in MongoDB | Existing DB Email | `409 Conflict` | `Email already registered` | ✅ PASS |
| **Path 4** | Login: Valid Email but wrong Hashed Password match | Wrong Login Creds | `401 Unauthorized` | `Invalid email or password` | ✅ PASS |
| **Path 5** | All Checks pass -> Token generation -> Insert | New Valid Entry | `201 Created` | Successful Redirect to `/dashboard` | ✅ PASS |

---
**Automation Status:**
Automated using **Node.js** and **Selenium-Webdriver** (ChromeDriver). The test script hits the frontend application at `http://localhost:3000/login` and mimics end-user inputs to trigger API logic visually through the DOM.
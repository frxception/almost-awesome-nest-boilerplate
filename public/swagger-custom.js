// Wait for Swagger UI to load and DOM to be ready
let currentToken = '';
let initAttempts = 0;
const maxAttempts = 20;

// Multiple initialization strategies
document.addEventListener('DOMContentLoaded', initializeQuickStart);
window.addEventListener('load', () => setTimeout(initializeQuickStart, 1000));

// Also try every 500ms for up to 10 seconds
const initInterval = setInterval(() => {
  initAttempts++;
  if (initAttempts > maxAttempts) {
    clearInterval(initInterval);
    console.log('Quick Start initialization failed after maximum attempts');
    return;
  }
  initializeQuickStart();
}, 500);

function initializeQuickStart() {
  // Check if already initialized
  if (document.getElementById('quickstart-container')) {
    clearInterval(initInterval);
    return;
  }

  // Find the description container and inject our interactive UI
  const descriptionContainer = document.querySelector('.description, .info .description, .swagger-ui .info .description');
  if (!descriptionContainer) {
    console.log('Description container not found, attempt:', initAttempts);
    return;
  }

  console.log('Initializing Quick Start Guide...');
  clearInterval(initInterval);

  // Create the interactive quick start HTML
  const quickStartHTML = `
    <div id="quickstart-container" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #007bff;">
      <h2 style="color: #007bff; margin-top: 0;">🚀 Interactive Quick Start Guide</h2>
      
      <div id="step1-container">
        <h3 style="color: #495057;">📝 Step 1: Register a New User</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0;">
          <input type="text" id="firstName" placeholder="First Name" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="John">
          <input type="text" id="lastName" placeholder="Last Name" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="Doe">
          <input type="email" id="regEmail" placeholder="Email Address" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="john@example.com">
          <input type="password" id="regPassword" placeholder="Password" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="password123">
        </div>
        <button id="register-btn" style="background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 10px 0; font-weight: bold;">
          📝 Register User
        </button>
        <div id="step1-result" style="margin-top: 10px; padding: 10px; border-radius: 4px; display: none;"></div>
      </div>

      <div id="step2-container" style="margin-top: 30px;">
        <h3 style="color: #495057;">🔑 Step 2: Login to Get JWT Token</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0;">
          <input type="email" id="loginEmail" placeholder="Email Address" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="john@example.com">
          <input type="password" id="loginPassword" placeholder="Password" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="password123">
        </div>
        <button id="login-btn" style="background: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 10px 0; font-weight: bold;">
          🔑 Login & Get Token
        </button>
        <div id="step2-result" style="margin-top: 10px; padding: 10px; border-radius: 4px; display: none;"></div>
      </div>

      <div id="step3-container" style="margin-top: 30px;">
        <h3 style="color: #495057;">🔓 Step 3: Authorize Swagger UI</h3>
        <p style="margin: 10px 0; color: #6c757d;">Your JWT Token will appear here after successful login:</p>
        <div id="jwt-token-display" style="background: #fff; border: 2px solid #007bff; padding: 15px; border-radius: 4px; font-family: monospace; word-break: break-all; margin: 10px 0; min-height: 50px; display: flex; align-items: center; justify-content: center; color: #666;">
          JWT Token will appear here after login...
        </div>
        <button id="authorize-btn" style="background: #ffc107; color: black; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 10px 0; font-weight: bold;" disabled>
          🔓 Auto-Authorize Swagger UI
        </button>
        <div id="step3-result" style="margin-top: 10px; padding: 10px; border-radius: 4px; display: none;"></div>
      </div>

    </div>
  `;

  // Insert the interactive UI at the beginning of the description
  descriptionContainer.innerHTML = quickStartHTML + descriptionContainer.innerHTML;
  
  // Add event listeners after DOM is updated
  setupEventListeners();
  console.log('Quick Start Guide initialized successfully!');
}

function setupEventListeners() {
  // Register button
  const registerBtn = document.getElementById('register-btn');
  if (registerBtn) {
    registerBtn.addEventListener('click', handleRegisterUser);
    console.log('Register button event listener added');
  }
  
  // Login button  
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', handleLoginUser);
    console.log('Login button event listener added');
  }
  
  // Authorize button
  const authorizeBtn = document.getElementById('authorize-btn');
  if (authorizeBtn) {
    authorizeBtn.addEventListener('click', handleAuthorizeSwagger);
    console.log('Authorize button event listener added');
  }
}

async function handleRegisterUser() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  
  if (!firstName || !lastName || !email || !password) {
    alert('Please fill in all fields');
    return;
  }

  // Show loading state
  const button = document.getElementById('register-btn');
  const originalText = button.innerHTML;
  button.innerHTML = '⏳ Registering...';
  button.disabled = true;

  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password
      })
    });

    const result = document.getElementById('step1-result');
    
    if (response.ok) {
      const data = await response.json();
      result.style.display = 'block';
      result.style.background = '#d4edda';
      result.style.color = '#155724';
      result.style.border = '1px solid #c3e6cb';
      result.innerHTML = `✅ <strong>User registered successfully!</strong><br>
        User ID: ${data.id}<br>
        Email: ${data.email}<br>
        <em>Now proceed to Step 2 to login.</em>`;
      
      // Auto-fill login form
      document.getElementById('loginEmail').value = email;
      document.getElementById('loginPassword').value = password;
    } else {
      const error = await response.json();
      result.style.display = 'block';
      result.style.background = '#f8d7da';
      result.style.color = '#721c24';
      result.style.border = '1px solid #f5c6cb';
      result.innerHTML = `❌ <strong>Registration failed:</strong><br>${error.message || 'Unknown error'}`;
    }
  } catch (error) {
    const result = document.getElementById('step1-result');
    result.style.display = 'block';
    result.style.background = '#f8d7da';
    result.style.color = '#721c24';
    result.style.border = '1px solid #f5c6cb';
    result.innerHTML = `❌ <strong>Network error:</strong><br>${error.message}`;
  } finally {
    // Reset button
    button.innerHTML = originalText;
    button.disabled = false;
  }
}

async function handleLoginUser() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  if (!email || !password) {
    alert('Please fill in both email and password');
    return;
  }

  // Show loading state
  const button = document.getElementById('login-btn');
  const originalText = button.innerHTML;
  button.innerHTML = '⏳ Logging in...';
  button.disabled = true;

  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const result = document.getElementById('step2-result');
    
    if (response.ok) {
      const data = await response.json();
      currentToken = data.accessToken.token;
      
      result.style.display = 'block';
      result.style.background = '#d1ecf1';
      result.style.color = '#0c5460';
      result.style.border = '1px solid #bee5eb';
      result.innerHTML = `✅ <strong>Login successful!</strong><br>
        Token expires in: ${data.accessToken.expiresIn} seconds<br>
        <em>Token captured! Ready for Step 3.</em>`;
      
      // Display token
      const tokenDisplay = document.getElementById('jwt-token-display');
      tokenDisplay.style.color = '#000';
      tokenDisplay.style.background = '#f8f9fa';
      tokenDisplay.style.fontSize = '12px';
      tokenDisplay.innerHTML = currentToken;
      
      // Enable authorize button
      const authorizeBtn = document.getElementById('authorize-btn');
      authorizeBtn.disabled = false;
      authorizeBtn.style.background = '#28a745';
      authorizeBtn.style.color = 'white';
      authorizeBtn.innerHTML = '🔓 Auto-Authorize Swagger UI';
    } else {
      const error = await response.json();
      result.style.display = 'block';
      result.style.background = '#f8d7da';
      result.style.color = '#721c24';
      result.style.border = '1px solid #f5c6cb';
      result.innerHTML = `❌ <strong>Login failed:</strong><br>${error.message || 'Unknown error'}`;
    }
  } catch (error) {
    const result = document.getElementById('step2-result');
    result.style.display = 'block';
    result.style.background = '#f8d7da';
    result.style.color = '#721c24';
    result.style.border = '1px solid #f5c6cb';
    result.innerHTML = `❌ <strong>Network error:</strong><br>${error.message}`;
  } finally {
    // Reset button
    button.innerHTML = originalText;
    button.disabled = false;
  }
}

function handleAuthorizeSwagger() {
  if (!currentToken) {
    alert('Please complete Step 2 first to get a JWT token');
    return;
  }

  const result = document.getElementById('step3-result');

  try {
    // Try different approaches to authorize Swagger UI
    let authorized = false;

    // Approach 1: Try to access Swagger UI's window.ui object
    if (window.ui && window.ui.authActions) {
      try {
        window.ui.authActions.authorize({
          bearerAuth: {
            name: 'bearerAuth',
            schema: {
              type: 'http',
              scheme: 'bearer'
            },
            value: currentToken
          }
        });
        authorized = true;
      } catch (e) {
        console.log('Approach 1 failed:', e);
      }
    }

    // Approach 2: Try to find and automatically fill the authorize modal
    if (!authorized) {
      const authorizeBtn = document.querySelector('.btn.authorize, .authorization__btn');
      if (authorizeBtn) {
        authorizeBtn.click();
        
        setTimeout(() => {
          const tokenInput = document.querySelector('input[placeholder*="Bearer"], input[name="bearerAuth"]');
          if (tokenInput) {
            tokenInput.value = `Bearer ${currentToken}`;
            
            // Try to find authorize button in modal
            const modalAuthorizeBtn = document.querySelector('.auth-btn-wrapper .btn-done, .auth-container .authorize, .modal-ux .auth-btn-wrapper button');
            if (modalAuthorizeBtn) {
              modalAuthorizeBtn.click();
              authorized = true;
            }
          }
        }, 500);
      }
    }

    // Show success message
    result.style.display = 'block';
    result.style.background = '#d4edda';
    result.style.color = '#155724';
    result.style.border = '1px solid #c3e6cb';
    
    if (authorized) {
      result.innerHTML = `✅ <strong>Authorization successful!</strong><br>
        Swagger UI has been authorized with your JWT token.<br>
        🎉 <em>You can now access all protected endpoints!</em>`;
    } else {
      result.innerHTML = `⚠️ <strong>Manual authorization required:</strong><br>
        1. Click the <strong>🔓 Authorize</strong> button at the top of this page<br>
        2. Enter: <code>Bearer ${currentToken.substring(0, 20)}...</code><br>
        3. Click <strong>Authorize</strong><br>
        <small>Your token is displayed above for easy copy-paste.</small>`;
    }

  } catch (error) {
    // Manual instruction fallback
    result.style.display = 'block';
    result.style.background = '#fff3cd';
    result.style.color = '#856404';
    result.style.border = '1px solid #ffeaa7';
    result.innerHTML = `⚠️ <strong>Manual authorization required:</strong><br>
      1. Click the <strong>🔓 Authorize</strong> button at the top of this page<br>
      2. Enter: <code>Bearer ${currentToken.substring(0, 20)}...</code><br>
      3. Click <strong>Authorize</strong><br>
      <small>Your full token is displayed above for easy copy-paste.</small>`;
  }
}

// Make functions globally available for debugging
window.handleRegisterUser = handleRegisterUser;
window.handleLoginUser = handleLoginUser;
window.handleAuthorizeSwagger = handleAuthorizeSwagger;
// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAt0sqKlQKhGZ_IDyrHHBKVdkRRhSoXAZs",
  authDomain: "gemini-project-9a564.firebaseapp.com",
  projectId: "gemini-project-9a564",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Login Function
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, password)
  .then(async (userCredential) => {
    const idToken = await userCredential.user.getIdToken();

    // Send token to backend
    const response = await fetch('/sessionLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idToken })
    });
    console.log('response is:', response)

    

    if (response.ok) {
      window.location.href = '/chatbot';
    } else {
      document.getElementById('error-message').innerText = 'Session setup failed.';
    }
  })
}


//sessionlogin function




// Signup Function
function signup() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => window.location.href = '/chatbot')
    .catch(error => document.getElementById('signup-error-message').innerText = error.message);
}

// Logout Function
function logout() {
  firebase.auth().signOut()
    .then(() => {
      return fetch('/logout', { method: 'POST' }); // Notify backend
    })
    .then(() => {
      window.location.href = '/login'; // Redirect to login page
    })
    .catch(error => {
      console.error('Logout error:', error);
    });
}


// Dark Mode Toggle
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
}

//enter function for chatbot
function handleSubmit(event) {
  event.preventDefault(); // prevents actual page reload
  const inputValue = document.getElementById("user-input").value;
}


//enter function for login
function handleLoginSubmit(event) {
  event.preventDefault(); // prevents actual page reload
  const inputValue = document.getElementById("login-input").value;
}



// Chatbot Message Sender
function sendMessage(value) {
  

  const promptOptions = document.querySelector('#prompt-options');
  promptOptions.innerHTML = ""
  const input = document.getElementById('user-input');
  const message = value ?? input.value.trim();

  if (message) {
    const messages = document.getElementById('messages');
    const userMsg = document.createElement('div');
    userMsg.className = "bg-blue-200 dark:bg-blue-500 text-black dark:text-white p-2 rounded w-max";
    userMsg.innerText = message;
    messages.appendChild(userMsg);


    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: message })
    })


      .then(response => response.json())
      .then(data => {
        const botMsg = document.createElement('div');
        console.log('BOTMSG:', botMsg)

        botMsg.className = "bg-green-200 dark:bg-green-500 text-black dark:text-white p-2 rounded w-max";


      const typedSpan = document.createElement('span');
      const typedId = `typed-${Date.now()}`;
      typedSpan.id = typedId;
      botMsg.appendChild(typedSpan);
      messages.appendChild(botMsg);

      // Use Typed.js on the span
      new Typed(`#${typedId}`, {
        strings: [data.response],
        typeSpeed: 20,
        showCursor: false
      });

        data.suggestions.forEach(suggestion => {
          promptOptions.innerHTML += `<button onclick="sendMessage('${suggestion}')" class="border rounded-full h-8 px-2 text-base">${suggestion}</button>`
        });







        messages.scrollTop = messages.scrollHeight;
      });

    input.value = "";



  }
}




//auth.signInWithEmailAndPassword(email, password)
  //  .then(() => window.location.href = '/chatbot')
  //  .catch(error => document.getElementById('error-message').innerText = 'invalid credentials');
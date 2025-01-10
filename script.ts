// Get references to the form and display area
const form = document.getElementById('resume-form') as HTMLFormElement;
const resumeDisplayElement = document.getElementById('resume-display') as HTMLDivElement;
const downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;
const shareableLinkContainer = document.getElementById('shareable-link-container') as HTMLDivElement;
const shareableLinkElement = document.getElementById('shareable-link') as HTMLAnchorElement;

//Handle form submission
form.addEventListener('submit', (event: Event) => {
  event.preventDefault(); //prevent page reload

  //collect input values
  const username = (document.getElementById('username') as HTMLInputElement).value;
  const name = (document.getElementById('name') as HTMLInputElement).value;
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const phone = (document.getElementById('phone') as HTMLInputElement).value;
  const education = (document.getElementById('education') as HTMLInputElement).value;
  const experience = (document.getElementById('experience') as HTMLInputElement).value;
  const skills = (document.getElementById('skills') as HTMLInputElement).value;

  // Save form data in localStorage with the username as the key
  const resumeData = {
    name,
    email,
    phone,
    education,
    experience,
    skills
  };
  localStorage.setItem(username, JSON.stringify(resumeData));

  // Generate the resume content dynamically
  const resumeHtml = `
    <h2> <b> Resume </b> </h2>
    <h3>Personal Information</h3>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Phone:</b> ${phone}</p>

    <h3>Education</h3>
    <p>${education}</p>

    <h3>Experience</h3>
    <p>${experience}</p>

    <h3>Skills</h3>
    <p>${skills}</p>
  `;

  //Display the generated resume
  if(resumeDisplayElement){
    resumeDisplayElement.innerHTML = resumeHtml;
    // Show download button after resume is generated
    if(downloadBtn) {
        downloadBtn.style.display = 'block';
        downloadBtn.style.opacity = '1';
        downloadBtn.style.transform = 'translateY(0)';
    }

    // Generate and display shareable link
    const shareableURL = `${window.location.origin}?username=${encodeURIComponent(username)}`;
    shareableLinkContainer.style.display = 'block';
    shareableLinkElement.href = shareableURL;
    shareableLinkElement.textContent = shareableURL;
  } else {
    console.error('The resume display element is missing.');
  }
});

// Handle download functionality
if(downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        // Get the resume display element
        const element = document.getElementById('resume-display');
        
        // Configure the PDF options
        const opt = {
            margin: [10, 10],
            filename: `resume-${new Date().toLocaleDateString()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            }
        };

        // Generate PDF
        // @ts-ignore (html2pdf is loaded from CDN)
        html2pdf().set(opt).from(element).save();
    });
}

// Load resume data from URL parameter when page loads
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    
    if (username) {
        // Retrieve resume data from localStorage
        const savedResumeData = localStorage.getItem(username);
        if (savedResumeData) {
            const resumeData = JSON.parse(savedResumeData);
            
            // Fill the form with saved data
            (document.getElementById('username') as HTMLInputElement).value = username;
            (document.getElementById('name') as HTMLInputElement).value = resumeData.name;
            (document.getElementById('email') as HTMLInputElement).value = resumeData.email;
            (document.getElementById('phone') as HTMLInputElement).value = resumeData.phone;
            (document.getElementById('education') as HTMLInputElement).value = resumeData.education;
            (document.getElementById('experience') as HTMLInputElement).value = resumeData.experience;
            (document.getElementById('skills') as HTMLInputElement).value = resumeData.skills;
            
            // Trigger form submission to display the resume
            form.dispatchEvent(new Event('submit'));
        }
    }
});
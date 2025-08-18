
const supabaseUrl = 'https://ungcexrijowskntosbid.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZ2NleHJpam93c2tudG9zYmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTczNzIsImV4cCI6MjA3MTA5MzM3Mn0.EUMfWaa8fZBvYgY89KhNo7PXSr5AAyext99pmSoAeag'
const client = supabase.createClient(supabaseUrl, supabaseKey);

console.log(client)


const enrollBtn = document.getElementById('enrollBtn');
    const modal = document.getElementById('studentModal');
    const closeModal = document.getElementById('closeModal');
    const courseSelect = document.getElementById('courseSelect');
    const programmingOptions = document.getElementById('programmingOptions');
    const itOptions = document.getElementById('itOptions');
    const studentForm = document.getElementById('studentForm');

    // Open modal
    enrollBtn.onclick = () => {
      modal.style.display = "flex";
    }
    // Close modal
    closeModal.onclick = () => {
      modal.style.display = "none";
    }
    window.onclick = (e) => {
      if (e.target == modal) {
        modal.style.display = "none";
      }
    }

    // Course selection
    courseSelect.addEventListener('change', () => {
      if (courseSelect.value === "programming") {
        programmingOptions.style.display = "block";
        itOptions.style.display = "none";
      } else if (courseSelect.value === "it") {
        itOptions.style.display = "block";
        programmingOptions.style.display = "none";
      } else {
        programmingOptions.style.display = "none";
        itOptions.style.display = "none";
      }
    });

    // Submit form & Save to LocalStorage
    studentForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(studentForm);
      const student = {};
      formData.forEach((value, key) => {
        student[key] = value;
      });

      // Save array of students
      let students = JSON.parse(localStorage.getItem("students")) || [];
      students.push(student);
      localStorage.setItem("students", JSON.stringify(students));

      alert("Student data saved to LocalStorage!");
      studentForm.reset();
      programmingOptions.style.display = "none";
      itOptions.style.display = "none";
      modal.style.display = "none";
    });

    //============ supabase data data ===================
    
    const {data, error} = await supabase
    .from ("students")
    .insert ( 
        [
            {
                name: name,
                gender: gender,
                phone: phone,
                cnic: cnic,
                email: email,
                course: course,
                subcourse: subcourse,
                campus: campus,
                image: image
            }

        ]
    );
    if (error) {
  console.error("❌ Insert error:", error);
} else {
  console.log("✅ Insert success:", data);
}